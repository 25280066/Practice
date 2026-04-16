// => Execution Context and Call Stack
/* Every time JS runs, it creates an Execution Context
There are two types: the Global Execution Context (GEC) created once, and a Function Execution Context (FEC) created for every function call
The Call Stack tracks which context is currently running. */

// Each Execution Context has 2 phases:
// Creation phase  — memory allocated, vars hoisted
// Execution phase — code runs line by line

var name = "Ali";   // GEC: name -> undefined -> "Ali"
function greet(who){    // GEC: greet -> fn body
    var msg = `Hi ${who}`;  // FEC created when greet() called
    return msg;
}

// Each FEC contains:
// Variable Environment  (local vars, args)
// Scope Chain           (ref to outer envs)
// this binding

greet("Ali");   // FEC pushed -> executed -> popped

// Stack overflow = infinite recursion
function inf() {return inf()};  // never pops
// inf() → RangeError: Maximum call stack size exceeded

// Scope chain = static link to outer Variable Environment
// determined at DEFINITION time, not call time

let x = 'global';
function outer(){
    let x = 'outer';
    function inner(){
        let x = 'inner';
        console.log(x); // 'inner' - found locally
    }
    function middle(){
        console.log(x); // 'outer' - walks up chain
    }

    inner();
    middle();
}

// Chain for inner():
// inner FEC → outer FEC → GEC → (null)
// Lexical (static) vs Dynamic scoping:
// JS uses LEXICAL — scope depends on where
// function is WRITTEN, not where it's CALLED

/* The call stack is synchronous and single-threaded
Every function call pushes a frame; every return pops it
async/await suspends the current context without blocking the stack. */


// => this - all cases
// Priority (highest → lowest):
// 1. new  2. explicit (call/apply/bind)  3. implicit  4. default

// new binding
function User(n){ this.name = n }
const u = new User("Ali");  // this = fresh object

// Explicit binding
function say(){ return this.name }
say.call({name: "Ali"});    // 'Ali'
say.apply({name: "Sara"});  // "Sara"
const bound = say.bind({name:"Zain"});
bound();    // "Zain" - permanently bound

// Implicit binding (method call)
const obj = {name: 'Ali', say};
obj.say();  // 'Ali' - this = obj

// Default binding
say();  // undefined (strict) / window.name (sloppy)

// Arrow: inherits 'this' from enclosing lexical scope
class Timer {
    constructor() { this.ticks = 0}
    start(){
        // regular fn loses 'this'
        setInterval(function(){
            this.ticks++;   // this = udefined in strict!
        }, 1000);

        // arrow captures 'this' from start()
        setInterval(()=>{
        this.ticks++;   // this = Timer instance
        }, 1000);
    }
}

// Event listener: this = element that fired event
btn.addEventListener('click', function(){
    console.log(this);  // the button element
});
btn.addEventListener('click', () => {
    console.log(this);  // outer scope
});

// bind overrides implicit - but not 'new'
const fixed = say.bind({ name: 'X'});
fixed.call({ name: 'Y'});   // still 'X' - blind wins

// ┌──────────────────────────────────────────────┐
// │  How called              │  this             │
// ├──────────────────────────┼───────────────────┤
// │  new Fn()                │  new object       │
// │  fn.call(obj) / .apply() │  obj              │
// │  fn.bind(obj)()          │  obj (permanent)  │
// │  obj.method()            │  obj              │
// │  fn()  (strict mode)     │  undefined        │
// │  fn()  (sloppy mode)     │  globalThis       │
// │  Arrow function          │  lexical scope    │
// │  DOM event (regular fn)  │  the element      │
// │  DOM event (arrow)       │  outer this       │
// └──────────────────────────┴───────────────────┘

// Golden rule for arrow functions:
// "this" is whatever 'this' was in the scope
// where the arrow was WRITTEN — full stop.
// No call/apply/bind can change it.


// => Prototypes & Prototypal Inheritance
/* JS has no classical inheritance — it uses prototypal delegation
Every object has an internal [[Prototype]] link
When a property is missing on an object, JS walks up the chain until it finds it or reaches null. */

// Every object secretly links to another object
const animal = {
    breathe(){ return 'breathing'}
};

const dog = Object.create(animal);  // dog -> animal -> Object.prototype -> null
dog.bark = function(){ return 'woof'};

