// In a circular singly list, tail.next = head
// There is NO null at the end — it wraps around!
// We track only #tail — head is always tail.next

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class CircularLinkedList {
  #tail = null; // tail.next === head
  #size = 0;

  // O(1) - insert before current head
  prepend(val) {
    const node = new Node(val);
    if (!this.#tail) {
      node.next = node; // points to itself
      this.#tail = node;
    } else {
      node.next = this.#tail.next; // new -> old head
      this.#tail.next = node; // tail -> new node
    }
    this.#size++;
  }
  // O(1) - insert after tail, advance tail
  append(val) {
    const node = new Node(val);
    if (!this.#tail) {
      node.next = node;
      this.#tail = node;
    } else {
      node.next = this.#tail.next; // new → head
      this.#tail.next = node; // old tail → new
      this.#tail = node; // advance tail
    }
    this.#size++;
  }
  // O(1) - just advance head reference via tail
  removeHead() {
    if (!this.#tail) throw new Error("Empty");
    const head = this.#tail.next;
    if (head === this.#tail) {
      // only one node — list becomes empty
      this.#tail = null;
    } else {
      this.#tail.next = head.next; // skip head
    }
    this.#size--;
    return head.val;
  }
  // O(n) - must walk to node before tail, no prev pointer => no jump back
  removeTail() {
    if (!this.#tail) throw new Error("Empty");
    if (this.#tail.next === this.#tail) {
      const val = this.#tail.val;
      this.#tail = null;
      this.#size--;
      return val;
    }
    let cur = this.#tail.next; // start at head
    while (cur.next !== this.#tail) cur = cur.next;
    const val = this.#tail.val;
    cur.next = this.#tail.next; // skip old tail
    this.#tail = cur; // new tail
    this.#size--;
    return val;
  }
  // O(n) — detect wrap-around with do-while
  traverse() {
    if (!this.#tail) return [];
    const result = [];
    const head = this.#tail.next;
    let cur = head;
    do {
      result.push(cur.val);
      cur = cur.next;
    } while (cur !== head); // ← stop at wrap-around
    return result;
  }
  // O(n)
  find(val) {
    if (!this.#tail) return -1;
    const head = this.#tail.next;
    let cur = head,
      i = 0;
    do {
      if (cur.val === val) return i;
      cur = cur.next;
      i++;
    } while (cur !== head);
    return -1;
  }
  get head() {
    return this.#tail?.next?.val ?? null;
  }
  get tail() {
    return this.#tail?.val ?? null;
  }
  get size() {
    return this.#size;
  }
  isEmpty() {
    return this.#size === 0;
  }
}

const list = new CircularLinkedList();
list.append(0);
list.prepend(-1);
list.append(1);
list.prepend(-2);
list.append(2);
console.log(list.find(1));  // 3
list.traverse();
console.log(list.head); // -2
