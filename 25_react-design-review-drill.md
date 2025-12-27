# 設計レビュー想定 問題集

**保存用ファイル名：`react-design-review-drill.md`**

目的：

- PR レビューで「なんとなく」ではなく理由付きで指摘できる
- 正解/不正解ではなく「設計として良いか」を判断する
- React・JS・Hooks の判断を統合する

---

## 🧠 レビュー前提の考え方

レビューで大事なのは：

- ❌ 書き方が違う
- ❌ 自分の好みと違う

ではなく、

- ✅ バグの温床にならないか
- ✅ 状態の責務が明確か
- ✅ 将来の変更に耐えられるか

---

# 🔍 問題 1：派生データを state に持つ設計

```tsx
const [visibleItems, setVisibleItems] = useState<Item[]>([]);

useEffect(() => {
  setVisibleItems(items.filter((i) => i.visible));
}, [items]);
```

### レビュー観点

- この設計は安全？
- どんな問題が起きうる？

<details>
<summary>模範解答（解説）</summary>

### 何が問題か

- `visibleItems` は `items` から必ず導ける
- **派生データを state にしている**

### 起きうる問題

- items と visibleItems の不整合
- effect の書き忘れ・依存漏れ
- 更新経路が増える

### 改善案

```tsx
const visibleItems = items.filter((i) => i.visible);
```

👉 state を減らすことが最大の安定化

</details>

---

# 🔍 問題 2：useEffect でイベント登録

```tsx
useEffect(() => {
  window.addEventListener("resize", onResize);
}, []);
```

### レビュー観点

- 何が足りない？

<details>
<summary>模範解答（解説）</summary>

### 問題点

- クリーンアップがない
- 再マウント時に多重登録

### 正解例

```tsx
useEffect(() => {
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, [onResize]);
```

### なぜ依存に入れる？

- 関数も closure
- 参照が変わる可能性

</details>

---

# 🔍 問題 3：useCallback の乱用

```tsx
const handleClick = useCallback(() => {
  setCount((c) => c + 1);
}, []);
```

### レビュー観点

- これは最適化？

<details>
<summary>模範解答（解説）</summary>

### 判断基準

- 子に props として渡す？
- memo とセット？

### 今回は？

- 単独使用
- 再レンダリング削減に寄与しない

👉 useCallback 不要

</details>

---

# 🔍 問題 4：依存配列を無視

```tsx
useEffect(() => {
  fetchData(userId);
}, []);
```

### レビュー観点

- 何が危険？

<details>
<summary>模範解答（解説）</summary>

### 問題

- userId が変わっても再取得されない
- stale な userId を閉じ込める

### 改善

```tsx
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

</details>

---

# 🔍 問題 5：条件付き useEffect

```tsx
if (isOpen) {
  useEffect(() => {
    fetchData();
  }, []);
}
```

### レビュー観点

- なぜ NG？

<details>
<summary>模範解答（解説）</summary>

### ルール違反

- Hooks は常に同じ順序で呼ぶ

### 正解構造

```tsx
useEffect(() => {
  if (!isOpen) return;
  fetchData();
}, [isOpen]);
```

</details>

---

# 🔍 問題 6：重い計算 + 再レンダリング

```tsx
const result = expensiveCalc(data);
```

### レビュー観点

- どう判断する？

<details>
<summary>模範解答（解説）</summary>

### 判断基準

- 本当に重い？
- 再レンダリング頻度は？

### 改善するなら

```tsx
const result = useMemo(() => expensiveCalc(data), [data]);
```

👉 先に計測、後で最適化

</details>

---

# 🔚 最終まとめ（超重要）

- state は最小限
- effect は副作用のみに
- memo / callback は伝播防止
- JS の参照・closure 理解が全て

---

🎯 **この md を説明できれば、レビュー担当に十分なレベルです**