dog.bark(); // founc on dog itself
dog.breathe();  // found on animal
dog.toString(); // found on Object.prototype

// Inspect
Object.getPrototypeOf(dog) === animal;  // true
dog.hasOwnProperty('bark'); // true
dog.hasOwnProperty('breathe'); // false (inherited)

// Property shadowing
dog.breathe = () => 'panting';  // shadows animal.breathe
dog.breathe();  // 'panting' - own prop wins

// class is syntatic sugar - prototype underneath
class Animal{
    constructor(n){this.name = n;}
    speak(){return `${this.name} makes noise`}
}
class Dog extends Animal{
    speak() {return `${this.name} barks`}
}

// What JS actually built:
// dog instance → Dog.prototype → Animal.prototype → Object.prototype → null
const d - new Dog('Rex');
Object.getPrototypeOf(d) === Dog.prototype; // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype;  // true

// Methods live on the prototype (shared)
// Properties live on the instance (own)
d.hasOwnProperty('name');   // true (set in constructor)
d.hasOwnProperty('speak');  // false (lives on Dog.prototype)

// Pure prototypal inheritance without classes
const personProto = {
    greet(){return `Im ${this.name}, ${this.age}`},
    birthday(){ this.age++ }
};
function createPerson(name, age){
    const p = Object.create(personProto);
    p.name = name;
    p.age = age;
    return p;
}
const ali = createPerson('Ali', 25);
ali.greet();
ali.birthday();

// Object.create(null) — no prototype at all
// useful for pure dictionaries (no hasOwnProperty risk)
const dict = Object.create(null);
dict.key = 'value'; // no inherited noise

/* Classes don't copy methods into instances — they share them via the prototype
This is why 100 instances of a class only store 1 copy of each method. */


// => Closures
// private state via closure
const CartModule = (() => {
    const items = [];   // private
    let discount = 0;   // private

    return {
        add(item){ items.push(item)},
        setDiscount(d){discount = d},
        total(){
            const sum = items.reduce((a, i) => a + i.price, 0);
            return sum * (1 - discount);
        },
        count(){return items.length}
    };
})();

CartModule.add({name: "Book", price: 20});
CartModule.setDiscount(0.1);
CartModule.total(); // 18
CartModule.items;   // undefined - truly private

// once(): fn that runs only once - ever
function once(fn){
    let called = false, result;
    return function(...args){
        if(called) return result;
        called = true;
        return (result = fn.apply(this, args));
    };
}
const initDB = once(() => console.log("DB connected"));
initDB(); initDB(); // logs once only

// Partial application — pre-fill some args
function partial(fn, ...preArgs) {
  return (...laterArgs) => fn(...preArgs, ...laterArgs);
}
const multiply = (a, b) => a * b;
const double   = partial(multiply, 2);
double(7);  // 14

// React hook analogy - useState is a closure
function useState(initial){
    let state = initial;    // closed over
    const setState = v => { state = v };
    const getState = ()  => state;
    return [getState, setState];
}

// Pitfall 1 - var in loops
for (var i = 0; i< 3; i++){
    setTimeout(() => console.log(i), 100);
}
// logs: 3 3 3 - one shared 'i'

// Fix A: let (new binding per iteration)
for (let i = 0; i < 3; i++){
    setTimeout(() => console.log(i), 100);
}
// logs: 0 1 2

// Fix B: IIFE to capture var
for (var i = 0; i < 3; i++){
    ((j) => setTimeout(() => console.log(j), 100))(i);
}

// Pitfall 2 - memory: dont close over large objects if fn outlives the data's usefulness
function leak(){
    const bigData = new Array(1e6).fill(0); // 8MB
    return () => bigData[0];    // bigDara cant be GC'd
}

/* React's useState, useEffect, and useCallback all rely on closures to capture state and props at a point in time*/


// => Memory Management & GC
/* JS manages memory automatically via Garbage Collection
The engine allocates memory when you create values and frees it when nothing references them anymore
Leaks happen when you unintentionally keep references alive. */

// Mark-and-Sweep algorithm (V8, SpiderMonkey)
// 1. Start from 'roots' (global, stack variables)
// 2. Mark every reachable object
// 3. Sweep (free) everything unmarked
let obj1 = { name: 'Ali'};  // allocated on heap
let ref = obj;  // 2 refs to same object
obj1 = null;    // 1 ref gone
ref = null; // 0 refs -> eligible for GC

