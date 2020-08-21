---
title: "Adding Code"
draft: false
weight: 3
---

Code can be defined with the simple "triple backtick" blocks and will be magically syntax-highlighted for you. For example, this:

````markdown
```javascript
function fibonacci(num){
  var a = 1, b = 0, temp;

  while (num >= 0){
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
}
```
````

Will be rendered like this:

```javascript
function fibonacci(num){
  var a = 1, b = 0, temp;

  while (num >= 0){
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
}
```