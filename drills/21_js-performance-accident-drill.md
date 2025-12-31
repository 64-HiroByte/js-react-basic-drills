# パフォーマンス事故 回避ドリル（React / 非同期 / 配列）

対象：React / Next.js 経験者

解答ファイル: `src/drills/21_performance-accident-drill.jsx`

---

## 目的

動くが「遅い・重い・無駄が多い」コードを見抜き、理由を説明できるようにする

> **Note**: このドリルは以下のドリルの知識を前提としています：
> - **19_js-usememo-usecallback-drill.md**：useMemo / useCallback の使いどころ
> - **17_js-useeffect-reduce-dependency-drill.md**：依存配列の最適化
> - **12_js-async-map-reduce-drill.md**：並列 / 直列実行の使い分け

---

## このドリルの狙い（重要）

パフォーマンス事故は次の特徴があります。

| 特徴 | 説明 |
|------|------|
| バグではない | 動作は正しいので気づきにくい |
| レビューで見逃されやすい | 「動く」から通ってしまう |
| 本番で効いてくる | データ量が増えると顕在化 |

このドリルでは **事故パターン → なぜダメか → 正解** を徹底的に叩きます。

---

# 🔹 Step 1：無駄な再計算

## 問題 1：毎回重い計算が走る

以下のコードの問題点を説明し、改善してください。

```jsx
function OrderSummary({ data }) {
  const total = data.reduce((sum, item) => sum + item.price, 0);

  return <div>合計: {total}円</div>;
}
```

<details>
<summary>模範解答</summary>

### 問題点

| 問題 | 説明 |
|------|------|
| **毎回 reduce が実行される** | 親の再レンダリングでも計算される |
| **data が変わらなくても再計算** | 無駄なCPU消費 |

### 何が起きているか

```
親コンポーネントの state 変更
    │
    ▼
OrderSummary 再レンダリング
    │
    ▼
reduce が実行される ← data が同じでも！
    │
    ▼
同じ結果が返る（無駄）
```

### 改善版

```jsx
import { useMemo } from "react";

function OrderSummary({ data }) {
  const total = useMemo(() => {
    console.log("reduce 実行"); // デバッグ用
    return data.reduce((sum, item) => sum + item.price, 0);
  }, [data]); // data が変わったときだけ再計算

  return <div>合計: {total}円</div>;
}
```

### useMemo を使うべき判断基準

| 条件 | useMemo が必要？ |
|------|------------------|
| 計算が O(n) 以上 | ✅ 検討すべき |
| データが大量（100件以上） | ✅ 検討すべき |
| 頻繁に再レンダリングされる | ✅ 検討すべき |
| 単純なプロパティアクセス | ❌ 不要 |

### ポイント

- **useMemo は「メモ化」**：同じ入力なら同じ出力を再利用
- **依存配列** `[data]`：data が変わったときだけ再計算

</details>

---

# 🔹 Step 2：map の中で処理しすぎ

## 問題 2：render 内で重い処理

以下のコードの問題点を説明し、改善してください。

```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map((item) => {
        // 重い整形処理（日付変換、通貨フォーマット等）
        const formatted = expensiveFormat(item);
        return <li key={item.id}>{formatted.displayText}</li>;
      })}
    </ul>
  );
}

// 重い処理のシミュレーション
function expensiveFormat(item) {
  // 実際には日付パース、通貨変換、文字列操作など
  let result = item.name;
  for (let i = 0; i < 1000; i++) {
    result = result.toUpperCase().toLowerCase();
  }
  return { displayText: result };
}
```

<details>
<summary>模範解答</summary>

### 問題点

| 問題 | 説明 |
|------|------|
| **render のたびに全件処理** | 100件なら100回の重い処理 |
| **無関係な state 変更でも再処理** | items が変わらなくても |

### 何が起きているか

```
コンポーネント再レンダリング
    │
    ▼
JSX 生成開始
    │
    ▼
items.map 実行
    ├─ expensiveFormat(item[0]) ← 重い
    ├─ expensiveFormat(item[1]) ← 重い
    ├─ expensiveFormat(item[2]) ← 重い
    └─ ... × n回

→ items が同じでも毎回実行される
```

### 改善版

