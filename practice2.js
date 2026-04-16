// => Closures & Scope
/*  closure is a function that remembers variables from its outer scope even after that scope has finished executing.
This is the foundation of data privacy, factories, and the module pattern. */

// Scope
var x = "global"; // function scoped, hoisted
let y = "block"; // block scoped, NOT hoisted
const z = "block"; // block scoped, NOT hoisted

function outer() {
  let a = "outer";
  function inner() {
    let b = "inner";
    console.log(a); // can see outer
  }
  // console.log(b) -> ReferenceError
}

// Block Scope with let/const
{
  let blockVar = 10;
}
// blockVar -> ReferenceError here

// Closure: inner fn remembers outer scope
function makeCounter(start = 0) {
  let count = start; // private to closure
  return {
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
    value() {
      return count;
    },
  };
}

const c1 = makeCounter(10);
const c2 = makeCounter(0);
c1.increment();
c1.increment();
console.log(c1.value()); // independant from c2
console.log(c2.value());

// Error: var in for loops
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3,3,3
}

// Fix: let in for loops (block-scoped iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0,1,2
}

/* Closures are how you create private state in JS without classes.
Every time a factory function runs, it creates a brand-new closure. */

// => Hoisting
/* Hoisting is JS's behaviour of moving declarations to the top of their scope during compilation — before any code runs.
Only declarations are hoisted, not initialisations. */

greet(); // works before definition
function greet() {
  console.log("Hello");
}

// var: declaration hoisted, value is undefined
console.log(x1); // undefined
var x1 = 5;
console.log(x1); // 5

// JS sees this
// var x1; // hoisted
// console.log(x1);    // undefined
// x1 = 5;
// console.log(x1);    // 5

// Function expressions: NOT hoisted
// sayHi();    // TypeError: sayHi is not a function
// var sayHi = function(){console.log("Hi")};

// Temporal Dead Zone (TDZ)
// let/const are hoisted but not initialised
// Accessing before declaration -> ReferenceError

//console.log(a); // ReferenceError: Cannot access 'a'
let a = 10; // TDZ ends here
console.log(a);

// typeof is not safe either in TDZ
console.log(typeof a1); // ReferenceError (unlike with var)
// let a1 = 5;
// var a1 = 5;

// Summary table:
// ┌──────────┬────────────┬───────────┐
// │          │  Hoisted?  │ Init val  │
// ├──────────┼────────────┼───────────┤
// │ var      │  Yes       │ undefined │
// │ let      │  Yes (TDZ) │ ✗         │
// │ const    │  Yes (TDZ) │ ✗         │
// │ function │  Yes       │ full body │
// └──────────┴────────────┴───────────┘

// => Functions Deeply
/* Functions can be stored in variables, passed as arguments, and returned from other functions.
This enables callbacks, higher-order functions, and functional patterns.*/

// Higher-order functions
//take/returns a function
function repeat(n, action) {
  // takes a fn
  for (let i = 0; i < n; i++) action(i);
}
repeat(3, (i) => console.log(`Step ${i}`));

// returns a function(factory)
function multiplier(factor) {
  return (n) => n * factor;
}
const double = multiplier(2);
console.log(double(5));

// Compose: combine small fns into pipelines
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

const process = pipe(
  (x) => x * 2,
  (x) => x + 1,
  (x) => console.log(`Result ${x}`),
);
process(5);

// Currying: fn(a,b,c) -> fn(a)(b)(c)
const add = (a) => (b) => a + b;
const add5 = add(5);
console.log(add5(3));

// Memoization: cache results of pure fns
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowFib = (n) => (n <= 1 ? n : slowFib(n - 1) + slowFib(n - 2));
fib = memoize(slowFib);
console.log(fib(40)); // fast after first call

// Pure functions -> same input always gives same output
// no side effects -> are easier to test, compose and memoize

// => Array methods
const users = [
  { name: "Ali", age: 25, active: true },
  { name: "Sara", age: 17, active: false },
  { name: "Zain", age: 30, active: true },
];

