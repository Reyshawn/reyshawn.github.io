---
title: 多个项目共享 Webpack
date: 2019-08-29 21:00:03
tags:
- JavaScript
- Front-end
---

最近在看 [@keyframer]() 的一系列视频，需要用到 webpack 来配置 scss 环境，这就导致了每一个项目都要重复下载一遍 webpack 和相关的所有 node modules，这样很浪费空间。

因此要想办法把 webpack 独立出来，让每一个项目都可以访问到 webpack，一个方法是全局安装 webpack。这里提供另一种方法，想到我们通常使用 webpack 的情景是，在  `package.json` 里预先定义好 

```json
"scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack"
}
```

然后 `npm run dev`。我们需要把这里修改一下，让每个项目都统一调用同一个 webpack。

<!--more-->

项目的结构是这样的：

```shell
.
├── Project1
│   ├── dist
│   ├── package.json
│   ├── src
│   └── webpack.config.js
├── Project2
│   ├── dist
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   └── webpack.config.js
├── Project3
│   ├── dist
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   └── webpack.config.js
├── node_modules // all webpack related node modules
├── package-lock.json
└── package.json
```

需要一个parent directory，在 parent directory 里首先 `npn init -y`，并安装好 webpack 和所有相关 node modules。为每一个子项目单独创建一个文件夹，把每个项目下 `package.json` 中的  `script` 修改成：

```json
"scripts": {
    "dev": "../node_modules/.bin/webpack-dev-server",
    "build": "../node_modules/.bin/webpack"
 }
```

这样一来，仅仅安装了一遍 webpack，每个子项目都可以 access 到 parent directory 里的 webpack。而且每个子项目都可以独立配置 webpack，配置文件为 `webpack.config.js`。

