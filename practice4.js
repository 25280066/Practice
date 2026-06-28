class Node {
    constructor(val){
        this.val = val;
        this.next = null;
    }
}


// Stack - LIFO
// Backed by a singly linked list => O(1) all ops
// space O(n)

class Stack {
    #top = null;
    #size = 0;

    push(val){  // O(1)
        const node = new Node(val);
        node.next = this.#top;
        this.#top = node;
        this.#size++;
    }
    pop(){  // O(1)
        if (this.isEmpty()) throw new Error("Empty stack");
        const val = this.#top.val;
        this.#top = this.#top.next;
        this.#size--;
        return val;
    }
    peek(){ return this.#top?.val ?? null}  // O(1)
    isEmpty(){ return this.#size === 0}
    getSize(){ return this.#size}
}

const stack = new Stack;
stack.push(0);
stack.push(1);
stack.push(2);
console.log(stack.pop());   // 2