// map: transform every element -> new array
const names = users.map((u) => u.name);

// filter: keeps elements matching predicate
const adults = users.filter((u) => u.age >= 18);

// find: first match (or undefined)
const sara = users.find((u) => u.name === "Sara");

// findIndex, some, every
users.some((u) => u.age < 18); // true
users.every((u) => u.age > 10); // true
users.findIndex((u) => !u.active); // 1

// reduce (callback, initialValue
// acc = accumulator, cur = current element
const nums = [1, 2, 3, 4, 5];
nums.reduce((acc, cur) => acc + cur, 0); // Sum: 15

// Group by property
const byActive = users.reduce((acc, user) => {
  const key = user.active ? "active" : "inactive";
  acc[key] = [...(acc[key] || []), user];
  return acc;
}, {});

// flatten array of arrays
[
  [1, 2],
  [3, 4],
].reduce((a, b) => [...a, ...b], []);

// Chain: active users' names, uppercased
users
  .filter((u) => u.active)
  .map((u) => u.name.toUpperCase())
  .sort();

// flat: flatten nested arrays
console.log([1, [2, [3, [4]]]].flat());
console.log([1, [2, [3, [4]]]].flat(Infinity));

// flatMap: map then flatten 1 level
["Hello World", "Foo Bar"].flatMap((s) => s.split(" "));
// ['Hello', 'World','Foo','Bar']

// sort: MUTATES the array!
const arr = [10, 2, 30, 4];
[...arr].sort((a, b) => a - b);
[...arr].sort((a, b) => b - a);

// Sort objects
[...users].sort((a, b) => a.age - b.age);

// forEach: for side-effects only - returns undefined
arr.forEach((n) => console.log(n));

/* map/filter/reduce never mutate the original array. sort()
splice() DO mutate — always spread first: [...arr].sort() */

// => DOM basics
/* The DOM is a tree of objects representing HTML
JS can query, create, modify and delete nodes
Event bubbling lets events travel up the tree from child to parent. */

// Select and Mutate
// Selecting elements
document.querySelector("#app"); // 1st match
document.querySelectorAll(".card"); // NodeList
document.getElementById("title"); // fastest

// Create and Insert
const btn = document.createElement("button");
btn.textContent = "Click me";
btn.classList.add("primary");
btn.dataset.id = 42; // data-id="42"
document.body.append(btn);

// Modify
el.innerHTML = "<b>HTML</b>"; // XSS risk
el.textContent = "Safe text"; // use this
el.setAttribute("aria-label", "x");
el.style.color = "red";

// Traverse
el.parentElement;
el.children;
el.nextElementSibling;

// Bubbling: child event travels UP to ancestors
// button -> div -> section -> body -> html -> document

// Stop propagation
btn.addEventListener("click", (e) => {
  e.stopPropagation(); // dont bubble further
  e.preventDefault(); // prevent default action (links etc)
});

// Event delegation: attach ONE listener on parent
// instead of hundreds on children
document.querySelector("#list").addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (!item) return;
  console.log("Clicked:", item.dataset.id);
});

// Capturing phase (rare, 3rd arg = true)
el.addEventListener("click", handler, true);

// Remove listener (needs reference)
el.removeEventListener("click", handler);

/* Use event delegation when you have many children or dynamically added elements
one listener on a stable parent beats N listeners on N children. */

// => Event loop
/* JS is single-threaded
The event loop coordinates between the call stack, the microtask queue (promises), and the macrotask queue (setTimeout, I/O)
Microtasks always run before the next macrotask. */

// Predict output:
console.log("1"); // sync
setTimeout(() => console.log("2"), 0); // macrotask
Promise.resolve().then(() => console.log("3"));
console.log("4"); // sync
// Output: 1 -> 4 -> 3 -> 2
// Sync -> microtasks -> macrotasks

// Microtasks: Promise.then, queueMicrotask, MutationObserver
// Macrotasks: setTimeout, setInterval, I/O, UI events

