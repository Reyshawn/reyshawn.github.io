---
title: 'issues'
date: 
tags:
- Shell
categories:
---


[TOC]

# General

## Apache & php

**Apache 开启**

macOS 系统内置了 Apache。目前，我的 Mojave 系统版本是：

```shell
$ Server version: Apache/2.4.34 (Unix)
$ Server built:   Aug 17 2018 18:35:43
```

如果需要对 Apache web server 本地进行开启，关闭，和重新开启的命令是：

```shell
$ sudo apachectl start
$ sudo apachectl stop
$ sudo apachectl restart
```

在 apache 打开后，在浏览器里输入 `localhost`，就会出现 「it works」字样，证明 apache 已经成功打开。apache serve 的本地文件存储在 `/Library/WebServer/Documents`。

**php 开启**

打开 apache 后，还不能正常渲染 php 文件。需要在 apache 的配置文件把 php 打开。使用 vim 或 vscode 以 root 权限打开 `/etc/apache2/httpd.conf` ，找到

```properties
#LoadModule php7_module libexec/apache2/libphp7.so
```

注释符去掉。然后再在文件末尾加上

```properties
AddType x-httpd-php .php
AddHandler application/x-httpd-php .php
```

这样就能够正确识别 php 文件并渲染了。

**借助 Brew 来搭建 Apache/PHP 环境**

使用 macOS 自带的 Apache，总是有很多问题。比如无法更改 Server 目录，目录访问权限问题等等。在这样的问题下。我转向了 brew，使用 brew 去配置 apache 的环境。

参考：