// Circular references ARE handled by mark-sweep
// (old ref-counting algorithms had trouble here)
function circular(){
    const a = {};
    const b = {};
    a.ref = b;
    b.ref = a;
    // When fn returns, a & b unreachable -> GC'd
}

// Generations: most objects die young
// V8 has Minor GC (young gen) + Major GC (old gen)
// Short-lived objects are cheap; long-lived cost more

// Leak 1: Global variables accumulate forever
function badFn(){
    leaked = 'I am global!'; // forgot let/const/var
}

// Leak 2: Detached DOM nodes held in JS
let ghost;
const btn = document.querySelector('button');
ghost = btn;
btn.remove();   // removed from DOM but ghost still refs it

// Fix: ghost = null when done

// Leak 3: Event listeners not removed
const heavy = new Array(1e6).fill(null);
el.addEventListener('click', () => heavy[0]);
// heavy can't be GC'd while listener lives
// Fix: removeEventListener or AbortController

// Leak 4: setInterval never cleared
const id = setInterval(() => doWork(), 1000);
// Fix: clearInterval(id) when component unmounts

// WeakMap: keys are weakly held - dont prevent GC
const cache = new WeakMap();

function process(obj){
    if (cache.has(obj)) return cache.get(obj);
    const result = heavyCompute(obj)
    cache.set(obj, result); // wont leak even if obj disappears
    return result;
}
// When obj goes out of scope, cache entry auto-freed

// WeakRef: observe an object without preventing GC
let target = { data: 'large payload'};
const weakRef = new WeakRef(target);
target = null;  // eligible for GC now
const obj2 = weakRef.deref();   // may be undefined after GC
if(obj2){
    console.log(obj2.data);
} else{
    console.log('Object was collected');
}

/* The #1 source of memory leaks in SPAs: attaching event listeners or starting intervals in a component and never cleaning them up when it unmounts. */


// => Debounce & Throttle
/* Both techniques control how often a function fires
Debounce waits for activity to stop
throttle guarantees a maximum fire rate
They're essential for scroll, resize, search, and button spam. */

// Debounce: wait until N ms of SILENCE, then fire once
// Use for: search inputs, form validation, resize

function debounce(fn, delay){
    let timerId;
    return function(...args) {
        clearTimeout(timerId);               // reset the clock
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// Example: only call API after user stops typing
const search = debounce(async (query) => {
    const results = await fetchResults(query);
    renderResults(results);
}, 400);

input.addEventListener('input', e => search(e.target.value));
// Types "j", "ja", "jav", "java" quickly
// → API called ONCE with "java" after 400ms silence

// Throttle: fire at most once per N ms, no matter what
// Use for: scroll handlers, mousemove, resize, buttons
function throttle(fn, limit){
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}

// Example: update position at most 60fps
const onScroll = throttle(() => {
  updateProgressBar(window.scrollY);
}, 16); // ~60fps
window.addEventListener('scroll', onScroll);

// Prevent double-submit on forms
const submit = throttle(async () => {
    await submitOrder();
}, 3000);   // at most once every 3s

// Decision guide:
// ┌──────────────────────────────────────────────────┐
// │ Scenario                    │ Use                │
// ├─────────────────────────────┼────────────────────┤
// │ Search-as-you-type          │ Debounce (300-500ms)│
// │ Form field validation       │ Debounce (200ms)   │
// │ Window resize layout fix    │ Debounce (150ms)   │
// │ Scroll position tracking    │ Throttle (16ms)    │
// │ Infinite scroll trigger     │ Throttle (200ms)   │
// │ Mouse/touch drag            │ Throttle (16ms)    │
// │ Button (prevent spam)       │ Throttle (1000ms)  │
// │ Analytics / event tracking  │ Throttle (500ms)   │
// └──────────────────────────────────────────────────┘

// requestAnimationFrame throttle (display-synced)
function rafThrottle(fn){
    let rafId = null;
    return function(...args) {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            fn.apply(this, args);
            rafId = null;
        });
    };
}
// Perfectly synced to screen refresh - no ms guessing

// When unsure, debounce is the safer default for inputs.