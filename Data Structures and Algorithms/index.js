function fibonacci(n) {
  if (n <= 0) {
    return "No Sequence";
  }
  if (n == 1) {
    return 0;
  }
  let fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
}

function factorial(n) {
  if (n < 0) {
    return "Input cannot be a negative number.";
  }
  if (n == 0 || n == 1) {
    return 1;
  }
  let result = n;
  for (let i = n - 1; i >= 1; i--) {
    result *= i;
  }
  return result;
}

function isPrime(n) {
  if (n < 2) {
    return false;
  }
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

function isPowerOf2(n) {
  if (n < 1) {
    return false;
  }
  // for (let i = 0; 2 ** i <= n; i++) {
  //   if (2 ** i === n) {
  //     return true;
  //   }
  // }
  // return false;
  while (n > 1) {
    if (n % 2 !== 0) {
      return false;
    }
    n /= 2;
  }
  return true;
  //return (n & (n-1))===0
}

function fibRec(n) {
  if (n < 1) {
    return "No sequence";
  }
  if (n === 1) {
    return 0;
  }
  if (n === 2) {
    return 1;
  }
  return fibRec(n - 1) + fibRec(n - 2);
}

function facRec(n) {
  if (n < 0) {
    return "Invalid Input";
  }
  if (n === 0) {
    return 1;
  }
  return n * facRec(n - 1);
}

function linearSearch(arr, n) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === n) {
      return i;
    }
  }
  return -1;
}

function binarySearch(arr, n) {
  let i = 0;
  let j = arr.length - 1;
  while (i <= j) {
    let mid = Math.floor((i + j) / 2);
    if (arr[mid] === n) {
      return mid;
    }
    if (n > arr[mid]) {
      i = mid + 1;
    } else {
      j = mid - 1;
    }
  }
  return -1;
}

function binSeaRec(arr, n) {
  return search(arr, n, 0, arr.length - 1);
}

function search(arr, n, i, j) {
  if (i > j) {
    return -1;
  }
  let mid = Math.floor((i + j) / 2);
  if (n === arr[mid]) {
    return mid;
  }
  if (n < arr[mid]) {
    search(arr, n, i, mid - 1);
  }
  if (n > arr[mid]) {
    search(arr, n, mid + 1, j);
  }
}

function arraySwap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function bubbleSort(arr) {
  let swapped = false;
  do {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        arraySwap(arr, i, i + 1);
        swapped = true;
      }
    }
  } while (swapped === true);
  return arr;
}

function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        arraySwap(arr, i, j);
      }
    }
  }
  return arr;
}

function insertionSort(arr){
  for(let i=1;i<arr.length;i++){
    let numToInsert=arr[i];
    for(var j=i-1;j>=0;j--){
      if(arr[j]>numToInsert){
        arr[j+1]=arr[j];
        arr[j]=numToInsert;
      }
    }
  }
  return arr;
}

console.log(insertionSort([12, 2, 41, 6]), insertionSort([5, 62, 7]));



let x = 10;
 function updateScore(val){
  val = 20;
 }

 updateScore(x)
 console.log(x)

 let student = {}