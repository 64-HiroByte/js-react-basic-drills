# 非同期 × map / reduce（Promise.all 実務変換ドリル）

**保存用ファイル名：`js-async-map-reduce-drill.md`**

対象：React / Next.js 経験者
目的：非同期処理を「await の置き場所」で混乱しないための思考訓練

---

## このドリルの核心

非同期 × 配列で迷う原因は常にこれです。

> **「今、自分は Promise を持っているのか？値を持っているのか？」**

このドリルでは、

- async / await の位置
- map が返す正体
- Promise.all の責務

を **強制的に言語化** させます。

---

# 🔹 Step 1：async × map の正体

## 問題 1：これは何を返す？

```ts
const results = [1, 2, 3].map(async (n) => {
  return n * 2;
});
```

- `results` の型は何か？
- なぜそうなるのか説明してください。

<details>
<summary>模範解答</summary>

**答え**

```ts
Promise < number > [];
```

**理由**

- async 関数は必ず Promise を返す
- map は戻り値をそのまま配列にする

→ Promise の配列になる

</details>

---

# 🔹 Step 2：await してもダメな例

## 問題 2：なぜ期待どおりにならない？

```ts
const values = await[(1, 2, 3)].map(async (n) => n * 2);
```

<details>
<summary>模範解答</summary>

`await` しているのは **配列そのもの**。
中身の Promise は解決されない。

```ts
// 実態
await Promise[]
```

→ 正解は Promise.all

</details>

---

# 🔹 Step 3：Promise.all 基本

## 問題 3：正しく値を取り出す

```ts
const numbers = [1, 2, 3];

// [2, 4, 6] を得たい
```

<details>
<summary>模範解答</summary>

```ts
const results = await Promise.all(numbers.map(async (n) => n * 2));
```

</details>

---

# 🔹 Step 4：エラーが 1 つでも起きたら？

## 問題 4：Promise.all の性質

```ts
await Promise.all([fetch("/ok"), fetch("/ng")]);
```

何が起きるか説明してください。

<details>
<summary>模範解答</summary>

- 1 つでも reject すると全体が reject
- 成功した結果も失われる

→ 部分成功を扱いたいなら allSettled

</details>

---

# 🔹 Step 5：Promise.allSettled

## 問題 5：成功したものだけ使う

```ts
const urls = ["/a", "/b", "/c"];
```

成功したレスポンスだけ配列にしてください。

<details>
<summary>模範解答</summary>

```ts
const results = await Promise.allSettled(urls.map((url) => fetch(url)));

const success = results
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value);
```

</details>

---

# 🔹 Step 6：reduce × 非同期（順次処理）

## 問題 6：順番を保証したい

```ts
const ids = [1, 2, 3];

// 1 → 2 → 3 の順で fetch したい
```

<details>
<summary>模範解答</summary>

```ts
const results = await ids.reduce(async (accPromise, id) => {
  const acc = await accPromise;
  const res = await fetch(`/api/${id}`);
  const data = await res.json();
  return [...acc, data];
}, Promise.resolve([]));
```

**解説**

- acc 自体が Promise
- await しながらバトンを渡す

</details>

---

# 🔹 Step 7：実務 API 変換

## 問題 7：API → 表示用データ

```ts
const users = [
  { id: 1, name: "Taro" },
  { id: 2, name: "Jiro" },
];

// 各ユーザーの /detail を並列 fetch し
// { id, name, detail } の配列を作る
```

<details>
<summary>模範解答</summary>

```ts
const result = await Promise.all(
  users.map(async (user) => {
    const res = await fetch(`/users/${user.id}`);
    const detail = await res.json();
    return { ...user, detail };
  })
);
```

</details>

---

## まとめ（超重要）

- async がある時点で Promise
- map + async = Promise[]
- await は **単体 Promise にだけ効く**
- 配列は Promise.all

---

次は 👉 **実務 API レスポンス整形 総合演習** に進むと
「非同期がわからない感覚」はほぼ消えます。
