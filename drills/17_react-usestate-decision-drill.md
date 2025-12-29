# useState 判断力・削減トレーニング

**保存用ファイル名：`react-usestate-decision-drill.md`**

対象：React / Next.js 経験者
目的：

- useState を「必要なときだけ」使えるようにする
- 派生 state / 不要な state を削減できる判断力を身につける

---

## このドリルの考え方（最重要）

次の質問を**常に自分に投げる**：

1. その値は **props から計算できないか？**
2. その値は **state を元に導出できないか？**
3. その値は **ユーザー操作によって変わるか？**
4. その値は **再レンダリングを跨いで保持する必要があるか？**

→ YES が多いほど useState が必要

---

# 🔹 問題 1：派生 state（典型）

## 状況

ユーザー一覧を表示するコンポーネントです。

```tsx
function UserList({ users }: { users: { name: string }[] }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(users.length);
  }, [users]);

  return <p>User count: {count}</p>;
}
```

## 問題

- この `useState` は必要ですか？
- 削減できる場合、どう書き換えますか？

<details>
<summary>模範解答</summary>

### 判断

- ❌ 不要
- `count` は `users` から **常に計算可能**

### 改善例

```tsx
function UserList({ users }: { users: { name: string }[] }) {
  return <p>User count: {users.length}</p>;
}
```

### 解説

- props → 派生可能な値は state にしない
- state と effect を 2 つ減らせる

</details>

---

# 🔹 問題 2：冗長な boolean state

## 状況

```tsx
function SubmitButton({ disabled }: { disabled: boolean }) {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  return <button disabled={isDisabled}>Submit</button>;
}
```

## 問題

- 問題点は？
- どう削減しますか？

<details>
<summary>模範解答</summary>

### 判断

- ❌ state 不要

### 改善例

```tsx
function SubmitButton({ disabled }: { disabled: boolean }) {
  return <button disabled={disabled}>Submit</button>;
}
```

### 解説

- props をそのまま使えばよい
- props → state のコピーはアンチパターン

</details>

---

# 🔹 問題 3：本当に state が必要なケース

## 状況

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

## 問題

- この useState は必要ですか？理由も答えてください。

<details>
<summary>模範解答</summary>

### 判断

- ✅ 必要

### 理由

- ユーザー操作で値が変わる
- 再レンダリングを跨いで保持したい

</details>

---

# 🔹 問題 4：複数 state を 1 つにまとめる

## 状況

```tsx
function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return null;
}
```

## 問題

- この設計はアリですか？
- まとめるならどう書きますか？

<details>
<summary>模範解答</summary>

### 判断

- 両方アリ（用途次第）

### まとめる例

```tsx
const [form, setForm] = useState({ name: "", email: "" });
```

### 判断基準

- 同時に更新される → まとめる
- 独立して更新される → 分ける

</details>

---

# 🔹 問題 5：useState + useEffect の削減

## 状況

```tsx
function FilteredList({ items }: { items: number[] }) {
  const [filtered, setFiltered] = useState<number[]>([]);

  useEffect(() => {
    setFiltered(items.filter((n) => n > 10));
  }, [items]);

  return <div>{filtered.length}</div>;
}
```

## 問題

- この設計の問題点は？
- どう書き換えますか？

<details>
<summary>模範解答</summary>

### 問題点

- 派生データを state にしている

### 改善例

```tsx
function FilteredList({ items }: { items: number[] }) {
  const filtered = items.filter((n) => n > 10);
  return <div>{filtered.length}</div>;
}
```

</details>

---

# 🔹 問題 6：useState を使わない選択

## 状況

```tsx
function Timer() {
  const start = Date.now();

  return <p>{Date.now() - start}</p>;
}
```

## 問題

- この表示は更新されますか？
- どうすれば意図通りになりますか？

<details>
<summary>模範解答</summary>

### 回答

- ❌ 更新されない（再レンダリングされない）

### 改善案

```tsx
const [now, setNow] = useState(Date.now());
```

または `useEffect + setInterval`

</details>

---

# 🔹 問題 7：useRef と迷うケース

## 状況

```tsx
function ClickCounter() {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current++;
    console.log(countRef.current);
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## 問題

- 画面表示に使うなら、どうすべき？

<details>
<summary>模範解答</summary>

### 判断

- 表示するなら useState

```tsx
const [count, setCount] = useState(0);
```

### 判断基準

- 再レンダリングが必要 → useState
- 値保持だけ → useRef

</details>

---

# 🔹 最終チェックリスト

- ❓ その値は props から計算できないか？
- ❓ state を 1 つ減らせないか？
- ❓ useEffect は本当に必要か？

---

以上。
