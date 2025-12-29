# JS 力が低いと壊れる React 総合演習

**保存用ファイル名：`react-js-foundation-breaks.md`**

目的：

- React の不具合の正体が「JS の理解不足」であることを体感する
- map / filter / reduce / closure / 参照 / イミュータブルの事故を潰す
- レビューで“危険なコード”を言語化できるようにする

---

## 🧠 前提

> React は「状態管理ライブラリ」ではなく、
> **JS の実行結果を UI に反映する仕組み**

JS が曖昧だと、React は必ず壊れる。

---

# 🔥 問題 1：map + key + 再レンダリング事故

```tsx
{
  items.map((item, index) => <Row key={index} value={item} />);
}
```

### 問題

- なぜ UI が壊れる可能性がある？

<details>
<summary>模範解答</summary>

- index は並び替え・削除に弱い
- React が同一要素と誤認する

👉 key は「識別子」である必要がある

</details>

---

# 🔥 問題 2：filter 結果を state に入れる事故

```tsx
const [activeItems, setActiveItems] = useState<Item[]>([]);

useEffect(() => {
  setActiveItems(items.filter((i) => i.active));
}, [items]);
```

### 問題

- 何が問題？

<details>
<summary>模範解答</summary>

- 派生データを state に持っている
- state と props の二重管理

👉 再計算で十分

</details>

---

# 🔥 問題 3：reduce を毎回実行してしまう

```tsx
const total = items.reduce((sum, i) => sum + i.price, 0);
```

### 問題

- いつ問題になる？

<details>
<summary>模範解答</summary>

- items が大きい
- 再レンダリングが頻繁

👉 useMemo 検討

</details>

---

# 🔥 問題 4：クロージャ事故

```tsx
const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1);
};
```

### 問題

- どんな事故が起きる？

<details>
<summary>模範解答</summary>

- stale closure
- 最新の count を使わない

👉 関数型更新

</details>

---

# 🔥 問題 5：参照が変わる props

```tsx
const config = { mode: "dark" };
<Child config={config} />;
```

### 問題

- memo が効かない理由は？

<details>
<summary>模範解答</summary>

- 毎回新しいオブジェクト
- shallow compare に引っかかる

</details>

---

# 🔥 問題 6：配列を直接変更

```tsx
items.push(newItem);
setItems(items);
```

### 問題

- React 的に何が起きる？

<details>
<summary>模範解答</summary>

- 参照が変わらない
- 再レンダリングされない

👉 イミュータブル更新

</details>

---

# 🔥 問題 7：条件分岐の副作用

```tsx
if (items.length === 0) {
  setItems(fetchItems());
}
```

### 問題

- なぜ危険？

<details>
<summary>模範解答</summary>

- render 中に副作用
- 無限ループ

👉 useEffect

</details>

---

# 🔚 総まとめ

- React が壊れる原因の 8 割は JS
- state / effect を減らすほど安全
- 「参照」「派生」「closure」を言語化できれば強い

---

次：
👉 **設計レビュー想定 問題集（最終）**