- [PHP not working after MacOS update to High Sierra](https://stackoverflow.com/questions/46436598/php-not-working-after-macos-update-to-high-sierra)
- [php mysqli_connect: authentication method unknown to the client (caching_sha2_password)](https://stackoverflow.com/questions/50026939/php-mysqli-connect-authentication-method-unknown-to-the-client-caching-sha2-pa)
- [macOS 10.14 Mojave Apache Setup: Multiple PHP Versions](https://getgrav.org/blog/macos-mojave-apache-multiple-php-versions)



## MySQL

通过 brew 安装 mysql。

```shell
$ brew install mysql
```

安装之后，需要首先开启 mysql，打开，关闭，查看状态的命令分别是：

```shell
$ mysql.server start
$ mysql.server stop
$ mysql.server status
```

新安装的 mysql，可以先使用 root 用户进入，无密码：

```shell
$ mysql -u root
```

如果想要在 python 里使用 mysql。使用 pip3 安装：

```shell
$ pip3 install mysql-connector-python
```

这里有一个陷阱。一定是安装 `mysql-connector-python` 这个 library。还有一个名字相近的叫 `mysql-connector` ，不要安装，因为后者这个问题很多，也不怎么维护了。

参考：

- [Create new user in MySQL and give it full access to one database](https://stackoverflow.com/questions/1720244/create-new-user-in-mysql-and-give-it-full-access-to-one-database)



## Mojave 下字体过细

*2018.9.26*

新更新了 Mojave，据说是因为 Mojave 禁用了亚像素抗锯齿 (anti-aliasing)，似的在一些应用诸如 chrome, VScode 中字体很细。很不好看。可以通过一下命令来开启「anti-aliasing」:

```shell
$ defaults write -g CGFontRenderingFontSmoothingDisabled -bool NO
```

想要回到之前的状态，把 `bool` 值设置为 YES 就行了。

```shell
defaults write -g CGFontRenderingFontSmoothingDisabled -bool YES
```


## matplotlib 中文显示

重新定义字体。这里我使用 Mac 自带的 Hiragino Sans GB，支持中文和日文。在文件里添加：

```python
from matplotlib.font_manager import FontProperties
font = FontProperties(fname='/System/Library/Fonts/Hiragino Sans GB.ttc')
```

同时在添加文字的语句，添加上字体 font 的参数：

```python
ax.text(dict_gantt[title][0][0], 10 * i + 16, title, ha='left', fontproperties=font,fontsize=6)
```

搞定。

参考：

- [matplotlib图例中文乱码? - 阿沐的回答](https://www.zhihu.com/question/25404709/answer/495606712)

## i++ 和 ++i

摘自 [what is the difference between i++ & ++i in for loop (Java)?](https://stackoverflow.com/questions/2315705/what-is-the-difference-between-i-i-in-for-loop-java)

They both increment the number. `++i` is equivalent to `i = i + 1`.

`i++` and `++i` are very similar but not exactly the same. Both increment the number, but `++i`increments the number before the current expression is evaluted, whereas `i++` increments the number after the expression is evaluated.

```java
int i = 3;
int a = i++; // a = 3, i = 4
int b = ++a; // b = 4, a = 4
```

## 算法理解

> As usual, one good way to understand an algorithm is to trace its behavior on a small example.

要想理解一个算法，最好的办法就是通过一个小例子，trace 它的行为。

# VScode

## 快捷键

快速添加 comment ：`shift` + `opt` + `A`；
tab 转 window：`cmd`+`k`, then `o`.

## tasks.json

tasks.json 用来完成一些自动化配置。以我配置的 C++ 环境为例:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build",
            "type": "process",
            "command": "g++",
            "args": [
                "${file}",
                "-g",
                "-Wall",
                "-std=c++14",
                "-lm",
                "-o",
                "${fileDirname}/${fileBasenameNoExtension}.o"
            ],
            "presentation": {
                "reveal": "always",
                "echo": false,
                "focus": true
            },
            "problemMatcher": {
                "owner": "cpp",
                "fileLocation": "absolute",
                "pattern": {
                    "regexp": "^(.*):(\\d+):(\\d+):\\s+(error):\\s+(.*)$",
                    "file": 1,
                    "line": 2,
                    "column": 3,
                    "severity": 4,
                    "message": 5
                }
            }
        },
        {
            "label": "Run",
            "type": "shell",
            "dependsOn": "Build",
            "command": "${fileDirname}/${fileBasenameNoExtension}.o",
            "args": [],
            "presentation": {
                "reveal": "always",
                "focus": true
            },
            "problemMatcher": [],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

这里定义两个 tasks："Build" 和 "Run"，一个用于编译，一个用于运行。编译时使用的命令是：`g++ ${file} -g -Wall -std=c++14 -lm -o ${fileDirname}/${fileBasenameNoExtension}.o`，其中用到了 VScode 里预定义的一些变量，比如 ${file} 等等。把命令，需要参数填写到 json 对应的属性中去就行了。"Run" task 同理。

我们再来简单看一下 task 里面的参数和用法：

- label: task 的名称；
- type：有 process 和 shell 两种， shell 就是会运行到 terminal 里；
- command：命令；
- args：参数；在之前的版本里，args 可以定义多次，且之后定义的 args 是对之前定义的追加，不回 override。似乎这被看作了一个 bug，新版本里已经修复，默认只能定义一个 args，之后定义的 args 会完全 override 之前的内容；
- problemMatcher：好像是让输出的报错信息更好的显示；


这里给一个小 tips。如果发现某个 task 运行不正确。可以把 type 调整成 `shell`，在 presentation 中把属性 `echo` 设置为 `true`，这样就能看到实际运行的命令是什么样子。



## C++ 环境配置

首要是安装微软官方提供的 C/C++ 插件。

有两种办法运行 C++ 程序。最简单的是安装 code-runner 插件，国人开发的。试了一下，确实很方便。但这样不能 debug。微软官方提供的方法是写配置文件，这样的做的前提是，必须把 cpp 文件放在一个文件夹下，用 vs code 打开那个文件夹。有 3 个文件需要配置：`c_cpp_properties.json`，`tasks.json`，`launch.json`。

第一个文件是定义了系统，c++ 版本等基本信息。

第二个文件用来编译和运行文件的。

第三个文件是用来 debug。一个坑就是，在 `tasks.json` 中编译文件时，参数一定要加上 `-g`，这样会多输出一个文件，输出的 `*.o` 也能用于 debug，否则 debug 老出错。

参考：

- [Run, Debug & get IntelliSense for C C++ in VSCode](https://medium.com/@jerrygoyal/run-debug-intellisense-c-c-in-vscode-within-5-minutes-3ed956e059d6)
- [Debugging C and C++ with VSCode](https://medium.com/@piyushchauhan/debugging-c-and-c-with-vscode-77dae50eaf7f)
- [VS Code 编译运行 C/C++ 的三种方案](https://zhuanlan.zhihu.com/p/35178331)
- [C/C++ for VS Code (Preview)](https://code.visualstudio.com/docs/languages/cpp)

## 多行编辑

按住 `opt` 鼠标点击，添加一个 cursor。
按住 `shift` + `opt`，跨行鼠标点击，连续在每一行添加一个 cursor。

另外一个，当鼠标选中高亮某些内容时，VScode 会同时把别处的相同内容也一并高亮，此时如果向把这些内容一块编辑，按 `cmd` + `shift` + `l`

## C++ debug

*2018.10.4*

debug 中不能检视 vector, map 等变量。解决办法是先创建一个 symbolic link:

```shell
$ ln -s /Applications/Xcode.app/Contents/Developer/usr/bin/lldb-mi /usr/local/bin/lldb-mi
```

然后在 `launch.json` 中添加参数：` "miDebuggerPath": "/usr/local/bin/lldb-mi"`。解决办法来自：

> Would setting "miDebuggerPath": "/usr/local/bin/lldb-mi" work? On my Mac, lldb-mi is a link to Xcode's lldb: `/usr/local/bin/lldb-mi -> /Applications/Xcode.app/Contents/Developer/usr/bin/lldb-mi`. Are they compatible?
>
> --**ftrofin** commented [on Apr 27](https://github.com/Microsoft/vscode-cpptools/issues/1768#issuecomment-384822921)

参考连接：

[Watching local variables of types vectors, maps etc. is empty when debugging C++ with lldb #1768](https://github.com/Microsoft/vscode-cpptools/issues/1768)

## PHP Debug

目前使用的 php 版本是 7.3.0。在 [Tailored Installation Instructions](https://xdebug.org/wizard.php) 上面，通过分析 `phpinfo()` 会给出 Xdebug 的需要安装的版本和安装步骤。但是这里给出的是 `2.6.1` 版本，实际安装 `make` 的时候会出错。在 [Installing XDebug for PHP with XAMPP on Mac](https://stackoverflow.com/questions/53973545/installing-xdebug-for-php-with-xampp-on-mac) 这篇问题，给出这是一个 bug，需要安装 ` Xdebug 2.7.0beta1` 才行。之后的配置按照参考链接里写的，一步一步来就行了。

在 debug 的时候，选择 *Launch currently open script*，这个，意思是 debug 当前文件。

参考：

- [PHP Debug Adapter for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug)
- [Tailored Installation Instructions](https://xdebug.org/wizard.php) 
- [Installing XDebug for PHP with XAMPP on Mac](https://stackoverflow.com/questions/53973545/installing-xdebug-for-php-with-xampp-on-mac)



# VIM

## 窗口操作

`:vs` , `:vsplit` 垂直分屏
`:sp` , `:split`  水平分屏

`:ls` 显示打开的文件
`:bn` 切换到下一个文件
`:bp` 切换到上一个文件

`ctrl`+`ww` 切换窗口位置

# Linux & Shell

## rsync

使用 `rsync` 命令转移文件。增加参数 --progress， 查看进度。

参考：

[How to show the transfer progress and speed when copying files with cp?](https://askubuntu.com/questions/17275/how-to-show-the-transfer-progress-and-speed-when-copying-files-with-cp)

## pip

**更新**

[Pip 10 release](https://blog.python.org/2018/04/pip-10-has-been-released.html)

> Python 2.6 is no longer supported - if you need pip on Python 2.6, you should stay on pip 9, which is the last version to support Python 2.6.

因为在 macOS 上预装的是 `Python 2.7.10`，这个版本是不能随意乱动的，而且这个版本并没有安装对应的 `Pip`。平时都是使用 Python3，在 Terminal 里用 Brew 安转。

```bash
$ brew install python3
```

> Homebrew installs pip for you when you install Python. `brew install python3` would have installed Python 3.6.0, and also `pip3`. You can then type `pip3` in the terminal to run pip for Python 3. You don't need to use `easy_install` at all.
>
> [Installing Pip for Python 3.x](https://stackoverflow.com/questions/42866367/installing-pip-for-python-3-x)

这时安装的 python3 自带 pip，关键字是 `pip3`。把这个升级到 Pip 10:

```bash
$ pip3 install --upgrade pip
```



**批量更新所有 outdated 的包**

```bash
$ pip3 list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1  | xargs -n1 pip3 install -U
```

`|` 符号叫做 pipe，它的作用是把第一条命令的 output 内容，作为 input，传递到下一条命令中；
`grep` 用来正则检索文本内容；
`cut` ，cut is a Unix command line utility which is used to extract sections from each line of input 
`xargs`: xargs is a command on Unix and most Unix-like operating systems used to build and execute commands from standard input.

> The `grep` is to skip editable ("-e") package definitions, as suggested

参考：

- [Upgrading all packages with pip](https://stackoverflow.com/questions/2720014/upgrading-all-packages-with-pip)
- [What does “|” mean in a terminal command line?](https://stackoverflow.com/questions/12400371/what-does-mean-in-a-terminal-command-line)



**查看依赖和卸载**

```shell
$ pip3 freeze > requirments.txt
```

会把当前安装的 package list 输出到一个 txt 文件中。在这个 txt 文件。利用下面的命令批量删除 txt 文件中列出的所有 packages。

```shell
$ pip3 uninstall -r requirments.txt
```

添加 flag `-y` 可以跳过输入 y 的步骤。

上面是一种方法。还有一种更加简单的，就是安装 `pip-autoremove` 这个包。此外，还可以安装 `pipdeptree` 来显示当前的包依赖关系。这两个包可以常驻系统，也可以随时用，随时装，随时删。



## job control

The general job control commands in Linux are:

- `jobs` - list the current jobs
- `fg` - resume the job that's next in the queue
- `fg %[number]` - resume job [number]
- `bg` - Push the next job in the queue into the background
- `bg %[number]` - Push the job [number] into the background
- `kill %[number]` - Kill the job numbered [number]
- `kill -[signal] %[number]` - Send the signal [signal] to job number [number]
- `disown %[number]` - disown the process(no more terminal will be owner), so command will be alive even after closing the terminal.

## du

近日使用 U 盘在 Lubuntu 上和 Mac 上传文件。发现 U 盘可用空间骤减。通过命令：

```shell
$ du -h --max-depth=1 
```

 得到文件的资源占用情况。发现 `.Trash-1000` 这个文件夹占用了 14 GB。都是平日里删除的一些文件。而且这个文件夹在 Mac 下用 CleanMyMac 检测不到。用 `rm` 删除即可。这里注意一个小细节，在 linux 下使用参数 `--max-depth`，而在 mac 下使用参数 `-depth`。

关于磁盘管理也学到几个命令：

- `df -h`，-h 命令表示输出 human readable 的数据，这个命令输出电脑的磁盘使用情况。
- `du -sk * | sort -n ` 输出当前路径下资源占用。不会输出剩余空间。也不现实隐藏文件。
- `du -h —-max-depth=1 ` 这个仅仅显示第一级别的文件或文件夹占用。同样也会显示隐藏文件。

## \$PATH

今天( 2018.8.7 ) 偶然使用 `echo $PATH` 查看环境变量，发现一个恶心的东西：

```shell
/usr/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Wireshark.app/Contents/MacOS
```

之前装过一次 wireshark 没有删除干净。然后查看 `/etc/paths` 中的内容没有动过手脚，我平时使用的是 zsh，查看 `~/.zshrc` 也 ok。找了很久与是看到了[这个](https://www.cyberciti.biz/faq/appleosx-bash-unix-change-set-path-environment-variable/):

> **Method #2: /etc/paths.d directory**
>
> Apple recommends the path_helper tool to generate the PATH variable i.e. helper for constructing PATH environment variable. From the man page:...

去查看了下 `/etc/paths.d/` 文件夹，果然里面有一个 Wireshark 文件，删除解决。

有一点奇怪的是，原来 Finder 默认的搜索不会去搜索隐藏文件。否则也就不会有漏网之鱼。

## brew

`brew ls -l` 现实安装 package 的安装时间，权限等信息。但可惜的是，并没有按照时间进行排序。

```shell
$ brew list -l                
total 0
drwxr-xr-x  3 reyshawn  staff   96 Aug 20 18:56 cairo
drwxr-xr-x  3 reyshawn  staff   96 Aug 17 09:50 cmake
drwxr-xr-x  3 reyshawn  staff   96 Aug 20 19:26 ffmpeg
...
```

查了一下如果加上参数 `-t` 可以让输出结果按照时间排序。参数的选择跟 `ls` 命令一样。

`brew ls --versions` 显示版本。

> The `-t` flag will sort the ls command output by last date and time modified

`brew deps —-tree —-installed` 现实当前安装包以及它的依赖：

```shell
$ brew deps --tree --installed
cairo
├── freetype
│   └── libpng
├── fontconfig
│   └── freetype
│       └── libpng
├── libpng
├── pixman
└── glib
    ├── gettext
    ├── libffi
    └── pcre

cmake

ffmpeg
├── lame
├── x264
└── xvid
...
```

这样显示 tree 虽然直观了，但是有个问题，就是 package 会重复显示，一个是作为顶级现实，一个是作为其他 package 的 dependency 显示。

如果想只显示顶级 package 的 dependencies，去掉重复。我再思考可以把 `brew deps` 和 `brew leaves`  的两个命令合并一下。也就是，让 `brew leaves` 的输出作为 `brew deps --tree` 输入的参数。在网上搜索后，发现可以使用 backtick 来 evaluate 命令。经过测试，因此可以采用下列命令：

```shell
$ brew deps --tree `brew leaves`
$ brew leaves | xargs brew deps --tree
```



`brew tap`

>The tap command allows Homebrew to **tap into** another repository of formulae. Once you've done this you've expanded your options of installable software.
>
>These additional Git repos (inside usr/local/Library/Taps) describe sets of package formulae that are available for installation.
>
>E.g. 
>
>```shell
>brew tap                     # list tapped repositories
>brew tap <tapname>           # add tap
>brew untap <tapname>         # remove a tap
>```

tap 就是水龙头的意思。字面理解就是再打开一个水龙头。

**uninstall 同时包含所有 dependencies**

下面是介绍一种卸载的方法。

>It looks like [the issue is now solved using an external command called `brew rmdeps` or `brew rmtree`](https://github.com/mxcl/homebrew/issues/7465#issuecomment-4998005).
>
> To install and use, issue the following commands:
>
>```
>$ brew tap beeftornado/rmtree
>$ brew rmtree <package>
>```
>See the above link for more information and discussion.
>
>--[Uninstall / remove a Homebrew package including all its dependencies](https://stackoverflow.com/questions/7323261/uninstall-remove-a-homebrew-package-including-all-its-dependencies)

`brew leaves` 显示那些最顶级的 package，及不作为任何 package 的 dependency。

`brew outdated` 显示所有旧版本的 formulae；

`brew upgrade` 把所有旧版本的 formulae 升级到新版本；也可以把上面几条命令合起来，就是：

```shell
$ brew update && brew upgrade `brew outdated`
```

`brew cleanup` ，[删除所有旧版本的 formulae](https://apple.stackexchange.com/questions/238179/brew-how-to-delete-outdated-version-of-package)。


参考：

- [pip uninstall](https://pip.pypa.io/en/stable/reference/pip_uninstall/#id2)

## lldb

*2018.10.4*

使用 lldb 进行 debug，前提是要先编译好文件，而且编译的时候要加上 `-g` 的参数，此时输出的是 `*.o.dSYM` 文件，这样的文件，在用 lldb debug 的时候可以得到具体的代码信息。如果不加 `-g` 参数，debug 的时候得到的汇编代码信息。以自己目前在写的一道 leetcode 题目为例：

```shell
$ g++ 12.Int2Rom.cpp -o main.out -std=c++14 -g
$ lldb ./main.out
(lldb) b main
Breakpoint 1: where = main.out`main + 39 at 12.Int2Rom.cpp:15, address = 0x0000000100001317
(lldb) run
Process 1870 launched: './main.out' (x86_64)
Process 1870 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100001317 main.out`main at 12.Int2Rom.cpp:15
   12   };
   13
   14   int main() {
-> 15       map<string, int> x = {{"I", 1}, {"V", 5}};
   16       vector<int> t = {1,2,3,4};
   17       for(auto& it:x) {
   18           cout << it.second << endl;
Target 0: (main.out) stopped.
(lldb)
```

lldb 里一些简单操作:

- `help`是帮助命令,会打印出一个command list,help + <command名称>可以查看某一个命令的描述

- `l` + Line number，显示该行及其之后的代码；

- `b(breakpoint)` ，在指定行断点。（这个貌似要先进入文件）

- `br(breakpoint) list`，列出所有断点；

- `br del` + 断点号；删除指定断点；

- `c(continue)`， 取消断点的暂停 一直到下一个断点,对应第一个按钮

- `n(next)` ，向下执行一行代码,如果是函数则黑盒执行,不会进入函数；

- `s(step)`， 进入函数内部,如果下一行不是函数,那么n和s是一样的；

- `finish`，  跳出函数；

- `exit`，退出 lldb；

- `p`打印变量；

- `po`打印变量的 description；

- `e int $a =2`，定义变量；

- `e $a = 3`，修改变量(也可以修改断点时的代码中的变量)；

关于设置断点，和以前用过的 pdb 不太一样，命令 `b` 后通常不能直接加行号，自己亲自试过比较方便的办法是先加函数名参数进行定位，如 `main` 函数，然后在加行号就可以了。



参考：

[使用LLDB调试程序](https://casatwy.com/shi-yong-lldbdiao-shi-cheng-xu.html)

## npm

`npm list -g --depth=0` ：查看全局安装所有的 npm package。

在 npm 中更新 package，使用 `npm-check`。来自 [npm-check](https://www.npmjs.com/package/npm-check)。其中命令行进行了颜色高亮，并加入了 emoji，使用起来非常舒服。

**安装 package**

`-g` 是全局安装。
`--save` 在安装完后，会自动把新安装的 package 信息添加到 package.json。
`--save-dev`，字面含义是开发时会用的 package，比如做一些 unit test 什么的，可能项目实际使用时用不到这个 package。



参考：

- [What is the difference between --save and --save-dev?](https://stackoverflow.com/questions/22891211/what-is-the-difference-between-save-and-save-dev)



## git

- `git log --pretty=oneline` 查看日志，每次提交都是只显示一行。
- `git diff` + 文件名，直接显示当前版本该文件的修改记录。  

# Regex

## Lookahead operator

**Positive Lookahead**

Syntax:

```python
'(?=REGEX_1)REGEX_2'
```

Match only if REGEX_1 matches; after matching REGEX_1, the match is discarded and searching for REGEX_2 starts at the same position.

example:

```python
'(?=[a-z0-9]{4}$)[a-z]{1,2}[0-9]{2,3}'
```

REGEX_1 is `[a-z0-9]{4}$` which matches four alphanumeric chars followed by end of line.
REGEX_2 is `[a-z]{1,2}[0-9]{2,3}` which matches one or two letters followed by two or three digits.

REGEX_1 makes sure that the length of string is indeed 4, but doesn't consume any characters so that search for REGEX_2 starts at the same location. Now REGEX_2 makes sure that the string matches some other rules. Without look-ahead it would match strings of length three or five

可以这样理解，REGEX_1 先给出 pattern 的大体框架，REGEX_2 对筛选出的文本进一步修饰。举例说明：

`^(?=[A-C]{3}$).*$` 等同于 `^[A-C]{3}$`
而如果 `^(?=[A-C]{3}$)ABC$` ，则只会把 ABC 的文本选择出来。起到了进一步筛选的功能。

**Negative Lookahead**

Syntax:

```python
'(?!REGEX_1)REGEX_2'
```

Match only if REGEX_1 does not match; after checking REGEX_1, the search for REGEX_2 starts at the same position.

这个可以看作 Positive Lookahead 的取反，前面是先对 REGEX_1 有一个 match，而这里是对 REGEX_1 没有 match，然后再从相同位置检测 REGEX_2。

应用：选择 ABC 三个字母的任意不重复排列。

```python
'^(?=[A-C]{3}$)(?!.*(.).*\1).*$'
```

第一个 `(?=)` 限定长度为 3，内容是 ABC 三个字母，第二个 `(?!)` 限定不允许重复。





参考：

- [Regex lookahead, lookbehind and atomic groups](https://stackoverflow.com/a/2973609/8247439)