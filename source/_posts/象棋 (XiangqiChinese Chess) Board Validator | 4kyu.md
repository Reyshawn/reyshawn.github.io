---
title: '象棋 (Xiangqi/Chinese Chess) Board Validator | 4kyu'
date: 
tags:
- Algorithm
- codewars
- JavaScript
categories: 
- Coding
---

## Details

Your friend recently has shown you some chess puzzles he found somewhere. It's not your ordinary chess: but the mysterious, distinct relative of chess, the legendary [象棋](http://www.wikiwand.com/en/Xiangqi), also known as Xiangqi/Chinese chess! As a Chinese, you know that your friend doesn't know anything in Chinese besides recognizing a few sigils (for example, he doesn't know what is `七步擒士` or `雙馬飲泉`), so it's probably likely that the "puzzles" he got is actually bogus, and the pieces are not placed properly. However, you don't want to actually teach him Xiangqi either (yet), so the best tactic you could come up with is to write a validator program and let your friend use it instead of using you.

------

You will be given an ASCII board. Xiangqi board is 9 tiles wide and 10 tiles high, with the pieces placed as follows:

```
Example (the starting Xiangqi board):

車馬象士將士象馬車
　　　｜Ｘ｜　　　
　砲　＋－＋　砲　
卒　卒　卒　卒　卒
－－－－－－－－－
－－－－－－－－－
兵　兵　兵　兵　兵
　炮　＋－＋　炮　
　　　｜Ｘ｜　　　
俥傌相仕帥仕相傌俥

The bottom and top half corresponds to red and black pieces, respectively.
Note that red and black have different characters to distinguish the same piece of both sides.
```

Your function, `chessValidator`, should determine whether the pieces in argument `board` are placed legally. Unlike the chess you're familiar with, there are restrictions as to where the various chess pieces can be at:

<!--more-->

```
俥/車, 傌/馬, 炮/砲 (2 max): no restrictions

相/象 (2 max): they can only stay at 7 spots at their side of the board:
－－Ｏ－－－Ｏ－－
　　　　　　　　　
Ｏ　　＋Ｏ＋　　Ｏ
　　　｜Ｘ｜　　　
　　Ｏ＋－＋Ｏ　　
Don't let them go to the other side of the board: it's called 飛象過河, which is bad and you should feel bad about it.

仕/士 (2 max): they can only stay at the center or the 4 corners of the 3x3 "palace" (九宮):
－－－－－－－－－
　　　　　　　　　
　　　Ｏ－Ｏ　　　
　　　｜Ｏ｜　　　
　　　Ｏ－Ｏ　　　

帥/將 (always 1): they can stay at every tile inside the palace, and nowhere else:
－－－－－－－－－
　　　　　　　　　
　　　＋－＋　　　
　　　｜Ｘ｜　　　
　　　＋－＋　　　    // anywhere inside this 3x3 block is okay
Because they are your "kings" in Xiangqi, it is mandatory that one and only one exists.

Additionally, 帥/將 cannot face each other vertically without any pieces inbetween:
　　　＋將＋　　　
　　　｜Ｘ｜　　　
　　　＋－＋　　　
　　　　　　　　　
－－－－－－－－－
－－－－－－－－－
　　　　　　　　　
　　　＋帥＋　　　
　　　｜Ｘ｜　　　
　　　＋－＋　　　  // this is illegal because they're directly facing each other at the same column


兵/卒 (5 max): at their starting positions (look at the above starting board), they can only move forward. However, once they reached the other side, they can move sideways as well as moving forward, at least until they reach the last row of the opponent side (no falling back, though!):
　　　　　　　　　
－－－－兵－－－－
－－－－－－－－兵
兵　　　　　　　　
The left and right 兵s can do nothing but moving forward. The center one, however, can move sideways since it has crossed the center line.

(By the way, there is no such thing as pawn promotion in Xiangqi.)
```

------

You program should validate that:

- Number of pieces of each side is within their respective limits
- The pieces are placed in a legal position
- Said configuration is legal (in respect to 帥/將 and 兵/卒 rules). Note that we don't care about whether it is practically reachable in-game, Xiangqi endgame puzzles can be pretty ridiculous at piece placements, and you might even start out being checked. We only care about whether it is legal. For example:

```
－－－－兵－兵－兵
兵－－－－－－－－
兵
```

would be illegal because 兵 cannot move sideways before they go across the center row, which means the above configuration is fundamentally impossible.

You can assume that the board will always be well-formatted. Always assume red is at the bottom.

See example test cases for some examples.

 ## My Solution

```javascript
function chessValidator(board) {
    let b = board.split('\n').map(x => x.split(''));

    // check the number of 俥/車, 傌/馬, 炮/砲
    let chariot1 = chessIndex(b, '車');
    let chariot2 = chessIndex(b, '俥');
    let horse1 = chessIndex(b, '馬');
    let horse2 = chessIndex(b, '傌');
    let cannon1 = chessIndex(b, '砲');
    let cannon2 = chessIndex(b, '炮');

    let elep1 = chessIndex(b, '象');
    let elep2 = chessIndex(b, '相');

    let advisor1 = chessIndex(b, '士');
    let advisor2 = chessIndex(b, '仕');

    let two = [chariot1, chariot2, horse1, horse2,cannon1,cannon2, elep1, elep2, advisor1, advisor2];
    for (var i = 0; i < two.length; i++) {
        if (two[i].length > 2) {
            console.log('over two pieces for the same kind')
            return false;
        }
    }

    // 相/象
    let elep1T = [[0,2], [0,6], [2,0], [2,4], [2,8], [4,2], [4,6]];
    let elep2T = [[9,2], [9,6], [7,0], [7,4], [7,8], [5,2], [5,6]];


    for (var i = 0; i < elep1.length; i++) {
        if(!isArrayInArray(elep1T,elep1[i])) {
            console.log('象 at the wrong position')
            return false;
        }
    }
    for (var i = 0; i < elep2.length; i++) {
        if(!isArrayInArray(elep2T,elep2[i])) {
            console.log('相 at the wrong position')
            return false;
        }
    }

    // 仕/士
    let advisor1T = [[0,3], [0,5], [1,4], [2,3], [2,5]]
    let advisor2T = [[9,3], [9,5], [8,4], [7,3], [7,5]]


    for (var i = 0; i < advisor1.length; i++) {
        if(!isArrayInArray(advisor1T,advisor1[i])) {
            console.log('士 at the wrong position')
            return false;
        }
    }
    for (var i = 0; i < advisor2.length; i++) {
        if(!isArrayInArray(advisor2T,advisor2[i])) {
            console.log('仕 at the wrong position')
            return false;
        }
    }

    // 兵/卒
    let soldier1 = chessIndex(b, '卒');
    let soldier2 = chessIndex(b, '兵');
    for (var i = 0; i < soldier1.length; i++) {
        if (soldier1[i][0] < 3) {
            console.log('卒 at the wrong position')
            return false;
        } else if(soldier1[i][0] < 5 && soldier1[i][1] % 2 === 1 ) {
            console.log('卒 at the wrong position')
            return false;
        }
    }

    for (var i = 0; i < soldier2.length; i++) {
        if (soldier2[i][0] > 6) {
            console.log('兵 at the wrong position')
            return false;
        } else if(soldier2[i][0] > 4 && soldier2[i][1] % 2 === 1 ) {
            console.log('兵 at the wrong position')
            return false;
        }
    }

    for (var i = 0; i < 9; i++) {
        if(b[3][i] === '卒' && b[4][i] === '卒') {
            console.log('卒 at the wrong position')
            return false;
        }
        if(b[5][i] === '兵' && b[6][i] === '兵') {
            console.log('兵 at the wrong position')
            return false;
        }
    }

    // 帥/將
    let general1 = chessIndex(b, '將');
    let general2 = chessIndex(b, '帥');
    if (general1.length !== 1 || general2.length !== 1) {
        console.log( '帥/將 lost ')
        return false;
    }
    if (general1[0][0] > 2 ||
        general1[0][1] < 3 ||
        general1[0][1] > 5 ||
        general2[0][0] < 7 ||
        general2[0][1] < 3 ||
        general2[0][1] > 5) {
        console.log( '帥/將 at the wrong position ')
        return false;
    }

    if(general1[0][1] === general2[0][1]) {
        let k = general1[0][1]
        for (var i = general1[0][0]+1; i < general2[0][0]; i++) {
            if (b[i][k] !== 'Ｘ' &&
                b[i][k] !== '－' &&
                b[i][k] !== '　' &&
                b[i][k] !== '｜' &&
                b[i][k] !== '＋') {
                break;
            }
        }
        if(i === general2[0][0]) {
            console.log('帥/將 are directly facing each other at the same column')
            return false;
        }
    }

    //if a flipped starting board

    return true;
}

function chessIndex(b, s) {
    let res = [];
    for (var i = 0; i < b.length; i++) {
        let k = -1;
        while((k = b[i].indexOf(s,k+1)) !== -1) {
            res.push([i,k]);
        }
    }
    return res;
}

function isArrayInArray(arr, item){
  var item_as_string = JSON.stringify(item);

  var contains = arr.some(function(ele){
    return JSON.stringify(ele) === item_as_string;
  });
  return contains;
}
```

主要讲一下重复用到的两个 function 吧，一个是 `chessIndex()` 来得到棋盘上某个棋子的坐标，输出的是一个二维 array。另一个 `isArrayInArray(arr, item)` ，arr 是一个二维 array，item 是一个 array，检测 item 是否再 arr 里面。

`chessIndex()` 难点在与处理一行内重复的元素。比如:

```javascript
>a = a.split("")
[ '　', '砲', '　', '＋', '－', '＋', '　', '砲', '　' ]
>a.indexOf('砲')
1
>a.indexOf('砲',2)
7
>
```

这里 array 中含有两个 `'砲'`。要获取第二个 `'砲'`，就要给 `indexOf()` 加上第二个参数。

`isArrayInArray()` 方法中用到 `JSON.stringfy`：

```javascript
>a = [[1,2],[2,3]]
[ [ 1, 2 ], [ 2, 3 ] ]
>JSON.stringify(a)
'[[1,2],[2,3]]'
>obj = { "name":"John", "age":30, "city":"New York"};
{ name: 'John', age: 30, city: 'New York' }
>JSON.stringify(obj)
'{"name":"John","age":30,"city":"New York"}'
>obj = { "name":"John", "today":new Date(), "city":"New York"};
{ name: 'John',
  today: 2018-06-10T03:44:24.742Z,
  city: 'New York' }
>JSON.stringify(obj)
'{"name":"John","today":"2018-06-10T03:44:24.742Z","city":"New York"}'
> obj = { "name":"John", "age":function () {return 30;}, "city":"New York"};
{ name: 'John', age: [Function: age], city: 'New York' }
>JSON.stringify(obj)
'{"name":"John","city":"New York"}'
>obj.age = obj.age.toString()
'function () {return 30;}'
>obj 
{ name: 'John',
  age: 'function () {return 30;}',
  city: 'New York' }
>JSON.stringify(obj)
'{"name":"John","age":"function () {return 30;}","city":"New York"}'
>
```

上面的例子，后面一大部分摘自 [JSON.stringify()](https://www.w3schools.com/js/js_json_stringify.asp)，可以看到，可以把  array，object 等直接转化成 string。最后两个例子是讲，如果 object 中包含函数，则会被忽略。

用到了 `some()` 方法，[MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) 给出的解释：

> The `some()` method tests whether at least one element in the array passes the test implemented by the provided function.

上述两个函数方法的构造是关键。在这两个函数的基础上，对棋盘的棋子进行依此按照相应的的规则进行检测，剩下的只是一些比较繁琐的工作，和细节上的修饰。

