const { Worker, isMainThread, workerData } = require('worker_threads');

console.log(workerData)
console.log("hi!")
