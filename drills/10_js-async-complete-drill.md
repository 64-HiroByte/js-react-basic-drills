# 非同期処理 完全反復ドリル（Promise / async-await）

対象：JavaScript / React / Next.js 経験者
目的：非同期処理を「雰囲気」ではなく **実行順・戻り値・設計** で理解する

> **Note**: map × async / reduce × async については **12_js-async-map-reduce-drill.md** でより詳しく扱っています。
> このドリルでは **Promise の基礎と実行順序** に焦点を当てます。

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
console.log(result);
```

質問：`result` は何ですか？`10` ですか？

<details>
<summary>模範解答</summary>

### 回答

**Promise オブジェクト**（値 10 そのものではない）

### 出力

```
Promise { 10 }
```

### 値を取り出すには

```js
const fn = () => {
  return Promise.resolve(10);
};

const result = fn();

// 方法1: then を使う
result.then((v) => console.log(v)); // 10

// 方法2: await を使う（async 関数内で）
const main = async () => {
  const value = await fn();
  console.log(value); // 10
};
main();
```

### ポイント

- `Promise.resolve(10)` は「10 で解決された Promise」を返す
- Promise は **「将来の値」を表すオブジェクト**
- 値を取り出すには `then` または `await` が必要

</details>

---

## 問題 2：async の戻り値

```js
const fn = async () => {
  return 10;
};

const result = fn();
console.log(result);
```

質問：`result` は何ですか？問題 1 との違いは？

<details>
<summary>模範解答</summary>

### 回答

**Promise オブジェクト**（問題 1 と同じ）

### 出力

```
Promise { 10 }
```

### 解説

`async` 関数は **必ず Promise を返す**。

```js
// この 2 つは実質同じ
const fn1 = async () => {
  return 10;
};

const fn2 = () => {
  return Promise.resolve(10);
};
```

### 値を取り出す

```js
const fn = async () => {
  return 10;
};

const main = async () => {
  const value = await fn();
  console.log(value); // 10
};
main();
```

### ポイント

| 書き方 | 戻り値 |
|--------|--------|
| `return 10` (通常関数) | `10` |
| `return 10` (async 関数) | `Promise { 10 }` |
| `return Promise.resolve(10)` | `Promise { 10 }` |

</details>

---

# 🔹 Step 2：await の意味

## 問題 3：await しているものは何？

```js
const fn = async () => {
  const value = await Promise.resolve(5);
  return value * 2;
};

const main = async () => {
  const result = await fn();
  console.log(result);
};
main();
```

質問：
1. `await Promise.resolve(5)` の結果、`value` は何になりますか？
2. 最終的な出力は何ですか？

<details>
<summary>模範解答</summary>

### 回答

1. `value` は `5`（Promise ではなく値）
2. 出力は `10`

### 出力

```
10
```

### 解説

```js
const fn = async () => {
  // await は Promise を「待って」値を取り出す
  const value = await Promise.resolve(5);  // value = 5
  return value * 2;  // 10 を返す（Promiseでラップされる）
};
```

### await の動作イメージ

```
Promise.resolve(5)  →  await  →  5
    ↑                           ↑
  Promise                      値
```

### ポイント

| 操作 | 結果 |
|------|------|
| `Promise.resolve(5)` | `Promise { 5 }` |
| `await Promise.resolve(5)` | `5` |

- `await` は **Promise を「開封」して中の値を取り出す**
- `await` は **async 関数の中でのみ** 使える

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

質問：A, B, C, D はどの順番で出力されますか？

<details>
<summary>模範解答</summary>

### 出力

```
A
D
C
B
```

### 解説

JavaScript の実行順序には優先度がある：

| 優先度 | 種類 | 例 |
|--------|------|-----|
| 1（最優先） | 同期処理 | `console.log("A")` |
| 2 | マイクロタスク | `Promise.then()` |
| 3 | マクロタスク | `setTimeout()` |

### 実行の流れ

```
1. console.log("A")    → 同期処理 → 即座に実行 → "A"
2. setTimeout(...)     → マクロタスクキューに登録
3. Promise.then(...)   → マイクロタスクキューに登録
4. console.log("D")    → 同期処理 → 即座に実行 → "D"
5. （同期処理完了）
6. マイクロタスク実行  → "C"
7. （マイクロタスク完了）
8. マクロタスク実行    → "B"
```

### イメージ図

```
同期処理: A → D
              ↓
