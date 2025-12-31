# Next.js 実務総合演習（設計判断トレーニング）

対象：React / Next.js 経験者（App Router）

解答ファイル: `src/drills/22_nextjs-practical-design-drill.jsx`

---

## 目的

Next.js における **データ取得・整形・描画の責務分離** を設計レベルで判断できるようにする

---

## この演習のゴール

- Server / Client Component の役割を即座に判断できる
- useEffect / useMemo を **使わない設計** を選べる
- 「なぜこの設計か」を言語化できる

---

## 🔰 大前提：Server Component と Client Component

| 項目 | Server Component | Client Component |
|------|------------------|------------------|
| デフォルト | ✅（App Router） | `"use client"` が必要 |
| データ取得 | `async/await` で直接 | useEffect + state |
| SEO | ✅ HTML に含まれる | ❌ JS 実行後に描画 |
| 初期表示 | 高速 | JS ロード後 |
| インタラクション | ❌ 使えない | ✅ onClick など使える |
| Hooks | ❌ 使えない | ✅ useState など使える |

---

# 🔹 Step 1：要件を読む

## 問題 1：次の要件を満たす設計を考える

以下の要件があります：

- ユーザー一覧を表示する
- API からユーザーと投稿を取得する
- 各ユーザーに投稿数を表示する
- **SEO を重視したい**
- **初期表示は高速にしたい**

質問：どのような設計方針が適切ですか？

<details>
<summary>模範解答</summary>

### 設計方針

1. **Server Component でデータ取得**
2. **初期 HTML にデータを含める**（SEO / 初速重視）
3. **Client Component は不要 or 最小限**

### 理由

| 要件 | 対応 |
|------|------|
| SEO 重視 | Server Component → HTML に含まれる |
| 初期表示高速 | Server で取得 → JS 実行待ち不要 |
| ユーザー一覧表示 | インタラクション不要 → Client 不要 |

### 判断フロー

```
Q1: SEO が必要？ or 初期表示を高速にしたい？
    Yes → Server Component を優先

Q2: インタラクション（onClick, useState など）が必要？
    No  → Server Component で完結
    Yes → その部分だけ Client Component
```

</details>

---

# 🔹 Step 2：Server Component 設計

## 問題 2：どこで fetch するべきか？

以下のファイル構成で、ユーザー一覧を表示したいです。

```
app/
  users/
    page.tsx  ← ここでデータ取得したい
```

