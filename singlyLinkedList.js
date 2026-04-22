class Node{
    constructor(val){
        this.val = val;
        this.next = null;
    }
}

class SinglyLinkedList{
    #head = null;
    #tail = null;
    #size = 0;

    // O(1) - rewire head pointer
    prepend(val){
        const node = new Node(val);
        node.next = this.#head;
        this.#head = node;
        if(!this.#tail) this.#tail = node;
        this.#size++;
    }
    // O(1) - tail pointer avoids traversal
    append(val){
        const node = new Node(val);
        if(!this.#tail){
            this.#head = this.#tail = node;
        } else{
            this.#tail.next = node;
            this.#tail = node;
        }
        this.#size++;
    }
    // O(1) - remove from front
    removeHead(){
        if(!this.#head) throw new Error("Empty");
        const val = this.#head.val;
        this.#head = this.#head.next;
        if(!this.#head) this.#tail = null;
        this.#size--;
        return val;
    }
    // O(n) - must walk to second-to-last
    removeTail(){
        if(!this.#head) throw new Error("Empty");
        if(this.#head === this.#tail){
            const val = this.#head.val;
            this.#head = this.#tail = null;
            this.#size--;
            return val;
        }
        let cur = this.#head;
        while(cur.next !== this.#tail) cur = cur.next;
        const val = this.#tail.val;
        cur.next = null;
        this.#tail = cur;
        this.#size--;
        return val;
    }
    // O(n)
    insertAt(index, val){
        if(index === 0) return this.prepend(val);
        if(index === this.#size) return this.append(val);
        const node = new Node(val);
        const prev = this.#getNode(index -1);
        node.next = prev.next;
        prev.next = node;
        this.#size++;
    }
    // O(n) Linear Search
    find(val){
        let cur = this.#head, i = 0;
        while(cur){
            if(cur.val === val) return i;
            cur = cur.next;
            i++;
        }
        return -1;
    }
    // O(n) - three-pointer in-place reverse
    reverse(){
        let prev = null, cur = this.#head;
        this.#tail = this.#head;
        while(cur){
            const nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }
        this.#head = prev;
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

const list = new SinglyLinkedList;
list.append(0);
list.prepend(-1);
list.append(1);
list.prepend(-2);
list.append(2);
console.log(list.find(1));  // 3
list.reverse();
console.log(list.head); // 2