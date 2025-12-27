# React パフォーマンス問題 実例 → 改善演習

**保存用ファイル名：`react-performance-refactor-drill.md`**

目的：

- パフォーマンス問題を「感覚」ではなく構造で捉える
- 無駄な再レンダリングを見抜き、改善できるようにする
- useMemo / useCallback / memo を正しい理由で使う

---

## 🔰 大前提

> **パフォーマンス最適化は「問題が起きてから」やる**

ただし：

- 問題が起きる構造は事前に見抜ける

---

# 🔥 実例 1：親の再レンダリングで子が全滅

## Before

```tsx
const Child = ({ value }: { value: number }) => {
  console.log("render child");
  return <p>{value}</p>;
};

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <Child value={1} />
      <Child value={2} />
    </>
  );
}
```

## 問題

- なぜ Child は毎回再レンダリングされる？
- 改善方法は？

<details>
<summary>模範解答</summary>

### 原因

- Parent が再レンダリングされるため

### 改善例

```tsx
const Child = React.memo(({ value }: { value: number }) => {
  return <p>{value}</p>;
});
```

</details>

---

# 🔥 実例 2：props が毎回変わる

## Before

```tsx
function Parent({ value }: { value: number }) {
  const options = { doubled: value * 2 };
  return <Child options={options} />;
}
```

## 問題

- memo 化しても効かない理由は？

<details>
<summary>模範解答</summary>

### 原因

- options が毎回新しいオブジェクト

### 改善

```tsx
const options = useMemo(() => ({ doubled: value * 2 }), [value]);
```

</details>

---

# 🔥 実例 3：無駄な useCallback

## Before

```tsx
function Example() {
  const handleClick = useCallback(() => {
    console.log("click");
  }, []);

  return <button onClick={handleClick}>Click</button>;
}
```

## 問題

- なぜ最適化になっていない？

<details>
<summary>模範解答</summary>

### 理由

- 子に渡していない
- 再レンダリング抑制に寄与しない

</details>

---

# 🔥 実例 4：重い計算の再実行

## Before

```tsx
function Heavy({ items }: { items: number[] }) {
  const total = items.reduce((a, b) => a + b, 0);
  return <p>{total}</p>;
}
```

## 問題

- いつ問題になる？
- どう改善する？

<details>
<summary>模範解答</summary>

### 条件

- items が大量
- 再レンダリング頻発

### 改善

```tsx
const total = useMemo(() => items.reduce((a, b) => a + b, 0), [items]);
```

</details>

---

# 🔥 実例 5：key ミスによる再生成

## Before

```tsx
{
  items.map((item, index) => <Row key={index} value={item} />);
}
```

## 問題

- 何が起きる？

<details>
<summary>模範解答</summary>

### 問題点

- 並び替え・追加で再生成

### 正解

```tsx
<Row key={item.id} />
```

</details>

---

# 🔥 実例 6：state の持ちすぎ

## Before

```tsx
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter((i) => i.active));
}, [items]);
```

## 問題

- パフォーマンス以前の問題は？

<details>
<summary>模範解答</summary>

### 問題点

- 派生 state

### 改善

```tsx
const filtered = items.filter((i) => i.active);
```

</details>

---

# 🔹 最終まとめ

- memo は props が安定して初めて効く
- useCallback / useMemo は「伝播」を止めるため
- state / effect を減らすのが最大の最適化

---

以上。