```jsx
import { useMemo } from "react";

function ItemList({ items }) {
  // 描画と計算を分離
  const formattedItems = useMemo(() => {
    console.log("整形処理実行");
    return items.map((item) => ({
      id: item.id,
      displayText: expensiveFormat(item).displayText,
    }));
  }, [items]);

  return (
    <ul>
      {formattedItems.map((item) => (
        <li key={item.id}>{item.displayText}</li>
      ))}
    </ul>
  );
}
```

### ポイント

| 原則 | 説明 |
|------|------|
| **計算と描画を分離** | useMemo で計算結果をキャッシュ |
| **render 内は軽く** | 整形済みデータを表示するだけ |

</details>

---

# 🔹 Step 3：依存配列ミス

## 問題 3：無限ではないが重い

以下のコードで、`options` が毎回新しく生成される場合、何が起きますか？

```jsx
function DataFetcher({ userId }) {
  const [data, setData] = useState(null);

  // 毎回新しいオブジェクトが作られる
  const options = { userId, limit: 10 };

  useEffect(() => {
    console.log("fetch 実行");
    fetchData(options).then(setData);
  }, [options]); // ← 問題！

  return <div>{data?.name}</div>;
}
```

<details>
<summary>模範解答</summary>

### 何が起きるか

```
render 1: options = { userId: 1, limit: 10 }  (参照 A)
    │
    ▼ useEffect 実行 → fetch

render 2: options = { userId: 1, limit: 10 }  (参照 B)
    │
    ▼ 参照が異なる → useEffect 再実行 → fetch

render 3: options = { userId: 1, limit: 10 }  (参照 C)
    │
    ▼ 参照が異なる → useEffect 再実行 → fetch

→ 値は同じでも参照が異なるため毎回 fetch される！
```

### 問題点

| 問題 | 説明 |
|------|------|
| **オブジェクトの参照比較** | `{} === {}` は `false` |
| **毎 render で新しいオブジェクト** | 依存配列が「変わった」と判定 |
| **不要な API 呼び出し** | ネットワーク負荷、レート制限リスク |

### 改善版 1：プリミティブ値を依存に

```jsx
function DataFetcher({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const options = { userId, limit: 10 };
    fetchData(options).then(setData);
  }, [userId]); // ← プリミティブ値だけを依存に

  return <div>{data?.name}</div>;
}
```

### 改善版 2：useMemo でオブジェクトを安定化

```jsx
function DataFetcher({ userId }) {
  const [data, setData] = useState(null);

  const options = useMemo(() => ({
    userId,
    limit: 10,
  }), [userId]); // userId が変わったときだけ新しいオブジェクト

  useEffect(() => {
    fetchData(options).then(setData);
  }, [options]);

  return <div>{data?.name}</div>;
}
```

### 判断基準

| 状況 | 対策 |
|------|------|
| オブジェクトの中身が単純 | プリミティブ値を依存に |
| オブジェクトを他でも使う | useMemo で安定化 |

</details>

---

# 🔹 Step 4：Promise の過剰並列

## 問題 4：API を叩きすぎる

以下のコードの問題点と対策を説明してください。

```js
const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, /* ... 100件 */];

const fetchAllUsers = async () => {
  const users = await Promise.all(
    ids.map((id) => fetch(`https://api.example.com/users/${id}`))
  );
  return users;
};
```

<details>
<summary>模範解答</summary>

### 問題点

| 問題 | 説明 |
|------|------|
| **同時に大量のリクエスト** | 100件なら100同時接続 |
| **API サーバーへの過負荷** | サーバーがダウンするリスク |
| **レート制限** | 429 Too Many Requests |
| **ブラウザの接続制限** | 同一ホストへの同時接続数に上限 |

### 何が起きているか

```
Promise.all 開始
    │
    ├─ fetch(/users/1)   ──┐
    ├─ fetch(/users/2)   ──┤
    ├─ fetch(/users/3)   ──┤
    │  ...                 ├── 100件同時発火！
    ├─ fetch(/users/99)  ──┤
    └─ fetch(/users/100) ──┘

→ サーバーが悲鳴を上げる
```

### 対策 1：バッチ API を使う

```js
// 1回のリクエストで複数取得（API がサポートしている場合）
const users = await fetch("/api/users?ids=1,2,3,4,5");
```

### 対策 2：チャンク分割（並列数を制限）

```js
// 5件ずつ並列実行
const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const fetchWithLimit = async (ids, concurrency = 5) => {
  const chunks = chunk(ids, concurrency);
  const results = [];

  for (const chunkIds of chunks) {
    const chunkResults = await Promise.all(
      chunkIds.map((id) =>
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
          .then((r) => r.json())
      )
    );
    results.push(...chunkResults);
  }

  return results;
};

