// => Object Basics
/*Objects are collections of key-value pairs.
Keys are strings/symbols, values can be anything */

//Object literal
const user = {
  name: "Ali",
  age: 25,
  isAdmin: false,
  greet() {
    return `Hi, Im ${this.name}`;
  }, // "this" = user
};

// Access and mute
console.log(user.age); // dot notation
console.log(user["name"]); // bracket notation
user.role = "dev"; // add new key
console.log(user.role);
delete user.isAdmin; // remove key
console.log(user.isAdmin);

// Check key existence
console.log("name" in user);
console.log(user.hasOwnProperty("age"));

// Note: Bracket notation should be used when the key is dynamic.

// => "this" keyword
/*'this' refers to the object that is calling the function
Determined at call-time, not definition-time (except for arrow functions) */

const car = {
    brand: "Toyota",
    getBrand(){return this.brand;}  // 'this' = car
}
console.log(car.getBrand());

// losing 'this' context
const fn = car.getBrand;
console.log(fn()); // undefined: 'this' = global/undefined in strict

// fixing with bind/call/apply
const bound = car.getBrand.bind(car);
console.log(bound());
console.log(car.getBrand.call(car)); // args spread
console.log(car.getBrand.apply(car, [])); // args array

// Arrow functions inherit outer 'this'
const obj = {
  name: "x",
  arrow: () => this.name, // outer this (not obj)
  regular() {
    return this.name;
  }, // obj.name
};
console.log(obj.arrow(), obj.regular());

// Note: Arrow functions do not have their own 'this'. They shouldnt be used as object methods if 'this' is needed.

// => Constructor functions

function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add methods to the prototype (shared, not per-instance)
Person.prototype.greet = function () {
  return `I'm ${this.name}`;
};

const a = new Person("Ali", 25);
console.log(a.greet());

/*Note: What new does:
1. Creates empty object {}
2. Sets __proto__ = Person.prototype
3. Runs constructor with this = {}
4. Returns 'this' implicitly

Note: Capitalise constructor function names by convention. Always call them with 'new' or 'this' will be the global object.
*/

// => Classes

class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }
  speak() {
    return `${this.name} says ${this.sound}`;
  }
  static kingdom() {
    // called on class, not instance
    return "Animalia";
  }
}

const cat = new Animal("Cat", "Meow");
console.log(cat.speak(), Animal.kingdom(), cat.constructor === Animal);

/*Note: Class bodies run in strict mode automatically.
Methods defined in class body go on Animal.prototype.*/

// => Prototypes & Chain
/*Every JS object has an internal [[Prototype]] link.
When a property is not found on the object, JS walks up this chain until it reaches null. */

const base = {
  greet() {
    return "Hello";
  },
};
const child = Object.create(base); // child.__proto__ = base

console.log(child.greet()); // found on base: Hello

// Inspect Chain
console.log(Object.getPrototypeOf(child) === base);

//Chain for a class instance:
// cat -> Animal.prototype -> Object.prototype -> null
class A {}
const a1 = new A();
console.log(Object.getPrototypeOf(a1) === A.prototype);
console.log(Object.getPrototypeOf(A.prototype) === Object.prototype);

// hasOwnProperty checks own props only
console.log(a1.hasOwnProperty("someMethod"));

// Note: Avoid mutating built-in prototypes(Array.prototype etc) in production

// => Inheritance
/*'extends' sets up the prototype chain between classes.
'super' calls the parent constructor/method. */

class Vehicle {
  constructor(brand) {
    this.brand = brand;
  }
  describe() {
    return `Brand: ${this.brand}`;
  }
}

class Car extends Vehicle {
  constructor(brand, model) {
    super(brand); // MUST call before using 'this'
    this.model = model;
  }
  describe() {
    return super.describe() + `, Model: ${this.model}`;
  }
}

const c = new Car("Toyota", "Corolla");
console.log(c.describe(), c instanceof Car, c instanceof Vehicle);

/*Note: Calling super() in child is mandatory, omitting it throws a ReferenceError. */

// => Encapsulation
/* Private fields (#) are truly inaccessible outside of class.
Public fields are declared without # */

class BankAccount {
  #balance = 0; //private field
  owner; // public field

