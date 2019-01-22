---
title: 'Argument Mapper | 5kyu'
date: 
tags:
- Algorithm
- codewars
- JavaScript
categories: 
- Coding
---

## Details

As part of a broader functionality you need to develop an argument mapper.

The function receives a function object as first parameter and an unknown number of arguments [zero to many]. You have to return an associative array that maps the name of an argument and its related value.

The usage is:

```javascript
function func1(arg1, arg2) { ... }

var map = createArgumentMap(func1,'valueOfArg1', 'valueOfArg2');
console.log(map['arg1']);  // writes 'valueOfArg1'
console.log(map['arg2']);  // writes 'valueOfArg2'
```

The passed values are in the same order as they appear in the function object.

Invalid inputs, e.g. non-function objects, or wrong number of arguments, are not considered.

Hajime!

<!--more-->

## My Solution

```javascript
function createArgumentMap(func) {
    // create an argument map and return it
    let args = Array.prototype.slice.call(arguments,1);
    let res = {};
    for (var i = 1; i <= args.length; i++) {
        res['a' + i] = args[i-1]
    }
    return res
  }
```

关于 JavaScript 中 arguments 的性质参看：[Arguments object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)

`res['a'+i]` 是为了契合 test 中都是用形如 map[a1] map[a2] 等来 check 答案的。这里我的方法有些取巧。实际上需要得到的是实际定义函数时使用的参数名称，就像上次 review 中那样，要用到 `.toString()` 和正则表达式。

## Other Solutions

[colbydauph](https://www.codewars.com/users/colbydauph)

```javascript
function createArgumentMap(func) {
  var args = (/function\s[^(]*\(([^)]+)\)/g.exec(func.toString()) || ['']).pop().split(/,/g);
  return Array.prototype.slice.call(arguments, 1).reduce(function(p, c, i){ return p[args[i]] = c, p }, {});
}
```

`reduce()` 中 callback 函数的三个参数，依次分别是 `accumulator`, `currentValue`, `currentIndex`。对应代码中的 `function(p, c, i){...}`

正则表达式分析：

`/function\s[^(]*\(([^)]+)\)/g`

- `/…/g` : 表明正则表达式 global 模式，找到所有可能的 match，而不是仅仅是找到第一个 mathc 就停下来。
- `function\s` : 以 function 开头，紧接着是一个 space 空格 `\s`。
- `[^(]*` : 0 个或多个非 `(` 的字符。
- `\(`: 匹配左括号 `(`。
- `([^)]+)`: 1个或多个非 `)` 的字符。注意这里用括号括住，那么输出匹配结果时也会把这个括号括住的匹配输出来。
- `\)`: 匹配右括号 `)`。

```javascript
>(/function\s[^(]*\(([^)]+)\)/g.exec(func1.toString()))
[ 'function func1(arg1, arg2)',
  'arg1, arg2',
  index: 0,
  input: 'function func1(arg1, arg2) { console.log(arg1, arg2) }' ]
>(/function\s[^(]*\([^)]+\)/g.exec(func1.toString()))
[ 'function func1(arg1, arg2)',
  index: 0,
  input: 'function func1(arg1, arg2) { console.log(arg1, arg2) }' ]
>
```

上述展示了加中间那对括号，和不加括号时的区别。

另外注意这里的 `.split(/,/g)` 方法的参数。这里的参数并不是两个。而是一个，一个正则表达式，global 模式匹配单字符 `,`，用正则表达式的 `/.../g` 扩起来。同理也可以写成 `.split(',')`。

`.reduce()`方法使用及参数说明：[Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

关于最后在 reduce 的 callback 函数中，return 那里出现的 comma，`return p[args[i]] = c, p`，其实就是多个语句的简写，先进行赋值，然后输出 `p`。参见 stack overflow 上的解释：[return statement with multiple comma separated values](https://stackoverflow.com/questions/10284536/return-statement-with-multiple-comma-separated-values)

> It's the [comma operator](http://es5.github.com/#x11.14). It runs a series of expressions, in order, and then returns the result of the *last* of them.  

[stnever](https://www.codewars.com/users/stnever)

```javascript
function createArgumentMap(func) {
  var argumentNames = getArgumentNames(func);
  var argumentValues = arguments;
  var result = {};
  argumentNames.forEach(function(key, index) {
    result[key] = argumentValues[index+1];    
  });
  return result;
}

// shamelessly copied from http://stackoverflow.com/questions/1007981
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getArgumentNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '')
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
  if(result === null)
     result = []
  return result
}
```

