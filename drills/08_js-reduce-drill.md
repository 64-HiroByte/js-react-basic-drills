# reduce 集中特訓（ES6+）

対象：React / Next.js 経験者
目的：reduce を「書ける」だけでなく「なぜそう書くか説明できる」状態にする

> **関連ドリル**: map / filter については **07_js-map-filter-drill.md** を参照

---

## このドリルの狙い

- reduce を **構造で理解する**
- 初期値・acc・current の役割を説明できる
- React の state 初期化・更新ロジックと直結させる

---

## reduce の基本形（超重要）

reduce は次の形に**必ず分解**してください。

```js
array.reduce((acc, current) => {
  // acc をどう更新するか
  return acc;
}, 初期値);
```

- acc = 最終的に欲しい形
- 初期値 = acc の型を決める

---

# 🔹 基礎編

## 問題 1：合計値を求める

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

## 問題 2：初期値の重要性

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

# 🔹 オブジェクトを作る reduce

## 問題 3：配列 → オブジェクト

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

## 問題 4：groupBy（頻出）

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
  acc[user.role].push(user.name);
  return acc;
}, {});
```

実務で非常によく使う reduce パターン。

</details>

---

## 問題 5：カウント集計（頻出）

```js
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

// 各フルーツの出現回数を集計
// 期待される出力: { apple: 3, banana: 2, orange: 1 }
```

<details>
<summary>模範解答</summary>

```js
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
```

### 処理の流れ

| 回 | fruit | acc[fruit] 現在値 | 更新後 |
|:--:|:-----:|:-----------------:|:------:|
| 1 | apple | undefined → 0 | { apple: 1 } |
| 2 | banana | undefined → 0 | { apple: 1, banana: 1 } |
| 3 | apple | 1 | { apple: 2, banana: 1 } |
| 4 | orange | undefined → 0 | { apple: 2, banana: 1, orange: 1 } |
| 5 | banana | 1 | { apple: 2, banana: 2, orange: 1 } |
| 6 | apple | 2 | { apple: 3, banana: 2, orange: 1 } |

`(acc[fruit] || 0)` は「存在すればその値、なければ 0」を意味する。

</details>

---

# 🔹 配列を作る reduce

## 問題 6：map + filter を reduce で書く

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

### 補足：push の戻り値に注意

```js
// NG: 1行で書くとエラーになる
const result = numbers.reduce((acc, n) => acc.push(n * 2), []);
// push() の戻り値は「配列の長さ」なので acc が数値になってしまう

// 無理矢理1行で書くならスプレッド構文（非推奨：毎回新配列を作るためパフォーマンスが悪い）
numbers.reduce((acc, n) => [...acc, n * 2], []);
```

</details>

---

# 🔹 React 実務直結

## 問題 7：イミュータブル更新（reduce 版）

```js
const cart = [
  { id: 1, count: 1 },
  { id: 2, count: 2 },
];

// id === 2 の count を +1（reduce を使って）
```

<details>
<summary>模範解答・解説</summary>

**reduce を使った解答**:

```js
const updatedCart = cart.reduce((acc, item) => {
  if (item.id === 2) {
    acc.push({ ...item, count: item.count + 1 });
  } else {
    acc.push(item);
  }
  return acc;
}, []);
```

**実務では map を使うのが一般的**:

```js
const updatedCart = cart.map((item) =>
  item.id === 2 ? { ...item, count: item.count + 1 } : item
);
```

### reduce vs map の使い分け

| 処理内容 | 推奨 |
|---------|-----|
| 要素数が変わらない変換 | map |
| 要素数が変わる or 集約する | reduce |

この問題は「全要素を変換」なので map がシンプル。reduce は「何でもできる」が、適切なメソッドを選ぶことが重要。

</details>

---

## 問題 8：state 初期化ロジック

```js
const fields = ["name", "email", "password"];

// { name: "", email: "", password: "" } を作る
```

<details>
<summary>模範解答</summary>

```js
const initialState = fields.reduce((acc, field) => {
  acc[field] = "";
  return acc;
}, {});
```

React のフォーム初期値を動的に生成する際によく使うパターン。

</details>

---

以上。