マイクロタスク: C
              ↓
マクロタスク:  B
```

### ポイント

- `setTimeout(..., 0)` でも **同期処理の後** に実行される
- `Promise.then` は `setTimeout` より **先に** 実行される

</details>

---

# 🔹 Step 4：map × async の罠

> **Note**: この内容は **12_js-async-map-reduce-drill.md** でより詳しく扱っています。

## 問題 5：この結果は何になる？

```js
const numbers = [1, 2, 3];

const result = numbers.map(async (n) => n * 2);
console.log(result);
```

質問：`result` は `[2, 4, 6]` ですか？

<details>
<summary>模範解答</summary>

### 回答

**いいえ、Promise の配列になる**

### 出力

```
[ Promise { 2 }, Promise { 4 }, Promise { 6 } ]
```

### なぜこうなるか

1. `async` 関数は **必ず Promise を返す**（問題 2 で学んだ）
2. `map` は各要素に関数を適用した結果を配列で返す
3. つまり `map(async ...)` の結果は **Promise の配列**

### イメージ

```
numbers.map(async (n) => n * 2)

[1, 2, 3].map(async (n) => n * 2)
    ↓
[async (1) => 2, async (2) => 4, async (3) => 6]
    ↓
[Promise { 2 }, Promise { 4 }, Promise { 6 }]
```

</details>

---

## 問題 6：正しく値を得る

問題 5 のコードを修正して、`result` が `[2, 4, 6]` になるようにしてください。

<details>
<summary>模範解答</summary>

### 修正後のコード

```js
const numbers = [1, 2, 3];

const main = async () => {
  const result = await Promise.all(numbers.map(async (n) => n * 2));
  console.log(result);
};
main();
```

### 出力

```
[2, 4, 6]
```

### 解説

1. `numbers.map(async ...)` で `Promise[]` を取得
2. `Promise.all()` で全ての Promise が解決するのを待つ
3. `await` で解決後の値の配列を取得

### 流れのイメージ

```
numbers.map(async (n) => n * 2)
    ↓
[Promise { 2 }, Promise { 4 }, Promise { 6 }]
    ↓
Promise.all([...])
    ↓
Promise { [2, 4, 6] }
    ↓
await
    ↓
[2, 4, 6]
```

### ポイント

**map + async = Promise[]** → **Promise.all で解決**

</details>

---

# 🔹 Step 5：reduce × async（注意）

> **Note**: この内容は **12_js-async-map-reduce-drill.md** でより詳しく扱っています。

## 問題 7：次のコードの問題点を説明する

```js
const numbers = [1, 2, 3];

const result = numbers.reduce(async (acc, n) => {
  const sum = await acc;
  return sum + n;
}, 0);

console.log(result);
```

質問：このコードの問題点を説明してください。

<details>
<summary>模範解答</summary>

### 出力

```
Promise { <pending> }
```

### 問題点

| # | 問題 | 説明 |
|---|------|------|
| 1 | **acc が Promise になる** | 2回目以降、`acc` は Promise |
| 2 | **result も Promise** | 最終結果も Promise |
| 3 | **可読性が悪い** | `await acc` が直感的でない |
| 4 | **直列実行** | 並列実行の恩恵を受けられない |

### なぜ acc が Promise になるか

| 回 | acc | n | 処理 | 戻り値 |
|----|-----|---|------|--------|
| 1回目 | `0` | 1 | `0 + 1` | `Promise { 1 }` |
| 2回目 | `Promise { 1 }` | 2 | `await acc` → `1 + 2` | `Promise { 3 }` |
| 3回目 | `Promise { 3 }` | 3 | `await acc` → `3 + 3` | `Promise { 6 }` |
| 最終 | - | - | - | `Promise { 6 }` |

async 関数は常に Promise を返すため、acc が Promise になっていく。

### 正しい書き方

```js
const numbers = [1, 2, 3];

