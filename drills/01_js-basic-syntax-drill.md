# JavaScript 構文基礎ドリル（ES6+）

対象：React / Next.js 経験者向け
目的：JavaScript 構文の基礎を整理し直す

---

## 問題 1：const / let

次のコードがエラーなく動作するように修正してください。

```js
// ユーザー名を後から変更したい
const userName = "Taro";

userName = "Jiro";

console.log(userName);
```

<details>
<summary>模範解答・解説</summary>

```js
let userName = "Taro";
userName = "Jiro";
console.log(userName);
```

`const` は再代入不可。値を変更したい場合は `let` を使う。

</details>

---

## 問題 2：var と let（スコープ）

次のコードは意図した挙動になりません。原因を理解したうえで修正してください。

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
```

期待する出力：

```
0
1
2
```

<details>
<summary>模範解答・解説</summary>

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
```

`var` は関数スコープのため、`setTimeout` 実行時には `i` がすでに `3` になっている。
`let` はブロックスコープなので、ループごとに別の `i` が保持される。

</details>

---

## 問題 3：アロー関数

次の関数をアロー関数で書き換えてください。

```js
function add(a, b) {
  return a + b;
}
```

<details>
<summary>模範解答</summary>

```js
const add = (a, b) => a + b;
```

</details>

---

## 問題 4：return の欠落

次のコードは `undefined` を返します。正しく動作するように修正してください。

```js
const double = (n) => {
  n * 2;
};

console.log(double(5)); // 10 を期待
```

<details>
<summary>模範解答・解説</summary>

```js
const double = (n) => {
  return n * 2;
};

console.log(double(5));
```

波括弧 `{}` を使う場合は `return` を明示する必要がある。

</details>

---

## 問題 5：配列操作（filter / map）

`numbers` 配列から「偶数だけを 2 倍した配列」を作ってください。

```js
const numbers = [1, 2, 3, 4, 5, 6];
```

期待する出力：

```js
[4, 8, 12];
```

<details>
<summary>模範解答</summary>

```js
const result = numbers.filter((n) => n % 2 === 0).map((n) => n * 2);

console.log(result);
```

</details>

---

## 問題 6：map の落とし穴

次のコードはエラーになります。修正してください。

```js
const users = [
  { name: "Taro", age: 20 },
  { name: "Jiro", age: 30 },
];

const names = users.map((user) => {
  name: user.name;
});

console.log(names);
```

<details>
<summary>模範解答・解説</summary>

```js
const names = users.map((user) => user.name);
```

`{}` を使う場合は `return` が必要。
1 行で値を返す場合は省略形が使える。

</details>

---

## 問題 7：分割代入

分割代入を使って `title` と `price` を取り出してください。

```js
const book = {
  title: "JavaScript Guide",
  price: 2800,
};
```

<details>
<summary>模範解答</summary>

```js
const { title, price } = book;
```

</details>

---

## 問題 8：イミュータブルな更新

次の `user` オブジェクトを直接変更せず、`age` を 21 にした新しいオブジェクトを作ってください。

```js
const user = {
  id: 1,
  name: "Taro",
  age: 20,
};
```

<details>
<summary>模範解答・解説</summary>

```js
const updatedUser = {
  ...user,
  age: 21,
};
```

React の state 更新と同じく、オブジェクトは直接変更しない。

</details>

---

## 問題 9：truthy / falsy

次のコードが `true` を出力する理由を説明し、必要であれば修正してください。

```js
const value = "0";

if (value) {
  console.log("true");
} else {
  console.log("false");
}
```

<details>
<summary>模範解答・解説</summary>

```js
// "0" は文字列なので truthy
```

```js
Boolean("0"); // true
Boolean(0); // false
```

数値として判定したい場合は型変換が必要。

</details>

---

## 問題 10：破壊的変更

次の関数は引数の配列を直接変更しています。非破壊的に修正してください。

```js
const addItem = (items, item) => {
  items.push(item);
  return items;
};
```

<details>
<summary>模範解答・解説</summary>

```js
const addItem = (items, item) => {
  return [...items, item];
};
```

`push` は破壊的変更。スプレッド構文で新しい配列を作る。

</details>

---

以上。