※ この演習では例として [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します。

質問：`page.tsx` でどのようにデータを取得すべきですか？

<details>
<summary>模範解答</summary>

### Server Component でのデータ取得

```jsx
// app/users/page.jsx（Server Component）
async function getUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();  // ← 直接 await できる！

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### ポイント

| 特徴 | 説明 |
|------|------|
| `async function` | Server Component はコンポーネント自体を async にできる |
| `await` | トップレベルで直接 await できる |
| useEffect 不要 | Server で取得 → useEffect / useState が不要 |
| SEO 対応 | データが HTML に含まれる |

### Client Component との比較

```jsx
// ❌ Client Component だとこうなる（冗長）
"use client";

import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

Server Component なら **3 行で済むことが 10 行以上になる**。

</details>

---

# 🔹 Step 3：データ整形の責務

## 問題 3：整形はどこで行うべきか？

ユーザーと投稿を取得して、各ユーザーの投稿数を表示したいです。

```js
// JSONPlaceholder から取得したデータ
const users = [
  { id: 1, name: "Leanne Graham", ... },
  { id: 2, name: "Ervin Howell", ... },
];

const posts = [
  { id: 1, userId: 1, title: "..." },
  { id: 2, userId: 1, title: "..." },
  { id: 3, userId: 2, title: "..." },
];

// 期待する表示
// Leanne Graham (2件)
// Ervin Howell (1件)
```

質問：この「投稿数の集計」は Server / Client どちらで行うべきですか？

<details>
<summary>模範解答</summary>

### 解答

**Server 側で整形する**

### 理由

| 場所 | メリット | デメリット |
|------|----------|------------|
| Server | useMemo 不要、Client コード削減、SEO 対応 | なし |
| Client | 動的に再計算可能 | useMemo 必要、初期表示遅延 |

この場合「初期表示時に投稿数を見せたい」だけなので、Server で整形が最適。

### 実装例

```jsx
// app/users/page.jsx（Server Component）
async function getUsersWithPostCount() {
  // 並列で取得
  const [users, posts] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users").then(r => r.json()),
    fetch("https://jsonplaceholder.typicode.com/posts").then(r => r.json()),
  ]);

  // Server 側で整形
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    postCount: posts.filter((p) => p.userId === user.id).length,
  }));
}

export default async function UsersPage() {
  const usersWithPostCount = await getUsersWithPostCount();

  return (
    <ul>
      {usersWithPostCount.map((user) => (
        <li key={user.id}>
          {user.name} ({user.postCount}件)
        </li>
      ))}
    </ul>
  );
}
```

### ポイント

- **Client には「表示用データ」だけ渡す**
- Client で filter / reduce / useMemo が不要になる
- 「データ整形」と「表示」の責務が分離される

</details>

---

# 🔹 Step 4：ダメな設計を見抜く

## 問題 4：次のコードの問題点を説明する

以下は問題 3 と同じ要件（ユーザー一覧 + 投稿数の表示）を Client Component で実装した例です。

※ JSONPlaceholder を使用しています。

```jsx
"use client";

import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        // 投稿も取得して整形
        fetch("https://jsonplaceholder.typicode.com/posts")
          .then((res) => res.json())
          .then((posts) => {
            setUsers(
              data.map((u) => ({
                ...u,
                postCount: posts.filter((p) => p.userId === u.id).length,
              }))
            );
            setLoading(false);
          });
      });
  }, []);

  if (loading) return <p>読み込み中...</p>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name} ({u.postCount}件)</li>
      ))}
    </ul>
  );
}
```

質問：このコードの問題点を **5 つ以上** 挙げてください。

<details>
<summary>模範解答</summary>

### 問題点

| # | 問題 | 説明 |
|---|------|------|
| 1 | **不要な Client Component** | SEO / 初期表示に不利 |
| 2 | **useEffect の乱用** | Server Component なら不要 |
| 3 | **useState の乱用** | loading 状態も不要になる |
| 4 | **fetch のネスト** | Promise.all を使うべき |
| 5 | **Client で整形** | Server で整形すれば useMemo 不要 |
| 6 | **初期表示が遅い** | JS 実行後に fetch → 表示 |
| 7 | **SEO に不利** | HTML に初期データが含まれない |

### 流れの比較

```
❌ Client Component:
1. HTML 受信（データなし）
2. JS ダウンロード・実行
3. useEffect 発火
4. fetch 実行
5. データ受信
6. 描画

✅ Server Component:
1. Server で fetch
2. HTML 生成（データ含む）
3. HTML 受信 → 即座に描画
```

### 修正後のコード

問題 3 の模範解答を参照。

</details>

---

# 🔹 Step 5：コンポーネント分割

## 問題 5：Server と Client の責務分割

問題 3 の実装に「お気に入りボタン」を追加したいです。

要件：
- ユーザー一覧は SEO 対応（Server Component）
- お気に入りボタンはクリックで状態が変わる（インタラクション必要）

質問：どのようにコンポーネントを分割すべきですか？

<details>
<summary>模範解答</summary>

### 分割方針

```
Server Component（SEO 対応）
  └─ Client Component（インタラクション部分のみ）
```

### 実装例

```jsx
// app/users/page.jsx（Server Component）
async function getUsersWithPostCount() {
  const [users, posts] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users").then(r => r.json()),
    fetch("https://jsonplaceholder.typicode.com/posts").then(r => r.json()),
  ]);

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    postCount: posts.filter((p) => p.userId === user.id).length,
  }));
}

export default async function UsersPage() {
  const users = await getUsersWithPostCount();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} ({user.postCount}件)
          <FavoriteButton userId={user.id} />  {/* Client Component */}
        </li>
      ))}
    </ul>
  );
}
```

```jsx
// components/FavoriteButton.jsx（Client Component）
"use client";

import { useState } from "react";

export function FavoriteButton({ userId }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <button onClick={() => setIsFavorite(!isFavorite)}>
      {isFavorite ? "★" : "☆"}
    </button>
  );
}
```

### ポイント

| コンポーネント | 役割 | 理由 |
|---------------|------|------|
| UsersPage | データ取得・整形・一覧表示 | SEO 対応が必要 |
| FavoriteButton | インタラクション | onClick が必要 |

**「インタラクションが必要な部分だけ」を Client Component にする**

</details>

---

# 🔹 Step 6：設計判断まとめ

## 問題 6：判断基準を言語化してください

以下の質問に答えてください：

1. Server Component を使うべき場面は？
2. Client Component を使うべき場面は？
3. useEffect を使うべき場面は？

<details>
<summary>模範解答</summary>

### 1. Server Component を使うべき場面

| 場面 | 例 |
|------|-----|
| SEO が必要 | ブログ記事、商品ページ |
| 初期表示を高速にしたい | ランディングページ |
| データ取得が必要 | 一覧ページ、詳細ページ |
| 機密情報を扱う | API キー、DB 接続 |

### 2. Client Component を使うべき場面

| 場面 | 例 |
|------|-----|
| onClick などのイベント | ボタン、リンク |
| useState / useReducer | フォーム、モーダル |
| useEffect | タイマー、外部ライブラリ |
| ブラウザ API | localStorage, geolocation |

### 3. useEffect を使うべき場面

| 場面 | 例 |
|------|-----|
| ユーザー操作後のデータ取得 | 検索、フィルター |
| ブラウザ API への接続 | localStorage, WebSocket |
| 外部ライブラリの初期化 | Chart.js, Google Maps |
| サブスクリプション | イベントリスナー |

### useEffect を使わなくてよい場面

| 場面 | 代替手段 |
|------|----------|
| 初期データ取得 | Server Component |
| props/state からの派生 | useMemo or 直接計算 |

</details>

---

## 🎯 このドリルのまとめ

### 判断フローチャート

```
Q1: SEO が必要？ or 初期表示を高速にしたい？
    Yes → Server Component
    No  → Q2へ

Q2: インタラクション（onClick, useState など）が必要？
    No  → Server Component
    Yes → Client Component

Q3: データ取得のタイミングは？
    初期表示時   → Server Component で async/await
    ユーザー操作後 → Client Component で useEffect
```

### 原則

| 原則 | 説明 |
|------|------|
| Server First | デフォルトは Server Component |
| 最小限の Client | インタラクション部分だけ Client |
| 整形は Server で | Client で useMemo が不要になる |

### 関連ドリル

- **12_js-async-map-reduce-drill.md**：Server Component での Promise.all
- **19_js-usememo-usecallback-drill.md**：不要な useMemo を避ける
- **18_js-react-async-useeffect-drill.md**：useEffect 内での非同期処理

---

以上。
