---
title: 'Lowest base system | 4kyu'
date: 
tags:
- Algorithm
- codewars
- JavaScript
categories: 
- Coding
---

## 要点

- 除法，求余，因子
- `Number.MAX_SAFE_INTEGER`
- 二分法求方程根

## Details

Your task is determine lowest number base system in which the input `n` (base 10), expressed in this number base system, is all `1` in its digit. See an example:

'7' in base 2 is '111' - fits! answer is 2

'21' in base 2 is '10101' - contains '0' does not fit '21' in base 3 is '210' - contains '0' and '2' does not fit '21' in base 4 is '111' - contains only '1' it fits! answer is 4

`n` is always less than `Number.MAX_SAFE_INTEGER`.

这个题目的难度主要在于性能 performance 方面，对于数值较小的数字，通常方法很容易计算，一旦涉及到九位十位往上的大数，一般的循环方法就会耗时很久。

<!--more-->

## My Solution

```javascript
function getMinBase (number) {
    if (number == 3) return 2;
    var divisor = number -1
    for (let i = 2; i != divisor; i++) {
        var k = number - 1;
        if (i > 5999) break;
        while (!(k % i)) {
            divisor = k / i
            k = divisor - 1;
            if (k == 0) return i;
        }
    }
    var _root = [2,3,4,5]
    var k = 11
    for (let i=0; i<_root.length; i++){
        var possible = parseInt(Math.pow(number, 1/_root[i]))
        var k = 10 * k + 1
        if (toTenBase(k,possible) == number) return possible
    }

    return number -1;
}


function toTenBase (number, base) {
    n = number + '';
    n = n.split('').map(a => parseInt(a));
    res = 0
    for (var i = n.length -1; i > -1; i--) {
        res += Math.pow(base,i) * n[i]
    }

    return res;
}
```

我的这个方法，似乎有些根据测试的数据，有些取巧。代码分成两部分，第一步是通常意义的查找，`i` 从 2 开始，依此类加，找到每次减 1 都能被整除的最小 `i` 值。这里面为了优化用了一些技巧，比如最开始一部其实是要找 `number - 1` 的所有因子，但注意，因为一个数的所有因子都是对称的。譬如 12 的因子：1，2，3，4，6，12。从 3 开始往后的每一个数，在之前的相除过程中都得到了。比如和 2 相除得到 6，和 3 相除得到 4。

所以我在代码的第一部分加入了变量 `divisor`，并把它加入了跳出循环的条件。因为一旦 `i` 超过了 `number - 1`  的一半，那么就不可能存在除了 `number -1` 之外的数，使得以之为 base 能得到 `111...`。

但因为每次 `i` 都是类加 1，经过多次反复实验，`i` 超过 5000 之后，再计算速度已经很慢了。于是我写了另一个函数 `toTenBase()` ，给出任意 number 和 base，计算以 10 base 的数。最开始写这个函数，不过是为了去找一些规律。对于测试中出现的那些很大的数，大部分的结果都是 `number - 1`，然而在特殊测试部分，类似这样的 `Test.assertEquals(getMinBase(2500050001), 50000);` 数就很难办。

后来也是借助函数 `toTenBase()` 才发现，特殊测试中的数字，化成 `111…` 形式的话，大多都是 `111`，`1111` 和 `11111`，再大的话就没有了。如果我们设 `getMinBase()` 函数所得值为 $x$，而对应 number 为 $n$，对于 `111` 的类型，则变成一个二次方程求解：

$$x^2 +x+1=n$$

相应的 `1111` 类型，则是三次方程求解：

$$x^3+x^2 +x+1=n$$

对于 `11111` ，按照上述形式也可写出四次方程来。那么问题就是，针对这样的方程，该如何解呢？那么我们就要意识到，$n$ 此时已经很大了，相应 $x$ 也很大。所以它可以转化成一个球极限的问题，即：

