import { useState, useRef } from "react";

// =========================================================
// OOP LAYER => business logic (No React)
// =========================================================

// class Song -> encapsulation via private fields
class Song {
  #id;
  #title;
  #artist;
  #duration;
  #genre;

  constructor(title, artist, duration = "3:00", genre = "Pop") {
    this.#id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.#title = title;
    this.#artist = artist;
    this.#duration = duration;
    this.#genre = genre;
  }
  get id() {
    return this.#id;
  }
  get title() {
    return this.#title;
  }
  get artist() {
    return this.#artist;
  }
  get duration() {
    return this.#duration;
  }
  get genre() {
    return this.#genre;
  }

  // plain object snapshot for React state (classes are not serialisable)
  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      artist: this.#artist,
      duration: this.#duration,
      genre: this.#genre,
    };
  }
}

// class DLLNode -> doubly linked node
class DLLNode {
  constructor(song) {
    this.song = song;
    this.next = null;
    this.prev = null;
  }
}

// class CircularDoublyPlaylist -> core data structure
class CircularDoublyPlayList {
  #head = null; // head.prev === tail (always)
  #size = 0;

  get size() {
    return this.#size;
  }
  get head() {
    return this.#head;
  }
  isEmpty() {
    return this.#size === 0;
  }

  // O(1) - new node inserted jut before head, tail.next = always
  append(song) {
    const node = new DLLNode(song);
    if (!this.#head) {
      node.next = node; // circular self-link (single node)
      node.prev = node;
      this.#head = node;
    } else {
      const tail = this.#head.prev;
      node.prev = tail;
      node.next = this.#head;
      tail.next = node;
      this.#head.prev = node;
    }
    this.#size++;
    return node;
  }

  // O(1) -> rewire neighbours, circular invariant preserved
  remove(node) {
    if (!this.#head || !node) return;
    if (this.#size === 1) {
      this.#head = null;
      this.#size--;
      return;
    }
    node.prev.next = node.next;
    node.next.prev = node.prev;
    if (node === this.#head) this.#head = node.next;
    this.#size--;
  }

  // O(n) do-while: stop when we wrap back to head
  toArray() {
    if (!this.#head) return [];
    const out = [];
    let cur = this.#head;
    do {
      out.push(cur);
      cur = cur.next;
    } while (cur !== this.#head);
    return out;
  }

  // Fisher-Yates shuffle -> swap song data, not node pointers
  shuffle() {
    const arr = this.toArray();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i].song, arr[j].song] = [arr[j].song, arr[i].song];
    }
  }
}

// class HistoryStack -> LIFO stack (backed by array)
class HistoryStack {
  #stack = [];

  push(song) {
    this.#stack.push(song);
  }
  pop() {
    return this.#stack.pop() ?? null;
  }
  peek() {
    return this.#stack[this.#stack.length - 1] ?? null;
  }
  clear() {
    this.#stack = [];
  }
  get size() {
    return this.#stack.length;
  }
  toArray() {
    return [...this.#stack];
  }
}

// class PlaylistManager - orchestrates everything
class PlaylistManager {
  #playlist;
  #history;
  #currentNode = null;
  #playing = false;

