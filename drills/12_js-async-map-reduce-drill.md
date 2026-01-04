# 非同期 × map / reduce 完全攻略ドリル（Promise.all / await）

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

出力例：

```
[ Promise { 2 }, Promise { 4 }, Promise { 6 } ]
```

### なぜこうなるか：

`async` 関数は**必ず Promise を返す**。そのため `map` の戻り値は `Promise[]` になる。

```js
// これは
async (id) => {
  return id * 2;
};

// 実質これと同じ
(id) => Promise.resolve(id * 2);
```

### 注意：

この例の `id * 2` は同期処理なので、本来 `async` は不要。
「`async` を付けると `Promise[]` になる」ことを示すための例。

</details>

---

## 問題 2：Promise[] を値の配列にする

上記の `results` を `[2, 4, 6]` にしてください。

<details>
<summary>模範解答</summary>

```js
const ids = [1, 2, 3];

const main = async () => {
  const results = ids.map(async (id) => {
    return id * 2;
  });
  const values = await Promise.all(results);
  console.log(values);
};

main();
```

### 解説：

- map + async は Promise の配列を返す
- Promise.all() で全ての Promise が解決するのを待つ
- await Promise.all() の戻り値は、各 Promise の結果の配列

#### 注意：

- この例の id \* 2 は同期処理なので、本来 async は不要。
- 「async を付けると Promise[] になる」ことを示すための例。

#### 実務での使用例：

```js
const fetchUsers = async (ids) => {
  const users = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`/api/users/${id}`);
      return res.json();
    })
  );
  return users;
};
```

</details>

---

# 🔹 Step 2：実務で頻出のパターン

## 問題 3：API を複数取得する

```js
const urls = [
  "https://jsonplaceholder.typicode.com/users/1",
  "https://jsonplaceholder.typicode.com/users/2",
  "https://jsonplaceholder.typicode.com/users/3",
];

// 各 URL を fetch して JSON の配列を作る関数を書いてください
```

<details>
<summary>模範解答</summary>

```js
const urls = [
  "https://jsonplaceholder.typicode.com/users/1",
  "https://jsonplaceholder.typicode.com/users/2",
  "https://jsonplaceholder.typicode.com/users/3",
];

const fetchAllData = async (urls) => {
  const data = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url);
      return res.json();
    })
  );
  return data;
};

// 実行
fetchAllData(urls).then((data) => {
  console.log(data);
  // [{ id: 1, name: "Leanne Graham", ... }, { id: 2, ... }, { id: 3, ... }]
});
```

### 解説：

1. `urls.map(async ...)` で各 URL に対して fetch を実行 → `Promise[]` が返る
2. `Promise.all()` で全ての Promise が解決するのを待つ
3. 全ての fetch が完了したら、JSON の配列が `data` に入る

### ポイント：

- 3 つの fetch は**並列**で実行される（高速）
- 1 つでも失敗すると `Promise.all` 全体が reject される

</details>

---

## 問題 4：並列実行と直列実行の違い

次の 2 つのコードの違いを説明してください。

```js
// 共通の準備
const items = [1, 2, 3];
const doAsync = async (item) => {
  console.log(`開始: ${item}`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待つ
  console.log(`完了: ${item}`);
  return item * 2;
};

// --- A: Promise.all ---
const runA = async () => {
  const results = await Promise.all(items.map((item) => doAsync(item)));
  console.log(results);
};

// --- B: for...of ---
const runB = async () => {
  const results = [];
  for (const item of items) {
    const result = await doAsync(item);
    results.push(result);
  }
  console.log(results);
};
```

<details>
<summary>模範解答・解説</summary>

```txt
A は並列実行、B は直列実行。
```

### A（Promise.all）の実行順序：

```
開始: 1
開始: 2
開始: 3
（1秒後）
完了: 1
完了: 2
完了: 3
[2, 4, 6]
```

全体の所要時間：**約 1 秒**（並列実行）

### B（for...of）の実行順序：

```
開始: 1
（1秒後）
完了: 1
開始: 2
（1秒後）
完了: 2
開始: 3
（1秒後）
完了: 3
[2, 4, 6]
```

全体の所要時間：**約 3 秒**（直列実行）

### 使い分け：

| パターン  | 使うケース                                           |
| --------- | ---------------------------------------------------- |
| A（並列） | 高速化したい、各処理が独立している                   |
| B（直列） | API レート制限がある、順序が重要、前の結果に依存する |

</details>

---

# 🔹 Step 3：reduce × async の落とし穴

## 問題 5：なぜこれは危険か

```js
// doAsync は問題 4 と同じ関数を使用
const doAsync = async (item) => {
  console.log(`開始: ${item}`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待つ
  console.log(`完了: ${item}`);
  return item * 2;
};

const items = [1, 2, 3];

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

### 問題点：

1. **可読性が低い**

   - `await acc` が何をしているか分かりにくい
   - 初期値が `Promise.resolve([])` なのも分かりにくい

2. **直列実行になる**

   - 各 `doAsync` が順番に実行される
   - 並列実行の恩恵を受けられない

3. **バグを生みやすい**
   - `await acc` を忘れると壊れる
   - `return` を忘れると壊れる

### 推奨：map + Promise.all を使う

```js
// こちらの方がシンプルで高速
const result = await Promise.all(items.map((item) => doAsync(item)));
```

原則として **非同期で配列を作るなら map + Promise.all** を使う。

</details>

---

## 問題 6：直列処理が必要なケース

直列処理（for...of / while）を使うべきケースを答えてください。

<details>
<summary>模範解答</summary>

```txt
直列処理が必要で、前の結果に依存する場合のみ。
```

### 具体例：ページネーションで全データを取得

```js
const fetchAllPages = async () => {
  let nextUrl = "/api/users?page=1";
  const allData = [];

  while (nextUrl) {
    const res = await fetch(nextUrl);
    const json = await res.json();
    allData.push(...json.data);
    nextUrl = json.nextPage; // 次のページの URL（なければ null）
  }

  return allData;
};
```

### なぜ直列が必要か：

- 次のページの URL が、前のレスポンスに含まれている
- 並列で取得することができない

### 結論：

- **並列で実行できるなら map + Promise.all を使う**
- 直列処理が必要な場面：
  - 前の結果がないと次に進めない（ページネーションなど）
  - API レート制限がある
  - 順序が重要な処理
- 直列処理には for...of や while を使う（reduce × async は避ける）

</details>

---

# 🔹 コラム：React / Next.js での活用

このドリルで学んだ `map + Promise.all` は、React / Next.js でも頻出パターンです。

---

## useEffect 内での非同期処理

```js
// ❌ NG: Promise[] を state に入れている
useEffect(() => {
  const data = items.map(async (item) => await fetchItem(item));
  setData(data); // data は Promise[] になってしまう
}, [items]);

// ✅ OK: Promise.all で解決してから state に入れる
useEffect(() => {
  const load = async () => {
    const data = await Promise.all(items.map((item) => fetchItem(item)));
    setData(data); // data は解決済みの値の配列
  };
  load();
}, [items]);
```

**ポイント**: state には **Promise ではなく解決済みの値** を入れる。

詳しくは **18_js-react-async-useeffect-drill.md** を参照。

---

## Next.js Server Component

Server Component では、コンポーネント自体を `async` にできるため、トップレベルで `await Promise.all(...)` が使えます。

```jsx
// Server Component（async コンポーネント）
export default async function UsersPage() {
  const userIds = [1, 2, 3];
  const users = await Promise.all(userIds.map((id) => getUser(id)));

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

詳しくは **22_nextjs-practical-design-drill.md** を参照。

---

以上。
