# 条件分岐・ループ 集中特訓ドリル（ES6+）

**保存用ファイル名：`js-condition-loop-drill.md`**

対象：React / Next.js 経験者
目的：if / switch / 各種ループを「安全に・意図通り」書けるようにする

---

## このドリルの狙い

- 条件分岐の書き分け（if / 三項 / switch）
- ループの役割理解（for / for...of / for...in / while）
- React で事故りやすい書き方を事前に潰す

---

# 🔹 条件分岐 編

## 問題 1：基本の if / else

```js
const score = 75;

// 80以上: "A"
// 60以上: "B"
// それ以外: "C"
```

<details>
<summary>模範解答</summary>

```js
let grade;

if (score >= 80) {
  grade = "A";
} else if (score >= 60) {
  grade = "B";
} else {
  grade = "C";
}
```

</details>

---

## 問題 2：三項演算子

```js
const isLogin = true;

// isLogin が true の場合 "Welcome"、false の場合 "Please login"
```

<details>
<summary>模範解答</summary>

```js
const message = isLogin ? "Welcome" : "Please login";
```

</details>

---

## 問題 3：truthy / falsy

次のコードが `false` を出力するように修正してください。

```js
const value = "";

if (value) {
  console.log("true");
} else {
  console.log("false");
}
```

<details>
<summary>模範解答</summary>

```js
// そのままで false が出力される（空文字は falsy）
```

</details>

---

## 問題 4：switch 文

```js
const role = "admin";

// admin -> "管理者"
// user -> "一般ユーザー"
// guest -> "ゲスト"
```

<details>
<summary>模範解答</summary>

```js
let label;

switch (role) {
  case "admin":
    label = "管理者";
    break;
  case "user":
    label = "一般ユーザー";
    break;
  case "guest":
    label = "ゲスト";
    break;
  default:
    label = "不明";
}
```

</details>

---

# 🔹 ループ 編

## 問題 5：for ループ（基本）

```js
// 0 から 4 まで出力
```

<details>
<summary>模範解答</summary>

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

</details>

---

## 問題 6：for...of（配列）

```js
const fruits = ["apple", "banana", "orange"];

// 各要素を出力
```

<details>
<summary>模範解答</summary>

```js
for (const fruit of fruits) {
  console.log(fruit);
}
```

</details>

---

## 問題 7：for...in（オブジェクト）

```js
const user = { name: "Taro", age: 20 };

// key と value を出力
```

<details>
<summary>模範解答</summary>

```js
for (const key in user) {
  console.log(key, user[key]);
}
```

</details>

---

## 問題 8：while ループ

```js
let count = 3;

// count が 0 になるまで出力
```

<details>
<summary>模範解答</summary>

```js
while (count > 0) {
  console.log(count);
  count--;
}
```

</details>

---

## 問題 9：break / continue

```js
// 1〜5 を出力。ただし 3 はスキップ
```

<details>
<summary>模範解答</summary>

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue;
  console.log(i);
}
```

</details>

---

## 問題 10：React で避けたいループ

次のコードの問題点を説明してください。

```js
items.forEach((item) => {
  setState(item);
});
```

<details>
<summary>模範解答</summary>

```js
// ループ内で state を更新すると再レンダリングが複数回走る
// map / reduce でまとめてから 1 回だけ setState すべき
```

</details>

---

以上。
