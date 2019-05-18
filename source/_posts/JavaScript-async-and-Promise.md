---
title: 'JavaScript async and Promise'
date: 
tags: 
- JavaScript
categories: 
---

非常推荐先看一下参考链接里两个 youtube 视频，分别介绍了 event loop 和 setTimeout 的实现原理，这对于理解 JavaScript 里异步操作实现非常有帮助。其次是关于 Promise object 的手动实现，有一些抽象，因为包含了大量的  callback 函数。这里一定要分清楚，哪些是函数的声明，哪些是函数的调用。

## Event loop

JavaScript 是一种 single thread 的语言。既然单一线程，那么在某个时间点，只能完成一项任务。于是

```javascript
$.get('http://twitter.com')
$.get('http://youtube.com')
$.get('http://google.com')
```

在单线程下，如果某一行执行所需要的时间太久了，那么余下的的 command 也无法执行，程序就在那一行停滞下来了。我们把这个叫做 blocking。然而事实上，当我们在使用 `setTimeout()` 函数时，程序似乎不会出现 blocking。

```Javascript
console.log('hi')
setTimeout(() => console.log('there'), 0)
console.log('Welcome!')

// output:
// hi
// Welcome
// there
```

这里哪怕是设置 delay 为 0s， `setTimeout()` 里的函数也是在最后才执行，是怎么回事呢？

在 JavaScript 的执行环境中，所有的需要运行的函数是单线程的，按照次序会出现在 call stack 里。而通常，JavaScript 要么在 Browser 里运行，要么在 Node 环境运行，在 Browser 里运行时，会有一整套来自 Browser 提供的 web API，同理在 node 环境里也有相应的 API。 `setTimeout()` 函数就来自这些提供的 API 中。当我们 declare and call  一个  `setTimeout()` 函数时，Browser 会生成一个 timer 计时器，计时器的时间达到时，  `setTimeout()`  里定义的 callback 函数会进入到一个叫 `task queue` 的容器中，此时程序会去检测 call stack 是否为空，当 call stack 为空时，会将 task queue 中最上层的函数移入 call stack 中进行执行。因此本质上来讲，由于有 web API 的加持，最终类似  `setTimeout()` 函数还是使用了多线程。只不过对于 JavaScript 来讲，一直是执行的是 call stack 里的内容，可以认为一直是单线程操作。

<!--more-->

![Event Loop](/images/eventLoop.png)

## Promise 的实现

Promise 和   `setTimeout()` 的区别是，`setTimeout()` 是 delay 一个确定的时间，比如 3000ms，5000ms，然后执行 callback 函数。Promise 本身执行 callback 的时间是不确定的，只有 resolve 之后才算执行完毕，因为 resolve 后会改变 state，比如从 pending 改变成 fulfilled，通过 `.then()` 的方法执行下一个任务。

>Timeouts and Promises serve different purposes.
>
>setTimeout delays the execution of the code block by a specific time duration. Promises are an interface to allow async execution of code.
>
>A promise allows code to continue executing while you wait for another action to complete. Usually this is a network call. So anything in your `then()` call will be executed once the network call (or whatever the promise is waiting for) is completed. The time difference between the start of the promise and the resolution of the promise entirely depends on what the promise is executing, and can change with every execution.
>
>The reason the promise is executing before your timeout is that the promise isn't actually waiting for anything so it resolved right away.

以下是来自 [Implementing](https://www.promisejs.org/implementing/)，对于 Promise object 的实现：

最好的方式是将下面的代码粘贴进 editor 里，调试几遍。不太明白的地方打上断点，或是 `console.log()`。

```javascript
let PENDING = 0;
let FULFILLED = 1;
let REJECTED = 2;

function Promise(fn) {
  // store state which can be PENDING, FULFILLED or REJECTED
  let state = PENDING;

  // store value or error once FULFILLED or REJECTED
  let value = null;

  // store sucess & failure handlers attached by calling .then or .done
  let handlers = [];

  function fulfill(result) {
    state = FULFILLED;
    value = result;
    handlers.forEach(handle);
    handlers = null;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
    handlers.forEach(handle);
    handlers = null;
  }

  function resolve(result) {
    try {
      let then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject);
        return ;
      }
      fulfill(result)
    } catch (e) {
      reject(e);
    }
  }

  function handle(handler) {
    if (state === PENDING) {
      handlers.push(handler);
    } else {
      if (state === FULFILLED &&
        typeof handler.onFulfilled === 'function') {
        handler.onFulfilled(value);
      }
      if (state === REJECTED &&
        typeof handler.onRejected === 'function') {
        handler.onRejected(value);
      }
    }
  }

  this.done = function (onFulfilled, onRejected) {
    // ensure we are always asynchronous
    setTimeout(function () {
      console.log('instantly implemented ⚠️')
      handle({
        onFulfilled: onFulfilled,
        onRejected: onRejected
      });
    }, 0);
  }
  
  doResolve(fn, resolve, reject)

  this.then = function (onFulfilled, onRejected) {
    var self = this;
    return new Promise(function (resolve, reject) {
      return self.done(function (result) {
        if (typeof onFulfilled === 'function') {
          try {
            return resolve(onFulfilled(result));
          } catch (ex) {
            return reject(ex);
          }
        } else {
          return resolve(result);
        }
      }, function (error) {
        if (typeof onRejected === 'function') {
          try {
            return resolve(onRejected(error));
          } catch (ex) {
            return reject(ex);
          }
        } else {
          return reject(error);
        }
      });
    });
  }
}

function getThen(value) {
  var t = typeof value;
  if (value && (t === 'object' || t === 'function')) {
    var then = value.then;
    if (typeof then === 'function') {
      return then;
    }
  }
  return null;
}

function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}


var promise1 = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve('foo');
  }, 3000);
});

promise1.then(function(value) {
  console.log(value)
  // expected output: "foo"
});

console.log(promise1);
```

![Promise](/images/Promise.png)

一些帮助理解这段代码的小 tips：

1. `doResolve()` ，第一，会直接执行 `fn` 函数，也就是声明 Promise 时传递的 callback 函数。第二， 保证 `resolve` 或是 `reject` function 仅执行一次。
2. 每次声明 Promise object，都会先执行一次 `doResolve()` 函数；
3. `.then()` 返回一个新的 Promise object，这个 Promise 会执行 `doResolve()`  函数，从而会直接执行这个新 Promise 的 callback 函数；line 73 - line 93，执行 callback 函数返回的是 `self.done()` 函数的执行结果；
4. `.done()` 方法会 check state 的值，确定是否将 `resolve` 添加进 `handlers` 中；
5. `resolve` 函数执行完毕后，将 `state` 从 `PENDING` 改为了 `FULFILLED`，同时 `handlers.forEach(handle)` 依次执行 `.then` 方法中添加进去的函数。
6. `resolve` 和 `reject` 都会将值赋给 `value` 变量；
7. `setTimeout(cb, 0)` 使用了上述提到的 event loop，此时 `cb` 会在几乎 0ms 的间隔时间后，进入 task queue。





参考链接：

- [What the heck is the event loop anyway? | Philip Roberts | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ&list=LLhaQJ_wSNai6JEl8bBjymqA&index=3&t=0s)
- [Async JS Crash Course - Callbacks, Promises, Async Await](https://www.youtube.com/watch?v=PoRJizFvM7s&list=LLhaQJ_wSNai6JEl8bBjymqA&index=2&t=0s)

- [Implementing](https://www.promisejs.org/implementing/)

- [Basic Javascript promise implementation attempt](https://stackoverflow.com/questions/23772801/basic-javascript-promise-implementation-attempt)

    