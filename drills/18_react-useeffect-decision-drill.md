# useEffect 要不要・設計判断トレーニング

**保存用ファイル名：`react-useeffect-decision-drill.md`**

対象：React / Next.js 中級手前〜中級
目的：

- useEffect を「書く前に止まれる」判断力を身につける
- 不要な useEffect / バグの温床を見抜く
- 依存配列・設計ミスを体系的に理解する

---

## 🔰 大原則（最重要）

### useEffect は「最後の手段」

以下に **1 つでも YES が付くか** を常に確認する：

1. **React のレンダリング外の世界**と同期する？（API / DOM / timer / storage）
2. レンダリング中に実行すると **副作用** がある？
3. props / state から **直接計算できない処理**か？

→ YES が 0 個なら、useEffect 不要

---

# 🔹 問題 1：useEffect が完全に不要な例

## 状況

```tsx
function UserCount({ users }: { users: string[] }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(users.length);
  }, [users]);

  return <p>{count}</p>;
}
```

## 問題

- useEffect は必要ですか？
- どう修正すべきですか？

<details>
<summary>模範解答</summary>

### 判断

- ❌ 不要

### 理由

- props から同期的に計算可能
- 副作用ではない

### 改善例

```tsx
function UserCount({ users }: { users: string[] }) {
  return <p>{users.length}</p>;
}
```

</details>

---

# 🔹 問題 2：「とりあえず useEffect」パターン

## 状況

```tsx
function TotalPrice({ items }: { items: number[] }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = items.reduce((a, b) => a + b, 0);
    setTotal(sum);
  }, [items]);

  return <p>{total}</p>;
}
```

## 問題

- 何が問題ですか？
- 設計としてどう直しますか？

<details>
<summary>模範解答</summary>

### 問題点

- 計算処理を副作用にしている

### 改善例

```tsx
function TotalPrice({ items }: { items: number[] }) {
  const total = items.reduce((a, b) => a + b, 0);
  return <p>{total}</p>;
}
```

### ポイント

- 計算 = render 中
- 副作用 = useEffect

</details>

---

# 🔹 問題 3：useEffect が必要な基本例

## 状況

```tsx
function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
```

## 問題

- useEffect は必要ですか？
- なぜですか？

<details>
<summary>模範解答</summary>

### 判断

- ✅ 必要

### 理由

- DOM（React 管理外）を操作している
- 副作用そのもの

</details>

---

# 🔹 問題 4：依存配列が怪しいケース

## 状況

```tsx
function Logger({ value }: { value: number }) {
  useEffect(() => {
    console.log(value);
  }, []);

  return null;
}
```

## 問題

- 何が問題ですか？
- 正しい依存配列は？

<details>
<summary>模範解答</summary>

### 問題点

- stale closure

### 修正

```tsx
useEffect(() => {
  console.log(value);
}, [value]);
```

</details>

---

# 🔹 問題 5：useEffect を書かなくていいケース

## 状況

```tsx
function Filtered({ items }: { items: number[] }) {
  const [filtered, setFiltered] = useState<number[]>([]);

  useEffect(() => {
    setFiltered(items.filter((n) => n > 5));
  }, [items]);

  return <div>{filtered.length}</div>;
}
```

## 問題

- useEffect は必要ですか？
- 削減してください

<details>
<summary>模範解答</summary>

### 判断

- ❌ 不要

### 改善例

```tsx
const filtered = items.filter((n) => n > 5);
```

</details>

---

# 🔹 問題 6：useEffect が本当に必要な非同期処理

## 状況

```tsx
function User() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then(setUser);
  }, []);

  return <pre>{JSON.stringify(user)}</pre>;
}
```

## 問題

- なぜ useEffect が必要ですか？

<details>
<summary>模範解答</summary>

### 理由

- 非同期処理は render 中に実行できない
- 外部 API との同期

</details>

---

# 🔹 問題 7：依存配列に関数がある場合

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

- 何が起きますか？
- どう直しますか？

<details>
<summary>模範解答</summary>

### 問題点

- 毎レンダリングで関数が再生成

### 修正例

```tsx
useEffect(() => {
  console.log(value * 2);
}, [value]);
```

または `useCallback`

</details>

---

# 🔹 問題 8：useEffect に書いてはいけない処理

## 状況

```tsx
useEffect(() => {
  const total = items.reduce((a, b) => a + b, 0);
  setTotal(total);
}, [items]);
```

## 問題

- なぜアンチパターンですか？

<details>
<summary>模範解答</summary>

### 理由

- 計算は副作用ではない
- 再レンダリング増加

</details>

---

# 🔹 最終チェックリスト

- useEffect を **書かなくても実装できないか？**
- render 中に書けない理由は？
- 副作用か、ただの計算か？

---

以上。
