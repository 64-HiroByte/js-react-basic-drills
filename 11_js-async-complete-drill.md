# 非同期処理 完全反復ドリル（Promise / async-await）

**保存用ファイル名：`js-async-complete-drill.md`**

対象：JavaScript / React / Next.js 経験者
目的：非同期処理を「雰囲気」ではなく **実行順・戻り値・設計** で理解する

---

## このドリルの方針（重要）

- 非同期は **数をこなさないと定着しない**
- すべての問題で次を意識する

```txt
1. 何が Promise か？
2. いつ解決されるか？
3. 戻り値は何か？
```

---

# 🔹 Step 1：Promise の正体

## 問題 1：この戻り値は何？

```js
const fn = () => {
  return Promise.resolve(10);
};

const result = fn();
```

質問：`result` は何か？

<details>
<summary>模範解答</summary>

- Promise
- 値 10 そのものではない

```js
result.then((v) => console.log(v)); // 10
```

</details>

---

## 問題 2：async の戻り値

```js
const fn = async () => {
  return 10;
};

const result = fn();
```

<details>
<summary>模範解答</summary>

- async 関数は必ず Promise を返す

```js
result.then((v) => console.log(v)); // 10
```

</details>

---

# 🔹 Step 2：await の意味

## 問題 3：await しているものは何？

```js
const fn = async () => {
  const value = await Promise.resolve(5);
  return value * 2;
};
```

<details>
<summary>模範解答</summary>

- await しているのは Promise
- value は解決後の値

</details>

---

# 🔹 Step 3：実行順トレーニング

## 問題 4：出力順を答える

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

<details>
<summary>模範解答</summary>

```
A
D
C
B
```

- Promise.then はマイクロタスク
- setTimeout はマクロタスク

</details>

---

# 🔹 Step 4：map × async の罠

## 問題 5：この結果は何になる？

```js
const numbers = [1, 2, 3];

const result = numbers.map(async (n) => n * 2);
```

<details>
<summary>模範解答</summary>

- Promise の配列

```js
[Promise, Promise, Promise];
```

</details>

---

## 問題 6：正しく値を得る

上の問題を修正して `[2, 4, 6]` を得てください。

<details>
<summary>模範解答</summary>

```js
const result = await Promise.all(numbers.map(async (n) => n * 2));
```

</details>

---

# 🔹 Step 5：reduce × async（注意）

## 問題 7：次のコードの問題点を説明する

```js
const result = numbers.reduce(async (acc, n) => {
  const sum = await acc;
  return sum + n;
}, 0);
```

<details>
<summary>模範解答</summary>

- acc が Promise になる
- 可読性が極端に悪い
- 多くの場合 for...of の方が安全

</details>

---

# 🔹 Step 6：逐次 or 並列

## 問題 8：どちらが並列？

```js
for (const id of ids) {
  await fetchUser(id);
}
```

```js
await Promise.all(ids.map((id) => fetchUser(id)));
```

<details>
<summary>模範解答</summary>

- 上：逐次
- 下：並列

👉 通信は基本並列

</details>

---

# 🔹 Step 7：実務パターン

## 問題 9：API をまとめて取得する

```js
const userIds = [1, 2, 3];

// 各ユーザーを取得して配列で返す
```

<details>
<summary>模範解答</summary>

```js
const users = await Promise.all(userIds.map((id) => fetchUser(id)));
```

</details>

---

## 🎯 ゴールチェック

- Promise / 値の違いを即答できる
- map + async の罠を反射的に回避できる
- 実行順を説明できる
- 並列・逐次を選択できる

---

以上。
