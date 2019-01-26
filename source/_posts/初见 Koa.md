---
title: '初见 Koa.js'
date: 2019-01-26 19:41:00
tags:
- JavaScript
- Node.js
- Front-end
catogries: 'Coding'
---

去网上检索 Koa，往往会看到诸多 Koa 和 Express 文章。Koa 的确是比 Express 更新的框架，因此也使用到了 ES6 更新的特性，比如 async/await。Koa 的核心 module 仅仅是 middleware kernel，Express 则提供了一套完整的解决方案，功能，routing，template 这些。Koa 要使用这些需要安装额外的 module。这样的对比，容易让人联想到 editor 和 IDE 的区别，前者注重轻量，可定制，后者追求大而全的设计。两种不同的设计哲学，我是偏爱前者，相信 less is more 的力量。当然，毕竟 Koa 和 Express 都是来自于同一个开发团队，很多基础概念是相通的。阅读本文，你需要提前了解以下内容：

- Node.js 的异步特性及异步是如何实现的
- 异步实现的几种方式，callback 到 Promise 到 async/await
- 什么是 middleware？
- ejs template engine

通过本文，你能了解到。Koa 最基础的 HelloWorld，它 如何渲染一个 template 页面，传递数据。什么是「Routing 路由」，路由在 Koa 中如何实现的。

<!--more-->

## Hello world

`app.use()` 就是添加一个 middleware。我们通过 Koa 进行的许多操作，比如处理 request，处理 data，routing 都是通过 `app.use()` 来实现的。

`ctx` 内封装了 request 和 response  object。

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async function(ctx) {
    ctx.body = "hello world ssss";
})

app.listen(3000, function() {
    console.log('listen port: 3000...')
})
```

## 渲染 ejs 模版

这里以 ejs 为例来进行说明，其他的 template engine，使用方法都是相通的。

使用 npm 安装：

```shell
$ npm install koa-views --save
$ npm install ejs --save
```

server.js 内容是

```javascript
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');

app.use(views(__dirname + '/views', {
    map: {
        html: 'ejs'
    }
}));

app.use(async function(ctx) {
    await ctx.render('layout.ejs');
})

app.listen(3000, function() {
    console.log('listen port: 3000...')
})
```

`./views/layout.ejs` 内容是

```html
<!DOCTYPE html>
<head>

</head>
<body>
    <h1>Hello Koa, This is from ejs</h1>
</body>
```

上面这个例子是不包含传值的，当需要向 template 传递值时，通过 `ctx.state` 来设置，将上面 render 部分修改成：

```javascript
app.use(async function(ctx) {
    ctx.state = {
        title: 'This is title',
        body: 'body bla bla'
    };
    await ctx.render('layout.ejs');
})
```

或者写成 `render` 的参数，二者是等价的：

```javascript
app.use(async function(ctx) {
    await ctx.render('layout.ejs', {
        title: 'This is title',
        body: 'body bla bla'
    });
})
```

此时 template 修改成：

```ejs
<!DOCTYPE html>
<head>

</head>
<body>
    <h1><%- title %></h1>
    <p><%- body %></p>
</body>
```

通常我们在写一个 template 的时候，会分成好多组件，首先有一个大体的框架，layout.ejs，新建一个 partials 文件夹，里面存储我们所需的各个组件，如 head.ejs，header.ejs，footer.ejs 等等。我们在一个需要渲染的页面里引用这些组件，那么这个过程在 koa 应该如何实现呢？

这里直接在 ejs 里使用 `include` 进行引用。

header.ejs

```html
<header>
    <p>This is a header</p>
</header>
```

layout.ejs

```ejs
<!DOCTYPE html>
<head>

</head>
<body>
    <%- include ./header %>
    <h1><%- title %></h1>
    <p><%- body %></p>
</body>
```

## Router 路由功能

对于一个 web site，需要处理各种各样不同的请求，针对不同的请求 request，有着不同的反馈 response，以及可能要调用不同的资源 resource。有些需要调用一些 javascript 文件，css 文件，有些需要调用一些图片 images，有些需要访问数据库。这些不同的资源 resource 有着不同的存储路径，为了让 request 得到合适的反馈，就需要一个 router 路由功能，告诉 server，这个 request，需要去哪里找相应的 resource 去反馈。

![koa_routing](/images/koa_routing.png)

```shell
$ npm install koa-router --save
```

server.js 中修改为：

```javascript
const Router = require('koa-router');
const router = new Router()

router.get('/', async function(ctx) {
    await ctx.render('layout.ejs', {
        title: 'This is title',
        body: 'body bla bla'
    });
})

app.use(router.routes());
```

我们看到，各个页面的渲染完全由 router 进行了接管。

上面是最简单的 "Get" 请求，下面是给出一个"Post" 请求的例子，来自 [koa2 进阶学习笔记](https://chenshenhai.github.io/koa2-note/note/request/post.html)，我做了一些小改动，原文使用的是原生 koa 中的 ctx 来判断请求。我这里直接使用了 `koa-router` 实现，通过对比，也可以明白 koa-router 这个 module 是如何工作的，只不过是在原生 Koa 基础上增加了一层判断。

```javascript
// receive the posting data
function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postData = "";
            ctx.req.addListener('data', (data) => {
                postData += data;
            });
            ctx.req.addListener('end', () => {
                let parseData = parseQueryStr(postData);
                resolve(parseData);
            });
        } catch(err) {
            reject(err);
        }
    })
}

// convert the posting data to Object
function parseQueryStr(data) {
    let queryData = {};
    let queryStrList = data.split('&');
    for (let queryStr of queryStrList) {
        let itemList = queryStr.split('=');
        queryData[ itemList[0] ] = decodeURIComponent(itemList[1]);
    }

    return queryData;
}

app.use(views(__dirname + '/views', {
    map: {
        html: 'ejs'
    }
}));

router.get('/', async function(ctx) {
    await ctx.render('layout.ejs', {
        data: 'no data posted'
    });
})

router.post('/', async function(ctx) {
    let postData = await parsePostData(ctx);
    await ctx.render('layout.ejs', {
        data: JSON.stringify(postData)
    })
})

app.use(router.routes());

```

layout.ejs 添加一个可以提交的表格，注意表格的 `method` 是 `POST`，`action` 是根目录页面 `"/"`。 

```ejs
<!DOCTYPE html>
<head>

</head>
<body>
    <%- include ./header %>
    <h1>koa2 request post demo</h1>
      <form method="POST" action="/">
            <p>userName</p>
            <input name="userName" /><br/>
            <p>nickName</p>
            <input name="nickName" /><br/>
            <p>email</p>
            <input name="email" /><br/>
            <button type="submit">submit</button>
      </form>
      <p><%- data %><p>
</body>
```

