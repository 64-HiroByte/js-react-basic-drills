# 依存配列 完全理解ドリル

**保存用ファイル名：`react-dependency-array-complete-drill.md`**

目的：

- 依存配列を「雰囲気」で書かない
- なぜその依存が必要かを説明できるようになる
- stale closure / 無限ループ / 意図しない再実行を防ぐ

---

## 🔰 超重要な前提

> **依存配列 = その中で使っている“変わり得る値”の宣言**

- props / state / 関数 / オブジェクト
- 再レンダリングで変わる可能性があるものは依存に含める

---

# 🔹 問題 1：基本（state）

## 状況

```tsx
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, []);
}
```

## 問題

- 何が問題？
- 正しい依存配列は？

<details>
<summary>模範解答</summary>

### 問題点

- stale closure

### 正解

```tsx
useEffect(() => {
  console.log(count);
}, [count]);
```

</details>

---

# 🔹 問題 2：props

## 状況

```tsx
function Logger({ value }: { value: number }) {
  useEffect(() => {
    console.log(value);
  }, []);
}
```

## 問題

- 何が問題？

<details>
<summary>模範解答</summary>

### 正解

```tsx
[value];
```

### 理由

- props も変わる

</details>

---

# 🔹 問題 3：関数依存

## 状況

```tsx
function Example({ value }: { value: number }) {
  const calc = () => value * 2;

  useEffect(() => {
    console.log(calc());
  }, [calc]);
}
```

## 問題

- 何が起きる？
- どう直す？

<details>
<summary>模範解答</summary>

### 問題点

- 毎レンダリングで再実行

### 修正例

```tsx
useEffect(() => {
  console.log(value * 2);
}, [value]);
```

</details>

---

# 🔹 問題 4：オブジェクト依存

## 状況

```tsx
useEffect(() => {
  console.log(options);
}, [options]);
```

## 問題

- 何が問題？

<details>
<summary>模範解答</summary>

### 問題点

- options が毎回新しく生成される

### 対策

- useMemo で固定

</details>

---

# 🔹 問題 5：setState は依存？

## 状況

```tsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
```

## 問題

- 無限ループする？

<details>
<summary>模範解答</summary>

### 回答

- ❌ する

### 修正

```tsx
setCount((c) => c + 1);
```

</details>

---

# 🔹 問題 6：依存配列を空にしていいケース

## 状況

```tsx
useEffect(() => {
  fetch("/api/data");
}, []);
```

## 問題

- これは OK？

<details>
<summary>模範解答</summary>

### 回答

- 条件付きで OK

### 条件

- 初回マウント時のみ
- 依存する値を使っていない

</details>

---

# 🔹 問題 7：useCallback の依存配列

## 状況

```tsx
const handleClick = useCallback(() => {
  console.log(value);
}, []);
```

## 問題

- 何が問題？

<details>
<summary>模範解答</summary>

### 問題点

- stale closure

### 正解

```tsx
[value];
```

</details>

---

# 🔹 最終ルール（暗記）

- ESLint の警告は基本 **正しい**
- 消したくなったら設計を疑う
- 依存配列は「契約」

---

以上。
