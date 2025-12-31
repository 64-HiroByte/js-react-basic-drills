# useEffect 要不要・設計判断トレーニング

対象：React / Next.js 中級手前〜中級

解答ファイル: `src/drills/14_react-useeffect-decision-drill.jsx`

---

## 目的

- useEffect を「書く前に止まれる」判断力を身につける
- 不要な useEffect / バグの温床を見抜く
- 依存配列・設計ミスを体系的に理解する

> **Note**: このドリルは以下のドリルと関連しています：
> - **13_react-usestate-decision-drill.md**：useState の判断力
> - **17_js-useeffect-reduce-dependency-drill.md**：依存配列の最適化
> - **18_js-react-async-useeffect-drill.md**：useEffect 内の非同期処理

---

## 🔰 大原則（最重要）

### useEffect は「最後の手段」

以下の質問に **1 つでも YES** があるか確認する：

| # | 質問 | 例 |
|---|------|-----|
| 1 | React 管理外と同期する？ | API / DOM / timer / storage |
| 2 | レンダリング中に実行すると副作用がある？ | ログ送信、外部状態の変更 |
| 3 | props / state から直接計算できない？ | 非同期データ |

→ **YES が 0 個なら、useEffect 不要**

---

# 🔹 問題 1：useEffect が完全に不要な例

## 状況

