# 非同期 × map / reduce 完全攻略ドリル（Promise.all / await）

**保存用ファイル名：`js-async-map-reduce-drill.md`**

対象：React / Next.js 経験者
目的：配列 × 非同期処理を安全に設計・実装できるようにする

---

## このドリルの狙い

- `map(async ...)` が **Promise[]** になる理由を説明できる
- `Promise.all` を「どこで・なぜ」使うか理解する
- `reduce × async` の危険ポイントを把握する
- React / Next.js 実務で事故らない書き方を身につける

---

# 🔹 Step 1：async × map の正体

## 問題 1：map に async を書くと何が返る？

```js
const ids = [1, 2, 3];

const results = ids.map(async (id) => {
  return id * 2;
});

console.log(results);
```

<details>
<summary>模範解答・解説</summary>

```txt
results は Promise の配列（Promise[]）になる。
```

`async` 関数は必ず Promise を返すため、`map` の戻り値は `Promise[]` になる。

</details>

---

## 問題 2：Promise[] を値の配列にする

上記の `results` を `[2, 4, 6]` にしてください。

<details>
<summary>模範解答</summary>

```js
const values = await Promise.all(results);
```

</details>

---

# 🔹 Step 2：実務で頻出のパターン

## 問題 3：API を複数取得する

```js
const urls = ["/a", "/b", "/c"];

// 各 URL を fetch して JSON の配列を作る
```

<details>
<summary>模範解答</summary>

```js
const data = await Promise.all(
  urls.map(async (url) => {
    const res = await fetch(url);
    return res.json();
  })
);
```

</details>

---

## 問題 4：for...of との違い

次の 2 つの違いを説明してください。

```js
// A
await Promise.all(items.map(async (item) => doAsync(item)));

// B
for (const item of items) {
  await doAsync(item);
}
```

<details>
<summary>模範解答・解説</summary>

```txt
A は並列実行、B は直列実行。
A は高速だが、API 制限がある場合は注意が必要。
```

</details>

---

# 🔹 Step 3：reduce × async の落とし穴

## 問題 5：なぜこれは危険か

```js
const result = items.reduce(async (acc, item) => {
  const resolved = await acc;
  const value = await doAsync(item);
  resolved.push(value);
  return resolved;
}, Promise.resolve([]));
```

<details>
<summary>模範解答・解説</summary>

```txt
可読性が低く、バグを生みやすい。
並列処理の恩恵も受けにくい。
```

原則として **非同期で配列を作るなら map + Promise.all** を使う。

</details>

---

## 問題 6：reduce を使うべきケース

reduce × async を使ってもよいケースを答えてください。

<details>
<summary>模範解答</summary>

```txt
直列処理が必要で、前の結果に依存する場合のみ。
```

</details>

---

# 🔹 Step 4：React / Next.js 実務

## 問題 7：useEffect 内の非同期 map

次のコードを安全に書き換えてください。

```js
useEffect(() => {
  const data = items.map(async (item) => await fetchItem(item));
  setData(data);
}, [items]);
```

<details>
<summary>模範解答・解説</summary>

```js
useEffect(() => {
  const load = async () => {
    const data = await Promise.all(items.map((item) => fetchItem(item)));
    setData(data);
  };
  load();
}, [items]);
```

state には **Promise ではなく解決済みの値** を入れる。

</details>

---

## 問題 8：Next.js（Server Component 想定）

```js
const users = [1, 2, 3];

// ユーザー情報を取得して配列で返す
```

<details>
<summary>模範解答</summary>

```js
const data = await Promise.all(users.map((id) => getUser(id)));
```

</details>

---

以上。
