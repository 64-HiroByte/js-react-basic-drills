# stale closure 事故再現ドリル

**保存用ファイル名：`react-stale-closure-accident-drill.md`**

目的：

- stale closure が「なぜ起きるか」を事故ベースで理解する
- 見た目は正しいコードが壊れる理由を説明できるようにする
- 修正パターンを反射的に選べるようにする

---

## 🔰 大前提（超重要）

> **クロージャは「作られた瞬間の値」を閉じ込める**

- 関数はレンダリング時に作られる
- useEffect / useCallback は「過去の値」を保持することがある

---

# 🔥 事故 1：useEffect + 空依存配列

## 事故コード

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

## 問題

- なぜ `count` は増えないように見える？
- どう直す？

<details>
<summary>模範解答</summary>

### 原因

- effect が初回の `count = 0` を閉じ込めている

### 修正例 ①（依存配列）

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);
  }, 1000);
  return () => clearInterval(id);
}, [count]);
```

### 修正例 ②（関数型更新・推奨）

```tsx
setCount((c) => c + 1);
```

</details>

---

# 🔥 事故 2：useCallback + 空依存

## 事故コード

```tsx
function Example() {
  const [value, setValue] = useState(0);

  const log = useCallback(() => {
    console.log(value);
  }, []);

  return (
    <button onClick={() => setValue((v) => v + 1)} onMouseEnter={log}>
      Hover
    </button>
  );
}
```

## 問題

- なぜ常に 0 が出る？

<details>
<summary>模範解答</summary>

### 原因

- useCallback が初期値を保持

### 修正

```tsx
useCallback(() => console.log(value), [value]);
```

</details>

---

# 🔥 事故 3：setState の直接参照

## 事故コード

```tsx
setCount(count + 1);
```

## 問題

- 何が危険？

<details>
<summary>模範解答</summary>

### 問題点

- 古い count を参照する可能性

### 正解

```tsx
setCount((c) => c + 1);
```

</details>

---

# 🔥 事故 4：イベントハンドラの勘違い

## 事故コード

```tsx
function Example({ value }: { value: number }) {
  const handleClick = () => {
    setTimeout(() => {
      console.log(value);
    }, 1000);
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## 問題

- どんなときに事故る？

<details>
<summary>模範解答</summary>

### 事故条件

- 1 秒以内に props が変わる

### 対策

- useRef に最新値を保持

</details>

---

# 🔥 事故 5：useEffect cleanup の勘違い

## 事故コード

```tsx
useEffect(() => {
  console.log(count);
  return () => {
    console.log(count);
  };
}, [count]);
```

## 問題

- cleanup の count は最新？

<details>
<summary>模範解答</summary>

### 回答

- ❌ 違う

### 理由

- cleanup は「前回の値」を参照

</details>

---

# 🔹 最終まとめ（暗記）

- 空依存配列は「初期値固定」
- 関数型更新で 8 割防げる
- 依存配列は嘘をつかない

---

以上。
