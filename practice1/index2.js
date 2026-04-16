//=> Modules (import/export)

import Calculator, {PI, add} from "./math.js";
import * as MathLib from "./math.js"; // namespace import

// Rename on import
import {add as sum1} from "./math.js"

// Dynamic Import (lazy-load)
const {add: lazyAdd} = await import("./math.js");

// Re-export
export {add} from "./math.js"

const cl = new Calculator()
console.log(sum1(PI, 1), add(1,2), cl.multiply(2,3) );
console.log(MathLib.PI+2);

/* Note: Always use named exports for utilities and default export for the main class/component of a file */



// => Async in OOP
class ApiService{
    #baseUrl;
    constructor(url){this.#baseUrl = url;}
    async fetchUser(id){
        const res = await fetch(`${this.#baseUrl}/users/${id}`)
        if (!res.ok) throw new Error("Not Found");
        return res.json();
    }
    async fetchMany(ids){
        const promises = ids.map(id => this.fetchUser(id));
        return Promise.all(promises);    // parallel
    }
}

const api = new ApiService("https://api.example.com");
try {
    const user = await api.fetchUser(1);
    console.log(user);
} catch(e){
    console.error(e.message);
}

/* Note: Private fields work perfectly with async methods.
Use Promise.all for parralel requests, Promise.allSettleed when you need all results even if some fail. */