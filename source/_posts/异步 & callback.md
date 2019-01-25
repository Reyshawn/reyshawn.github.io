---
title: '异步 & callback'
date: 
tags:
- Node.js
- JavaScript
categories: 
- Coding
---



最近开始学习 Node.js。主要看两本书：*Node.js in Practice* 和 *Node.js Design Patterns*。前者类似于 o'reilly 的 cookbook 系列，整本书的编排是通过一个个 recipe，一个个具体的 problem&solution 实现的。后者就是 [Packt Publishing](https://search.packtpub.com/) 出品的一系列 Design Patterns 书籍。包括这两本书在内的许多讲解 Node.js 的书籍，都会不断强调两个关键词， asynchronous 和 non-blocking I/O。在最初开始学习编程的时候，无论是写一些算法题目，或是做一些本地测试，它都是同步的，即时响应的，单线程的，blocking I/O。但如果进入的网络领域，「异步」则会被不断提起。相比 synchronous，「异步」更加接近我们相处的真实世界。

这篇文章以 *Node.js Design Patterns* 第二章的 Web Spider 例子，探究思考在 Node.js 中是如何通过 callback 来实现异步操作的。

<!--more-->

## callback，递归，libuv

>Callbacks are to be used when we don’t know **when** something will be done. Again, think of something like an API call, fetching data from a database or I/O with the hard drive.
>
>--[Callbacks in Node.js: Why, When, How?](https://medium.com/javascript-in-plain-english/callbacks-in-node-js-how-why-when-ac293f0403ca)

在解决一些算法题目时，经常会用到「递归」。「递归」是函数不断调用自身的过程。callback 和「递归」有些相似，区别是，「递归」是重复的调用自身，而 callback 是去调用另一个不同的函数。本质来讲，都会形成一个  [Call stack](http://www.wikiwand.com/en/Call_stack)。那么为什么可以通过 callback 来实现异步？

```javascript
// This is synchronous.
function processData() {   
    let data = fetchData();   
    data += 1;   
    return data; 
}
// This is asynchronous... 
function processData(callback) {   
    fetchData(function (err, data) {     
        if (err) {
           return callback(err);
        }     
        data += 1;     
        callback(null, data);   
    }); 
}
```

在  synchronous 中，line 3 获得数据，存储在 data 中，line 4 对数据进行处理。这是一个线性的，单线程的，需要等待的 synchronous 操作。在 async 中，函数 `fetchData()` 多了一个 callback 参数，后续的数据处理，`data += 1 ` 写在了这个 callback 里。也就意味着，当调用 `fetchData()` 后，整个程序不会停下来等待，而是接着进行下面的操作。当 `fetchData()` 中获得了数据，更抽象点，是达成了某个条件，则调用 callback 函数。

> Callbacks are functions. You pass them to other functions so they can be executed when the time is right, i.e. when the event needed by the callback has happened.
>
> --[Callbacks in Node.js: Why, When, How?](https://medium.com/javascript-in-plain-english/callbacks-in-node-js-how-why-when-ac293f0403ca)

看似在 async 中出现了第二条线程，实际上，在 Node.js 中依旧是单线程。通过单线程，来模拟多线程下的 concurrency，借助底层库 `libuv` 来实现。`libuv` 让 Node.js 有了 non-blocking I/O 特性。

> For example, in Unix, regular filesystem files do not support non-blocking operations, so, in order to simulate a non-blocking behavior, it is necessary to use a separate thread outside the Event Loop. All these inconsistencies across and within the different operating systems required a higher-level abstraction to be built for the Event Demultiplexer. This is exactly why the Node.js core team created a C library called libuv, with the objective to make Node.js compatible with all the major platforms and normalize the non-blocking behavior of the different types of resource; libuv today represents the low-level I/O engine of Node.js.
>
> -- p17 *Node.js Design Patterns*

> This may sound strange if we consider that Node.js is single threaded, but if we remember what we discussed in Chapter 1, Node.js Design Fundamentals, we realize that even though we have just one thread, we can still achieve concurrency, thanks to the nonblocking nature of Node.js.
>
> --p71 *Node.js Design Patterns*

> 每个我们常见的操作系统都为我们封装了类似的高并发异步模型，那libuv其实就是对各个操作系统进行封装，最后暴露出统一的api供开发者调用，开发者不需要关系底层是什么操作系统，什么API了。 
>
> --[libuv — 知乎专栏](https://zhuanlan.zhihu.com/p/50480439)

这里单线程模拟多线程的原理，和计算机中实现的 concurrency 差不多。因为在计算机中，如果从单个时钟来看，计算机只能完成一条命令。而借助诸如 time shared 分时系统等等，在一段时间内可以认为计算机同时「并发」地在进行多个任务。因此，在 Node.js 由于有了 `libuv`，会让有着 callback 的函数会进行「异步」操作。

>So why show you this? Because you can’t just call one function after another and hope they execute in the right order. Callbacks are a way to make sure certain code doesn’t execute until other code has already finished execution.
>
>--[JavaScript: What the heck is a Callback?](https://codeburst.io/javascript-what-the-heck-is-a-callback-aba4da2deced)

关于 callback 的使用，是有一些 conventions 的。比如 callback 的第一个参数是 error。callback 本身作为函数参数，通常放在最后一个。

>Nearly everything in node.js is asynchronous. So, nearly every method that is called, you must specify a callback method to handle the result of the method call. Normally, the callback function takes two parameters: error, result. So it is up to you to check for the error and then handle the result. 
>
>-- [understanding node.js callback structure](https://stackoverflow.com/questions/13789095/understanding-node-js-callback-structure)

## Web Spider 的 callback 实现

在 *Node.js Design Patterns* 这本书的第二章节，作者通过 web spider 这个例子，介绍了 async 在 node 里的各种实现方案。有最原生的 callback hell，改良后的 callback，也有 async，Promise，generator 等等更加简单的写法。无论使用哪种方式，会用到 `fs.stat(path, callback)` 和 `request(url, callback)`[^1]。前者是 Node.js 自身的关于文件操作的一系列 api，后者是一个第三方 module。因为这两个函数都用到了 callback，所以在 debug 模式下，就去更深一层看看是如何运作的。Web Spider 的函数源码已附在了参考链接里。

```javascript
function download(url, filename, callback) {
  console.log(`Downloading ${url}`);
  request(url, (err, response, body) => {
    if(err) {
      return callback(err);
    }
    saveFile(filename, body, err => {
      if(err) {
        return callback(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      callback(null, body);
    });
  });
}

function spider(url, callback) {
  const filename = utilities.urlToFilename(url);
  fs.stat(filename, err => {
    if(!err) {
      return callback(null, filename, false);
    }
    download(url, filename, err => {
      if(err) {
        return callback(err);
      }
      callback(null, filename, true);
    })
  });
}
```



### fs.stat()

首先进入 `fs.stat()` 函数：

```javascript
function stat(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  callback = makeStatsCallback(callback);
  path = toPathIfFileURL(path);
  validatePath(path);
  const req = new FSReqCallback(options.bigint);
  req.oncomplete = callback;
  binding.stat(pathModule.toNamespacedPath(path), options.bigint, req);
}
```

line 2 到 line 5 是参数判断和转换。line 6 `makeStatsCallback(callback)`，调用：

```Javascript
// Special case of `makeCallback()` that is specific to async `*stat()` calls as
// an optimization, since the data passed back to the callback needs to be
// transformed anyway.
function makeStatsCallback(cb) {
  if (typeof cb !== 'function') {
    throw new ERR_INVALID_CALLBACK();
  }

  return (err, stats) => {
    if (err) return cb(err);
    cb(err, getStatsFromBinding(stats));
  };
}
```

按照注释说明，是 `makeCallback()` 的特殊情况，那我们就去看看 `makeCallback()` 是什么。

```javascript
// Ensure that callbacks run in the global context. Only use this function
// for callbacks that are passed to the binding layer, callbacks that are
// invoked from JS already run in the proper scope.
function makeCallback(cb) {
  if (typeof cb !== 'function') {
    throw new ERR_INVALID_CALLBACK();
  }

  return (...args) => {
    return Reflect.apply(cb, undefined, args);
  };
}
```

这段 code  的关键是 `Reflect.apply(cb, undefined, args);`。按照 MDN 的叙述，`Reflect` 是：

>**Reflect** is a built-in object that provides methods for interceptable JavaScript operations. The methods are the same as those of [proxy handlers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler). `Reflect` is not a function object, so it's not constructible.
>
>Unlike most global objects, `Reflect` is not a constructor. You cannot use it with a [`new`operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) or invoke the `Reflect` object as a function. All properties and methods of `Reflect`are static (just like the [`Math`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math) object).

Reflect 是一个 global object。那么当调用 `Reflect.apply()`，就是在 global context 下进行的。为什么需要 global context 呢？首先想什么时候会去调用 callback，往往是 error handling，出错的时候，或者是进行最后一步工作的时候。两种情况，无论是哪一种，程序都要从不管多深的 call stack 出来，回到地面，回到 global context，去 handle error，或是进行所有前提工作结束后的下一步工作。

`makeStatsCallback(callback)`之后关键的三步是：

```javascript
const req = new FSReqCallback(options.bigint);
req.oncomplete = callback;
binding.stat(pathModule.toNamespacedPath(path), 
```

`FSReqCallback` 和 `binding` 都是对更底层的 C library 调用。

```javascript
const binding = process.binding('fs');
const { FSReqCallback, statValues } = binding;
```

从这里开始，就逐渐进入 `libuv` ，C library 的领域了。在这些 C library 中做了什么事情，以我目前的知识结构就很难理解了。只是大体上，应该是设置异步操作，规定在函数结束后去执行 callback 等等，就如这句 `req.oncomplete = callback;` 字面含义所写的那样。



### request

request 是一个简单的 Http client。这是它们的 [Git repo](https://github.com/request/request)。web spider 的目标就是要下载目标 url 的内容。在上一小节，我们通过 `fs.stat()` 来检测文件是否存在。当检测到文件不存在的时候，则对目标 url 进行下载。下载这个动作，展开来讲，首要工作就是创建一个 http clinet，来向 server 发送请求，然后接收来自 server 返回的数据。即 `body` 内容。这些操作，都是通过 `request` 这个 module 来实现的。创建的 http client 就可类比浏览器，当它发送 request 请求时，需要按照 TCP/IP 协议，加入 head，设置 tunnel，redirect 等等内容。这些是通过 `request.Request(params)` 来实现的。

```javascript
function request (uri, options, callback) {
  if (typeof uri === 'undefined') {
    throw new Error('undefined is not a valid uri or options object.')
  }

  var params = initParams(uri, options, callback)

  if (params.method === 'HEAD' && paramsHaveRequestBody(params)) {
    throw new Error('HTTP HEAD requests MUST NOT include a request body.')
  }

  return new request.Request(params)
}
```

line 6 对参数进行初始化：

```javascript
// organize params for patch, post, put, head, del
function initParams (uri, options, callback) {
  if (typeof options === 'function') {
    callback = options
  }

  var params = {}
  if (typeof options === 'object') {
    extend(params, options, {uri: uri})
  } else if (typeof uri === 'string') {
    extend(params, {uri: uri})
  } else {
    extend(params, uri)
  }

  params.callback = callback || params.callback
  return params
}
```

`request()` 函数返回的  `request.Request(params)`  如下：

```javascript
function Request (options) {
  // if given the method property in options, set property explicitMethod to true

  // extend the Request instance with any non-reserved properties
  // remove any reserved functions from the options object
  // set Request instance to be readable and writable
  // call init

  var self = this

  // start with HAR, then override with additional options
  if (options.har) {
    self._har = new Har(self)
    options = self._har.options(options)
  }

  stream.Stream.call(self)
  var reserved = Object.keys(Request.prototype)
  var nonReserved = filterForNonReserved(reserved, options)

  extend(self, nonReserved)
  options = filterOutReservedFunctions(reserved, options)

  self.readable = true
  self.writable = true
  if (options.method) {
    self.explicitMethod = true
  }
  self._qs = new Querystring(self)
  self._auth = new Auth(self)
  self._oauth = new OAuth(self)
  self._multipart = new Multipart(self)
  self._redirect = new Redirect(self)
  self._tunnel = new Tunnel(self)
  self.init(options)
}
```

注意一下 line 17，`stream.Stream.call(self)`，在进入这个函数内部后，来到：

```javascript
// legacy.js
const EE = require('events');
const util = require('util');

function Stream() {
  EE.call(this);
}
```

因为 EE 是来自 events 导出的 EventEmitter，`EE.call(this)` 实际上是对 EventEmitter 的初始化。到这里会发现，request 处理 callback 所使用的方式，是和 EventEmitter 相关的。具体的继承关系是：

`EventEmitter` <- `stream.Stream` <- `Request`

## 后记

这篇文章最初是想弄清楚 `fs` 和 `request` 是怎么处理 callback 函数，是如何去调用的，一路 debug 下去，终归绕不开 `libuv` ，计算机底层关于 thread 的内容以及网络方面的 TCP/IP 协议。这两方面都是我的知识弱项，因此也就在合适的地方浅尝辄止了。当然，写这篇文章也让我对于 callback 有了更深的理解之外，同时，我想必要抽时间再去好好读读 CSAPP 和 TCP/IP 那两本书了。



[^1]: 原文判断文件存在用的是 `fs.exists()`，但这个函数，在我查阅 Node.js Documentation 时发现已经 deprecated，所以稍微修改了一下。

 

---



参考：

- [Callbacks in Node.js: Why, When, How?](https://medium.com/javascript-in-plain-english/callbacks-in-node-js-how-why-when-ac293f0403ca)
- [Nodejs: What does `process.binding` mean?](https://stackoverflow.com/questions/24042861/nodejs-what-does-process-binding-mean)
- [深入出不来nodejs源码-从fs.stat看node架构](https://zhuanlan.zhihu.com/p/40977678)
- [Node.js_Design Patterns Second Edition Code](https://github.com/PacktPublishing/Node.js_Design_Patterns_Second_Edition_Code)