// 実行（3件ずつ並列）
fetchWithLimit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3).then(console.log);
```

### 対策 3：完全直列（レート制限が厳しい場合）

```js
const fetchSequential = async (ids) => {
  const results = [];
  for (const id of ids) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const user = await res.json();
    results.push(user);
  }
  return results;
};
```

### 使い分け

| パターン | 使うケース |
|----------|------------|
| バッチ API | API がサポートしている場合（最も効率的） |
| チャンク分割 | 適度な並列化が必要な場合 |
| 完全直列 | レート制限が厳しい場合 |

### ポイント

**並列は正義ではない**：状況に応じて並列数を制御する

</details>

---

# 🔹 Step 5：state の分けすぎ

## 問題 5：不要な再レンダリング

以下のフォームコードの改善案を述べてください。

```jsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```

<details>
<summary>模範解答</summary>

### 改善版：state をまとめる

```jsx
const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};
```

### 比較

| 観点 | 分割版 | 統合版 |
|------|--------|--------|
| 送信時の取得 | 各変数を集める | `form` をそのまま使える |
| リセット | 各 set を呼ぶ | `setForm(初期値)` で一発 |
| バリデーション | 各変数を参照 | 1つのオブジェクトで管理 |

### ただし

この例自体は **大きな問題ではありません**。分割 state も十分実用的です。

### 本当に問題なのは「導出値を state にする」ケース

```jsx
// ❌ 問題：user から取得できる値を state にコピーしている
function UserProfile({ user }) {
  const [name, setName] = useState(user.name);     // ← user.name で済む
  const [email, setEmail] = useState(user.email);  // ← user.email で済む

  return <div>{name} / {email}</div>;
}

// ✅ 改善：props を直接使う
function UserProfile({ user }) {
  return <div>{user.name} / {user.email}</div>;
}
```

### ポイント

| 原則 | 説明 |
|------|------|
| **関連する state はまとめる** | フォームなど一緒に更新されるもの |
| **props から取得できる値は state にしない** | 無駄なコピーを避ける |

</details>

---

# 🔹 Step 6：key の事故

## 問題 6：index key の罠

```jsx
items.map((item, index) => <Row key={index} item={item} />);
```

何が問題か説明してください。

> **Note**: key の詳細は **16_js-react-map-rendering-pitfalls.md** を参照してください。

<details>
<summary>模範解答</summary>

### 問題点

- 並び替え・削除で state がズレる
- 次の要素が前の state を引き継いでしまう

### 改善版

```jsx
<Row key={item.id} item={item} />
```

### ポイント

**一意で安定した値を key に**：`item.id` など

</details>

---

## 🎯 このドリルのまとめ

### 事故パターン一覧

| # | 事故 | 症状 | 対策 |
|---|------|------|------|
| 1 | 無駄な再計算 | 重い処理が毎 render 実行 | useMemo |
| 2 | render 内の重い処理 | map 内で計算 | useMemo で事前計算 |
| 3 | 依存配列のオブジェクト | effect が毎回実行 | プリミティブ値 or useMemo |
| 4 | 過剰並列 | API 過負荷 | チャンク分割 / 直列 |
| 5 | props を state にコピー | 無駄な state | props を直接使う |
| 6 | index key | state ズレ | id を使う |

### チェックリスト

- [ ] reduce / filter / map が render 内で直接実行されていないか
- [ ] useEffect の依存配列にオブジェクトが入っていないか
- [ ] Promise.all で大量の API を叩いていないか
- [ ] props から取得できる値を state にしていないか
- [ ] key に index を使っていないか

### 設計原則

| 原則 | 説明 |
|------|------|
| **render は軽く** | 重い処理は useMemo |
| **effect は依存を疑う** | オブジェクト参照に注意 |
| **並列は正義ではない** | 状況に応じて制御 |
| **props は直接使う** | 無駄なコピーを避ける |

### 関連ドリル

- **16_js-react-map-rendering-pitfalls.md**：map・key・再レンダリング
- **19_js-usememo-usecallback-drill.md**：useMemo / useCallback の使いどころ
- **17_js-useeffect-reduce-dependency-drill.md**：依存配列の最適化

---

以上。