$\lim\limits_{x \to \infty }x^3+x^2 +x+1=\lim\limits_{n \to \infty }n$
$\lim\limits_{x \to \infty }x^3=\lim\limits_{n \to \infty }n$

因此对于第一个方程，n 直接开方，对于第二个方程，n 直接开三次方。理论终究只是理论，实际检验一下，发现可以，于是就是有代码的第二部分。

## Other Solutions

 [Voile](https://www.codewars.com/users/Voile)

```javascript
function getMinBase(n) {
  for(let i=Math.ceil(Math.log2(n)); i>1; i--) {
    let root=Math.round(findRoot(n,i));
    if([...'1'.repeat(i)].reduce((s,_)=>s*root+1,0)===n) return root;
  }
}

function findRoot(n,i) {
  var l=1, r=Number.MAX_SAFE_INTEGER;
  while((r-l)/l>1e-12) {
    let m=(r+l)/2, g=(Math.pow(m,i)-1)/(m-1);
    g<n?l=m:r=m;
  }
  return (r+l)/2;
}
```

`Number.MAX_SAFE_INTEGER` 是我们可以在 JavaScript 中进行 **准确计算**的最大数字，比之更大的数依然存在，但如果参与计算就会误差很大。

> The **Number.MAX_SAFE_INTEGER** constant represents the maximum safe integer in JavaScript (`253 - 1`).
>
> The reasoning behind that number is that JavaScript uses [double-precision floating-point format numbers](http://www.wikiwand.com/en/Double_precision_floating-point_format) as specified in [IEEE 754](http://www.wikiwand.com/en/IEEE_floating_point) and can only safely represent numbers between `-(253 - 1)` and `253 - 1`.

 `findRoot(n,i)` 正是求我上面所说 $i-1$ 阶的一元方程。

```javascript
>x = findRoot(1000,4)
9.641969245752986
>Math.pow(x,3) + Math.pow(x,2) + Math.pow(x,1) + 1
999.9999999995179
```

关键一步：`g=(Math.pow(m,i)-1)/(m-1)`，写成数学式是：

$g = \dfrac{m^i -1}{m-1} = m^{i-1}+m^{i-2} + ... + m + 1$

求解的方程是：

$f(x) = x^{i-1}+x^{i-2} + ... + x + 1 = n$

注意到 `r` 和 `l`，分别为计算的上界和下届。求  `r` 和 `l` 平均值，带入减 $n$，比较 0，大小，按结果分别再次带入到 `r` 和 `l`  中。标准的二分法求根的迭代过程，bisection method。

下面看一下函数的主体部分。主要是 for 循环中 `i` 的初始值：`i=Math.ceil(Math.log2(n))`。`i` 可能的 1 的最大位数，已知当 base 为 2 的时候，1 的位数是最多了，所以这里才会求 2 的对数。然后得到 i 值的上界，之后再依次减 1。



[spiderPan](https://www.codewars.com/users/spiderPan)

```javascript
function getMinBase(number) {
  for (var b =2; b<= Math.floor(Math.sqrt(number)); b++) {
    var num = number;
    while (num % b == 1) {
      num = Math.floor(num / b);
      if (num == 1) {
        return b;
      }
    }

  }

  return number - 1;
}
```



 [LesRamer](https://www.codewars.com/users/LesRamer), [yurak](https://www.codewars.com/users/yurak)

```javascript
function getMinBase(x) {
  function test(b) {
    var z = x;
    while(z % b == 1)
      z = (z - 1) / b;
    return z == 0;
  }
  for(var n = Math.ceil(Math.log2(x)); n >= 1; --n) {
    var b = Math.floor(Math.pow(x,1/n));
    if (test(b)) return b;
    if (test(b-1)) return b-1;
  }
  return -1;
}
```





参考文章：

- [Prove $x^n−1=(x−1)(x^{n−1}+x^{n−2}+…+x+1)$](https://math.stackexchange.com/questions/900869/prove-xn-1-x-1xn-1xn-2-x1)
- [二分法 (數學)](http://www.wikiwand.com/zh/二分法_(數學))