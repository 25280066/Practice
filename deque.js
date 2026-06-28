// Deque — Double-Ended Queue
// Doubly linked list → O(1) on BOTH ends

class Node {
    constructor(val){
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

class Deque{
    #head = null;
    #tail = null;
    #size = 0;

    addFront(val){
        const node = new Node(val);
        if(!this.#head) {this.#head = this.#tail = node;}
        else {
            node.next = this.#head;
            this.#head.prev = node;
            this.#head = node;
        }
        this.#size++;
    }

    addRear(val){
        const node = new Node(val);
        if(!this.#tail) {this.#head = this.#tail = node;}
        else {
            node.prev = this.#tail;
            this.#tail.next = node;
            this.#tail = node;
        }
        this.#size++;
    }
    removeFront(){
        if (this.isEmpty()) throw new Error ("Empty");
        const val = this.#head.val;
        this.#head = this.#head.next;
        if(this.#head) this.#head.prev = null;
        else this.#tail = null;
        this.#size--;
        return val;
    }
    removeRear(){
        if (this.isEmpty()) throw new Error ("Empty");
        const val = this.#tail.val;
        this.#tail = this.#tail.prev;
        if(this.#tail) this.#tail.next = null;
        else this.#head = null;
        this.#size--;
        return val;
    }
    peekFront() { return this.#head?.val ?? null }
    peekRear()  { return this.#tail?.val ?? null }
    isEmpty()   { return this.#size === 0 }
    get size()  { return this.#size }

}

const deque = new Deque;
deque.addFront(0);
deque.addFront(1);
deque.addFront(2);
deque.addRear(-1);
deque.addRear(-2);
deque.addRear(-3);
console.log(deque.removeFront());   // 2
console.log(deque.removeRear());   // -3
console.log(deque.isEmpty());   //false

