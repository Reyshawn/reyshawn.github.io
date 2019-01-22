---
title: 'Hexo Theme 开发不完全记录'
tags:
- JavaScript
- Front-end
categories: 'Coding'
---

决定建立一个静态 Blog，已经是 2016 年的事了。在那之前，也就是在 2016 年 4 月 5 日，自己曾经使用 [Pelican](https://github.com/getpelican/pelican) 进行过短暂的尝试。生活在互联网时代，当你决定将一切电子化，义无反顾地投入比特的世界时，最大的好处便是，这以后发生的每一起事件，都有着清楚的记录。建立 Blog 这件事也不例外。但仅过 1 天，我就删除了 github 上的 repo。当时的自己这样写道：

> 两天的尝试发现：没有足够的知识积累，挑战就是「摸着石头过河」，到处都是困难，耐心被一点一点消磨，直到像一只无头苍蝇乱撞，而无法再耐心地解决问题。所以，博客平台搭建计划暂停。

那时自己才刚开始学 Python，也才刚开始接触 Github。其他方面更是经验甚少，处处碰壁。一年以后， 2017 年 3 月，自己使用 Hexo 建立了这个 Blog，并在 Godaddy 上购买了域名，采用 Hexo 预置主题 Next 。全面，简洁，美观大方。这个主题足够好用。当时的主题并不多，所以经常看到其他使用 Hexo 搭建的 Blog ，往往都是差不多的样式，我当时也只是改了以下 banner，才显得稍有不同。这也让我想试着自己去写一个主题。

目前看到的这个 theme 所有样式，并非我本人设计。它来自于一款付费的 WordPress theme typology。我是一次偶然的机会看到它。考虑到可能的版权问题。自己可能不会把它发布到 [Themes | Hexo](https://hexo.io/themes/index.html) 或开源到 Github 上（无法联系到这个 theme 的作者）。以下我所做的大部分工作，不过是以 Hexo 的形式对 typology 的再现。为了方便。我把这个模仿之作命名为 hagoromo（羽衣）。至于为什么会叫这个名字，Google 会给你答案。

<!--more-->

## template engine 的比较，swig，ejs or pug

Hexo 本身是基于 Nodejs ，它首先通过模版的 render engine，渲染 markdown 和写好的 template 文件，生成相应的 html 。这些生成的 html 文件存储在 `public` 文件夹中。再通过 git 将这个文件夹的内容发布到 github 上。整个 Hexo 大体的工作逻辑是这样的。工作的第一步是选择合适的 template engine。

目前可用的 template engine 有多种选择，在 [Awesome JS](https://js.libhunt.com/categories/13-templating-engines) 上会给出各个 template engine 的比较。我最终选择使用 ejs。因为， ejs 本身学习成本很低。ejs 全称 Embedded JavaScript Template，类似于 jsx，直接就是在 html 里写 js 代码就行了。而 Next 主题是用 swig 写的，不选择 swig 的一个很重要原因是它不再维护了，最后一次 commit 是两年前。pug 也是个备受推崇的选择，它的前身是 jade，jade 的 logo 很漂亮，现在更名为 pug，icon 是一个哈巴狗，个人不是太喜欢。pug 的格式和 html 区别也很大，是类似 python 那种缩进形式，如果选择 pug 是需要一段时间去适应的。

ejs 常用 pattern：

- `<% %>`: 不输出任何内容，用于嵌套 if 或 for 控制语句；
- `<%- %>`: 输出 raw html 文本；
- `<%= %>`:  输出文本，html 中的 tag 如 `<div>` 会 escape 成 `&lt;div&gt;`



## 文件结构

这是我目前整个主题的文件结构。

```shell
.
├── _config.yml
├── languages
├── layout
│   ├── _partials
│   │   ├── footer.ejs
│   │   ├── head.ejs
│   │   ├── header.ejs
│   │   ├── pagination.ejs
│   │   └── sidebar.ejs
│   ├── archive.ejs
│   ├── category.ejs
│   ├── index.ejs
│   ├── layout.ejs
│   ├── page.ejs
│   ├── post.ejs
│   └── tag.ejs
├── scripts
└── source
    ├── css
    │   ├── highlight.css
    │   └── main.css
    ├── images
    │   ├── footer.png
    │   └── logo.png
    └── js
        ├── highlight.min.js
        ├── highlightjs-line-numbers.js
        ├── jquery-3.3.1.min.js
        └── main.js
```

`layout` 里存放的是 `ejs` 模版文件。`source` 里分了三个文件夹，分别存放用到的 css，图片和 js 文件。`languages` 和 `scripts` 这两个文件夹没有用到。

在 ejs 里使用 source 中的文件：

```ejs
<%- js('js/main.js') %>
<%- css('css/main.css') %>
<img class="typology-logo" src="/images/logo.png" alt="hagoromo" style="width: 125px;">
```

因为 source 的里文件会原封不动的 copy 进 `public` 文件夹一份。所以可以直接以上述的形式进行引用。

## 测试环境搭建

最简单办法是直接 copy 了一份我个人 blog 文件夹到 Desktop 上。把主题文件夹移到 themes 文件夹中。使用 `hexo s` 进行本地测试。

我最开始还想着，因为需要 render  ejs 文件，还去看了 nodejs 和 koa 等等内容。后来发现那样做会走不少弯路。最好的测试环境，就是拿真实的环境去模拟，可能会出现的种种状况。

## traps 不完全统计

### archive 页面构建

我最开始构建 archive 页面时，没太弄明白如何使用插件 hexo-genrator-archive 。所以当时选择新建了一个 page，再在 page 里引入 `partial(archive)`。loop 所有 posts 时使用 global variable `site.posts`。这样写，一个最大的问题是，最后 archive 页面展示的 post 顺序，不是按照时间顺序来显示的。我也试了很多办法，设法对 `site.posts` 排序，但都一一告北。直到搞清楚了 hexo-genrator-archive plugin 的逻辑。

实际上，安装了 hexo-generator-archive plugin 后，在 hexo 的配置文件本身就有里：

```yaml
archive_dir: archives
```

这样在执行完 `hexo g` 时候，会自动在 `public` 文件夹下生成一个 `archives` 文件，这个文件夹里的内容是和 template 文件 `archive.ejs` 文件相关联的。也就是，这个插件已经做了所有的「router」路由工作。所以在 template 想要创建一个 archive 点击链接，只需要即可。

```ejs
<a href="/archives">Archive</a>
```

接下来整个 archive 的页面，就是在  `archive.ejs`  中进行的。在 archive 页面里，采用变量 `page.posts`，输出的 posts 刚好是按照时间顺序从近到远排列。

### pagination 分页实现

使用 pagination 分页功能，需要现在 config 里配置：

```yaml
per_page: 10
pagination_dir: page
```

此外，hexo 还很贴心地提供了有关 pagination 分页的相关 API。大体的实现是就变的很简单。

```ejs
<% if (page.total > 1){ %>
<div class="hagoromo-pagination">
    <nav class="navigation pagination" role="navigation">
        <% let prev_text = "&laquo; " + __('prev'); %>
        <% let next_text = __('next') + " &raquo;"; %>
        <%- paginator({
          prev_text: prev_text,
          next_text: next_text
        }) %>
    </nav>
</div>
<% } %>
```

如果自己去实现的话，还是很复杂的，要考虑当前第几页，最后一页和第一页。当前页和第一页，最后一页差值等等。使用 hexo 提供的 `paginator()` 函数，就直接自动生成了整个分页 module。这之后 css 样式，按照生成的 html tag 上给的 class 来写就行了。

### banner 下拉动画

我希望实现的 banner 下拉动画效果是，在窗口下拉大概 600 pixel 时，也就是 scrollY>600 时，banner 从顶部出现并固定，当 scrollY<600 时，banner 隐去。

大体思路是给 `window` bind 一个 scroll 事件，实时 listen 窗口的 scrollY 位置。对于动画的实现，有多种方式，可以用 css，也可以用 js。我这里使用了 jQuery 的 `animate()` 函数，相比 css，控制起来更加灵活方便。

```javascript
$(window).on('scroll', function() {
    let scrollPosition = $(this).scrollTop();
    let $header = $('.hagoromo-header');        
    
    if ($(window).width() > 800) {
        if (scrollPosition < 200) {
            $header.finish();
            $header.css({
                'top': '0',
            });
        }
        if (scrollPosition > 600 && !$header.hasClass('hagoromo-header-sticky')) {
            $header.addClass('hagoromo-header-sticky');
            $header.css({
                'top': '-70px',
            });
            $header.animate({
                top: "0"
            },160)
        }
        if (scrollPosition < 550 && $header.hasClass('hagoromo-header-sticky')) {
            $header.animate({
                top: "-70px"
            },160, function() {
                $header.removeClass('hagoromo-header-sticky');
                $header.finish();
                $header.css('top', '0');
            })
        }
    } else {
        if (scrollPosition > 55) {
            $header.addClass('hagoromo-header-hidden')
        } else {
            $header.removeClass('hagoromo-header-hidden')
        }
    }
});
```

其中出现的问题是，因为只要有 animation，都要涉及时间的问题，涉及时间的问题就可以看作一次 asynchronous 调用，这样相比平时 synchronous 调用，速度的快慢，时间的长短，总会带来额外的问题。我当时遇到的问题时，如果过快的从下到上滑到顶部，会出现循环动画，即 banner 不停的上下抖动。问题的原因也很浅显，就是在上一个动画还没结束时，有触发了新一轮的动画，一不小心进入 infinite loop。最后为了解决它，找到了 `finish()` ，强制结束之前动画。这样一来整体的效果就好多了。

### coding highlight 和 line number 显示

hexo 自带了代码高亮。可能是因为我没有定义相关的 css ，实际渲染后，code block 有行号，但是没有高亮。而且 code block 渲染后的 html 后是 `<figure><table>` 这样形式。参考网上意见后，通常的解决方案是采取 `highlight.js`。使用之前先把 hexo 内置的 highlight 关闭，这样 code block 渲染回到了传统 `<pre><code>` 形式。引入 `highlight.js`  提供的 js，css 文件后，初始化后就能看到高亮的代码。这个要注意：

```javascript
hljs.initHighlightingOnLoad();
```

这个函数是要写在自己 js 文件的 `$(document).ready()` **外面**。因为函数本身已经包含 onload 了。

 `highlight.js` 自身是没有 line number 显示的。这里需要另外一个扩展 [highlightjs-line-numbers.js](https://github.com/wcoder/highlightjs-line-numbers.js/), 使用方法同  `highlight.js` 。初始化的时候同样要写在  `$(document).ready()` **外面**。



### 搜索功能的替代性实现

搜索，平时不经意就会用到功能，凭我个人却写一个 search engine，工作量时很大的。这里有几种方案。

第一种是调用 algolia 接口，hexo 本身提供了 hexo-algolia 插件。这样实现后的形式是，点击搜索后，页面会出现一个类似 macOS 中 spotlight 那样的输入弹窗，输入要搜索的内容，便会实时给出结果。

第二种暂时只是我个人想法。就是借助 Google 的 [Custom Search JSON API](https://developers.google.com/custom-search/v1/overview)。但这个需要新建一个 search page 页面来展示 search 结果。需要 js 通过 ajax 得到返回的 json，实时渲染到 search 页面上。

第三种，也就是我现在使用的比较简单的办法。记得 [V2EX](www.v2ex.com) 也是这么实现的。利用 Google 搜索中的 `site:` 语句。点击 `SEARCH` 后是直接打开 Google，展示 Google 的站内搜索结果。

## 后记

文章主要写了自己开发过程中碰到的几个棘手的难题。另外还有一大部分关于设计的内容没有涉及。包括字体，颜色，layout，z-index，footer，responsive design 等等。虽然大部分的设计使用了 typology 的 css 文件，但弄懂其中的逻辑结构，写出更优雅的 css ，还需要一番努力和功夫。

## 番外

### 配置 favicon

需要将自己准备好 icon 文件，通常是 .ico 格式的文件，存储在 `source` 文件夹下。在 `head.ejs` 中加入一条 `<link>` 来声明 favicon 地址：

```ejs
<% if (theme.favicon){ %>
	<link rel="icon" href="<%- theme.favicon %>">
<% } %>
```

这里使用 if 结构是为了方便在 `config.yaml` 中进行配置。

在 theme 的配置文件 `config.yaml` 中添加，

```yaml
favicon: ./favicon.ico
```

即可。

测试的话，local 本地测试我是没有成功。但 deploy 之后，把网页加入收藏，等待片刻就能看到  icon。