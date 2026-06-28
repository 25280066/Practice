import { useState } from "react";

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  // ── JS FUNDAMENTALS ──────────────────────────────────────────────────────
  {
    topic: "JS Fundamentals", topicColor: "#7F77DD", topicBg: "#EEEDFE", topicBorder: "#AFA9EC",
    difficulty: "Easy",
    q: "What does the following print?\n\nconsole.log(typeof null);",
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    answer: 2,
    explanation: `typeof null === "object" is a famous JS bug that dates back to the language's first implementation. null is NOT an object — it's a primitive. This quirk was never fixed to avoid breaking existing code. Always use === null to check for null.`
  },
  {
    topic: "JS Fundamentals", topicColor: "#7F77DD", topicBg: "#EEEDFE", topicBorder: "#AFA9EC",
    difficulty: "Medium",
    q: "What is the output?\n\nvar x = 1;\nfunction foo() {\n  console.log(x);\n  var x = 2;\n}\nfoo();",
    options: ["1", "2", "undefined", "ReferenceError"],
    answer: 2,
    explanation: `Hoisting. var x inside foo() is hoisted to the top of the function scope, so the function effectively becomes:\n\nfunction foo() {\n  var x;           // hoisted, value = undefined\n  console.log(x);  // undefined\n  x = 2;\n}\n\nThis is why let/const are preferred — they have a Temporal Dead Zone that throws instead of silently returning undefined.`
  },
  {
    topic: "JS Fundamentals", topicColor: "#7F77DD", topicBg: "#EEEDFE", topicBorder: "#AFA9EC",
    difficulty: "Medium",
    q: "What does this print?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
    options: ["0 1 2", "3 3 3", "undefined undefined undefined", "0 0 0"],
    answer: 1,
    explanation: `3 3 3. var is function-scoped, so all three closures share the same i. By the time the setTimeout callbacks fire, the loop has finished and i === 3.\n\nFix with let (block-scoped, new binding per iteration):\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 0 1 2 ✓\n}`
  },
  {
    topic: "JS Fundamentals", topicColor: "#7F77DD", topicBg: "#EEEDFE", topicBorder: "#AFA9EC",
    difficulty: "Hard",
    q: "What does this log?\n\nfunction makeAdder(x) {\n  return function(y) {\n    return x + y;\n  };\n}\nconst add5 = makeAdder(5);\nconsole.log(add5(3));",
    options: ["NaN", "8", "undefined", "Error"],
    answer: 1,
    explanation: `8. This is a closure. makeAdder(5) returns a new function that closes over x = 5 in its outer scope. When add5(3) is called, y = 3 and x is still 5 from the closure — so 5 + 3 = 8.\n\nThis is the factory function pattern. Each call to makeAdder creates an independent closure with its own x.`
  },
  {
    topic: "JS Fundamentals", topicColor: "#7F77DD", topicBg: "#EEEDFE", topicBorder: "#AFA9EC",
    difficulty: "Hard",
    q: "What is the scope chain? How does JS resolve variable names?",
    options: [
      "JS searches the call stack from top to bottom",
      "JS searches each function's scope then walks up to outer scopes until global",
      "JS searches global scope first, then local scope",
      "JS uses dynamic scoping based on where the function is called"
    ],
    answer: 1,
    explanation: `JS uses lexical (static) scoping. When a variable is referenced, JS first looks in the current function's local scope. If not found, it walks up the scope chain — each outer function scope in turn — until it reaches the global scope. If still not found: ReferenceError.\n\nThe chain is determined at DEFINITION time, not at call time. This is why it's called "lexical" — it depends on where the code is written, not how it runs.`
  },

  // ── OOP ───────────────────────────────────────────────────────────────────
  {
    topic: "OOP", topicColor: "#1D9E75", topicBg: "#E1F5EE", topicBorder: "#5DCAA5",
    difficulty: "Easy",
    q: "What does the 'new' keyword do when calling a constructor function?",
    options: [
      "Copies the prototype into the new object",
      "Creates a plain object, sets its __proto__, runs the constructor with this = new object, returns it",
      "Clones the constructor function",
      "Only works with ES6 classes, not constructor functions"
    ],
    answer: 1,
    explanation: `new does 4 things:\n1. Creates an empty object {}\n2. Sets its [[Prototype]] to Constructor.prototype\n3. Runs the constructor with this pointing to the new object\n4. Returns the object (or whatever the constructor explicitly returns if it's an object)\n\nThis is why forgetting new with a constructor function is dangerous — this becomes the global object (or undefined in strict mode) instead.`
  },
  {
    topic: "OOP", topicColor: "#1D9E75", topicBg: "#E1F5EE", topicBorder: "#5DCAA5",
    difficulty: "Medium",
    q: "What does this print?\n\nclass Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} speaks`; }\n}\nclass Dog extends Animal {\n  speak() { return super.speak() + ' (woof!)'; }\n}\nconst d = new Dog('Rex');\nconsole.log(d.speak());",
    options: ["Rex speaks", "speaks (woof!)", "Rex speaks (woof!)", "undefined (woof!)"],
    answer: 2,
    explanation: `"Rex speaks (woof!)"\n\nDog.speak() calls super.speak() which runs Animal.speak() with this still pointing to the Dog instance — so this.name = 'Rex'. Then it appends ' (woof!)'.\n\nThis is method overriding (polymorphism). super lets you extend the parent's behaviour rather than replace it entirely.`
  },
  {
    topic: "OOP", topicColor: "#1D9E75", topicBg: "#E1F5EE", topicBorder: "#5DCAA5",
    difficulty: "Medium",
    q: "What is the prototype chain for an instance of a class Dog that extends Animal?",
    options: [
      "dog → Dog → Animal → null",
      "dog → Dog.prototype → Animal.prototype → Object.prototype → null",
      "dog → Animal.prototype → Dog.prototype → null",
      "dog → Object.prototype → Animal.prototype → Dog.prototype → null"
    ],
    answer: 1,
    explanation: `dog instance → Dog.prototype → Animal.prototype → Object.prototype → null\n\nMethods defined in a class body go onto the .prototype object, not the instance. When you call dog.speak(), JS looks on the dog instance first (not found), then Dog.prototype (found — done!).\n\nThis is why 100 instances of Dog share one copy of speak() in memory — they all delegate to Dog.prototype.`
  },
  {
    topic: "OOP", topicColor: "#1D9E75", topicBg: "#E1F5EE", topicBorder: "#5DCAA5",
    difficulty: "Hard",
    q: "What is the difference between class fields with # and the old _ convention?",
    options: [
      "No difference — both are just naming conventions",
      "# fields are enforced at the syntax level — accessing them outside the class is a SyntaxError. _ is just a gentleman's agreement with no enforcement.",
      "# is only for static fields; _ is for instance fields",
      "# prevents subclasses from accessing the field; _ does not"
    ],
    answer: 1,
    explanation: `Private class fields (#) are a hard language-level restriction:\n\nclass Foo {\n  #secret = 42;\n}\nconst f = new Foo();\nf.#secret; // SyntaxError — can't even be read in DevTools!\n\nThe _ convention was just documentation — other developers knew _name meant "don't touch this", but JS didn't enforce it at all. f._name = 99 worked fine.\n\n# fields also don't appear in Object.keys(), JSON.stringify(), or for...in loops.`
  },
  {
    topic: "OOP", topicColor: "#1D9E75", topicBg: "#E1F5EE", topicBorder: "#5DCAA5",
    difficulty: "Hard",
    q: "What prints?\n\nfunction Person(name) { this.name = name; }\nPerson.prototype.greet = function() { return this.name; };\nconst p = new Person('Ali');\nconsole.log(p.hasOwnProperty('name'));\nconsole.log(p.hasOwnProperty('greet'));",
    options: ["true, true", "false, false", "true, false", "false, true"],
    answer: 2,
    explanation: `true, false.\n\nname is set with this.name = name inside the constructor — so it's an OWN property of the instance p.\n\ngreet is attached to Person.prototype — it's inherited, not own. p can access it via the prototype chain, but hasOwnProperty returns false because it's not directly on p.\n\nRule: constructor sets own properties; .prototype holds shared methods.`
  },

  // ── DATA STRUCTURES ───────────────────────────────────────────────────────
  {
    topic: "Data Structures", topicColor: "#D85A30", topicBg: "#FAECE7", topicBorder: "#F0997B",
    difficulty: "Easy",
    q: "What is the time complexity of removing the tail node from a singly linked list (with a tail pointer)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    answer: 2,
    explanation: `O(n). Even with a tail pointer, you can't remove the tail in O(1) with a singly linked list.\n\nWhy? To remove the tail, you need to set the second-to-last node's .next = null. But there's no .prev pointer, so you have to walk the entire list from head to find it — O(n).\n\nThis is the key advantage of a doubly linked list: .prev lets you jump to the second-to-last node instantly — O(1) tail removal.`
  },
  {
    topic: "Data Structures", topicColor: "#D85A30", topicBg: "#FAECE7", topicBorder: "#F0997B",
    difficulty: "Medium",
    q: "What data structure would you use to implement an 'undo' feature in a text editor, and why?",
    options: [
      "Queue — first action is the first to be undone",
      "Stack — last action is the first to be undone (LIFO)",
      "Linked list — O(1) insert and delete",
      "Hash map — O(1) lookup of any past state"
    ],
    answer: 1,
    explanation: `Stack (LIFO). Undo means reversing the most recent action — the last thing you did is the first thing to undo. That's exactly LIFO.\n\nEach action (type char, delete, paste) is push()ed onto the stack. Ctrl+Z calls pop() to retrieve and reverse the latest action.\n\nRedo is typically a second stack — when you undo, push the action onto the redo stack. If you perform a new action, clear the redo stack.`
  },
  {
    topic: "Data Structures", topicColor: "#D85A30", topicBg: "#FAECE7", topicBorder: "#F0997B",
    difficulty: "Medium",
    q: "Why is a linked list-backed queue more efficient than an array-backed queue for dequeue operations?",
    options: [
      "Linked lists use less memory overall",
      "Array.shift() is O(n) because it re-indexes every element; linked list dequeue is O(1) — just move the head pointer",
      "Arrays don't support queue operations",
      "Linked lists have O(1) random access unlike arrays"
    ],
    answer: 1,
    explanation: `Array.shift() removes the first element but then shifts every remaining element left by one index — O(n).\n\nA linked list queue maintains a head pointer. Dequeue just does:\nconst val = this.#head.val;\nthis.#head = this.#head.next; // O(1)!\n\nNo element is moved. Only a pointer is updated.\n\nFor enqueue (adding to rear), both are O(1) — arrays use push(), linked lists update the tail pointer.`
  },
  {
    topic: "Data Structures", topicColor: "#D85A30", topicBg: "#FAECE7", topicBorder: "#F0997B",
    difficulty: "Hard",
    q: "In a circular linked list, what is the key bug to avoid when traversing?",
    options: [
      "Forgetting to check for null on every node",
      "Using while(cur) which loops forever since there's no null — use do-while and stop when cur wraps back to head",
      "Starting traversal from tail instead of head",
      "Not tracking the size separately"
    ],
    answer: 1,
    explanation: `In a circular list, tail.next = head — there is no null terminator. A standard while(cur !== null) loop will spin forever.\n\nCorrect pattern:\nconst head = this.#head;\nlet cur = head;\ndo {\n  // process cur\n  cur = cur.next;\n} while (cur !== head); // stop when we wrap back\n\nThe do-while guarantees at least one iteration and exits when the traversal completes the circle.`
  },
  {
    topic: "Data Structures", topicColor: "#D85A30", topicBg: "#FAECE7", topicBorder: "#F0997B",
    difficulty: "Hard",
    q: "What combination of data structures gives an LRU Cache O(1) get AND O(1) put?",
    options: [
      "Array + Binary Search Tree",
      "Stack + Queue",
      "Hash Map + Doubly Linked List",
      "Hash Map + Min-Heap"
    ],
    answer: 2,
    explanation: `Hash Map + Doubly Linked List.\n\n• Hash Map gives O(1) lookup by key → node\n• Doubly Linked List maintains access order (most recent at front, LRU at back)\n• On get: find node via map, move it to front → O(1)\n• On put: add to front + map; if over capacity, remove tail (LRU) → O(1)\n\nDoubly linked is essential — removing an arbitrary node requires O(1) access to its prev, which only a doubly linked list provides. Singly would need O(n) traversal.`
  },

  // ── ASYNC JS ──────────────────────────────────────────────────────────────
  {
    topic: "Async JS", topicColor: "#BA7517", topicBg: "#FAEEDA", topicBorder: "#EF9F27",
    difficulty: "Easy",
    q: "What is the output order?\n\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');",
    options: ["A B C D", "A D B C", "A D C B", "A C D B"],
    answer: 2,
    explanation: `A → D → C → B\n\nExecution order:\n1. Sync: A, then D\n2. Microtasks (Promise.then): C\n3. Macrotasks (setTimeout): B\n\nMicrotasks always drain completely before the next macrotask runs. Promise.then callbacks go into the microtask queue; setTimeout goes into the macrotask queue — even with 0ms delay.`
  },
  {
    topic: "Async JS", topicColor: "#BA7517", topicBg: "#FAEEDA", topicBorder: "#EF9F27",
    difficulty: "Medium",
    q: "What is wrong with this code?\n\nasync function loadAll() {\n  const users = await fetchUsers();\n  const posts = await fetchPosts();\n  return { users, posts };\n}",
    options: [
      "async functions can't return objects",
      "fetchPosts() won't start until fetchUsers() completes — they run sequentially, wasting time if independent",
      "await can only be used with Promise.all",
      "Nothing — this is correct async/await usage"
    ],
    answer: 1,
    explanation: `The requests are sequential — fetchPosts() doesn't start until fetchUsers() fully resolves. If each takes 1s, total wait = 2s.\n\nSince they're independent, run them in parallel:\nasync function loadAll() {\n  const [users, posts] = await Promise.all([\n    fetchUsers(),\n    fetchPosts()\n  ]);\n  return { users, posts };\n}\n\nNow both fire simultaneously — total wait ≈ 1s (whichever is slower).`
  },
  {
    topic: "Async JS", topicColor: "#BA7517", topicBg: "#FAEEDA", topicBorder: "#EF9F27",
    difficulty: "Medium",
    q: "What is the difference between Promise.all and Promise.allSettled?",
    options: [
      "Promise.all is faster; Promise.allSettled is more accurate",
      "Promise.all rejects immediately if any promise rejects; Promise.allSettled waits for all and returns each result (fulfilled or rejected)",
      "Promise.allSettled only works with async functions",
      "They are identical — allSettled is just an alias"
    ],
    answer: 1,
    explanation: `Promise.all — "all or nothing". If any promise rejects, the whole thing rejects immediately (fail-fast). Other pending promises are ignored.\n\nPromise.allSettled — "wait for everyone". Always resolves with an array of { status, value/reason } for every promise regardless of success/failure.\n\nUse Promise.all when you need all results and any failure is fatal.\nUse Promise.allSettled when you want to handle each result individually (e.g., show partial data, report which API calls failed).`
  },
  {
    topic: "Async JS", topicColor: "#BA7517", topicBg: "#FAEEDA", topicBorder: "#EF9F27",
    difficulty: "Hard",
    q: "fetch() rejects its Promise when the server returns a 404. True or false?",
    options: ["True — 4xx/5xx responses reject the Promise", "False — fetch() only rejects on network failure; 4xx/5xx resolve with ok: false"],
    answer: 1,
    explanation: `False. fetch() only rejects on network-level errors (no connection, DNS failure, CORS block). HTTP error status codes like 404 or 500 still resolve the Promise — you must manually check res.ok:\n\nconst res = await fetch('/api/data');\nif (!res.ok) throw new Error(\`HTTP \${res.status}\`);\nconst data = await res.json();\n\nThis is one of the most common fetch bugs in production code.`
  },
  {
    topic: "Async JS", topicColor: "#BA7517", topicBg: "#FAEEDA", topicBorder: "#EF9F27",
    difficulty: "Hard",
    q: "What are microtasks vs macrotasks? Name two of each.",
    options: [
      "Microtasks: setTimeout, setInterval. Macrotasks: Promise.then, queueMicrotask",
      "Microtasks: Promise.then, queueMicrotask. Macrotasks: setTimeout, setInterval / I/O callbacks",
      "They are the same queue processed in FIFO order",
      "Microtasks: async/await. Macrotasks: Promises"
    ],
    answer: 1,
    explanation: `Microtask queue (higher priority — drains completely before next macrotask):\n• Promise .then / .catch / .finally\n• queueMicrotask()\n• MutationObserver\n\nMacrotask queue (one per event loop tick):\n• setTimeout / setInterval\n• I/O callbacks (file reads, network)\n• UI rendering events\n\nThe event loop processes ALL microtasks first, then picks ONE macrotask, then ALL microtasks again, and so on.`
  },

  // ── ARRAY METHODS ─────────────────────────────────────────────────────────
  {
    topic: "Array Methods", topicColor: "#185FA5", topicBg: "#E6F0FA", topicBorder: "#7BAED4",
    difficulty: "Easy",
    q: "What does Array.map() return?",
    options: [
      "The same array mutated in-place",
      "A new array of the same length with each element transformed",
      "A single accumulated value",
      "A filtered subset of the original array"
    ],
    answer: 1,
    explanation: `map() always returns a NEW array of the SAME LENGTH, with each element transformed by the callback. The original array is never mutated.\n\nconst nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2); // [2, 4, 6]\n// nums is still [1, 2, 3]\n\nIf you want to transform AND filter, chain .filter().map() or use .reduce() in one pass.`
  },
  {
    topic: "Array Methods", topicColor: "#185FA5", topicBg: "#E6F0FA", topicBorder: "#7BAED4",
    difficulty: "Medium",
    q: "What does this return?\n\n[1,2,3,4,5].reduce((acc, n) => n % 2 === 0 ? [...acc, n*2] : acc, [])",
    options: ["[2, 4, 6, 8, 10]", "[4, 8]", "[2, 8]", "[1, 4, 3, 8, 5]"],
    answer: 1,
    explanation: `[4, 8]. This reduce combines filter + map in a single pass:\n\n• n=1: odd → skip → acc = []\n• n=2: even → [...[], 4] → acc = [4]\n• n=3: odd → skip → acc = [4]\n• n=4: even → [...[4], 8] → acc = [4, 8]\n• n=5: odd → skip → acc = [4, 8]\n\nThis pattern (reduce as a filter+map) is O(n) vs two-pass .filter().map() which is also O(n) but iterates twice — both are valid.`
  },
  {
    topic: "Array Methods", topicColor: "#185FA5", topicBg: "#E6F0FA", topicBorder: "#7BAED4",
    difficulty: "Medium",
    q: "What is the difference between .find() and .filter()?",
    options: [
      "find() returns a boolean; filter() returns an array",
      "find() returns the first matching element (or undefined); filter() returns all matching elements as a new array",
      "filter() stops at the first match; find() checks every element",
      "They are identical — just aliases"
    ],
    answer: 1,
    explanation: `find() — returns the FIRST element that matches, then stops. Returns undefined if no match.\nfilter() — checks EVERY element, returns a new array of ALL matches (empty array if none).\n\nconst users = [{id:1,name:'Ali'},{id:2,name:'Sara'}];\nusers.find(u => u.id === 1);   // {id:1,name:'Ali'} — single object\nusers.filter(u => u.id === 1); // [{id:1,name:'Ali'}] — array\n\nUse find() when you expect one result; filter() when you want all matches.`
  },
  {
    topic: "Array Methods", topicColor: "#185FA5", topicBg: "#E6F0FA", topicBorder: "#7BAED4",
    difficulty: "Hard",
    q: "What is the danger with [1,2,3].sort() in JavaScript?",
    options: [
      "sort() returns undefined instead of the sorted array",
      "sort() converts elements to strings first by default, so numbers sort lexicographically: [1,10,2] not [1,2,10]",
      "sort() only works on strings",
      "sort() creates a new array instead of mutating"
    ],
    answer: 1,
    explanation: `Two dangers:\n\n1. Default sort converts to strings:\n[1, 10, 2].sort() → [1, 10, 2]  ← wrong! (lexicographic)\n\nFix: always provide a comparator:\n[1, 10, 2].sort((a, b) => a - b) → [1, 2, 10]  ✓\n\n2. sort() MUTATES the original array!\nconst arr = [3,1,2];\nconst sorted = arr.sort((a,b) => a-b);\n// arr is NOW [1,2,3] — mutated!\n\nSafe pattern: [...arr].sort((a,b) => a-b)`
  },
  {
    topic: "Array Methods", topicColor: "#185FA5", topicBg: "#E6F0FA", topicBorder: "#7BAED4",
    difficulty: "Hard",
    q: "Group this array by category using reduce:\n[{name:'A',cat:'x'},{name:'B',cat:'y'},{name:'C',cat:'x'}]",
    options: [
      "arr.reduce((acc, item) => { acc[item.cat].push(item); return acc; }, {})",
      "arr.reduce((acc, item) => { acc[item.cat] = [...(acc[item.cat] || []), item]; return acc; }, {})",
      "arr.map(item => ({ [item.cat]: item }))",
      "arr.filter(item => item.cat).reduce((a,b) => a+b)"
    ],
    answer: 1,
    explanation: `Option B is correct:\nacc[item.cat] = [...(acc[item.cat] || []), item]\n\nThe || [] handles the first time a category appears (acc[item.cat] is undefined). Result:\n{\n  x: [{name:'A',cat:'x'},{name:'C',cat:'x'}],\n  y: [{name:'B',cat:'y'}]\n}\n\nOption A fails with "Cannot read properties of undefined (push)" on the first item of each new category because acc[item.cat] starts as undefined.`
  },

  // ── DOM & EVENTS ──────────────────────────────────────────────────────────
  {
    topic: "DOM & Events", topicColor: "#993556", topicBg: "#F9EEF2", topicBorder: "#D68099",
    difficulty: "Easy",
    q: "What is event bubbling?",
    options: [
      "Events fire from the document root down to the target element",
      "After an event fires on the target, it propagates up through each ancestor in the DOM",
      "Multiple events fired simultaneously merge into one",
      "Events are queued and processed one at a time"
    ],
    answer: 1,
    explanation: `Bubbling: an event fires on the target element, then bubbles UP through each ancestor: target → parent → grandparent → ... → document.\n\nClick a button inside a div — both the button AND the div receive the click event.\n\nCapturing (rarely used) is the opposite: document → ... → target. You enable it with the 3rd arg: addEventListener('click', fn, true).\n\nstopPropagation() halts bubbling at any point.`
  },
  {
    topic: "DOM & Events", topicColor: "#993556", topicBg: "#F9EEF2", topicBorder: "#D68099",
    difficulty: "Medium",
    q: "What is event delegation and why is it useful?",
    options: [
      "Assigning different events to different elements for performance",
      "Attaching ONE listener to a parent instead of many listeners to children, using bubbling to detect which child was clicked",
      "Delegating event handling to a Web Worker",
      "Preventing default browser behaviour on form submissions"
    ],
    answer: 1,
    explanation: `Event delegation leverages bubbling. Instead of:\n// BAD — 1000 listeners\nlistItems.forEach(li => li.addEventListener('click', handler));\n\nDo:\n// GOOD — 1 listener\nul.addEventListener('click', e => {\n  const li = e.target.closest('li');\n  if (!li) return;\n  handle(li.dataset.id);\n});\n\nBenefits:\n• Works for dynamically added children (no re-binding)\n• Far fewer listeners → less memory\n• Cleaner code`
  },
  {
    topic: "DOM & Events", topicColor: "#993556", topicBg: "#F9EEF2", topicBorder: "#D68099",
    difficulty: "Medium",
    q: "What is the difference between e.target and e.currentTarget?",
    options: [
      "They always point to the same element",
      "e.target is the element that triggered the event; e.currentTarget is the element the listener is attached to",
      "e.currentTarget is the element that triggered the event; e.target is the listener element",
      "e.target is only available during capture phase"
    ],
    answer: 1,
    explanation: `e.target — the element that ACTUALLY triggered the event (where the click/key happened).\ne.currentTarget — the element the addEventListener is attached to.\n\nExample: listener on <ul>, user clicks <li>:\n• e.target = the <li> that was clicked\n• e.currentTarget = the <ul> (where the listener lives)\n\nIn the handler, this also refers to e.currentTarget (for regular functions). This distinction is critical for event delegation.`
  },
  {
    topic: "DOM & Events", topicColor: "#993556", topicBg: "#F9EEF2", topicBorder: "#D68099",
    difficulty: "Hard",
    q: "Why can attaching event listeners cause memory leaks, and how do you prevent it?",
    options: [
      "addEventListener stores listeners in a global array that grows forever",
      "If the listener holds a reference to a large object or DOM node, removing the element from the DOM doesn't release the memory if the listener still exists",
      "Event listeners prevent garbage collection of the window object",
      "Memory leaks only occur with inline event handlers (onclick=)"
    ],
    answer: 1,
    explanation: `If a listener closes over a large object, that object can't be GC'd as long as the listener exists — even after the DOM node is removed.\n\nPrevent with:\n1. removeEventListener (requires saved reference to the same function)\nconst handler = () => doWork();\nel.addEventListener('click', handler);\nel.removeEventListener('click', handler); // later\n\n2. AbortController (cleaner for multiple listeners):\nconst ac = new AbortController();\nel.addEventListener('click', fn, { signal: ac.signal });\nac.abort(); // removes all listeners at once`
  },

  // ── ES6+ ─────────────────────────────────────────────────────────────────
  {
    topic: "ES6+", topicColor: "#2E7D32", topicBg: "#E8F5E9", topicBorder: "#81C784",
    difficulty: "Easy",
    q: "What does the nullish coalescing operator (??) do, and how does it differ from ||?",
    options: [
      "They are identical",
      "?? only falls back when the left side is null or undefined; || falls back on any falsy value (0, '', false, null, undefined)",
      "|| is for booleans only; ?? works with any type",
      "?? is stricter — it only works with null, not undefined"
    ],
    answer: 1,
    explanation: `const a = 0 || 'default';  // 'default' — 0 is falsy!\nconst b = 0 ?? 'default';  // 0 — 0 is NOT null/undefined\n\n?? only triggers when the left side is strictly null or undefined.\n|| triggers for any falsy value: 0, '', false, NaN, null, undefined.\n\nUse ?? when 0 or '' are valid values you want to preserve. This is very common with API data where 0 is a meaningful value (count, price, score).`
  },
  {
    topic: "ES6+", topicColor: "#2E7D32", topicBg: "#E8F5E9", topicBorder: "#81C784",
    difficulty: "Medium",
    q: "What does this destructuring do?\n\nconst { a: x, b: y = 10 } = { a: 1 };",
    options: [
      "Creates variables a and b; b defaults to 10",
      "Creates variables x=1 and y=10 (renamed + default value)",
      "Throws an error because b is missing",
      "Creates x=undefined and y=10"
    ],
    answer: 1,
    explanation: `{ a: x } means "take property a, put it in variable x". So x = 1.\n{ b: y = 10 } means "take property b, put it in variable y, default to 10 if missing". Since b doesn't exist, y = 10.\n\nThe variables created are x and y — NOT a and b.\n\nThis pattern (rename + default) is common in function params:\nfunction show({ name: displayName = 'Guest', age: years = 0 } = {}) { ... }`
  },
  {
    topic: "ES6+", topicColor: "#2E7D32", topicBg: "#E8F5E9", topicBorder: "#81C784",
    difficulty: "Medium",
    q: "What is the difference between a named export and a default export?",
    options: [
      "Named exports can only export functions; default exports can export anything",
      "A file can have many named exports but only ONE default export. Named imports use {braces}; default imports don't.",
      "Default exports are faster at runtime",
      "Named exports require the same name on import; default exports always use the same name too"
    ],
    answer: 1,
    explanation: `Named: export const PI = 3.14; export function add() {}\nImport: import { PI, add } from './math.js';\n(name must match, can alias with 'as')\n\nDefault: export default class Calculator {}\nImport: import Calculator from './math.js'; import Calc from './math.js';\n(any name works — one per file)\n\nBest practice: use named exports for utilities (tree-shakeable), default export for the primary thing a module provides (class, component).`
  },
  {
    topic: "ES6+", topicColor: "#2E7D32", topicBg: "#E8F5E9", topicBorder: "#81C784",
    difficulty: "Hard",
    q: "What does optional chaining (?.) protect against, and what does it return on failure?",
    options: [
      "Protects against null references; returns false on failure",
      "Protects against TypeError when accessing a property on null or undefined; returns undefined on failure",
      "Protects against all runtime errors; returns null on failure",
      "Only works with function calls, not property access"
    ],
    answer: 1,
    explanation: `Without ?. :\nconst city = user.address.city; // TypeError if address is null/undefined\n\nWith ?. :\nconst city = user?.address?.city; // undefined if any part is null/undefined — no crash\n\nAlso works for:\n• Method calls: obj?.method?.()  — calls only if method exists\n• Array access: arr?.[0]?.name\n• Dynamic: obj?.[key]\n\nAlways returns undefined (not null, not false) on short-circuit. Combine with ?? for defaults:\nconst city = user?.address?.city ?? 'Unknown';`
  },
  {
    topic: "ES6+", topicColor: "#2E7D32", topicBg: "#E8F5E9", topicBorder: "#81C784",
    difficulty: "Hard",
    q: "What is the difference between spread and rest, even though both use '...'?",
    options: [
      "They are the same — context determines meaning",
      "Spread EXPANDS an iterable into individual items. Rest COLLECTS remaining items into an array. Location determines which one.",
      "Rest is only used in array destructuring; spread is only for function calls",
      "Spread mutates the original; rest does not"
    ],
    answer: 1,
    explanation: `Same syntax, opposite purposes:\n\nSPREAD — expands:\nconst merged = [...arr1, ...arr2];     // expand into array\nconst copy   = { ...obj, key: 'new' }; // expand into object\nMath.max(...nums);                      // expand into args\n\nREST — collects:\nfunction sum(...nums) { ... }          // collect all args\nconst { a, ...rest } = obj;           // collect remaining props\nconst [first, ...tail] = arr;         // collect remaining items\n\nRest MUST be last in its context. You can't do (a, ...b, c) — SyntaxError.`
  },
];

// shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOPICS = ["JS Fundamentals","OOP","Data Structures","Async JS","Array Methods","DOM & Events","ES6+"];
const DIFF_COLOR = { Easy: { bg:"#E1F5EE", c:"#085041", br:"#5DCAA5" }, Medium: { bg:"#FAEEDA", c:"#633806", br:"#EF9F27" }, Hard: { bg:"#FAECE7", c:"#712B13", br:"#F0997B" } };

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function InterviewQuiz() {
  const [questions]    = useState(() => shuffle(ALL_QUESTIONS));
  const [idx, setIdx]  = useState(0);
  const [selected, setSelected] = useState(null);   // chosen option index
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores]     = useState([]);      // true/false per question
  const [done, setDone]         = useState(false);
  const [filter, setFilter]     = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");

  const visibleQs = questions.filter(q =>
    (filter === "All" || q.difficulty === filter) &&
    (topicFilter === "All" || q.topic === topicFilter)
  );
  const total    = visibleQs.length;
  const q        = visibleQs[idx] || null;
  const correct  = scores.filter(Boolean).length;
  const progress = total > 0 ? Math.round(((idx) / total) * 100) : 0;

  function choose(i) {
    if (revealed) return;
    setSelected(i);
  }

  function reveal() {
    if (selected === null) return;
    setRevealed(true);
    setScores(s => [...s, selected === q.answer]);
  }

  function next() {
    if (idx + 1 >= total) { setDone(true); return; }
    setIdx(i => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function restart() {
    setIdx(0); setSelected(null); setRevealed(false); setScores([]); setDone(false);
  }

  const BOR = "1px solid #e0e0dd";
  const BG  = "#f9f9f8";

  // ── Results screen ─────────────────────────────────────────────────────────
  if (done) {
    const pct = Math.round((correct / scores.length) * 100);
    const grade = pct >= 85 ? { label:"Excellent", emoji:"🏆", c:"#085041", bg:"#E1F5EE" }
                : pct >= 65 ? { label:"Good",      emoji:"👍", c:"#633806", bg:"#FAEEDA" }
                :             { label:"Keep going", emoji:"📚", c:"#712B13", bg:"#FAECE7" };

    const byTopic = TOPICS.map(t => {
      const qs = visibleQs.filter((_,i) => visibleQs[i].topic === t);
      const correct = qs.filter((_, i) => {
        const globalIdx = visibleQs.findIndex((q2,j) => q2.topic === t && j === visibleQs.filter((q3,k) => q3.topic === t && k <= j).indexOf(visibleQs.filter(q3=>q3.topic===t).find((_,li)=>li===qs.indexOf(qs[i]))));
        return scores[globalIdx];
      }).length;
      return { topic: t, total: qs.length, correct };
    }).filter(r => r.total > 0);

    return (
      <div style={{ fontFamily:"system-ui,sans-serif", color:"#1a1a1a", fontSize:14 }}>
        <div style={{ textAlign:"center", padding:"24px 0 20px" }}>
          <div style={{ fontSize:48, marginBottom:8 }}>{grade.emoji}</div>
          <div style={{ fontSize:22, fontWeight:600, marginBottom:4 }}>{grade.label}</div>
          <div style={{ fontSize:15, color:"#555", marginBottom:16 }}>
            {correct} / {scores.length} correct — {pct}%
          </div>
          <div style={{ width:220, height:8, background:"#f0f0ee", borderRadius:4, margin:"0 auto 24px" }}>
            <div style={{ height:"100%", borderRadius:4, background: pct>=85?"#1D9E75":pct>=65?"#EF9F27":"#E24B4A", width:`${pct}%`, transition:"width .5s" }} />
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10, marginBottom:20 }}>
          {byTopic.map(({ topic, total, correct }) => {
            const pct2 = total > 0 ? Math.round(correct/total*100) : 0;
            return (
              <div key={topic} style={{ border:BOR, borderRadius:8, padding:"10px 14px", background:"#fff" }}>
                <div style={{ fontSize:11, color:"#888", marginBottom:4 }}>{topic}</div>
                <div style={{ fontSize:14, fontWeight:500, color:"#1a1a1a" }}>{correct}/{total}</div>
                <div style={{ height:4, background:"#f0f0ee", borderRadius:2, marginTop:6 }}>
                  <div style={{ height:"100%", borderRadius:2, background: pct2>=80?"#1D9E75":pct2>=50?"#EF9F27":"#E24B4A", width:`${pct2}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign:"center" }}>
          <button onClick={restart} style={{ padding:"10px 28px", fontSize:14, cursor:"pointer", border:"1px solid #AFA9EC", borderRadius:8, background:"#EEEDFE", color:"#3C3489", fontFamily:"inherit", fontWeight:500 }}>
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!q) return <div style={{ padding:20, color:"#999" }}>No questions match the current filters.</div>;

  const dc = DIFF_COLOR[q.difficulty];

  // ── Question screen ────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"system-ui,sans-serif", color:"#1a1a1a", fontSize:14 }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
        <div style={{ fontSize:16, fontWeight:600 }}>🎯 Interview Quiz</div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:12, color:"#888" }}>{Math.min(idx+1,total)} / {total}</span>
          <span style={{ fontSize:12, color:"#1D9E75", fontWeight:500 }}>✓ {correct}</span>
          {idx > 0 && <span style={{ fontSize:12, color:"#E24B4A" }}>✗ {idx - correct}</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height:4, background:"#f0f0ee", borderRadius:2, marginBottom:14 }}>
        <div style={{ height:"100%", borderRadius:2, background:"#7F77DD", width:`${progress}%`, transition:"width .3s" }} />
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {["All","Easy","Medium","Hard"].map(d => (
          <button key={d} onClick={() => { setFilter(d); restart(); }}
            style={{ padding:"3px 11px", fontSize:11, cursor:"pointer", fontFamily:"inherit",
              border: `1px solid ${filter===d?"#7F77DD":"#ddd"}`,
              background: filter===d?"#EEEDFE":"transparent", color: filter===d?"#3C3489":"#666",
              borderRadius:20, fontWeight: filter===d?500:400 }}>
            {d}
          </button>
        ))}
        <span style={{ margin:"0 4px", color:"#ddd" }}>|</span>
        {["All",...TOPICS].map(t => (
          <button key={t} onClick={() => { setTopicFilter(t); restart(); }}
            style={{ padding:"3px 11px", fontSize:11, cursor:"pointer", fontFamily:"inherit",
              border: `1px solid ${topicFilter===t?"#1D9E75":"#ddd"}`,
              background: topicFilter===t?"#E1F5EE":"transparent", color: topicFilter===t?"#085041":"#666",
              borderRadius:20, fontWeight: topicFilter===t?500:400 }}>
            {t === "All" ? "All Topics" : t}
          </button>
        ))}
      </div>

      {/* Question card */}
      <div style={{ border:BOR, borderRadius:12, overflow:"hidden", background:"#fff", marginBottom:12 }}>
        {/* Topic bar */}
        <div style={{ padding:"8px 16px", background: q.topicBg, borderBottom:`1px solid ${q.topicBorder}`, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:12, fontWeight:500, color: q.topicColor }}>{q.topic}</span>
          <span style={{ flex:1 }} />
          <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background: dc.bg, color: dc.c, border:`0.5px solid ${dc.br}`, fontWeight:500 }}>{q.difficulty}</span>
        </div>

        {/* Question */}
        <div style={{ padding:"18px 18px 14px" }}>
          <pre style={{ fontFamily:"system-ui,sans-serif", fontSize:13.5, lineHeight:1.7, margin:0, whiteSpace:"pre-wrap", color:"#1a1a1a" }}>{q.q}</pre>
        </div>

        {/* Options */}
        <div style={{ padding:"0 14px 16px", display:"flex", flexDirection:"column", gap:7 }}>
          {q.options.map((opt, i) => {
            const isSelected  = selected === i;
            const isCorrect   = i === q.answer;
            const isWrong     = revealed && isSelected && !isCorrect;
            const isRight     = revealed && isCorrect;

            let bg = "#fafafa", border = "#e0e0dd", color = "#1a1a1a";
            if (!revealed && isSelected) { bg = "#EEEDFE"; border = "#AFA9EC"; color = "#3C3489"; }
            if (isRight)  { bg = "#E1F5EE"; border = "#5DCAA5"; color = "#085041"; }
            if (isWrong)  { bg = "#FAECE7"; border = "#F0997B"; color = "#712B13"; }

            return (
              <button key={i} onClick={() => choose(i)} disabled={revealed}
                style={{ width:"100%", textAlign:"left", padding:"10px 14px", border:`1.5px solid ${border}`,
                  borderRadius:8, background:bg, color, cursor: revealed?"default":"pointer",
                  fontFamily:"inherit", fontSize:13, lineHeight:1.5, display:"flex", alignItems:"flex-start", gap:10,
                  transition:"all .15s" }}>
                <span style={{ fontSize:11, minWidth:18, height:18, borderRadius:"50%", background: isRight?"#1D9E75":isWrong?"#E24B4A":isSelected?"#7F77DD":"#e0e0dd", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, fontWeight:500 }}>
                  {revealed && isCorrect ? "✓" : revealed && isWrong ? "✗" : String.fromCharCode(65+i)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <div style={{ margin:"0 14px 16px", padding:"14px 16px", background: selected===q.answer?"#E1F5EE":"#FAECE7", border:`1px solid ${selected===q.answer?"#5DCAA5":"#F0997B"}`, borderRadius:8 }}>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", color: selected===q.answer?"#085041":"#712B13", marginBottom:8 }}>
              {selected === q.answer ? "✓ Correct!" : "✗ Not quite — here's why:"}
            </div>
            <pre style={{ fontFamily:"system-ui,sans-serif", fontSize:12.5, lineHeight:1.72, margin:0, whiteSpace:"pre-wrap", color: selected===q.answer?"#0a4032":"#5a1a0a" }}>
              {q.explanation}
            </pre>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ padding:"0 14px 16px", display:"flex", gap:8 }}>
          {!revealed ? (
            <button onClick={reveal} disabled={selected === null}
              style={{ flex:1, padding:"10px 0", fontSize:13, cursor: selected===null?"default":"pointer",
                border:"1px solid #AFA9EC", borderRadius:8, background: selected===null?"#f5f5f3":"#EEEDFE",
                color: selected===null?"#aaa":"#3C3489", fontFamily:"inherit", fontWeight:500,
                opacity: selected===null ? 0.6 : 1 }}>
              Check Answer
            </button>
          ) : (
            <button onClick={next}
              style={{ flex:1, padding:"10px 0", fontSize:13, cursor:"pointer",
                border:"1px solid #5DCAA5", borderRadius:8, background:"#E1F5EE",
                color:"#085041", fontFamily:"inherit", fontWeight:500 }}>
              {idx + 1 >= total ? "See Results →" : "Next Question →"}
            </button>
          )}
        </div>
      </div>

      {/* Mini progress by topic */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {TOPICS.map(t => {
          const tqs = visibleQs.filter(q => q.topic === t);
          return tqs.length > 0 ? (
            <span key={t} style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:"#f5f5f3", border:BOR, color:"#888" }}>
              {t}: {tqs.length}q
            </span>
          ) : null;
        })}
      </div>
    </div>
  );
}