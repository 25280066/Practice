class Node {
    constructor(val){
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

class DoublyLinkedList{
    #head = null;
    #tail = null;
    #size = 0;

    // O(1)
    prepend(val){
        const node = new Node(val);
        if (!this.#head) {
            this.#head = this.#tail = node;
        } else {
            node.next = this.#head;
            this.#head.prev = node;
            this.#head = node;
        }
        this.#size++;
    }
    // O(1)
    append(val){
        const node = new Node(val);
        if(!this.#tail){
            this.#head = this.#tail = node;
        } else{
            node.prev = this.#tail;
            this.#tail.next = node;
            this.#tail = node;
        }
        this.#size++;
    }
    // O(1)
    removeHead(){
        if(!this.#head) throw new Error("Empty");
        const val = this.#head.val;
        this.#head = this.#head.next;
        if (this.#head) this.#head.prev = null;
        else this.#tail = null;
        this.#size--;
        return val;
    }
    // O(n)
    removeTail(){
        if (!this.#tail) throw new Error('Empty');
        const val  = this.#tail.val;
        this.#tail = this.#tail.prev;
        if (this.#tail) this.#tail.next = null;
        else this.#head = null;
        this.#size--;
        return val;
    }
    // O(n) - no separate "prev" lookup needed
    insertAt(index, val){
        if(index === 0) return this.prepend(val);
        if(index === this.#size) return this.append(val);
        const node = new Node(val);
        const after = this.#getNode(index);
        const before= after.prev;
        node.next = after;
        node.prev = before;
        before.next = node;
        after.prev = node;
        this.#size++;
    }
    // O(n)
    find(val){
        let cur = this.#head, i = 0;
        while(cur){
            if(cur.val === val) return i;
            cur = cur.next;
            i++;
        }
        return -1;
    }
    // O(n) - swap next and prev on every node
    reverse(){
        let cur = this.#head;
        this.#tail = cur;
        while (cur) {
      [cur.next, cur.prev] = [cur.prev, cur.next];
      if (!cur.prev) this.#head = cur;
      cur = cur.prev; // was .next before swap
    }
    }
    #getNode(i){
        let cur = this.#head;
        for (let k = 0; k < i; k++) cur = cur.next;
        return cur;
    }
    get size() { return this.#size }
    get head() { return this.#head?.val ?? null }
    get tail() { return this.#tail?.val ?? null }
}

const list = new DoublyLinkedList;
list.append(0);
list.prepend(-1);
list.append(1);
list.prepend(-2);
list.append(2);
console.log(list.find(1));  // 3
list.reverse();
console.log(list.head); // 2