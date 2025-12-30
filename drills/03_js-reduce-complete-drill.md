# reduce 完全攻略ドリル（思考トレーニング）

**保存用ファイル名：`js-reduce-complete-drill.md`**

対象：React / Next.js 経験者
目的：reduce を「書ける」だけでなく「なぜそう書くか説明できる」状態にする

---

## このドリルの考え方（超重要）

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

# 🔹 Step 1：reduce の超基礎

## 問題 1：合計（基本中の基本）

```js
const numbers = [1, 2, 3, 4];

// 合計を reduce で求める
```

<details>
<summary>模範解答</summary>

```js
const sum = numbers.reduce((acc, n) => acc + n, 0);
```

</details>

---

## 問題 2：初期値を省略すると何が起きるか

次のコードの挙動を説明してください。

```js
numbers.reduce((acc, n) => acc + n);
```

<details>
<summary>模範解答</summary>

初期値がない場合

- acc = 配列の先頭要素
- 空配列だとエラーになる

</details>

---

# 🔹 Step 2：配列を作る reduce

## 問題 3：map を reduce で書く

```js
const numbers = [1, 2, 3, 4];

// 各要素を 2 倍した配列を reduce で作る
```

<details>
<summary>模範解答</summary>

```js
const result = numbers.reduce((acc, n) => {
  acc.push(n * 2);
  return acc;
}, []);
```

</details>

---

## 問題 4：filter を reduce で書く

```js
const numbers = [1, 2, 3, 4, 5, 6];

// 偶数だけの配列を reduce で作る
```

<details>
<summary>模範解答</summary>

```js
const result = numbers.reduce((acc, n) => {
  if (n % 2 === 0) {
    acc.push(n);
  }
  return acc;
}, []);
```

</details>

---

# 🔹 Step 3：オブジェクトを作る reduce

## 問題 5：配列 → オブジェクト

```js
const users = [
  { id: 1, name: "Taro" },
  { id: 2, name: "Jiro" },
];

// { 1: "Taro", 2: "Jiro" } に変換
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

## 問題 6：カウント集計（頻出）

```js
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

// 各フルーツの出現回数を集計
```

<details>
<summary>模範解答</summary>

```js
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
```

</details>

---

# 🔹 Step 4：groupBy パターン

## 問題 7：role ごとにグループ化

```js
const users = [
  { name: "Taro", role: "admin" },
  { name: "Jiro", role: "user" },
  { name: "Hanako", role: "admin" },
];
```

<details>
<summary>模範解答</summary>

```js
const grouped = users.reduce((acc, user) => {
  if (!acc[user.role]) {
    acc[user.role] = [];
  }
  acc[user.role].push(user);
  return acc;
}, {});
```

</details>

---

# 🔹 Step 5：React 実務直結

## 問題 8：イミュータブル更新

```js
const cart = [
  { id: 1, count: 1 },
  { id: 2, count: 2 },
];

// id === 2 の count を +1（reduce で）
```

<details>
<summary>模範解答</summary>

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

</details>

---

## 問題 9：state 初期化ロジック

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

</details>

---

以上。
