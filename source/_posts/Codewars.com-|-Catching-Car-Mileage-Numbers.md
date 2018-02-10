---
title: 'Codewars.com | Catching Car Mileage Numbers'
date: 
tags:
- 算法
- codewars
- JavaScript
categories: 
---

#  Codewars.com | [Catching Car Mileage Numbers](https://www.codewars.com/kata/52c4dd683bfd3b434c000292)

## Kata

>   "7777...*8?!??!*", exclaimed Bob, "I missed it again! Argh!" Every time there's an interesting number coming up, he notices and then promptly forgets. Who *doesn't* like catching those one-off interesting mileage numbers?

Let's make it so Bob **never** misses another interesting number. We've hacked into his car's computer, and we have a box hooked up that reads mileage numbers. We've got a box glued to his dash that lights up yellow or green depending on whether it receives a `1` or a `2` (respectively).

It's up to you, intrepid warrior, to glue the parts together. Write the function that parses the mileage number input, and returns a `2` if the number is "interesting" (see below), a `1` if an interesting number occurs within the next two miles, or a `0` if the number is not interesting.

**Note:** In Haskell, we use `No`, `Almost` and `Yes` instead of `0`, `1` and `2`.

 **"Interesting" Numbers**

Interesting numbers are 3-or-more digit numbers that meet one or more of the following criteria:

-   Any digit followed by all zeros: `100`, `90000`
-   Every digit is the same number: `1111`
-   The digits are sequential, incementing†: `1234`
-   The digits are sequential, decrementing‡: `4321`
-   The digits are a palindrome: `1221` or `73837`
-   The digits match one of the values in the `awesomePhrases` array

>   † For incrementing sequences, `0` should come after `9`, and not before  `1`, as in `7890`.
>   ‡ For decrementing sequences, `0` should come after `1`, and not before  `9`, as in `3210`.

So, you should expect these inputs and outputs:

```javascript
// "boring" numbers
isInteresting(3, [1337, 256]);    // 0
isInteresting(3236, [1337, 256]); // 0

// progress as we near an "interesting" number
isInteresting(11207, []); // 0
isInteresting(11208, []); // 0
isInteresting(11209, []); // 1
isInteresting(11210, []); // 1
isInteresting(11211, []); // 2

// nearing a provided "awesome phrase"
isInteresting(1335, [1337, 256]); // 1
isInteresting(1336, [1337, 256]); // 1
isInteresting(1337, [1337, 256]); // 2

```

**Error Checking**

-   A number is only interesting if it is greater than `99`!
-   Input will *always* be an integer greater than `0`, and less than `1,000,000,000`. 
-   The `awesomePhrases` array will always be provided, and will always be an array, but may be empty. (Not *everyone* thinks numbers spell funny words...)
-   You should only ever output `0`, `1`, or `2`.



<!-- more -->

***

## Solution

题目很长，但总结起来，无非就是输入一个 number 类型的数据，检查是否符合上述列出的所谓「interesting number」的规则，按照规则输出 0，1 或 2。以下是自己看到的一个非常简洁的答案，答案来自 [laoris](https://www.codewars.com/users/laoris), [jwong483](https://www.codewars.com/users/jwong483), [Marlen](https://www.codewars.com/users/Marlen)：

```javascript
function isInteresting(number, awesomePhrases) {
  var tests = [
    function(n) { return /^\d00+$/.test(n); },
    function(n) { return /^(\d)\1+$/.test(n); },
    function(n) { return RegExp(n).test(1234567890); },
    function(n) { return RegExp(n).test(9876543210); },
    function(n) { return n + '' == (n + '').split('').reverse().join(''); },
    function(n) { return awesomePhrases.some(function(p) { return p == n; }); }
  ];

  var interesting = 0;
  tests.some(function(test) {
    if (number > 99 && test(number))
      return interesting = 2;
    else if ((number > 98 && test(number + 1)) || (number > 97 && test(number + 2)))
      interesting = 1;
  });
  return interesting;
}
```

这个答案在代码结构上很厉害的一点在于，使用了 `some()` 这个函数，以及加上完全由函数组成的 array 数组，来进行给定规则的检验。 `some()` 方法主要用于测试数组中某些元素。用法就是在方法 `some()` 中定义一个 callback 回调函数，数组中的每一个元素作为回调函数的参数依次传入到回调函数中（回调函数的意思就是函数作为函数的参数，这里有点儿绕） 。

在这个例子里，`tests` 是事先定义好的数组，数组的每一个元素都是一个函数。对这个数组使用 `some()` 方法，在其中定义了一个回调函数，形如：

```javascript
tests.some(function(test){
    if（number > 99 && test(number)){
        // code here
    }
    //code here
})
```

在实际执行过程中，`tests` 中的每一个元素 element，都会作为回调函数的参数 `test` 传递进回调函数中。因为 `tests`  数组里的元素都是函数，所以这里使用参数  `test`  时也是把它当作函数来使用的。因此才会看到有 `test(number)` 这样的语句。

关于 `some()` 方法，MDN 上给了一个更加简单的例子，来帮助理解这其中的参数传导：

```javascript
function isBigEnough(element, index, array) {
  return (element >= 10);
}
var passed = [2, 5, 8, 1, 4].some(isBigEnough);
// passed is false
passed = [12, 5, 8, 1, 4].some(isBigEnough);
// passed is true
```

明白了整个算法的结构，其实在 `tests` 中定义的检测函数，也都非常巧妙。 

-   形如 [1234, 8765] 这类数，把被检测数转化成 `RegExp` 逆向使用正则表达式；
-   `n+''` 把数字转化成数组；
-   检测 palindrome 回文数，使用 `reverse()` 方法，判断反转后是否相等。