// Long tasks block the UI - break them up
function yieldtoMain() {
  return new Promise((r) => setTimeout(r, 0));
}
async function process(items) {
  for (const item of items) {
    doWork(item);
  }
  await yieldtoMain(); // let UI breathe
}

/* Microtasks (promises) are processed until the queue is empty before the next macrotask runs
A promise chain can starve setTimeout callbacks. */

// Promises & async/await
/* Promises represent a value that will be available in the future
async/await is syntactic sugar over promises — it makes async code read like synchronous code. */

// Creating a promise
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    Math.random() > 0.5 ? resolve("Success!") : reject(new Error("Failed"));
  }, 1000);
});

p.then((val) => console.log(val))
  .catch((err) => console.log(err))
  .finally(() => console.log("always runs"));

// static helpers
Promise.all([p1, p2, p3]); // all resolve or 1st reject
Promise.allSettled([p1, p2]); // wait for all regardless
Promise.race([p1, p2]); // first to settle wins
Promise.any([p1, p2]); //  first to RESOLVE wins
Promise.resolve(42); // instantly resolved

// async fn always returns a Promise
async function getUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err; // re-throw if caller needs it
  }
}

// Parallel with async/await
async function loadDashboard() {
  // BAD - sequential (slow)
  const users = await getUsers();
  const posts = await petPosts();

  // GOOD - parallel
  const [users2, posts2] = await Promise.all([getUsers(), getPosts()]);
}

/* Always use try/catch with await
Unhandled promise rejections crash Node.js processes and cause silent failures in browsers. */

// => Fetch API
/* The Fetch API is the modern way to make HTTP requests
It returns a Promise, works with async/await, and requires explicit JSON parsing and error handling. */

// Basic GET
async function getPost(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  // fetch ONLY rejects on network error
  // HTTP 404/500 are still "ok:false" — must check
if(!res.ok){
    throw new Error(`Error: ${res.status} ${res.statusText}`);
}
    return res.json();  // parse body as JSON
}

// With query params
const params = new URLSearchParams({page:1, limit:10});
fetch(`/api/users?${params}`);

// Other body types
const text = await res.text();
const blob = await res.blob();  // files/images

// POST with JSON body
async function createPost(data) {
    const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
}

// Reusable API client
async function api(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    if(!res.ok) throw new Error(`${res.status}`);
    return res.json();
}

api('posts');
api('posts', {method:'POST', body: JSON.stringify(d)});

/* fetch() never throws on HTTP errors (4xx, 5xx)
Always check res.ok
Use a wrapper function so you don't repeat this check everywhere. */


// => ES6+ essentials

// Template Literals
const msg = `Hello ${user.name}, you habe ${count} msgs`;
const html = `
<div class="card">
    <h2>${title}</h2>
</div>`;

// Optional chaining - no more TypeError chains
const city = user?.address?.city;   // undefined if missing
const fn = obj?.method?.(); // call if exists
const el = arr?.[0]?.name;  // array access

// Nullish coolescing (??) vs OR (||)
const a1 = null ?? 'default';    // 'default'
const b = 0 ?? 'default';   // 0 <- 0 is valid
const c = 0 || 'default';   // 'default' <- 0 is false

// Logical assignment
x ??= 'default';    //assign only if null/undefined
x ||= 'fallback'    // assign only if false
x &&= TransformStream(x);   // assign only if true

// Symbol: unique, non-string key
const id = Symbol('id');
const obj = {[id]: 123, name: 'Ali'};
obj[id];    // 123 - wont conflict with 'id' string key

// Iterators & for...of
for(const char of 'hello') console.log(char);
for(const [k,v] of new Map([[a, 1]])) {}

// Custom iterable
const range = {
    from:1, to:3,
    [Symbol.iterator](){
        let cur = this.from;
        return {
            next: () => cur <= this.to
            ? {value: curr++, done: false}
            : {done: true}
        };
    }
};
[...range]; // [1, 2, 3]

/* ?. (oprional chaining) liberally when working with API data - deeply nested objects often have missing fields */