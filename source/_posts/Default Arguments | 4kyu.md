---
title: 'Default Arguments | 4kyu'
date: 
tags:
- Algorithm
- codewars
- JavaScript
categories: 
- Coding
---

## Details

Write a function `defaultArguments`. It takes a function as an argument, along with an object containing default values for that function's arguments, and returns another function which defaults to the right values. 

You cannot assume that the function's arguments have any particular names.

You should be able to call `defaultArguments` repeatedly to change the defaults.

```javascript
function add(a,b) { return a+b;};

var add_ = defaultArguments(add,{b:9});
add_(10); // returns 19
add_(10,7); // returns 17
add_(); // returns NaN

add_ = defaultArguments(add_,{b:3, a:2});
add_(10); // returns 13 now
add_(); // returns 5

add_ = defaultArguments(add_,{c:3}); // doesn't do anything, since c isn't an argument
add_(10); // returns NaN
add_(10,10); // returns 20
```

HINT: This problem requires using `Fuction.prototype.toString()` in order to extract a function's argument list

<!--more-->

## My Solution

```javascript
function defaultArguments(func, params) {

    // get the properties list of params
    let defArg = Object.keys(params);

    // use Function.prototype.toString() to get the arguments list
    let args = func.args || func.toString().replace(/\/\/.*$|\/\*.*?\*\/|\s/gm, '').match(/(?:[\w]+(?:,[\w]+)*)?(?=\))/m)[0].split(',');

    // pass the properties into func
    let newArgs = {};
    for (var i = 0; i < defArg.length; i++) {
        if (args.indexOf(defArg[i]) > -1) {
            let idx = args.indexOf(defArg[i]);
            newArgs[idx] = params[defArg[i]];
        }
    }
    // bind the func and params into a new function

    let detour = function() {
                let argsArray = [].slice.call(arguments);
                let x = Object.keys(newArgs);
                for (var i = 0; i < x.length; i++) {
                    if(x[i] >= argsArray.length) {
                        argsArray[x[i]] = newArgs[x[i]];
                    }
                }
                return func.apply(this,argsArray);
            }
    detour.args = args;
    return detour;
}
```

`args` 那一大串正则表达式，获得的是原函数的参数列表，是一个 array。`defArg` 是函数 `defaultArguments()` 预先给定的参数。将两者合并成新的参数 `newArgs` ，类型为 object。

举例说明，如果 `params` 传入的值是 `{ b: 3, a: 2 }`，那么经过中间 10 行到 16 行的循环运算得到的 `newArgs` 值是 `{ '0': 2, '1': 3 }`。

20 行 `argsArray = [].slice.call(arguments);`作用是打印参数列表。举例说明：

```javascript
>function add(a,b) { console.log([].slice.call(arguments));return a+b;};
undefined
>add(1,2)
[ 1, 2 ]
3
>add(1,2,3)
[ 1, 2, 3 ]
3
>add(1,2,3,4)
[ 1, 2, 3, 4 ]
3
```

因为整个函数最后 return 的是 detour。也就是说当第一次运行 `defaultArguments()` 时，仅仅是声明了 `detour()` 函数但是并没有运行。按照 details 里给出的例子，只有当 `add_(10)` 调用时， `detour()` 函数才真正被运行。此时的 `arguments ` 值为 `[10]`。

27 行 `apply()` 方法的应用，就是调取 `func` 函数，并给他特定的 arguments 值，并获得结果。第一个参数是修改 `func` 函数的 `this` 指向的， 是 `this` 还是 `null` 对结果都是没有影响的。[因为都是对函数的直接调用，不存在对某个 object 的 method 进行调用。](https://stackoverflow.com/questions/9644044/javascript-this-pointer-within-nested-function)

注意第 29 行的，函数也是 object，而且这个定义使得返回的函数对象多携带了 args 信息。这一点当时自己没有想到，也是看了答案后才明白的。

## Other Solutions

 [mrkishi](https://www.codewars.com/users/mrkishi), [guyingll](https://www.codewars.com/users/guyingll), [iphp](https://www.codewars.com/users/iphp), [willin](https://www.codewars.com/users/willin), [marek_mistrzuk](https://www.codewars.com/users/marek_mistrzuk)

```javascript
function defaultArguments(func, params) {
  var names = func.names || func.toString()
    .replace(/\/\/.*$|\/\*.*?\*\/|\s/gm, '')
    .match(/(?:[\w]+(?:,[\w]+)*)?(?=\))/m)[0].split(',');
  
  var detour = function () {
    var input = arguments;
    return func.apply(this, names.map(function (val, i) {
      return i < input.length ? input[i] : params[names[i]];
    }));
  };
  
  detour.names = names;
  return detour;
}
```

