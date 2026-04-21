// Queue — FIFO (First In, First Out)
// Linked list avoids O(n) array shift on dequeue

class Node {
    constructor(val){
        this.val = val;
        this.next = null;
    }
}

class Queue{
    #head = null;
    #tail = null;
    #size = 0;

    enqueue(val){
        const node = new Node(val);
        if(this.#tail) this.#tail.next = node;
        else this.#head = node
        this.#tail = node;
        this.#size++;
    }
    dequeue(){
        if (this.isEmpty()) throw new Error ("Empty Queue");
        const val = this.#head.val;
        this.#head = this.#head.next;
        this.#size--;
        return val;
    }
    front()   { return this.#head?.val ?? null }
    isEmpty() { return this.#size === 0 }
    get size(){ return this.#size }
}

const queue = new Queue;
queue.enqueue(0);
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue());   // 0
console.log(queue.front());   // 1