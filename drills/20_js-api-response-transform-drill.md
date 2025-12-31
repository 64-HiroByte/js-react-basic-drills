# 実務 API レスポンス整形・総合演習（非同期 × 設計）

**保存用ファイル名：`js-api-response-transform-drill.md`**

対象：React / Next.js 経験者
目的：非同期処理・配列操作・責務分離を「実務判断」として統合する

> **Note**: このドリルは以下のドリルの知識を前提としています：
> - **12_js-async-map-reduce-drill.md**：map × async / Promise.all
> - **22_nextjs-practical-design-drill.md**：Server / Client 責務分離
> - **11_js-async-error-handling-drill.md**：エラーハンドリング

---

## この演習の位置づけ（最重要）

このドリルは **単なる構文練習ではありません**。

- 非同期処理をどこでやるか
- map / reduce をどこで使うか
- UI が欲しい形は何か

を **設計として判断する** トレーニングです。

---

# 🔹 Step 1：API レスポンスを読む

## 問題 1：そのままでは使えない API

以下のような API レスポンスがあります。

```js
// GET /api/orders
const response = [
  {
    id: 1,
    user: { id: 10, name: "Taro" },
    items: [
      { productId: "A", price: 100, quantity: 2 },
      { productId: "B", price: 200, quantity: 1 },
    ],
  },
  {
    id: 2,
    user: { id: 20, name: "Hanako" },
    items: [
      { productId: "C", price: 300, quantity: 3 },
    ],
  },
];
```

UI では次の形が欲しいとします。

```js
// 期待する形
[
  { orderId: 1, userName: "Taro", totalPrice: 400 },
  { orderId: 2, userName: "Hanako", totalPrice: 900 },
]
```

質問：どんな変換ステップが必要か、文章で説明してください。

<details>
<summary>模範解答</summary>

### 変換ステップ

| ステップ | 処理内容 | 使用メソッド |
|----------|----------|--------------|
| 1 | orders 配列を変換 | `map` |
| 2 | user.name を取り出す | プロパティアクセス |
| 3 | items の合計金額を計算 | `reduce` |
| 4 | UI 用オブジェクトを組み立てる | オブジェクトリテラル |

### 処理の流れ

```
response (注文の配列)
    │
    ▼ map で各注文を変換
┌─────────────────────────────────┐
│ order = { id, user, items }    │
│    │                           │
│    ├─ user.name を取り出す     │
│    │                           │
│    └─ items を reduce          │
│       price × quantity の合計  │
│    │                           │
│    ▼                           │
│ { orderId, userName, totalPrice } │
└─────────────────────────────────┘
    │
    ▼
[{ orderId: 1, ... }, { orderId: 2, ... }]
```

</details>

---

# 🔹 Step 2：同期変換を書いてみる

## 問題 2：同期版 実装

問題 1 の response から UI 用配列を作る関数を実装してください。

```js
const response = [
  {
    id: 1,
    user: { id: 10, name: "Taro" },
    items: [
      { productId: "A", price: 100, quantity: 2 },
      { productId: "B", price: 200, quantity: 1 },
    ],
  },
  {
    id: 2,
    user: { id: 20, name: "Hanako" },
    items: [
      { productId: "C", price: 300, quantity: 3 },
    ],
  },
];

// ここで変換処理を書く
```

<details>
<summary>模範解答</summary>

### 実装

```js
const response = [
  {
    id: 1,
    user: { id: 10, name: "Taro" },
    items: [
      { productId: "A", price: 100, quantity: 2 },
      { productId: "B", price: 200, quantity: 1 },
    ],
  },
  {
    id: 2,
    user: { id: 20, name: "Hanako" },
    items: [
      { productId: "C", price: 300, quantity: 3 },
    ],
  },
];

const uiData = response.map((order) => {
  const totalPrice = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    orderId: order.id,
    userName: order.user.name,
    totalPrice,
  };
});

console.log(uiData);
```

