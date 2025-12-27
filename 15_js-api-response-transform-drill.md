# 実務 API レスポンス整形・総合演習（非同期 × 設計）

**保存用ファイル名：`js-api-response-transform-drill.md`**

対象：React / Next.js 経験者
目的：非同期処理・配列操作・責務分離を「実務判断」として統合する

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

```ts
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
];
```

UI では次の形が欲しいとします。

```ts
{
  orderId: number;
  userName: string;
  totalPrice: number;
}
```

どんな変換ステップが必要か、文章で説明してください。

<details>
<summary>模範解答</summary>

- orders を map する
- user.name を取り出す
- items を reduce して合計金額を出す
- UI 用オブジェクトを組み立てる

</details>

---

# 🔹 Step 2：同期変換を書いてみる

## 問題 2：同期版 実装

```ts
// response から UI 用配列を作る
```

<details>
<summary>模範解答</summary>

```ts
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
```

</details>

---

# 🔹 Step 3：非同期が混ざる

## 問題 3：追加 fetch が必要な場合

```ts
// 各 productId の詳細を取得する API
// GET /api/products/:id
```

items ごとに product 名を取得し、
合計金額と一緒に使う必要があります。

どう書きますか？

<details>
<summary>模範解答</summary>

```ts
const uiData = await Promise.all(
  response.map(async (order) => {
    const itemsWithName = await Promise.all(
      order.items.map(async (item) => {
        const res = await fetch(`/api/products/${item.productId}`);
        const product = await res.json();
        return { ...item, name: product.name };
      })
    );

    const totalPrice = itemsWithName.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      orderId: order.id,
      userName: order.user.name,
      totalPrice,
    };
  })
);
```

</details>

---

# 🔹 Step 4：責務分離（最重要）

## 問題 4：どこでやるべきか

次の処理はどこに置くべきか説明してください。

- API 呼び出し
- データ整形
- 表示用計算

(Server / Client / hook)

<details>
<summary>模範解答</summary>

- API 呼び出し：Server or data layer
- データ整形：Server / hook
- 表示用計算：Component

→ UI は「完成形」だけ受け取る

</details>

---

# 🔹 Step 5：useEffect に入れると？

## 問題 5：危険な例

```tsx
useEffect(() => {
  fetchData();
  setTotal(calcTotal(data));
}, [data]);
```

問題点を説明してください。

<details>
<summary>模範解答</summary>

- data 更新 → effect 再実行
- setTotal が不要な再計算を誘発

→ total は導出値
useMemo or 整形済みデータで解決

</details>

---

## まとめ（設計視点）

- 非同期 × 配列は段階分解
- Promise の境界を意識
- UI に近づくほどロジックを減らす

---

🎉 **これで「非同期がわからない感覚」はほぼ卒業です。**

次は：

- パフォーマンス事故ケース集
- 実務コード持ち込みレビュー
- 設計説明ドリル（面接対応）

どれに進みますか？
