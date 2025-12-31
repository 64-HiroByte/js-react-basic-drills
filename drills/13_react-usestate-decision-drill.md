# useState 判断力・削減トレーニング

対象：React / Next.js 経験者

解答ファイル: `src/drills/13_react-usestate-decision-drill.jsx`

---

## 目的

- useState を「必要なときだけ」使えるようにする
- 派生 state / 不要な state を削減できる判断力を身につける

> **Note**: このドリルは以下のドリルと関連しています：
> - **21_js-performance-accident-drill.md**：state の無駄遣いによる事故
> - **14_react-useeffect-decision-drill.md**：useEffect の判断力

---

## このドリルの考え方（最重要）

次の質問を**常に自分に投げる**：

| # | 質問 | YES なら |
|---|------|----------|
| 1 | その値は **props から計算できないか？** | state 不要 |
| 2 | その値は **他の state から導出できないか？** | state 不要 |
| 3 | その値は **ユーザー操作によって変わるか？** | state 必要 |
| 4 | その値は **再レンダリングを跨いで保持する必要があるか？** | state 必要 |

---

# 🔹 問題 1：派生 state（典型）

## 状況

ユーザー一覧を表示するコンポーネントです。

```jsx
function UserList({ users }) {
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

### 何が起きているか

```
1. 初回レンダリング（count: 0）← 実際の users.length と不一致！
       │
       ▼
2. useEffect 発火 → setCount(users.length)
       │
       ▼
3. 再レンダリング（count: 正しい値）

→ 無駄なレンダリングが 1 回発生
→ 初回は間違った値が表示される
```

### 改善例

```jsx
function UserList({ users }) {
  return <p>User count: {users.length}</p>;
}
```

### 解説

| 削減したもの | 効果 |
|--------------|------|
| useState | state 管理の複雑さが減る |
| useEffect | 副作用の追跡が不要になる |
| 余計な再レンダリング | パフォーマンス向上 |

</details>

---

# 🔹 問題 2：冗長な boolean state

## 状況

```jsx
function SubmitButton({ disabled }) {
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

### 問題点

| 問題 | 説明 |
|------|------|
| props を state にコピー | 無駄な処理 |
| props 変更時に 1 フレーム遅れる | useEffect は render 後に実行 |
| コードが複雑 | 3 行で済むものが 10 行に |

### 改善例

```jsx
function SubmitButton({ disabled }) {
  return <button disabled={disabled}>Submit</button>;
}
```

### 解説

**props → state のコピーはアンチパターン**

props をそのまま使えばよい。

</details>

---

# 🔹 問題 3：本当に state が必要なケース

## 状況

```jsx
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

| 質問 | 回答 |
|------|------|
| props から計算できる？ | ❌ No（props がない） |
| 他の state から導出できる？ | ❌ No |
| ユーザー操作で変わる？ | ✅ Yes（クリックで変わる） |
| 再レンダリングを跨いで保持？ | ✅ Yes |

→ state が必要なケース

</details>

---

# 🔹 問題 4：複数 state を 1 つにまとめる

## 状況

```jsx
function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
    </form>
  );
}
```

## 問題

- この設計はアリですか？
- まとめるならどう書きますか？

<details>
<summary>模範解答</summary>

### 判断

- **両方アリ**（用途次第）

### 分割版のメリット

```jsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
```

- 各フィールドが独立
- TypeScript で型推論が効きやすい

### 統合版

```jsx
const [form, setForm] = useState({ name: "", email: "" });

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};
```

### 判断基準

| 状況 | 推奨 |
|------|------|
| 同時に更新される（送信時など） | まとめる |
| 独立して更新される | 分ける |
| フィールド数が多い（5個以上） | まとめる |
| バリデーションを一括で行う | まとめる |

</details>

---

# 🔹 問題 5：useState + useEffect の削減

## 状況

```jsx
function FilteredList({ items }) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(items.filter((n) => n > 10));
  }, [items]);

  return <div>{filtered.length} 件</div>;
}
```

## 問題

- この設計の問題点は？
- どう書き換えますか？

<details>
<summary>模範解答</summary>

### 問題点

| 問題 | 説明 |
|------|------|
| **派生データを state にしている** | `filtered` は `items` から計算できる |
| **初回表示が間違っている** | `filtered` は最初 `[]` |
| **useEffect は render 後に実行** | 1 フレーム遅れる |

### 何が起きているか

```
1. 初回レンダリング（filtered: []）← 間違い！
       │
       ▼
2. useEffect 発火 → setFiltered([...])
       │
       ▼