  constructor(owner, initial) {
    this.owner = owner;
    this.#balance = initial;
  }
  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }
  get balance() {
    return this.#balance;
  } // getter
}

const acc = new BankAccount("Ali", 1000);
acc.deposit(500);
console.log(acc.balance);

/* Note: Private fields are hard syntax-level restriction */

// => Polymorphism
/* Method overriding lets child classes provide a specialised implementation of a parent method, called at runtime based on actual object type. */

class Shape {
  area() {
    return 0;
  }
  toString() {
    return `Area: ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(r) {
    super();
    this.r = r;
  }
  area() {
    return Math.PI * this.r ** 2;
  } // overrides
}

class Rect extends Shape {
  constructor(w, h) {
    super();
    this.w = w;
    this.h = h;
  }
  area() {
    return this.w * this.h;
  } // overrides
}

const shapes = [new Circle(5), new Rect(4, 6)];
shapes.forEach((s) => console.log(s.toString()));

/*Note: Polymorphism lets you write code against the parent type and 
let the runtime dispatch to the correct child method */

// => Arrow vs regular functions
/* Critical Difference is 'this' binding.
 Regular functions get their own 'this'
 arrow functions capture the enclosing lexical 'this' */

class Timer {
  constructor() {
    this.seconds = 0;
  }
  startBroken() {
    setInterval(function () {
      this.seconds++; // 'this' = global
    }, 1000);
  }
  startFixed() {
    setInterval(() => {
      (this.seconds++, 1000);
    }); // 'this' = Timer instance
  }
}

/* Other differences:
No 'arguments object.
Cannot be used as constructors. (no 'new')
No prototype property.
Implicit return for single expressions: */

const double = (x) => 2 * 2;
const toObj = (x) => ({ value: double() }); // wrap in () for object
console.log(double(), toObj());

/* Note: use arrow functions for callbacks and short utilities.
Use regular functions / class methods when you need your own 'this' */

// => Object methods
/* inspect/copy/iterate over objects */

const obj1 = { a: 1, b: 2, c: 3 };

console.log(Object.keys(obj1), Object.values(obj1), Object.entries(obj1));

// Build object from entries
Object.fromEntries([["x", 10]]);

// Shallow copy/merge
const copy = {};
Object.assign(copy, obj1, { d: 4 });
console.log(copy);

//Immutability
const frozen = Object.freeze({ x: 1 });
frozen.x = 99; // Silently fails (throws in strict)

// Define property with descriptor
Object.defineProperty(obj1, "id", {
  value: 42,
  writable: false,
  enumerable: false,
});
console.log(obj1);

/* Note: Object.assign does a shallow copy
Nested objects are still shared by reference
Use structuredClone() for deep copies */

// => Destructuring
/* Extract values from objects and arrays into named variables with concise syntax */

// Object destructuring
const { name, age, role = "user" } = user; // default value
const { name: firstName } = user; // rename
//const {address: {city}} = user; // nested

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4];
console.log(first, second, rest);
const [, second2] = [10, 20];
console.log(second2);

// Swap variables
let x = 1,
  y = 2;
console.log(x, y);
[x, y] = [y, x];
console.log(x, y);

// In function params
function show({ name, age = 0 }) {
  return `${name} is ${age}`;
}
console.log(show({ name: "barry" }), show({ name: "barry", age: 5 }));

// With object entries
for (const [key, val] of Object.entries(obj1)) {
  console.log(key, val);
}

// => Spread & rest
/* The '...' operator spreads iterables into individual elements or
collects remaining elements into an array/object */

// Spread - expand
const arr1 = [1, 2],
  arr2 = [3, 4];
const merged = [...arr1, ...arr2];
console.log(merged);

const copy1 = { ...obj1, extra: 99 }; // shallow clone + merge
const updated = { ...user, name: "Bob" }; // override key
console.log(copy1, updated);

console.log(Math.max(...arr1)); // spread into function args
console.log([..."hello"]); // ["h","e","l","l","o"]

// Rest - collect
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3, 4));

const { a: _a, ...remaining } = { a: 1, b: 2, c: 3 }; // remaining = {b:2, c:3}
console.log(A, remaining);

/* Note: Spread creates a shallow copy.
For arrays of objects, the inner objects are still references */

