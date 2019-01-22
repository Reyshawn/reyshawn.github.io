---
title: '@wraps | 6kyu'
date: 
tags:
- Algorithm
- codewars
- JavaScript
categories: 
- Coding
---

## 要点

- `decorator` 装饰器用法
- `try`...`except`... `else` control flow
- `getattr()` 和 `setattr()`
- `__dict__.update()`

## Details

Implement the functools.wraps decorator, which is used to preserve the name and docstring of a decorated function. Your decorator must not modify the behavior of the decorated function. Here's an example :

```python
def identity(func):
  @wraps(func)
  def wrapper(*args, **kwargs):
    """Wraps func"""
    return func(*args, **kwargs)
  return wrapper

@identity
def return_one():
  """Return one"""
  return 1

return_one.__name__ == 'return_one' # If wraps hadn't been used, __name__ would be equal to 'wrapper'
return_one.__doc__ == 'Return one' # If wraps hadn't been used, __doc__ would be equal to 'Wraps func'
```

**Note: of course, you may not use the functools module for this kata.**

题目要求，经过一次二重的装饰器，保留原来函数的 `__name__` 和 `__doc__`。二重装饰器 decorator，就是用一个 decorator 去 decorate 另一个 decorator。该二重装饰器装饰后的函数， 输出的是一重装饰器装饰过的函数，但是 `__name__` 和 `__doc__`  得到保留，及为原函数的值。

依照题目给的例子，就是输出是被 decorator wraps 修饰过的 `wrapper` 函数，即函数主体和功能还是 `wrapper`，但因为被 `wraps` 装饰了，输出的 `wrapper` 函数的  `__name__` 和 `__doc__`  值为原函数 `return_one` 的值。

<!--more-->

## My Solution

```python
def wraps(func):
    def first(wrapper):
        return func
    return first
```

我的这个方法，其实是不正确的。因为我这个经过几次 decorate 又输出了原函数，按道理应该是输出 `wrapper` 函数的。

## Other Solution

 [siebenschlaefer](https://www.codewars.com/users/siebenschlaefer)

```python
def wraps(wrapped):
    def wrapper(func):
        for attr in ('__module__', '__name__', '__qualname__', '__doc__', '__annotations__'):
            try:
                value = getattr(wrapped, attr)
            except AttributeError:
                pass
            else:
                setattr(func, attr, value)
        func.__dict__.update(getattr(wrapped, attr, {}))
        func.__wrapped__ = wrapped
        return func
    return wrapper
```

首先注意一下对应关系。经过一次二重的装饰后，
`wrapped` ➡️ `return_one`
`func` ➡️ `wrapper`

目标是输出 `func` ，但要把 `func` 的 `__name__` 和 `__doc__` 进行修改。修改这些 built-in 的值用到了 `getattr()` 和 `setattr()`。

>You use them if the attribute you want to access is a variable and not a literal string. They let you parameterize attribute access/setting.
>
>There's no reason to do `getattr(x, 'foobar')`, but you might have a variable called `attr` that could be set to "foobar" or "otherAttr", and then do `getattr(x, attr)`.

`try`…`except`… `else`，`else` 后面是当 `try` 中的内容无错误时才执行的，否则时执行 `except` 中的内容。

>`try`:
>	Normal execution block
>`except` A:
>	Exception A handle
>`except` B:
>	Exception B handle
>`except`:
>	Other exception handleelse:
>`else`:
>	if no exception,get here
>`finally`:
>	print("finally")   

 [Voile](https://www.codewars.com/users/Voile)

```python
def wraps(func):
    def f(g):
        g.__name__ = func.__name__
        g.__doc__ = func.__doc__
        return g
    return f
```

Voile 的解法更简洁。

参考文章：

- [Why use setattr() and getattr() built-ins?](https://stackoverflow.com/questions/19123707/why-use-setattr-and-getattr-built-ins)