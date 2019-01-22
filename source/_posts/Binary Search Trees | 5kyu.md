---
title: 'Binary Search Trees | 5kyu'
date: 
tags:
- Algorithm
- codewars
- Python
categories: 
- Coding
---

## 要点

- `__str__()` 的几种定义方法：如  `"%s" % value`  和 `'{}'.format()`
- A `and` B `and` C
- `if`  … `else` 单行语句
- `for` … `in` 单行语句
- `join()` 函数
- `str()` 函数与 `__str__()` 方法



## Details

A `Tree` consists of a root, which is of type `Node`, and possibly a left subtree of type `Tree` and possibly a right subtree of type `Tree`. If the left subtree is present, then all its nodes are less than the parent tree's root and if the right tree is present, then all its nodes are greater than the parent tree's root. In this kata, classes `Tree` and `Node` have been provided. However, the methods `__eq__`, `__ne__`, and `__str__` are missing from the `Tree` class. Your job is to provide the implementation of these methods. The example test cases should provide enough information to implement these methods correctly.

As an illustrative example, here is the string representation of a tree that has two nodes, 'B' at the root and 'C' at the root of the right subtree. The left subtree is missing and the right subtree is a leaf, i.e., has no subtrees: 

```python
'[_ B [C]]'
```

This tree is obtained by evaluating the following expression:

```python
Tree(Node('B'), None, Tree(Node('C'))))
```

Notice in particular that when one subtree, but not both, is missing, an underscore is in its place, a single space separates the root node from the subtrees, and when both subtrees are missing, the root node is enclosed in brackets.

<!--more-->

## My Solution

```python
class Tree(object):

    def __init__(self, root, left=None, right=None):
        assert root and type(root) == Node
        if left: assert type(left) == Tree and left.root < root
        if right: assert type(right) == Tree and root < right.root

        self.left = left
        self.root = root
        self.right = right

    def is_leaf(self):
        return not(self.left or self.right)


    def __str__(self):
        rep = '['
        if self.left is not None:
            rep += self.left.__str__() + ' '
        elif self.right is not None:
            rep += '_ ' + self.root.__str__() + ' ' + self.right.__str__()
            return rep + ']'
        rep += self.root.__str__()
        if self.right is not None:
            rep += ' ' + self.right.__str__()
        elif self.left is not None:
            rep = self.left.__str__() + ' ' + self.root.__str__() + ' _'
            return rep + ']'
        return rep + ']'


    def __eq__(self, other):
        if (self is None) and (other is None):
            return True
        if self and other and self.root == other.root:
            return (self.left == other.left) and (self.right == other.right)
        else:
            return False

    def __ne__(self, other):
        return not self == other


class Node(object):

    def __init__(self, value, weight=1):
        self.value = value
        self.weight = weight

    def __str__(self):
        return str(self.value)

    def __lt__(self, other):
        return self.value < other.value

    def __gt__(self, other):
        return self.value > other.value

    def __eq__(self, other):
        return self.value == other.value

    def __ne__(self, other):
        return self.value != other.value
```

## Other Solution

 [siebenschlaefer](https://www.codewars.com/users/siebenschlaefer)

```python
class Tree(object):
	# ... 其余重复部分省略
    def __str__(self):
        if self.is_leaf():
            return "[%s]" % self.root
        return "[%s %s %s]" % (
            self.left if self.left else "_",
            self.root,
            self.right if self.right else "_")

    def __eq__(self, other):
        if not other:
            return False
        return (
            self.root == other.root and
            self.left == other.left and
            self.right == other.right)

    def __ne__(self, other):
        return not (self == other)
    
# ... 其余重复部分省略
```

这个在 `__str__()` 部分写得异常简洁，并且利用到了 `is_leaf()` 方法。如果  `is_leaf()` 返回值为 `True`，则说明 self 没有 left 和 right。还有 `if` 的单行写法，也要学会使用。

`__eq__()` 方法的 `and` 连续使用，要用括号括起来。

[Voile](https://www.codewars.com/users/Voile)

```python
class Tree(object):
    
    def __init__(self, root, left=None, right=None):
        assert root and type(root) == Node
        if left: assert type(left) == Tree and left.root < root
        if right: assert type(right) == Tree and root < right.root

        self.left = left
        self.root = root
        self.right = right
        
    def is_leaf(self):
        return not(self.left or self.right)
        
    
    def __str__(self):
        if type(self.left) != Tree and type(self.right) != Tree: return '[{}]'.format(self.root)
        if type(self.left) == Tree and type(self.right) == Tree: return '[{} {} {}]'.format(self.left, self.root, self.right)
        return '[{}]'.format(' '.join(str(v) if v else '_' for v in [self.left, self.root, self.right]))
    
    def __eq__(self, other):
        if self.root != other.root: return False
        if type(self.left) != type(other.left): return False
        if type(self.right) != type(other.right): return False
        return self.left == other.left and self.right == other.right
    
    def __ne__(self, other):
        return not self == other

```

Voile 在 `__str__()` 中用的 return 形式是 `'[{}]'.format()`，也是分了三种情况。注意第三种的单行写法，形如：

```python
>>> ' '.join(str(v) if v else '_' for v in [1, 0, 3])
'1 _ 3'
>>> ''.join(str(v) if v else '_' for v in [1, 0, 3])
'1_3'
```

`__eq__()` 写法思路和我的写法差不多，都是在保证 `self.root == other.root` 的情况下，输出一个 `and` 并列语句，`self.left == other.left and self.right == other.right`。当然，他这里用 `type` 来判断是否是 Node 还是 None。

 [brettso](https://www.codewars.com/users/brettso)

```python
class Tree(object):
    
    def __init__(self, root, left=None, right=None):
        assert root and type(root) == Node
        if left: assert type(left) == Tree and left.root < root
        if right: assert type(right) == Tree and root < right.root

        self.left = left
        self.root = root
        self.right = right
        
    def is_leaf(self):
        return not(self.left or self.right)
        
    
    def __str__(self):
        if self.is_leaf():
            return '[' + self.root.value + ']'
        left = "_" if not self.left else self.left.__str__()
        right = "_" if not self.right else self.right.__str__()
        return '[' + left + ' ' + self.root.value + ' ' + right + ']'    
        
    
    def __eq__(self, other):
        return self.__str__() == other.__str__()

    
    def __ne__(self, other):
        return self.__str__() != other.__str__()
```

这个 `__eq__()` 的写法很巧妙啊，直接利用了 `__str__()` 来进行判断。