  constructor(songs = []) {
    this.#playlist = new CircularDoublyPlayList();
    this.#history = new HistoryStack();
    songs.forEach((s) => this.addSong(s));
    this.#currentNode = this.#playlist.head;
  }
  addSong(song) {
    const node = this.#playlist.append(song);
    if (!this.#currentNode) this.#currentNode = node;
  }
  removeCurrent() {
    if (!this.#currentNode) return;
    const next = this.#playlist.size > 1 ? this.#currentNode.next : null;
    this.#playlist.remove(this.#currentNode);
    this.#currentNode = next;
    if (this.#playlist.isEmpty()) this.#playing = false;
  }
  next() {
    if (!this.#currentNode) return;
    this.#history.push(this.#currentNode.song); // push to stack before moving
    this.#currentNode = this.#currentNode.next; // circular - never null
    this.#playing = true;
  }
  previous() {
    if (!this.#currentNode) return;
    const historySong = this.#history.pop(); // pop from stack
    if (historySong) {
      // find node whose song matches
      const found = this.#playlist
        .toArray()
        .find((n) => n.song.id === historySong.id);
      if (found) {
        this.#currentNode = found;
        this.#playing = true;
        return;
      }
    }
    // no history - step back via prev pointer
    this.#currentNode = this.#currentNode.prev;
    this.#playing = true;
  }
  togglePlay() {
    if (this.#currentNode) this.#playing = !this.#playing;
  }
  shuffle() {
    this.#playlist.shuffle();
    this.#history.clear();
    // resync currentNode reference after shuffle (song objects moved between nodes)
    const currentId = this.#currentNode?.song?.id;
    if (currentId) {
      const found = this.#playlist
        .toArray()
        .find((n) => n.song.id === currentId);
      this.#currentNode = found ?? this.#playlist.head;
    }
  }
  // snapshot for React - plain serialisable object
  getState() {
    const songs = this.#playlist.toArray().map((n) => n.song.toJSON());
    const currentId = this.#currentNode?.song?.id ?? null;
    const history = this.#history.toArray().map((s) => s.toJSON());
    return {
      songs,
      currentId,
      isPlaying: this.#playing,
      history,
      size: this.#playlist.size,
    };
  }
}

// =========================================================
// SEED DATA
// =========================================================

const SEED = [
  new Song("Blinding Lights", "The Weend", "3:20", "Synth-pop"),
  new Song("Levitating", "Dua Lipa", "3:23", "Pop"),
  new Song("Peaches", "Justin Bieber", "3:18", "R&B"),
  new Song("Good 4 U", "Olivia Rodrigo", "2:58", "Pop-punk"),
  new Song("Stay", "The Kid LAROI", "2:21", "Pop"),
];
const GENRES = [
  "Pop",
  "Rock",
  "Hip-hop",
  "R&B",
  "Jazz",
  "Electronic",
  "Synth-pop",
  "Pop-punk",
  "Indie",
  "Latin",
];
const EMOJIS = {
  Pop: "🎵",
  Rock: "🎸",
  "Hip-hop": "🎤",
  "R&B": "🎶",
  Jazz: "🎷",
  Electronic: "🎛",
  "Synth-pop": "💜",
  "Pop-punk": "🔥",
  Indie: "🌿",
  Latin: "🪗",
};

// =========================================================
// REACT UI
// =========================================================

const P = "#7F77DD",
  PT = "#3C3489",
  PB = "#EEEDFE",
  PBR = "#AFA9EC";
const T = "#1D9E75",
  TT = "#085041",
  TB = "#E1F5EE",
  TBR = "#5DCAA5";
const A = "#EF9F27",
  AT = "#633806",
  AB = "#FAEEDA";
const R = "#E24B4A",
  RT = "#7A1A1A",
  RB = "#FAECE7",
  RBR = "#F0997B";
const BOR = "1px solid #e0e0dd";

function pill(bg, tc, border, text) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: "2px 9px",
        borderRadius: 20,
        background: bg,
        color: tc,
        border: `0.5px solid ${border}`,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}
function iStyle() {
  return {
    padding: "0 10px",
    height: 34,
    fontSize: 13,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontFamily: "inherit",
    color: "#1a1a1a",
    background: "#fff",
  };
}
function circleBtn(bg, color, border = "#e0e0dd", size = 40) {
  return {
    width: size,
    height: size,
    borderRadius: "50%",
    border: `1px solid ${border}`,
    background: bg,
    color,
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
    transition: "opacity .15s",
  };
}

export default function MusicPlaylistManager() {
  const mgr = useRef(new PlaylistManager(SEED));
  const [st, setSt] = useState(mgr.current.getState());
  const [form, setForm] = useState({
    title: "",
    artist: "",
    duration: "",
    genre: "Pop",
  });
  const [tab, setTab] = useState("playlist"); // playlist | arch

  function sync() {
    setSt(mgr.current.getState());
  }
  const m = mgr.current;

  function addSong() {
    if (!form.title.trim() || !form.artist.trim()) return;
    m.addSong(
      new Song(
        form.title.trim(),
        form.artist.trim(),
        form.duration.trim() || "3:00",
        form.genre,
      ),
    );
    setForm({ title: "", artist: "", duration: "", genre: "Pop" });
    sync();
  }

  const current = st.songs.find((s) => s.id === st.currentId);
  const emoji = current ? EMOJIS[current.genre] || "🎵" : "🎵";

  return (
    <div
      style={{
        fontFamily: "system-ui,sans-serif",
        color: "#1a1a1a",
        fontSize: 14,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-.01em" }}
          >
            🎵 Playlist Manager
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
            CircularDoublyList · HistoryStack · OOP Encapsulation
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {pill(PB, PT, PBR, `${st.size} songs`)}
          {pill(AB, AT, A, `${st.history.length} in history`)}
          {st.isPlaying && pill(TB, TT, TBR, "▶ playing")}
        </div>
      </div>

      {/* ── Sub-tabs ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          border: BOR,
          borderRadius: 8,
          overflow: "hidden",
          width: "fit-content",
          marginBottom: 14,
        }}
      >
        {[
          ["playlist", "Playlist"],
          ["arch", "Architecture"],
        ].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            style={{
              padding: "6px 18px",
              fontSize: 12,
              cursor: "pointer",
              border: "none",
              borderRight: v === "playlist" ? BOR : "none",
              background: tab === v ? "#f0f0ee" : "transparent",
              fontWeight: tab === v ? 500 : 400,
              color: tab === v ? "#1a1a1a" : "#666",
              fontFamily: "inherit",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ══ PLAYLIST TAB ══════════════════════════════════════════════════════ */}
      {tab === "playlist" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            {/* ── Now playing + controls ─────────────────────────────────── */}
            <div
              style={{
                border: BOR,
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {/* Album art area */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${PB} 0%, ${TB} 100%)`,
                  padding: "22px 20px 18px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 52,
                    marginBottom: 10,
                    filter: st.isPlaying
                      ? "drop-shadow(0 0 8px #AFA9EC)"
                      : "none",
                    transition: "filter .3s",
                  }}
                >
                  {emoji}
                </div>
                {current ? (
                  <>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                        color: PT,
                        marginBottom: 3,
                      }}
                    >
                      {current.title}
                    </div>
                    <div style={{ color: TT, fontSize: 13, marginBottom: 8 }}>
                      {current.artist}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        justifyContent: "center",
                      }}
                    >
                      {pill("#fff", PT, PBR, current.genre)}
                      {pill("#fff", TT, TBR, current.duration)}
                    </div>
                  </>
                ) : (
                  <div style={{ color: "#999", fontSize: 13 }}>
                    No song selected
                  </div>
                )}
              </div>

              {/* Transport controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 20px",
                  borderBottom: BOR,
                }}
              >
                <button
                  onClick={() => {
                    m.previous();
                    sync();
                  }}
                  style={circleBtn("#f5f5f3", "#555")}
                  title="Previous / undo history"
                >
                  ⏮
                </button>
                <button
                  onClick={() => {
                    m.togglePlay();
                    sync();
                  }}
                  style={circleBtn(PB, PT, PBR, 46)}
                  title="Play / Pause"
                >
                  {st.isPlaying ? "⏸" : "▶"}
                </button>
                <button
                  onClick={() => {
                    m.next();
                    sync();
                  }}
                  style={circleBtn("#f5f5f3", "#555")}
                  title="Next (circular)"
                >
                  ⏭
                </button>
                <button
                  onClick={() => {
                    m.shuffle();
                    sync();
                  }}
                  style={circleBtn("#f5f5f3", "#888")}
                  title="Shuffle"
                >
                  🔀
                </button>
                <button
                  onClick={() => {
                    m.removeCurrent();
                    sync();
                  }}
                  style={circleBtn(RB, RT, RBR)}
                  title="Remove current song"
                >
                  🗑
                </button>
              </div>

              {/* History stack panel */}
              <div style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#888",
                    marginBottom: 8,
                  }}
                >
                  History Stack — LIFO (⏮ pops)
                </div>
                {st.history.length === 0 ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#ccc",
                      fontStyle: "italic",
                      textAlign: "center",
                      padding: "10px 0",
                    }}
                  >
                    Empty — press ⏭ to build history
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {[...st.history]
                      .reverse()
                      .slice(0, 5)
                      .map((s, i) => (
                        <div
                          key={s.id + i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "5px 9px",
                            borderRadius: 6,
                            border: `1px solid ${i === 0 ? PBR : "#e8e8e5"}`,
                            background: i === 0 ? PB : "#fafafa",
                            fontSize: 12,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 9,
                              padding: "1px 5px",
                              borderRadius: 3,
                              fontFamily: "monospace",
                              fontWeight: 500,
                              background: i === 0 ? P : "#ddd",
                              color: "#fff",
                            }}
                          >
                            {i === 0 ? "TOP" : i}
                          </span>
                          <span
                            style={{
                              fontWeight: i === 0 ? 500 : 400,
                              color: i === 0 ? PT : "#444",
                              flex: 1,
                            }}
                          >
                            {s.title}
                          </span>
                          <span style={{ fontSize: 11, color: "#aaa" }}>
                            {s.artist}
                          </span>
                        </div>
                      ))}
                    {st.history.length > 5 && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "#aaa",
                          textAlign: "center",
                          paddingTop: 2,
                        }}
                      >
                        + {st.history.length - 5} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Circular list view + song list ────────────────────────── */}
            <div
              style={{
                border: BOR,
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Circular node diagram */}
              <div
                style={{
                  padding: "9px 14px",
                  borderBottom: BOR,
                  background: "#f4f4f2",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#888",
                }}
              >
                Circular doubly list — live structure
              </div>
              <div
                style={{
                  padding: "12px 14px 10px",
                  overflowX: "auto",
                  borderBottom: BOR,
                }}
              >
                {st.songs.length === 0 ? (
                  <div
                    style={{
                      color: "#ccc",
                      fontSize: 12,
                      textAlign: "center",
                      padding: "14px 0",
                    }}
                  >
                    empty
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: "max-content",
                        gap: 0,
                      }}
                    >
                      <div style={{ fontSize: 14, color: PT, marginRight: 3 }}>
                        ↻
                      </div>
                      {st.songs.map((s, i) => {
                        const isCur = s.id === st.currentId;
                        return (
                          <div
                            key={s.id}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div
                              style={{
                                border: `1.5px solid ${isCur ? P : "#ccc"}`,
                                borderRadius: 7,
                                overflow: "hidden",
                                minWidth: 62,
                                background: isCur ? PB : "#fff",
                                boxShadow: isCur ? `0 0 0 2px ${P}33` : "none",
                                transition: "all .2s",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 8.5,
                                  fontWeight: 500,
                                  textAlign: "center",
                                  padding: "5px 6px 4px",
                                  color: isCur ? PT : "#555",
                                  borderBottom: `1px solid ${isCur ? PBR : "#eee"}`,
                                }}
                              >
                                {s.title.length > 10
                                  ? s.title.slice(0, 9) + "…"
                                  : s.title}
                              </div>
                              <div style={{ display: "flex" }}>
                                <div
                                  style={{
                                    flex: 1,
                                    fontSize: 7.5,
                                    textAlign: "center",
                                    padding: "3px 2px",
                                    background: TB,
                                    color: TT,
                                  }}
                                >
                                  ←prev
                                </div>
                                <div
                                  style={{
                                    flex: 1,
                                    fontSize: 7.5,
                                    textAlign: "center",
                                    padding: "3px 2px",
                                    background: "#f5f5f3",
                                    color: "#666",
                                  }}
                                >
                                  next→
                                </div>
                              </div>
                            </div>
                            {i < st.songs.length - 1 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                  padding: "0 2px",
                                  marginBottom: 14,
                                }}
                              >
                                <span
                                  style={{
                                    color: TT,
                                    fontSize: 11,
                                    lineHeight: 1,
                                  }}
                                >
                                  →
                                </span>
                                <span
                                  style={{
                                    color: PT,
                                    fontSize: 11,
                                    lineHeight: 1,
                                  }}
                                >
                                  ←
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div style={{ fontSize: 14, color: TT, marginLeft: 3 }}>
                        ↺
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 10,
                        fontFamily: "monospace",
                        padding: "4px 8px",
                        background: PB,
                        borderRadius: 5,
                        color: PT,
                      }}
                    >
                      tail.next → {st.songs[0]?.title} &nbsp;|&nbsp; head.prev →{" "}
                      {st.songs[st.songs.length - 1]?.title}
                    </div>
                  </>
                )}
              </div>

              {/* Song list */}
              <div style={{ overflowY: "auto", flex: 1, maxHeight: 240 }}>
                {st.songs.length === 0 ? (
                  <div
                    style={{
                      padding: "24px 0",
                      textAlign: "center",
                      color: "#ccc",
                      fontSize: 12,
                    }}
                  >
                    Add some songs below
                  </div>
                ) : (
                  st.songs.map((s, i) => {
                    const isCur = s.id === st.currentId;
                    return (
                      <div
                        key={s.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 14px",
                          background: isCur
                            ? PB
                            : i % 2 === 0
                              ? "#fafafa"
                              : "#fff",
                          borderBottom: "1px solid #f0f0ee",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: 11,
                            color: isCur ? PT : "#bbb",
                            minWidth: 18,
                            textAlign: "right",
                          }}
                        >
                          {isCur ? "▶" : i + 1}
                        </span>
                        <span style={{ fontSize: 14 }}>
                          {EMOJIS[s.genre] || "🎵"}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 12.5,
                              fontWeight: isCur ? 500 : 400,
                              color: isCur ? PT : "#1a1a1a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.title}
                          </div>
                          <div style={{ fontSize: 11, color: "#888" }}>
                            {s.artist}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            color: "#aaa",
                            fontFamily: "monospace",
                            flexShrink: 0,
                          }}
                        >
                          {s.duration}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* ── Add song form ──────────────────────────────────────────────── */}
          <div
            style={{
              border: BOR,
              borderRadius: 10,
              background: "#fff",
              padding: "13px 16px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#888",
                marginBottom: 10,
              }}
            >
              Add New Song
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addSong()}
                placeholder="Title"
                style={{ ...iStyle(), width: 150 }}
              />
              <input
                value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addSong()}
                placeholder="Artist"
                style={{ ...iStyle(), width: 140 }}
              />
              <input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addSong()}
                placeholder="3:30"
                style={{ ...iStyle(), width: 60 }}
              />
              <select
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                style={{ ...iStyle(), width: 110 }}
              >
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              <button
                onClick={addSong}
                disabled={!form.title.trim() || !form.artist.trim()}
                style={{
                  padding: "0 18px",
                  height: 34,
                  fontSize: 13,
                  cursor: "pointer",
                  border: `1px solid ${PBR}`,
                  borderRadius: 6,
                  background: PB,
                  color: PT,
                  fontFamily: "inherit",
                  fontWeight: 500,
                  opacity: !form.title.trim() || !form.artist.trim() ? 0.45 : 1,
                }}
              >
                + Add
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══ ARCHITECTURE TAB ══════════════════════════════════════════════════ */}
      {tab === "arch" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            {
              cls: "class Song",
              color: P,
              tc: PT,
              bg: PB,
              border: PBR,
              concept: "Encapsulation",
              desc: "All fields are private (#id, #title, #artist, #duration, #genre). External code can only read via getters — it can never mutate a song directly. toJSON() provides a React-safe plain object snapshot.",
              code: `class Song {
  #id; #title; #artist; #duration; #genre;

  constructor(title, artist, duration, genre) {
    this.#id = \`s_\${Date.now()}_\${Math.random()...}\`;
    this.#title  = title;   // private!
    this.#artist = artist;  // private!
    ...
  }

  get title()  { return this.#title }  // read-only
  get artist() { return this.#artist } // read-only
  toJSON()     { return { id, title, artist, ... } }
}`,
            },
            {
              cls: "class CircularDoublyPlaylist",
              color: T,
              tc: TT,
              bg: TB,
              border: TBR,
              concept: "Circular Doubly Linked List",
              desc: "Core data structure. tail.next = head and head.prev = tail — always. append() and remove() are both O(1). Traversal uses do-while to detect wrap-around. shuffle() uses Fisher-Yates, swapping song data between nodes.",
              code: `class CircularDoublyPlaylist {
  #head = null;  // head.prev === tail (always)
  #size = 0;

  append(song) {
    // tail → new node → head (circular)
    const tail = this.#head.prev;
    node.prev = tail;   node.next = this.#head;
    tail.next = node;   this.#head.prev = node;
  }

  remove(node) {          // O(1) — just rewire
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
}`,
            },
            {
              cls: "class HistoryStack",
              color: A,
              tc: AT,
              bg: AB,
              border: A,
              concept: "Stack (LIFO)",
              desc: "Every time next() is called, the current song is pushed onto the stack. previous() pops it to restore that song. This mirrors real music app 'back' behaviour — you retrace your exact listening path, not just step backwards in the list.",
              code: `class HistoryStack {
  #stack = [];   // private array backing the stack

  push(song) { this.#stack.push(song) }
  pop()      { return this.#stack.pop() ?? null }
  peek()     { return this.#stack[this.#stack.length-1] }

  // Used by PlaylistManager.previous():
  // const song = this.#history.pop()  ← last played
  // find node with that song.id, jump to it
}`,
            },
            {
              cls: "class PlaylistManager",
              color: "#888",
              tc: "#333",
              bg: "#f5f5f3",
              border: "#ccc",
              concept: "Facade / Orchestrator",
              desc: "Owns both the CircularDoublyPlaylist and HistoryStack. Exposes a clean API (next, previous, addSong, removeCurrent, shuffle, togglePlay). React never touches the data structures directly — it only calls manager methods and reads getState().",
              code: `class PlaylistManager {
  #playlist;   // CircularDoublyPlaylist
  #history;    // HistoryStack
  #currentNode = null;
  #playing = false;

  next() {
    this.#history.push(this.#currentNode.song); // stack
    this.#currentNode = this.#currentNode.next; // circular
    this.#playing = true;
  }

  getState() { /* plain object snapshot for React */ }
}`,
            },
          ].map(({ cls, color, tc, bg, border, concept, desc, code }) => (
            <div
              key={cls}
              style={{
                border: `1px solid ${border}`,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: bg,
                  padding: "10px 14px",
                  borderBottom: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <code
                  style={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    fontSize: 13,
                    color: tc,
                  }}
                >
                  {cls}
                </code>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 10,
                    background: "#fff",
                    color: tc,
                    border: `0.5px solid ${border}`,
                  }}
                >
                  {concept}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.1fr",
                  gap: 0,
                }}
              >
                <div
                  style={{
                    padding: "12px 14px",
                    borderRight: `1px solid ${border}`,
                    fontSize: 12.5,
                    lineHeight: 1.7,
                    color: "#444",
                  }}
                >
                  {desc}
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <pre
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      lineHeight: 1.75,
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      color: "#1a1a1a",
                      background: "#f9f9f8",
                      borderRadius: 6,
                      padding: 10,
                    }}
                  >
                    {code}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