// 方法1: reduce を使わない（単純な合計なら）
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 6

// 方法2: 非同期処理が必要なら for...of
const main = async () => {
  let sum = 0;
  for (const n of numbers) {
    sum += n;  // 本来ここで await someAsyncOperation(n)
  }
  console.log(sum); // 6
};
main();
```

### ポイント

- **reduce × async は避ける**（可読性が低い）
- 非同期で配列を作るなら **map + Promise.all**
- 直列処理が必要なら **for...of**

</details>

---

# 🔹 Step 6：逐次 or 並列

## 問題 8：どちらが並列？

```js
// パターン A
const fetchAllA = async (ids) => {
  const results = [];
  for (const id of ids) {
    const user = await fetchUser(id);
    results.push(user);
  }
  return results;
};

// パターン B
const fetchAllB = async (ids) => {
  return await Promise.all(ids.map((id) => fetchUser(id)));
};
```

質問：
1. どちらが並列実行ですか？
2. 各パターンの所要時間は？（fetchUser は 1 秒かかると仮定、ids は 3 件）

<details>
<summary>模範解答</summary>

### 回答

1. **パターン B が並列実行**
2. 所要時間：
   - パターン A：約 3 秒（逐次）
   - パターン B：約 1 秒（並列）

### 実行の流れ

**パターン A（逐次）**

```
fetchUser(1) ─────→ 完了
                   fetchUser(2) ─────→ 完了
                                      fetchUser(3) ─────→ 完了
|---- 1秒 ----|---- 1秒 ----|---- 1秒 ----|
合計: 約3秒
```

**パターン B（並列）**

```
fetchUser(1) ─────→ 完了
fetchUser(2) ─────→ 完了
fetchUser(3) ─────→ 完了
|------- 1秒 -------|
合計: 約1秒
```

### 使い分け

| パターン | 使うケース |
|----------|------------|
| A（逐次） | API レート制限がある、順序が重要 |
| B（並列） | 高速化したい、各処理が独立している |

### ポイント

👉 **通信は基本並列**（特別な理由がない限り Promise.all を使う）

</details>

---

# 🔹 Step 7：実務パターン

## 問題 9：API をまとめて取得する

JSONPlaceholder を使って、複数のユーザー情報を取得してください。

```js
const userIds = [1, 2, 3];

// 各ユーザーを取得して配列で返す関数を書いてください
// https://jsonplaceholder.typicode.com/users/1 のような URL を使用
```

<details>
<summary>模範解答</summary>

### 実装例

```js
const userIds = [1, 2, 3];

const fetchUsers = async (ids) => {
  const users = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
      return res.json();
    })
  );
  return users;
};

// 実行
fetchUsers(userIds).then((users) => {
  console.log(users);
  // [{ id: 1, name: "Leanne Graham", ... }, { id: 2, ... }, { id: 3, ... }]
});
```

### ポイント

1. `ids.map(async ...)` で `Promise[]` を作成
2. `Promise.all()` で全て並列実行
3. `await` で解決後の値を取得

### このパターンを覚える

```js
const results = await Promise.all(
  items.map(async (item) => {
    return await someAsyncOperation(item);
  })
);
```

</details>

---

## 🎯 このドリルのまとめ

### チェックリスト

- [ ] `async` 関数は必ず Promise を返すことを理解した
- [ ] `await` は Promise を「開封」して値を取り出すことを理解した
- [ ] `map + async = Promise[]` を理解した
- [ ] `Promise.all` で並列実行できることを理解した
- [ ] 実行順（同期 → マイクロタスク → マクロタスク）を理解した

### パターン表

| やりたいこと | 書き方 |
|--------------|--------|
| Promise から値を取り出す | `await promise` |
| 配列を非同期で変換 | `await Promise.all(arr.map(async ...))` |
| 並列実行 | `Promise.all([...])` |
| 逐次実行 | `for...of` + `await` |

### 関連ドリル

- **12_js-async-map-reduce-drill.md**：map × async / reduce × async の詳細
- **11_js-async-error-handling-drill.md**：エラーハンドリング

---

以上。
