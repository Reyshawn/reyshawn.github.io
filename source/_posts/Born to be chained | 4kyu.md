---
title: 'Born to be chained | 4kyu'
date: 
tags:
- Algorithm
- codewars
- JavaScript
categories: 
- Coding
---

- 对于 Object 的遍历；

## Details

Function composition is a powerful technique. For example:

```javascript
function sum(x, y) {
  return x + y;
}

function double(x) {
  return sum(x, x);
}

function minus (x, y) {
  return x - y;
}

function addOne(x) {
  return sum(x, 1);
}

double(sum(2, 3)); // 10
```

But in complex expressions, composition may be difficult to understand. For example:

```javascript
double(double(addOne(sum(7, minus(sum(5, sum(4, 5)), 4))))); // 72
```

In this kata, we will implement a function that allows us to perform this by applying a fluid style:

```javascript
c.sum(4, 5).sum(5).minus(4).sum(7).addOne().double().double().execute(); // 72
```

Your job is implement the `chain` function:

```javascript
function chain(fns) {
}

var c = chain({sum: sum, minus: minus, double: double, addOne: addOne});
```

As you can see, this function receives the methods to be chained and returns an object that allows you to call the chained methods. The result is obtained by calling the `execute`method.

Chained functions receive an arbitrary number of arguments. The first function in the chain receives all its arguments. In the other functions, the first argument is the result of the previous function and then it only receives the remainder arguments (second, third, etc.). The tests always pass the appropriate arguments and you do not have to worry about checking this.

Note that the chain can be reused (the internal state is not stored):

<!--more-->

```javascript
c.sum(3, 4).execute(); //7
c.sum(1, 2).execute(); //3
```

Other examples:

```javascript
var c1 = c.sum(1, 2);
c1.execute(); // == fns.sum(1, 2) == 3
c1.double().execute(); // == fns.double(fns.sum(1, 2)) == 6
c1.addOne().execute(); // == fns.addOne(fns.sum(1, 2)) == 4
c1.execute(); // == fns.sum(1, 2) == 3

var c2 = c1.sum(5);
c2.addOne().execute(); // == fns.addOne(fns.sum(fns.sum(1, 2) 5)) == 9
c2.sum(3).execute(); // == fns.sum(c1.sum(fns.sum(1, 2), 5), 3) == 11
c2.execute(); // == fns.sum(fns.sum(1, 2), 5) == 8

c1.execute(); // == fns.sum(1, 2) == 3
```

## Other Solutions

 [ooflorent](https://www.codewars.com/users/ooflorent), [ChungGor](https://www.codewars.com/users/ChungGor), [pompeu2004](https://www.codewars.com/users/pompeu2004), [guilhermeconti](https://www.codewars.com/users/guilhermeconti), [lwio](https://www.codewars.com/users/lwio) (plus 2 more warriors)

```javascript
function chain(fns) {
  function ChainWrapper(x) {
    this._ = x
  }
  
  Object.keys(fns).forEach(function(prop) {
    var fn = fns[prop]
    
    ChainWrapper.prototype[prop] = function() {
      var args = [].slice.call(arguments)
      if (this._ != null) args.unshift(this._)
      
      var x = fn.apply(null, args)
      return new ChainWrapper(x)
    }
  })
  
  ChainWrapper.prototype.execute = function() {
    return this._
  }
  
  return new ChainWrapper()
}
```

line 6: 关注一下对于一般 Object  的遍历方法。主要用到 `Object.keys()` 和 `forEach()`，另外相对应的也有 `Object.values()`。

line 9: ChainWrapper 是一个函数，给这个函数添加若干子函数（或也称 method）的办法。这里要弄明白一个问题，直接用 `ChainWrapper[prop]` 和使用 `ChainWrapper.prototype[prop]` 的区别在哪里。前者只给该函数加入了一个子函数，而后者透过原型链，给最原始的**函数对象**加入了一个子函数，如果讲函数作为 Object 进行创建，形如 `var a = new ChainWrapper(3)` 这样，前者创建的子函数不复存在，后者创建的子函数依然存在。如下例子：

```javascript
function ChainWrapper(x) {
    this._ = x
}
ChainWrapper['sum'] = (a,b) => (a+b)

ChainWrapper.sum(2,3) //5
ChainWrapper['sum'](2,3) //5

var a = new ChainWrapper(1) //ChainWrapper { _: 1 }

a.sum(2,3) //TypeError: a.sum is not a function

ChainWrapper.prototype['sum'] = (a,b) => (a+b)

var a = new ChainWrapper(1) //ChainWrapper { _: 1 }
a.sum(2,3) //5

```

当将函数利用 new 关键字进行创建的时候，得到的是一个 Object 而不是 function。

line 11: 初次定义时，`chain()` 函数返回的是 `return new ChainWrapper()`，此时 Object 内的 `this._` 为 `undefined`。当 Object 开始 chain 第一个子函数时，得到的运算结果记录在 `this._` 中，此时为非 null 值，则在下一次 chain 的时候，前一次函数的运算结果要作为下一次 chain 的参数传入进去，所以要 `args.unshift(this._)`。

但这里有一个小 bug，当 `this._` 出现 `NaN` 时，此时判定 `NaN != null`  的结果会是 `true`。然后会把 `NaN` 传入到参数的最开头，那么每次结果都会是 `NaN`。修复的办法就是判定 `x` 是否为 `NaN`，在 `apply()` 方法使用后加一个条件结构。

```javascript
if (isNaN(x)) return new ChainWrapper();
```

但注意，这里默认了当输出为 `NaN` 为输出无效，不会保留之前的参数。如果要保留参数，但不同函数参数数量都不一样，就比较复杂了。比如 `sum()` 两个数相加，只输入 1 个数时会得到 `NaN`，此时输入的那个数也是直接舍弃不再保留了。

[evk](https://www.codewars.com/users/evk), [niweic](https://www.codewars.com/users/niweic), [marek_mistrzuk](https://www.codewars.com/users/marek_mistrzuk)

```javascript
function chain(fns) {
  let Chain = function(val){
    this.execute = () => val;
  };
  for(let i in fns) Chain.prototype[i] = function (a, b) {
    let val = this.execute(),
        args = val === null ? [a, b] : [val, a];
    return new Chain(fns[i](...args));
  }
  return new Chain(null);
}
```





参考文章：

-  [Why is isNaN(null) == false in JS?](https://stackoverflow.com/questions/115548/why-is-isnannull-false-in-js)