```jsx
function UserCount({ users }) {
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

> **Note**: このパターンは **13_react-usestate-decision-drill.md 問題 1** でも扱っています。

<details>
<summary>模範解答</summary>

### 判断

- ❌ 不要

### 3 つの質問で確認

| 質問 | 回答 |
|------|------|
| React 管理外と同期？ | ❌ No |
| 副作用がある？ | ❌ No（計算のみ） |
| 直接計算できない？ | ❌ No（`users.length` で計算可能） |

→ useEffect は不要

### 改善例

```jsx
function UserCount({ users }) {
  return <p>{users.length}</p>;
}
```

</details>

---

# 🔹 問題 2：「とりあえず useEffect」パターン

## 状況

```jsx
function TotalPrice({ items }) {
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

| 問題 | 説明 |
|------|------|
| **計算処理を副作用にしている** | reduce は副作用ではない |
| **初回表示が 0** | useEffect は render 後に実行 |
| **余計な再レンダリング** | setTotal で追加レンダリング |

### 改善例

```jsx
function TotalPrice({ items }) {
  const total = items.reduce((a, b) => a + b, 0);
  return <p>{total}</p>;
}
```

### ポイント

| 処理の種類 | 書く場所 |
|------------|----------|
| 計算 | render 中（直接 or useMemo） |
| 副作用 | useEffect |

</details>

---

# 🔹 問題 3：useEffect が必要な基本例

## 状況

```jsx
function PageTitle({ title }) {
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

### 3 つの質問で確認

| 質問 | 回答 |
|------|------|
| React 管理外と同期？ | ✅ Yes（`document.title` は React 管理外） |
| 副作用がある？ | ✅ Yes（ブラウザの状態を変更） |
| 直接計算できない？ | ✅ Yes（DOM 操作は render 中に実行不可） |

→ useEffect が必要

### useEffect が必要な典型例

| 処理 | 理由 |
|------|------|
| `document.title` の変更 | DOM（React 管理外） |
| `localStorage` の読み書き | ブラウザ API |
| イベントリスナーの登録 | 副作用 |
| タイマー（setInterval） | 副作用 |
| API 呼び出し（fetch） | 非同期 / 副作用 |

</details>

---

# 🔹 問題 4：依存配列が怪しいケース

## 状況

```jsx
function Logger({ value }) {
  useEffect(() => {
    console.log("value:", value);
  }, []); // ← 空の依存配列

  return null;
}
```

## 問題

- 何が問題ですか？
- 正しい依存配列は？

<details>
<summary>模範解答</summary>

### 問題点

- **stale closure**（古い値を参照し続ける）

### 何が起きるか

```
render 1: value = 10
    │
    ▼ useEffect 実行 → console.log(10)

render 2: value = 20
    │
    ▼ useEffect 実行されない！ ← 依存配列が空
    │
    ▼ console.log されない

render 3: value = 30
    │
    ▼ 同様に実行されない
```

### 修正

```jsx
useEffect(() => {
  console.log("value:", value);
}, [value]); // ← value を依存に追加
```

### ポイント

| 原則 | 説明 |
|------|------|
| **ESLint ルールに従う** | `react-hooks/exhaustive-deps` |
| **effect 内で使う値は依存に** | props, state, 関数など |

</details>

---

# 🔹 問題 5：useEffect を書かなくていいケース

## 状況

```jsx
function FilteredList({ items }) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(items.filter((n) => n > 5));
  }, [items]);

  return <div>{filtered.length} 件</div>;
}
```

## 問題

- useEffect は必要ですか？
- 削減してください

> **Note**: このパターンは **13_react-usestate-decision-drill.md 問題 5** でも扱っています。

<details>
<summary>模範解答</summary>

### 判断

- ❌ 不要

### 3 つの質問で確認

| 質問 | 回答 |
|------|------|
| React 管理外と同期？ | ❌ No |
| 副作用がある？ | ❌ No（filter は副作用ではない） |
| 直接計算できない？ | ❌ No（`items.filter(...)` で計算可能） |

### 改善例

```jsx
function FilteredList({ items }) {
  const filtered = items.filter((n) => n > 5);
  return <div>{filtered.length} 件</div>;
}
```

### 重い処理なら useMemo

```jsx
const filtered = useMemo(
  () => items.filter((n) => n > 5),
  [items]
);
```

</details>

---

# 🔹 問題 6：useEffect が本当に必要な非同期処理

## 状況

```jsx
function UserProfile() {
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

### 3 つの質問で確認

| 質問 | 回答 |
|------|------|
| React 管理外と同期？ | ✅ Yes（外部 API） |
| 副作用がある？ | ✅ Yes（ネットワーク通信） |
| 直接計算できない？ | ✅ Yes（非同期データ） |

→ useEffect が必要

### ただし注意点

このコードには改善点があります：

```jsx
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setUser(data);
      });

    return () => {
      ignore = true; // クリーンアップ（競合状態を防ぐ）
    };
  }, []);

  return <pre>{JSON.stringify(user)}</pre>;
}
```

詳しくは **18_js-react-async-useeffect-drill.md** を参照。

</details>

---

# 🔹 問題 7：依存配列に関数がある場合

## 状況

```jsx
function Calculator({ value }) {
  const calc = () => value * 2;

  useEffect(() => {
    console.log(calc());
  }, [calc]);

  return <p>{value}</p>;
}
```

## 問題

- 何が起きますか？
- どう直しますか？

<details>
<summary>模範解答</summary>

### 問題点

- **毎 render で関数が再生成される**
- **useEffect が毎回実行される**

### 何が起きるか

```
render 1: calc = function() {...}  (参照 A)
    │
    ▼ useEffect 実行

render 2: calc = function() {...}  (参照 B)
    │
    ▼ 参照が異なる → useEffect 再実行

→ value が変わっていなくても毎回実行される
```

### 修正例 1：依存を value に変更

```jsx
useEffect(() => {
  console.log(value * 2);
}, [value]);
```

### 修正例 2：useCallback で関数を安定化

```jsx
const calc = useCallback(() => value * 2, [value]);

useEffect(() => {
  console.log(calc());
}, [calc]);
```

### 判断基準

| 状況 | 対策 |
|------|------|
| 関数が単純 | effect 内で直接計算 |
| 関数を他でも使う | useCallback で安定化 |

</details>

---

# 🔹 問題 8：useEffect に書いてはいけない処理

## 状況

```jsx
function OrderTotal({ items }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = items.reduce((a, b) => a + b, 0);
    setTotal(sum);
  }, [items]);

  return <p>合計: {total}</p>;
}
```

## 問題

- なぜアンチパターンですか？

<details>
<summary>模範解答</summary>

### 問題点

| 問題 | 説明 |
|------|------|
| **計算は副作用ではない** | reduce は同期的な計算 |
| **再レンダリング増加** | 初回: 0 → effect 後: 正しい値 |
| **1 フレーム遅れる** | useEffect は render 後に実行 |

### 何が起きているか

```
1. render（total: 0）← 間違った値が一瞬表示
       │
       ▼
2. useEffect 実行 → setTotal(計算結果)
       │
       ▼
3. 再 render（total: 正しい値）

→ 2 回レンダリングしている
→ 初回は間違った値が表示される（フリッカー）
```

### 改善例

```jsx
function OrderTotal({ items }) {
  const total = items.reduce((a, b) => a + b, 0);
  return <p>合計: {total}</p>;
}
```

</details>

---

# 🔹 問題 9：条件付き useEffect（Hooks rules 違反）

## 状況

```jsx
function Example({ isOpen }) {
  if (isOpen) {
    useEffect(() => {
      fetchData();
    }, []);
  }

  return <div>...</div>;
}
```

## 問題

- なぜこのコードは NG ですか？

<details>
<summary>模範解答</summary>

### 問題点

- **Hooks は常に同じ順序で呼ぶ必要がある**（Rules of Hooks）
- 条件分岐内で Hooks を呼ぶと、レンダリングごとに呼び出し順序が変わる

### 何が起きるか

```
render 1: isOpen = true
    → useEffect 呼び出し（1番目）

render 2: isOpen = false
    → useEffect 呼び出されない
    → React が混乱する！
```

### 正しい書き方

```jsx
function Example({ isOpen }) {
  useEffect(() => {
    if (!isOpen) return;  // 条件は effect 内で判定
    fetchData();
  }, [isOpen]);

  return <div>...</div>;
}
```

### ポイント

| NG | OK |
|----|-----|
| `if (条件) { useEffect(...) }` | `useEffect(() => { if (!条件) return; ... })` |

</details>

---

# 🔹 問題 10：render 中の setState

## 状況

```jsx
function Example({ items }) {
  const [data, setData] = useState([]);

  if (items.length === 0) {
    setData(fetchDefaultData());  // ← render 中に setState
  }

  return <div>{data.length}</div>;
}
```

## 問題

- なぜこのコードは危険ですか？

<details>
<summary>模範解答</summary>

### 問題点

- **render 中に setState を呼ぶと無限ループ**になる

### 何が起きるか

```
1. render 開始
    │
    ▼ items.length === 0 → setData 実行
    │
    ▼ state が変わる → 再 render
    │
    ▼ items.length === 0 → setData 実行
    │
    ▼ 無限ループ！
```

### 正しい書き方

```jsx
function Example({ items }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (items.length === 0) {
      setData(fetchDefaultData());
    }
  }, [items]);

  return <div>{data.length}</div>;
}
```

### ポイント

| 原則 | 説明 |
|------|------|
| **render は純粋関数** | 副作用（setState 含む）を直接呼ばない |
| **副作用は useEffect** | イベントハンドラ or useEffect 内で実行 |

</details>

---

## 🎯 このドリルのまとめ

### useEffect 要不要チェックリスト

- [ ] React 管理外（DOM / API / timer）と同期する？
- [ ] レンダリング中に実行すると副作用がある？
- [ ] props / state から直接計算できない？

→ **すべて No なら useEffect 不要**

### パターン表

| パターン | useEffect |
|----------|-----------|
| props から計算できる値 | ❌ 不要 |
| 他の state から導出できる値 | ❌ 不要 |
| API からデータ取得 | ✅ 必要 |
| document.title の変更 | ✅ 必要 |
| イベントリスナーの登録 | ✅ 必要 |
| タイマー（setInterval） | ✅ 必要 |

### 設計原則

| 原則 | 説明 |
|------|------|
| **useEffect は最後の手段** | 書かなくて済むなら書かない |
| **計算は render 中で** | useEffect は副作用のみ |
| **依存配列は正直に** | ESLint に従う |

### 関連ドリル

- **13_react-usestate-decision-drill.md**：useState の判断力
- **17_js-useeffect-reduce-dependency-drill.md**：依存配列の最適化
- **18_js-react-async-useeffect-drill.md**：useEffect 内の非同期処理

---

以上。
