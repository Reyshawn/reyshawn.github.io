---
title: iPadOS 使用体验
date: 2019-06-05 11:25:19
tags:
---

今早安装了 iPadOS Development Beta 版本，体验了一会儿。因为不太敢拿 mac 升级 Catalina，据说文件系统改掉了。目前 mac 不太敢升，所以 Sidecar 功能暂时还没办法体验。iPhone 变化其实没那么大，也就只有 iPad 可以尝试了。提前做好备份，在苹果的开发者官网 [Installing Apple Beta Software](https://developer.apple.com/support/beta-software/install-beta/) 下载安装 Xcode beta，安装完毕要打开运行，这样做的目的是帮助 iTunes 能够识别 iOS13。下载你所使用设备的 ipsw 文件。我是在[这里](https://www.udid.in/install-beta)下载的。然后在 iTunes 里更新就行了，注意要提前做好备份。

具体的安装教程也可以参考这个 [YouTube 视频](https://www.youtube.com/watch?v=iPZ6eNc8BvU&frags=pl%2Cwn)。

下面按照给我带来惊喜的顺序，来简单谈一下这次的 iPadOS / iOS13。

<!--more-->

## Safari

### Always Request Desktop Page

永远访问桌面网页，这对于使用 iPad 而言是巨大的进步。在电脑端，无论是 Safari 或是 Chrome，都已经成为了无比强大的通用客户端，general client，在浏览器里几乎可以做任何事情。而在 iPhone 上，苹果对于第三方浏览器有很多限制，因此，原生 Safari 的增强就显得无比重要。这让 iPad 变得更像是 laptop 了。不仅如此：

- 在 bilibili.com 可以调整更高清的分辨率；
- 可以在 repl.it 上在线 coding 了；

![repl](/images/repl.png)

bilibili 的 iPad app 极为难用。而在以前在 iPad 上使用 Safari 浏览 bilibili，总会自动跳到移动端页面，而且可恶的是移动端仅支持 240P 的分辨率。哪怕你在 share sheet 里去 request desktop page 也不行。而在新的 iOS13 里，使用 Safari 进行浏览就和电脑端一模一样，体验非常友好。

理论上，现在的 iPadOS 可以开无数个 Safari 窗口，但由于内存限制，只能同时运行 2-3 个 Safari，多余的就会被后台 kill 掉。目前，只有 1T 容量的 iPad Pro 搭配有 6G RAM 内存，其余 iPad Pro 是只有 4G RAM。

可以预见的是，未来 iPad 产品也将逐渐加入更大的内存，以此实现后台的多任务运行。

### 下载

Safari 终于有了原生的下载功能。可以在 Settings 设置里选择下载保存的文件夹，可以保存在本地 On My iPad，或者是 iCloud 里。这对于日常使用，通过 http 或 ftp 下载一些文件资源已经足够了。但如果想要使用「磁力链」或 bitTorrent，在目前或可以想象的未来的 iOS 系统中，都不太可能。

## 手势交互

手势交互一直是 iPad 有别于 Mac 和 iPhone 的一个最重要特征。

### 截图 / 长截图

两种截图方式：

1. power button + volume button；
2. 使用 Apple Pencil 在屏幕左下角或右下角向上拉；

第一种是一直以来很传统的截图方式。第二种很有趣，很自然，截图之后直接进入编辑页面。

### 文字选取高亮 / 光标移动

在以前，要想选中某段文字，需要在想要选中的位置上 touch 两下才会出现光标。在新的 iOS 13 中，苹果把这个操作进一步简化，更加接近在桌面端的交互逻辑。而以前的双击，是选中一个词，三击是选中整个句子。

### copy / paste

我们在电脑端编辑文字，使用的很多的快捷键便是 cmd+c/cmd+v。现在在 iPad，复制是三指 pinch （捏合），粘贴是三指 spread。类似的手势在 mac 上很常用。需要指出的是，这里手势操作的复制粘贴并不仅仅限于文字，它可以用于所有可以进行复制粘贴的地方，比如文件。

通常如果使用键盘，cmd+c/cmd+v 是更好的方式。但如果在 files 里整理文件，首先多选，再利用手势进行操作，就非常方便了。

## 外接存储

是的，等了很多年了，iPad 终于可以外接闪存了。这里为什么强调是闪存，因为我在发布会上只听到了说 flash drive。而在我自己的实验里，exFAT 格式的 flash drive 可以准确读取，嗯，这点和 mac 是一致的。因为一定会有文件格式的壁垒在。但我使用我的 APFS 格式的外接机械硬盘，读取失败，甚至出现了一个 bug。这里要说明一下，我的这个机械硬盘被分成了两个区，一个用作 time machine，另一个是正常存储。但连接 iPad 后，似乎识别成了 image 什么的，而且出现的外接存储图标再也消除不掉了。

不清楚各位有没有连接 APFS 格式机械硬盘成功的。

![ipad files bug](/images/ipad files bug.png)

## UI 变化

苹果在每一代系统里，对 UI 设计都有一些细微的变化。最明显的是顶部选项卡

![iOS13 tab 1](/images/iOS13 tab 1.png)

![iOS13 tab 2](/images/iOS13 tab 2.png)

![iOS13 tab 3](/images/iOS13 tab 3.png)

## 关于 iPad 的未来

1. Files 和 Safari 都会持续进化。Files 会加入更丰富的文件编辑功能，能够原生支持更多格式的文件直接在 Files 读取。
2. 会有 iPad Terminal，并且会有一整套的 iPad 上的有关编程的 API 及 editor。
3. 内存会更多，将来可以后台多任务运行的数量会增多。

最后，从 WWDC19 结束后，就很多人在讨论 iPad 上的鼠标。我也看了别人在 iPad 上使用鼠标的演示视频。我能想到比较好的使用方式是进行 FPS 枪战游戏。但目前来看，iPad 上的鼠标还仅仅是模拟手指操作，而不是类似 Apple Pencil 那种更精细的指针，而且不支持滚轮滚动，所以整个下来体验并不好。我个人是很多年都不在用鼠标了，电脑上一直用触控板，体验很好。我也一直认为，iPad 上最好的精确输入方式是 Apple Pencil。而鼠标的作用，想一想，定位可能是和现在已经支持的 playstation controller 或 Xbox controller 那样吧。