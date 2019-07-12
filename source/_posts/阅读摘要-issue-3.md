---
title: '阅读摘要 | issue #3'
date: 2019-07-12 17:33:53
tags:
---

## [Program analysis](https://github.com/github/semantic/blob/master/docs/program-analysis.md#potential-use-cases)

GitHub 开源程序分析库 semantics，这里的一篇文章科普什么是程序分析 Program Analysis，以及它能用来做什么？

程序静态分析，program static analysis，意味着在不运行程序的情况下，我们可以知道：

1. 程序运行时所需要多少内存；
2. 得到所有的 dependencies 并生成相应的 graph；
3. call graph，所有的函数调用关系；
4. control flow graph，字面意思，程序运行时的 control flow，比如 if，for 循环这些；

## [The Designer’s Growth Model](https://medium.com/design-leadership-notebook/the-designers-growth-model-8240dafb7137)

https://css-tricks.com/the-developers-growth-model/

模仿 [Grenier](https://wiki.mbalib.com/wiki/葛雷纳的企业成长模型) groth model，  Dennis Hambeukers 提出他的「设计师成长模型」，分为五个阶段：

1. 第一阶段是 Producers，生产者，仅仅是作为个体，通过不断学习，设计创造好的 artifacts；
2. 第二阶段是 Architects，对于稍微复杂的项目，进入多人协作领域；
3. 第三阶段是 Connectors，不仅仅是多人「协」作，而能够真正做到多人「创」作；
4. 第四阶段是 Scientists，能够应对系统级别的复杂性 complexity，在更高一层级上进行思考，统筹，降低风险，指明方向；
5. 第五阶段是 Visionaries，skill, mind, toolset，所有一切集大成者，对于策略，组织，领导力又有着自己独到的见解，对于更远的未来有着自己清晰的解读，清晰的 roadmap；



<!--more-->



## [CSS Architecture — Folders & Files Structure](https://medium.com/@elad/css-architecture-folders-files-structure-f92b40c78d0b)

Elad Shechter 介绍了他的 CSS 文件结构。

## [How to Increase Your Page Size by 1,500% with webpack and Vue](https://css-tricks.com/how-to-increase-your-page-size-by-1500-with-webpack-and-vue/)

Burke Holland 引入了 Bulma 来重构了它的网站，结果发现编译后 css 从原来 30kb 增加到了接近 300 kb。这里涉及到 Vue 中关于 css style 的 scoped 概念。因为 Bulma 被重复声明了十多次的缘故。解决办法就是 Bulma 首先要能够全局引入，Bulma 的变量要能够在各个 component 被调用。把 Bulma 的所有文件在 `main.js` 里导入即可，以及在 vue.config.js 增加 css.loadOptions.sass.data 的配置，让 components 能够使用预先定义的变量。



## [Blendle](https://launch.blendle.com)

今天在美区 App Store 偶然看到这个。一家荷兰公司，和 New Yorker，The Economists 等报业集团合作，将内容打包统一放在他们这一个平台上，供人们选择阅读。

它的收费模式很有意思。文章按照单篇收费，大概20 - 40 美分不等，不满意可以退款。我下载下来适用了一下，免费的账户会有 0.45$。所有单篇文章价格小于这个数字的都可以打开，但更贵的文章就会提示 no enough credits。在一篇文章停留过长时间，超过 1min？就会判定为阅读，并从你的账户里扣除相应金额。但假如你不满意，可以 refund，被扣除的金额又会立即回来。

## [Matrix.org](https://matrix.org)

一个开源的，e2e 加密，去中心化的 message 项目

> The not-so-talked-about but killer feature of Matrix is that you can bridge other services into it. I'm currently able to send and receive messages from Hangouts, iMessage, SMS, and Slack all from within Matrix. If I'm working on my laptop I can put my phone in my bag and not even touch it for 8 hours, because there's no need. I have Riot running on my laptop with a full keyboard and access to all my communication platforms.
> — [comments from Hacker News](https://news.ycombinator.com/item?id=20157809)

## Discoveries

[Clippy - CSS clip-path maker](https://bennettfeely.com/clippy/)

[Which programming language is fastest? | Computer Language Benchmarks Game](https://benchmarksgame-team.pages.debian.net/benchmarksgame/)

*Toy-program performance measurements for ~24 language implementations.*

[Observable](https://observablehq.com) 

*JavaScript 版本的 Juypter*

[Relearn CSS layout](https://every-layout.dev) 

*CSS layout*

[jsPerf: JavaScript performance playground](https://jsperf.com) 

*比较不同 js 写法的性能*

[Flutter - Beautiful native apps in record time](https://flutter.dev) 

*Google 推出的跨平台 UI 框架*