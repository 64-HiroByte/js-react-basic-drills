# パフォーマンス事故 回避ドリル（React / 非同期 / 配列）

**保存用ファイル名：`js-performance-accident-drill.md`**

対象：React / Next.js 経験者
目的：動くが「遅い・重い・無駄が多い」コードを見抜き、理由を説明できるようにする

---

## このドリルの狙い（重要）

パフォーマンス事故は次の特徴があります。

- バグではない
- レビューで見逃されやすい
- 本番で効いてくる

このドリルでは **事故パターン → なぜダメか → 正解** を徹底的に叩きます。

---

# 🔹 Step 1：無駄な再計算

## 問題 1：毎回重い計算が走る

```tsx
const total = data.reduce((sum, item) => sum + item.price, 0);

return <div>{total}</div>;
```

問題点を説明し、改善してください。

<details>
<summary>模範解答</summary>

```tsx
const total = useMemo(() => {
  return data.reduce((sum, item) => sum + item.price, 0);
}, [data]);
```

**解説**
render ごとに reduce が走るため無駄。

</details>

---

# 🔹 Step 2：map の中で処理しすぎ

## 問題 2：render 内で重い処理

```tsx
return (
  <ul>
    {items.map((item) => {
      const formatted = expensiveFormat(item);
      return <li key={item.id}>{formatted}</li>;
    })}
  </ul>
);
```

<details>
<summary>模範解答</summary>

```tsx
const formattedItems = useMemo(() => {
  return items.map((item) => ({
    ...item,
    formatted: expensiveFormat(item),
  }));
}, [items]);
```

**解説**
描画と計算を分離する。

</details>

---

# 🔹 Step 3：依存配列ミス

## 問題 3：無限ではないが重い

```tsx
useEffect(() => {
  fetchData();
}, [options]);
```

options が毎回新しく生成される場合、何が起きる？

<details>
<summary>模範解答</summary>

- 毎 render options が別参照
- effect が毎回再実行

**対策**

```tsx
const memoOptions = useMemo(() => options, [options.id]);
```

</details>

---

# 🔹 Step 4：Promise の過剰並列

## 問題 4：API を叩きすぎる

```ts
await Promise.all(ids.map((id) => fetch(`/api/${id}`)));
```

問題点と対策を説明してください。

<details>
<summary>模範解答</summary>

- API に過剰負荷
- レート制限・失敗リスク

**対策**

- バッチ API
- chunk 分割
- 順次処理

</details>

---

# 🔹 Step 5：state の分けすぎ

## 問題 5：不要な再レンダリング

```tsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```

改善案を述べてください。

<details>
<summary>模範解答</summary>

```tsx
const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
});
```

**解説**
state をまとめることで更新を制御しやすい。

</details>

---

# 🔹 Step 6：key の事故

## 問題 6：index key の罠

```tsx
items.map((item, index) => <Row key={index} item={item} />);
```

何が問題か説明してください。

<details>
<summary>模範解答</summary>

- 並び替えで state がズレる
- 無駄な再生成

**正解**

```tsx
<Row key={item.id} />
```

</details>

---

## まとめ（事故を防ぐ思考）

- render は軽く
- 重い処理は memo
- effect は依存を疑う
- 並列は正義ではない

---

🎯 ここまで来たら、
**「書ける」→「事故らない」** まで到達しています。

次は：

- 実務コードレビュー模擬
- 設計説明アウトプット訓練

どちらに進みますか？
