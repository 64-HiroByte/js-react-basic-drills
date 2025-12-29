# Next.js 実務総合演習（設計判断トレーニング）

**保存用ファイル名：`nextjs-practical-design-drill.md`**

対象：React / Next.js 経験者
目的：Next.js における **データ取得・整形・描画の責務分離** を設計レベルで判断できるようにする

---

## この演習のゴール

- Server / Client Component の役割を即座に判断できる
- useEffect / useMemo を **使わない設計** を選べる
- 「なぜこの設計か」を言語化できる

---

# 🔹 Step 1：要件を読む

## 問題 1：次の要件を満たす設計を考える

- ユーザー一覧を表示する
- API からユーザーと投稿を取得する
- 各ユーザーに投稿数を表示する
- SEO を重視したい
- 初期表示は高速にしたい

<details>
<summary>模範解答</summary>

- Server Component でデータ取得
- 初期 HTML に含める（SEO / 初速重視）
- Client Component は不要 or 最小限

</details>

---

# 🔹 Step 2：Server Component 設計

## 問題 2：どこで fetch するべきか？

```ts
// app/users/page.tsx
```

<details>
<summary>模範解答</summary>

```ts
// Server Component
const data = await fetchUsers();
```

- Server Component は async OK
- useEffect 不要

</details>

---

# 🔹 Step 3：データ整形の責務

## 問題 3：整形はどこで行うべきか？

- map / reduce による整形
- 投稿数・集計

<details>
<summary>模範解答</summary>

- Server 側で整形する
- Client には表示用データだけ渡す

👉 Client の再計算・useMemo が不要

</details>

---

# 🔹 Step 4：ダメな設計を見抜く

## 問題 4：次のコードの問題点を説明する

```tsx
"use client";

useEffect(() => {
  fetch("/api/users")
    .then((res) => res.json())
    .then((data) => {
      setUsers(
        data.users.map((u) => ({
          ...u,
          postCount: u.posts.length,
        }))
      );
    });
}, []);
```

<details>
<summary>模範解答</summary>

- 本来 Server でできる処理を Client に寄せている
- SEO に不利
- 初期描画が遅い
- useEffect / state / 再レンダリングが不要に増える

</details>

---

# 🔹 Step 5：正しい構成例

## 問題 5：理想的な構成を書く

<details>
<summary>模範解答</summary>

```tsx
// app/users/page.tsx (Server Component)
const users = await fetchUsers();

const viewData = users.map((u) => ({
  id: u.id,
  name: u.name,
  postCount: u.posts.length,
}));

return <UserList users={viewData} />;
```

```tsx
// UserList.tsx
export const UserList = ({ users }) => (
  <ul>
    {users.map((u) => (
      <li key={u.id}>
        {u.name} ({u.postCount})
      </li>
    ))}
  </ul>
);
```

</details>

---

# 🔹 Step 6：設計判断まとめ

## 問題 6：次を言語化してください

- useEffect を使うべき場面
- Client Component が必要な場面

<details>
<summary>模範解答</summary>

### useEffect

- ユーザー操作起点
- ブラウザ API 依存

### Client Component

- インタラクションが必要
- 状態を持つ UI

</details>

---

## 🎯 最終ゴール

- Next.js の設計を「雰囲気」で決めない
- パフォーマンスと責務を同時に満たす
- レビューで設計意図を説明できる

---

以上。