### 出力

```
[
  { orderId: 1, userName: 'Taro', totalPrice: 400 },
  { orderId: 2, userName: 'Hanako', totalPrice: 900 }
]
```

### 計算過程

```
注文1:
  - item A: 100 × 2 = 200
  - item B: 200 × 1 = 200
  - 合計: 400

注文2:
  - item C: 300 × 3 = 900
  - 合計: 900
```

### ポイント

| 処理 | メソッド | 目的 |
|------|----------|------|
| 配列変換 | `map` | 各要素を別の形に変換 |
| 合計計算 | `reduce` | 配列を単一の値に集約 |

</details>

---

# 🔹 Step 3：非同期が混ざる

## 問題 3：追加 fetch が必要な場合

次のような状況を考えます。

```js
// 注文データ（items に productId しかない）
const orders = [
  { id: 1, items: [{ productId: 1 }, { productId: 2 }] },
  { id: 2, items: [{ productId: 3 }] },
];

// 商品詳細は別 API で取得する必要がある
// GET https://jsonplaceholder.typicode.com/posts/:id
// → { id, title, ... }
```

各 productId に対して API を呼び、商品名（title）を取得して以下の形にしてください。

```js
// 期待する形
[
  {
    orderId: 1,
    products: ["商品名1", "商品名2"],
  },
  {
    orderId: 2,
    products: ["商品名3"],
  },
]
```

<details>
<summary>模範解答</summary>

### 実装

```js
const orders = [
  { id: 1, items: [{ productId: 1 }, { productId: 2 }] },
  { id: 2, items: [{ productId: 3 }] },
];

const fetchOrdersWithProducts = async () => {
  const uiData = await Promise.all(
    orders.map(async (order) => {
      // 各注文の items を並列で fetch
      const products = await Promise.all(
        order.items.map(async (item) => {
          const res = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${item.productId}`
          );
          const product = await res.json();
          return product.title;
        })
      );

      return {
        orderId: order.id,
        products,
      };
    })
  );

  return uiData;
};

// 実行
fetchOrdersWithProducts().then((data) => {
  console.log(data);
});
```

### 出力例

```
[
  {
    orderId: 1,
    products: [
      'sunt aut facere repellat...',
      'qui est esse...'
    ]
  },
  {
    orderId: 2,
    products: [
      'ea molestias quasi exercitationem...'
    ]
  }
]
```

### 処理の流れ

```
orders
    │
    ▼ Promise.all + map（外側：注文ごと）
┌─────────────────────────────────────┐
│ order = { id, items }              │
│    │                               │
│    ▼ Promise.all + map（内側：商品ごと）
│ ┌───────────────────────────────┐  │
│ │ fetch(/posts/1) → title      │  │
│ │ fetch(/posts/2) → title      │  │
│ │     ↓                        │  │
│ │ [title1, title2]             │  │
│ └───────────────────────────────┘  │
│    │                               │
│    ▼                               │
│ { orderId, products }             │
└─────────────────────────────────────┘
    │
    ▼
[{ orderId: 1, ... }, { orderId: 2, ... }]
```

### ポイント

| 構造 | 方法 | 理由 |
|------|------|------|
| 外側の配列 | `Promise.all(orders.map(...))` | 各注文を並列処理 |
| 内側の配列 | `Promise.all(order.items.map(...))` | 各商品を並列処理 |

**二重の Promise.all** で外側も内側も並列実行 → 高速化

</details>

---

# 🔹 Step 4：責務分離（最重要）

## 問題 4：どこでやるべきか

Next.js アプリケーションで以下の処理があります。
それぞれどこに置くべきか説明してください。

- API 呼び出し
- データ整形（map / reduce）
- 表示用の計算

選択肢：
- Server Component
- Client Component
- カスタム Hook
- API Route / Server Action

<details>
<summary>模範解答</summary>

### 責務分離の原則

| 処理 | 推奨場所 | 理由 |
|------|----------|------|
| API 呼び出し | Server Component / API Route | 機密情報（API キー）を隠せる |
| データ整形 | Server Component / カスタム Hook | Client に渡す前に完成形にする |
| 表示用計算 | useMemo / 直接計算 | 再レンダリング時の最適化 |

### 判断フロー

```
Q1: SEO が必要？初期表示を高速にしたい？
    │
    ├─ Yes → Server Component で fetch + 整形
    │
    └─ No → Q2 へ

