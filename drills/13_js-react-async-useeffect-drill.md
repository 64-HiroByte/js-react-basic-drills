# React × 非同期（useEffect 地獄ドリル）

**保存用ファイル名：`js-react-async-useeffect-drill.md`**

対象：React / Next.js 経験者
目的：useEffect × 非同期処理で起きがちな事故を構造的に理解し、説明できるようにする

---

## このドリルの狙い（重要）

useEffect は次の 3 点を **必ずセットで考える** 必要があります。

1. いつ実行されるか（依存配列）
2. 何を更新するか（state）
3. その更新が再実行を引き起こすか

このドリルでは、

- 無限ループ
- 二重 fetch
- stale state
- cleanup 忘れ

を **意図的に踏ませて → 正解に修正** します。

---

# 🔹 Step 1：useEffect × 非同期の基本

## 問題 1：useEffect で async が書けない理由

次のコードはエラーになります。理由を説明し、正しい形に修正してください。

```tsx
useEffect(async () => {
  const res = await fetch("/api/users");
  const data = await res.json();
  setUsers(data);
}, []);
```

<details>
<summary>模範解答</summary>

```tsx
useEffect(() => {
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  fetchUsers();
}, []);
```

**解説**
useEffect のコールバックは Promise を返してはいけない。
cleanup 関数 or undefined を返す必要がある。

</details>

---

# 🔹 Step 2：依存配列事故

## 問題 2：無限ループが起きる理由

```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(count + 1);
}, [count]);
```

なぜ無限ループになるのか説明してください。

<details>
<summary>模範解答</summary>

**原因**

- count が変わる
- effect が再実行される
- setCount が走る
- count が変わる

の無限循環。

**対策例**

```tsx
useEffect(() => {
  setCount((prev) => prev + 1);
}, []);
```

</details>

---

# 🔹 Step 3：fetch × 依存配列

## 問題 3：props 依存 fetch

```tsx
useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then((res) => res.json())
    .then(setUser);
}, []);
```

問題点を指摘し、修正してください。

<details>
<summary>模範解答</summary>

```tsx
useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then((res) => res.json())
    .then(setUser);
}, [userId]);
```

**解説**
依存している値は依存配列に必ず含める。

</details>

---

# 🔹 Step 4：二重 fetch 問題

## 問題 4：StrictMode で 2 回呼ばれる

開発環境で fetch が 2 回走る理由を説明してください。

<details>
<summary>模範解答</summary>

React 18 の StrictMode では、
副作用の安全性確認のため useEffect が 2 回実行される。

本番環境では 1 回。

</details>

---

# 🔹 Step 5：cleanup 忘れ

## 問題 5：タイマーの cleanup

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log("tick");
  }, 1000);
}, []);
```

問題点を修正してください。

<details>
<summary>模範解答</summary>

```tsx
useEffect(() => {
  const id = setInterval(() => {
    console.log("tick");
  }, 1000);

  return () => clearInterval(id);
}, []);
```

**解説**
cleanup を返さないとアンマウント後も処理が残る。

</details>

---

# 🔹 Step 6：stale state

## 問題 6：古い state を参照してしまう

```tsx
useEffect(() => {
  setTimeout(() => {
    setCount(count + 1);
  }, 1000);
}, []);
```

問題点と修正案を示してください。

<details>
<summary>模範解答</summary>

```tsx
useEffect(() => {
  setTimeout(() => {
    setCount((prev) => prev + 1);
  }, 1000);
}, []);
```

**解説**
クロージャに閉じ込められた古い count を使っている。

</details>

---

# 🔹 Step 7：実務パターン

## 問題 7：ローディング & エラー管理

```tsx
useEffect(() => {
  fetch("/api/data")
    .then((res) => res.json())
    .then(setData);
}, []);
```

loading / error state を含めた形に修正してください。

<details>
<summary>模範解答</summary>

```tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/data");
      const data = await res.json();
      setData(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

</details>

---

## まとめ

- useEffect = 実行条件 + 副作用 + cleanup
- 非同期処理は関数内に閉じ込める
- 依存配列は「参照している値すべて」

---

次は 👉 **非同期 × map / reduce（Promise.all 実務変換）** に進むのが最適です。
