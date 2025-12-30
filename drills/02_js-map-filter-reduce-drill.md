# map / filter / reduce 集中特訓（ES6+）

対象：React / Next.js 経験者
目的：配列操作を「書ける・説明できる」状態にする

---

## このドリルの狙い

- map / filter / reduce を **役割で使い分ける**
- `{}` と `return` の罠を完全に潰す
- React の state 更新・描画ロジックと直結させる

---

# 🔹 map 基礎編

## 問題 1：基本の map

```js
const numbers = [1, 2, 3, 4];

// 各要素を 2 倍した配列を作る
```

<details>
<summary>模範解答</summary>

```js
const result = numbers.map((n) => n * 2);
```

</details>

---

## 問題 2：map + アロー関数省略形

```js
const users = [
  { id: 1, name: "Taro" },
  { id: 2, name: "Jiro" },
];

// name だけの配列を作る
```

<details>
<summary>模範解答</summary>

```js
const names = users.map((user) => user.name);
```

</details>

---

## 問題 3：map の return 忘れ

次のコードを修正してください。

```js
const numbers = [1, 2, 3, 4];
const result = numbers.map((n) => {
  n * 2;
});
```

<details>
<summary>模範解答・解説</summary>

```js
const result = numbers.map((n) => n * 2);
```

`{}` を使う場合は `return` が必要。省略形なら不要。

</details>

---

## 問題 4：オブジェクトを返す map

```js
const products = [
  { name: "Apple", price: 100 },
  { name: "Banana", price: 200 },
];

// { label: "Apple", price: 100 } の形に変換する
```

<details>
<summary>模範解答・解説</summary>

```js
const result = products.map((product) => ({
  label: product.name,
  price: product.price,
}));
```

オブジェクトを即時返す場合は `({ ... })` と丸括弧で囲む。

### ポイント: アロー関数でオブジェクトを返す

```
(product) => ({ ... })
//           ↑ この括弧が重要
オブジェクトの{}をそのまま書くと関数のブロックと解釈されるため、括弧()で囲む必要があります。

// NG: {}がブロックとして解釈される
(product) => { label: product.name }

// OK: ()で囲むとオブジェクトリテラルになる
(product) => ({ label: product.name })
```

</details>

---

# 🔹 filter 基礎編

## 問題 5：基本の filter

```js
const numbers = [1, 2, 3, 4, 5, 6];

// 偶数だけを抽出する
```

<details>
<summary>模範解答</summary>

```js
const result = numbers.filter((n) => n % 2 === 0);
```

</details>

---

## 問題 6：条件式の書き方

```js
const users = [
  { name: "Taro", age: 20 },
  { name: "Jiro", age: 30 },
  { name: "Saburo", age: 15 },
];

// 20歳以上のユーザーだけ残す
```

<details>
<summary>模範解答</summary>

```js
const adults = users.filter((user) => user.age >= 20);
```

</details>

---

## 問題 7：filter の戻り値

次のコードの意図を説明し、必要であれば修正してください。

```js
const numbers = [1, 2, 3, 4];
const result = numbers.filter((n) => n * 2);
```

<details>
<summary>模範解答・解説</summary>

```js
// n * 2 は 0 以外すべて truthy になるため条件として不適切
const result = numbers.filter((n) => n % 2 === 0);
```

filter は「true / false」を返す関数を書く必要がある。

</details>

---

# 🔹 map + filter 合わせ技

## 問題 8：よくある実務パターン

```js
const numbers = [1, 2, 3, 4, 5, 6];

// 偶数だけを 2 倍した配列を作る
```

<details>
<summary>模範解答</summary>

```js
const result = numbers.filter((n) => n % 2 === 0).map((n) => n * 2);
```

</details>

---

# 🔹 reduce 基礎編

## 問題 9：合計値を求める

```js
const numbers = [1, 2, 3, 4];

// 合計を求める
```

<details>
<summary>模範解答</summary>

```js
const sum = numbers.reduce((acc, n) => acc + n, 0);
```

## 詳説

**reduce は配列を 1 つの値に集約するメソッドです。**

### 基本構文

```js
array.reduce((accumulator, currentValue) => 処理, 初期値);
```

|       引数        | 説明                           |
| :---------------: | :----------------------------- |
| accumulator (acc) | 累積値。前回の処理結果が入る   |
| currentValue (n)  | 現在処理中の要素               |
|      初期値       | acc の最初の値（この例では 0） |