Q2: ユーザー操作で再取得が必要？
    │
    ├─ Yes → Client Component + useEffect
    │          └─ 整形はカスタム Hook に分離
    │
    └─ No → Server Component
```

### 実装例

```jsx
// ✅ 良い例：Server Component で完成形を作る
// app/orders/page.jsx
async function getOrdersForUI() {
  const res = await fetch("https://api.example.com/orders");
  const orders = await res.json();

  // Server で整形 → Client には完成形だけ渡す
  return orders.map((order) => ({
    orderId: order.id,
    userName: order.user.name,
    totalPrice: order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
  }));
}

export default async function OrdersPage() {
  const orders = await getOrdersForUI();

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.orderId}>
          {order.userName}: ¥{order.totalPrice}
        </li>
      ))}
    </ul>
  );
}
```

### ポイント

**UI は「完成形」だけを受け取る**

- Server で fetch
- Server で整形（map / reduce）
- Client には表示するだけのデータを渡す

</details>

---

# 🔹 Step 5：useEffect に入れると？

## 問題 5：危険な例

以下のコードの問題点を説明してください。

```jsx
"use client";

import { useState, useEffect } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  useEffect(() => {
    const sum = orders.reduce(
      (acc, order) => acc + order.price,
      0
    );
    setTotal(sum);
  }, [orders]);

  return (
    <div>
      <p>合計: {total}</p>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

<details>
<summary>模範解答</summary>

### 問題点

| # | 問題 | 説明 |
|---|------|------|
| 1 | **不要な state** | `total` は `orders` から導出可能 |
| 2 | **不要な useEffect** | 導出値を state にする必要がない |
| 3 | **余計な再レンダリング** | `setTotal` で追加の再レンダリングが発生 |
| 4 | **SEO に不利** | Client でデータ取得 → HTML にデータがない |

### 処理の流れ（問題のあるコード）

```
1. 初回レンダリング（orders: [], total: 0）
       │
       ▼
2. useEffect[1] 発火 → fetch 開始
       │
       ▼
3. fetch 完了 → setOrders([...])
       │
       ▼
4. 再レンダリング（orders: [...], total: 0）← まだ古い
       │
       ▼
5. useEffect[2] 発火 → setTotal(計算結果)
       │
       ▼
6. 再レンダリング（orders: [...], total: 計算結果）

→ 3回もレンダリングしている！
```

### 修正版 1：導出値として計算

```jsx
"use client";

import { useState, useEffect } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  // 導出値：state ではなく直接計算
  const total = orders.reduce(
    (acc, order) => acc + order.price,
    0
  );

  return (
    <div>
      <p>合計: {total}</p>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 修正版 2：Server Component で整形

```jsx
// app/orders/page.jsx（Server Component）
async function getOrdersWithTotal() {
  const res = await fetch("https://api.example.com/orders");
  const orders = await res.json();

  const total = orders.reduce(
    (acc, order) => acc + order.price,
    0
  );

  return { orders, total };
}

export default async function OrdersPage() {
  const { orders, total } = await getOrdersWithTotal();

  return (
    <div>
      <p>合計: {total}</p>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### ポイント

| 原則 | 説明 |
|------|------|
| **導出値は state にしない** | props / state から計算できる値は直接計算 |
| **useEffect は最小限** | 副作用（fetch、イベント登録）のみに使う |
| **Server First** | SEO / 初期表示が重要なら Server Component |

</details>

---

# 🔹 Step 6：実践問題（JSONPlaceholder）

## 問題 6：ユーザーと投稿を結合する

JSONPlaceholder から以下のデータを取得し、結合してください。

- `/users` → ユーザー一覧
- `/posts` → 投稿一覧（userId を持つ）

期待する出力形式：

```js
[
  {
    userId: 1,
    userName: "Leanne Graham",
    postCount: 10,
    latestPostTitle: "...",
  },
  // ...
]
```

<details>
<summary>模範解答</summary>

### 実装

```js
const fetchUsersWithPosts = async () => {
  // 並列で取得
  const [users, posts] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users").then((r) => r.json()),
    fetch("https://jsonplaceholder.typicode.com/posts").then((r) => r.json()),
  ]);

  // 整形
  const uiData = users.map((user) => {
    const userPosts = posts.filter((post) => post.userId === user.id);
    const latestPost = userPosts[userPosts.length - 1];

    return {
      userId: user.id,
      userName: user.name,
      postCount: userPosts.length,
      latestPostTitle: latestPost?.title || "投稿なし",
    };
  });

  return uiData;
};

// 実行
fetchUsersWithPosts().then((data) => {
  console.log(data);
});
```

### 出力例

```
[
  {
    userId: 1,
    userName: 'Leanne Graham',
    postCount: 10,
    latestPostTitle: 'at nam consequatur ea labore ea harum'
  },
  {
    userId: 2,
    userName: 'Ervin Howell',
    postCount: 10,
    latestPostTitle: 'voluptatem eligendi optio'
  },
  // ...
]
```

### 処理の流れ

```
Promise.all
    │
    ├─ fetch(/users) → users[]
    │
    └─ fetch(/posts) → posts[]
    │
    ▼
users.map で各ユーザーを変換
    │
    ├─ posts.filter(userId) → userPosts[]
    │
    ├─ postCount = userPosts.length
    │
    └─ latestPostTitle = userPosts[last].title
    │
    ▼
[{ userId, userName, postCount, latestPostTitle }, ...]
```

### ポイント

| 処理 | 方法 | 理由 |
|------|------|------|
| データ取得 | `Promise.all` | 並列で高速化 |
| 結合 | `map` + `filter` | ユーザーごとに投稿を絞り込む |
| 存在チェック | `?.` (optional chaining) | 投稿がない場合に対応 |

</details>

---

## 🎯 このドリルのまとめ

### チェックリスト

- [ ] API レスポンスから UI 用データへの変換手順を説明できる
- [ ] map + reduce で同期的にデータを整形できる
- [ ] 二重の Promise.all で非同期データを並列取得できる
- [ ] Server / Client の責務分離を判断できる
- [ ] 導出値を state にしない理由を説明できる

### パターン表

| やりたいこと | 書き方 |
|--------------|--------|
| 配列を変換 | `arr.map(item => ...)` |
| 配列から単一値を計算 | `arr.reduce((acc, item) => ..., 初期値)` |
| 配列 × 非同期（並列） | `await Promise.all(arr.map(async ...))` |
| 二重配列 × 非同期 | `Promise.all` をネスト |
| 導出値 | state ではなく直接計算 |

### 設計原則

| 原則 | 説明 |
|------|------|
| **Server First** | SEO / 初期表示重視なら Server Component |
| **整形は Server で** | Client には完成形だけ渡す |
| **導出値は state にしない** | 計算で得られる値は直接計算 |
| **useEffect は最小限** | 副作用のみに使う |

### 関連ドリル

- **12_js-async-map-reduce-drill.md**：map × async / Promise.all の基礎
- **22_nextjs-practical-design-drill.md**：Server / Client 責務分離
- **18_js-react-async-useeffect-drill.md**：useEffect 内での非同期処理

---

以上。