3. 再レンダリング（filtered: 正しい値）
```

### 改善例

```jsx
function FilteredList({ items }) {
  const filtered = items.filter((n) => n > 10);
  return <div>{filtered.length} 件</div>;
}
```

### 重い処理なら useMemo

```jsx
function FilteredList({ items }) {
  const filtered = useMemo(
    () => items.filter((n) => n > 10),
    [items]
  );
  return <div>{filtered.length} 件</div>;
}
```

### ポイント

| 原則 | 説明 |
|------|------|
| **導出値は state にしない** | 計算で得られる値は直接計算 |
| **重い処理は useMemo** | 毎回計算しなくてよい |

</details>

---

# 🔹 問題 6：useState を使わない選択

## 状況

```jsx
function Timer() {
  const start = Date.now();

  return <p>経過時間: {Date.now() - start}ms</p>;
}
```

## 問題

- この表示は更新されますか？
- どうすれば意図通りになりますか？

<details>
<summary>模範解答</summary>

### 回答

- ❌ 更新されない（再レンダリングされない）

### なぜ更新されないか

```
render → Date.now() - start を計算 → 表示
    │
    ▼
（何も起きない）← state が変わらないので再レンダリングされない
```

### 改善案：useEffect + setInterval

```jsx
function Timer() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 100);

    return () => clearInterval(id);
  }, []);

  return <p>経過時間: {elapsed}ms</p>;
}
```

### ポイント

| 要素 | 役割 |
|------|------|
| `useState(elapsed)` | 再レンダリングを引き起こす |
| `useRef(start)` | 開始時刻を保持（再レンダリング不要） |
| `setInterval` | 定期的に更新 |
| cleanup | アンマウント時にクリア |

</details>

---

# 🔹 問題 7：useRef と迷うケース

## 状況

```jsx
function ClickCounter() {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current++;
    console.log(countRef.current);
  };

  return <button onClick={handleClick}>Click ({countRef.current})</button>;
}
```

## 問題

- このコードの問題点は？
- 画面表示に使うなら、どうすべき？

<details>
<summary>模範解答</summary>

### 問題点

- **画面が更新されない**
- `useRef` は値を変更しても再レンダリングしない

### 動作

```
クリック
    │
    ▼
countRef.current++ → 値は増える
    │
    ▼
console.log() → コンソールには表示される
    │
    ▼
画面は更新されない！ ← useRef は再レンダリングしない
```

### 改善案

```jsx
function ClickCounter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1);
  };

  return <button onClick={handleClick}>Click ({count})</button>;
}
```

### useState vs useRef

| 用途 | 使う Hook |
|------|-----------|
| 画面に表示する | useState |
| 表示しない（内部で保持するだけ） | useRef |
| DOM 要素への参照 | useRef |
| 前回の値を記憶する | useRef |

</details>

---

# 🔹 問題 8：配列を直接変更してしまう

## 状況

```jsx
function TodoList() {
  const [items, setItems] = useState(["買い物", "掃除"]);

  const handleAdd = () => {
    items.push("新しいタスク");  // ← 配列を直接変更
    setItems(items);
  };

  return (
    <div>
      <button onClick={handleAdd}>追加</button>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
```

## 問題

- なぜ画面が更新されないことがありますか？

<details>
<summary>模範解答</summary>

### 問題点

- **配列の参照が変わらない** → React が変更を検知できない

### 何が起きるか

```
1. items.push("新しいタスク")
   → 配列の中身は変わる
   → でも参照（アドレス）は同じ

2. setItems(items)
   → React「前と同じ参照だな」
   → 「変更なし」と判断
   → 再レンダリングされない！
```

### 正しい書き方（イミュータブル更新）

```jsx
const handleAdd = () => {
  setItems([...items, "新しいタスク"]);  // 新しい配列を作る
};
```

### よくあるミスと修正

| ミス | 修正 |
|------|------|
| `arr.push(x)` | `[...arr, x]` |
| `arr.pop()` | `arr.slice(0, -1)` |
| `arr[i] = x` | `arr.map((v, idx) => idx === i ? x : v)` |
| `arr.splice(i, 1)` | `arr.filter((_, idx) => idx !== i)` |

### ポイント

| 原則 | 説明 |
|------|------|
| **state は直接変更しない** | 常に新しい参照を作る |
| **スプレッド構文を使う** | `[...arr]`, `{...obj}` |

</details>

---

## 🎯 このドリルのまとめ

### チェックリスト

- [ ] その値は props から計算できないか？
- [ ] その値は他の state から導出できないか？
- [ ] props を state にコピーしていないか？
- [ ] useEffect + setState の組み合わせを削減できないか？
- [ ] 表示に使うなら useState を使っているか？

### パターン表

| パターン | 判断 |
|----------|------|
| props から計算できる値 | ❌ state 不要 |
| 他の state から導出できる値 | ❌ state 不要 |
| props を state にコピー | ❌ アンチパターン |
| ユーザー操作で変わる値 | ✅ state 必要 |
| 画面に表示する値 | ✅ state 必要 |
| 内部で保持するだけの値 | useRef を検討 |

### 関連ドリル

- **21_js-performance-accident-drill.md**：state の無駄遣いによる事故
- **14_react-useeffect-decision-drill.md**：useEffect の判断力
- **19_js-usememo-usecallback-drill.md**：useMemo / useCallback

---

以上。