### 処理の流れを追う

```js
const numbers = [1, 2, 3, 4];
numbers.reduce((acc, n) => acc + n, 0);
```

|   回   | acc |  n  | acc + n | 次の acc へ |
| :----: | :-: | :-: | :-----: | :---------: |
| 1 回目 |  0  |  1  |  0 + 1  |      1      |
| 2 回目 |  1  |  2  |  1 + 2  |      3      |
| 3 回目 |  3  |  3  |  3 + 3  |      6      |
| 4 回目 |  6  |  4  |  6 + 4  |     10      |

最終的な acc の値 10 が reduce の戻り値になります。

### 初期値の重要性

```js
// 初期値あり（推奨）
[1, 2, 3].reduce((acc, n) => acc + n, 0); // 0 + 1 + 2 + 3 = 6

// 初期値なし（配列の最初の要素がaccになる）
[1, 2, 3].reduce((acc, n) => acc + n); // 1 + 2 + 3 = 6

// 空配列の場合
[].reduce((acc, n) => acc + n, 0); // 0（初期値が返る）
[].reduce((acc, n) => acc + n); // エラー！初期値がないと失敗
```

**初期値は必ず指定するのがベストプラクティスです。**

### よくある使用例

```js
// 合計
[1, 2, 3].reduce((acc, n) => acc + n, 0); // 6

// 最大値
[1, 5, 3].reduce((acc, n) => Math.max(acc, n), -Infinity); // 5

// 配列をオブジェクトに変換
["a", "b"].reduce((acc, v, i) => ({ ...acc, [v]: i }), {});
// { a: 0, b: 1 }

// 配列のフラット化
[
  [1, 2],
  [3, 4],
].reduce((acc, arr) => [...acc, ...arr], []);
// [1, 2, 3, 4]
```

### map/filter との違い

| メソッド | 入力 | 出力                                   |
| :------: | :--: | :------------------------------------- |
|   map    | 配列 | 同じ長さの配列                         |
|  filter  | 配列 | 同じか短い配列                         |
|  reduce  | 配列 | 何でも（数値、文字列、オブジェクト等） |

reduce は最も汎用的で、実は map や filter も reduce で実装できます。

</details>

---

## 問題 10：初期値の重要性

次の reduce の問題点を説明してください。

```js
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, n) => acc + n);
```

<details>
<summary>模範解答・解説</summary>

```js
// 初期値がないと空配列の場合にエラーになる
```

reduce は初期値を指定するのが安全。

</details>

---

## 問題 11：配列 → オブジェクト

```js
const users = [
  { id: 1, name: "Taro" },
  { id: 2, name: "Jiro" },
];

// { 1: "Taro", 2: "Jiro" } に変換する
```

<details>
<summary>模範解答</summary>

```js
const result = users.reduce((acc, user) => {
  acc[user.id] = user.name;
  return acc;
}, {});
```

</details>

---

## 問題 12：groupBy（頻出）

```js
const users = [
  { name: "Taro", role: "admin" },
  { name: "Jiro", role: "user" },
  { name: "Hanako", role: "admin" },
];

// role ごとにグループ化する
// 期待される出力
// { admin: [ 'Taro', 'Hanako' ], user: [ 'Jiro' ] }
```

<details>
<summary>模範解答・解説</summary>

```js
const grouped = users.reduce((acc, user) => {
  if (!acc[user.role]) {
    acc[user.role] = [];
  }
  acc[user.role].push(user);
  return acc;
}, {});
```

実務で非常によく使う reduce パターン。

</details>

---

## 問題 13：map + filter を reduce で書く練習

```js
const numbers = [1, 2, 3, 4, 5, 6];

// 偶数だけを 2 倍した配列を reduce で作る
```

<details>
<summary>模範解答</summary>

```js
const result = numbers.reduce((acc, n) => {
  if (n % 2 === 0) {
    acc.push(n * 2);
  }
  return acc;
}, []);
```

</details>

---

## 問題 14：イミュータブル更新

```js
const cart = [
  { id: 1, count: 1 },
  { id: 2, count: 2 },
];

// id === 2 の count を +1
```

<details>
<summary>模範解答・解説</summary>

```js
const updatedCart = cart.map((item) =>
  item.id === 2 ? { ...item, count: item.count + 1 } : item
);
```

React の state 更新で最頻出の書き方。

</details>

---

以上。
