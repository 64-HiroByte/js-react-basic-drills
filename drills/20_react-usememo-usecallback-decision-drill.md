# useMemo / useCallback 要不要判断ドリル

**保存用ファイル名：`react-usememo-usecallback-decision-drill.md`**

対象：React / Next.js 中級
目的：

- useMemo / useCallback を「必要なときだけ」使えるようにする
- 早すぎる最適化を避ける判断力を養う
- 再レンダリング・参照同一性の理解を深める

---

## 🔰 大原則（最重要）

> **useMemo / useCallback は最適化であり、必須ではない**

次の質問に YES が付くか？

1. 計算コストが高い？（大量データ・重い処理）
2. 参照の同一性が重要？（memo 化された子コンポーネント）
3. 再レンダリングによる実害が確認できている？

→ YES が 0〜1 個なら基本不要

---

# 🔹 問題 1：軽い計算に useMemo

## 状況

```tsx
function Example({ count }: { count: number }) {
  const doubled = useMemo(() => count * 2, [count]);
  return <p>{doubled}</p>;
}
```

## 問題

- useMemo は必要ですか？

<details>
<summary>模範解答</summary>

### 判断

- ❌ 不要

### 理由

- 掛け算は十分軽い
- 最適化のオーバーヘッドの方が大きい

</details>

---

# 🔹 問題 2：重い計算 + useMemo

## 状況

```tsx
function Heavy({ items }: { items: number[] }) {
  const total = useMemo(() => {
    return items.reduce((a, b) => a + b, 0);
  }, [items]);

  return <p>{total}</p>;
}
```

## 問題

- useMemo を使う判断は妥当ですか？

<details>
<summary>模範解答</summary>

### 判断

- △ ケース次第

### 解説

- items が大量 or 頻繁に再レンダリング → 有効
- 小規模なら不要

</details>

---

# 🔹 問題 3：useCallback の典型アンチパターン

## 状況

```tsx
function Parent() {
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return <button onClick={handleClick}>Click</button>;
}
```

## 問題

- この useCallback は必要ですか？

<details>
<summary>模範解答</summary>

### 判断

- ❌ 不要

### 理由

- 子コンポーネントに渡していない
- 再生成されても問題なし

</details>

---

# 🔹 問題 4：memo 化された子 + useCallback

## 状況

```tsx
const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log("render child");
  return <button onClick={onClick}>Child</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <Child onClick={handleClick} />
    </>
  );
}
```

## 問題

- Child は再レンダリングされますか？
- どう防ぎますか？

<details>
<summary>模範解答</summary>

### 回答

- 毎回再レンダリングされる

### 改善例

```tsx
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

### 理由

- 関数参照が毎回変わるため

</details>

---

# 🔹 問題 5：useMemo + オブジェクト生成

## 状況

```tsx
function Example({ value }: { value: number }) {
  const options = { doubled: value * 2 };
  return <Child options={options} />;
}
```

## 問題

- 何が問題？
- どう直す？

<details>
<summary>模範解答</summary>

### 問題点

- 毎レンダリングで新しいオブジェクト

### 改善例

```tsx
const options = useMemo(() => ({ doubled: value * 2 }), [value]);
```

### 条件

- Child が memo 化されている場合のみ有効

</details>

---

# 🔹 問題 6：useMemo の誤用

## 状況

```tsx
const filtered = useMemo(() => items.filter((i) => i > 5), []);
```

## 問題

- 何がバグ？

<details>
<summary>模範解答</summary>

### 問題点

- 依存配列不足

### 正解

```tsx
useMemo(() => items.filter((i) => i > 5), [items]);
```

</details>

---

# 🔹 問題 7：useCallback vs 通常関数

## 状況

```tsx
const handleClick = useCallback(() => {
  setCount(count + 1);
}, []);
```

## 問題

- 何が問題？

<details>
<summary>模範解答</summary>

### 問題点

- stale closure

### 修正例

```tsx
setCount((c) => c + 1);
```

または `[count]` を依存配列に追加

</details>

---

# 🔹 最終チェックリスト

- 本当にパフォーマンス問題はある？
- memo 化された子がいる？
- useMemo / useCallback を外すと何が壊れる？

---

## 結論

- 迷ったら **書かない**
- 必要になってから **測って入れる**

---

以上。
