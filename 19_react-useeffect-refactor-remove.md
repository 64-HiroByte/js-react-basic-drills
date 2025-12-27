# useEffect → 削除リファクタリング実例集

**保存用ファイル名：`react-useeffect-refactor-remove.md`**

目的：

- 「useEffect を削除する思考」を身につける
- state / effect 地獄から脱出する
- なぜ消せるのかを説明できるようになる

---

## 基本方針（超重要）

> **useEffect は「書く」より「消す」ほうが難しい**

次を常に疑う：

- これは **ただの計算**では？
- props / state から **導出可能**では？
- state を 1 つ減らせないか？

---

# 🔥 実例 1：派生データ + useEffect

## Before

```tsx
function ItemCount({ items }: { items: string[] }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(items.length);
  }, [items]);

  return <p>{count}</p>;
}
```

## 問題

- useEffect を削除してください
- state も削除できるか考えてください

<details>
<summary>模範解答</summary>

### After

```tsx
function ItemCount({ items }: { items: string[] }) {
  return <p>{items.length}</p>;
}
```

### 解説

- count は常に items から導出可能
- state + effect 両方削除できる

</details>

---

# 🔥 実例 2：filter + useEffect

## Before

```tsx
function FilteredList({ items }: { items: number[] }) {
  const [filtered, setFiltered] = useState<number[]>([]);

  useEffect(() => {
    setFiltered(items.filter((n) => n > 10));
  }, [items]);

  return <div>{filtered.join(", ")}</div>;
}
```

## 問題

- なぜこの useEffect は不要？
- どう書き換える？

<details>
<summary>模範解答</summary>

### After

```tsx
function FilteredList({ items }: { items: number[] }) {
  const filtered = items.filter((n) => n > 10);
  return <div>{filtered.join(", ")}</div>;
}
```

### 解説

- filter は副作用ではない
- 再レンダリング毎に安全に計算可能

</details>

---

# 🔥 実例 3：reduce + useEffect

## Before

```tsx
function Total({ prices }: { prices: number[] }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(prices.reduce((a, b) => a + b, 0));
  }, [prices]);

  return <p>{total}</p>;
}
```

## 問題

- useEffect を消してください

<details>
<summary>模範解答</summary>

### After

```tsx
function Total({ prices }: { prices: number[] }) {
  const total = prices.reduce((a, b) => a + b, 0);
  return <p>{total}</p>;
}
```

### 解説

- 計算処理は render 中

</details>

---

# 🔥 実例 4：props コピー型 useEffect

## Before

```tsx
function Button({ disabled }: { disabled: boolean }) {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  return <button disabled={isDisabled}>Submit</button>;
}
```

## 問題

- 何が無駄？

<details>
<summary>模範解答</summary>

### After

```tsx
function Button({ disabled }: { disabled: boolean }) {
  return <button disabled={disabled}>Submit</button>;
}
```

### 解説

- props → state コピーは不要

</details>

---

# 🔥 実例 5：useEffect + state が両方不要

## Before

```tsx
function Length({ text }: { text: string }) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(text.length);
  }, [text]);

  return <span>{length}</span>;
}
```

## 問題

- 削除できるものを全て削除せよ

<details>
<summary>模範解答</summary>

### After

```tsx
function Length({ text }: { text: string }) {
  return <span>{text.length}</span>;
}
```

</details>

---

# 🔥 実例 6：useEffect を残すべきケース（対比）

## Before

```tsx
function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
```

## 問題

- なぜこれは消せない？

<details>
<summary>模範解答</summary>

### 理由

- DOM 操作は副作用
- React 管理外

</details>

---

# 🔥 実例 7：useEffect を削るための最終チェック

削除を考える前に必ず問う：

- これは **計算**か？ **副作用**か？
- 再レンダリングしても安全か？
- state を 1 つ減らせないか？

---

## 結論

- useEffect は **少ないほど良い**
- 書いたら「消せないか？」を必ず検討

---

以上。
