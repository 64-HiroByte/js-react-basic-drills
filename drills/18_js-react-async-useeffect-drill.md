# React × 非同期（useEffect 地獄ドリル）

対象：React / Next.js 経験者

解答ファイル: `src/drills/18_react-async-useeffect-drill.jsx`

---

## 目的

useEffect × 非同期処理で起きがちな事故を構造的に理解し、説明できるようにする

> **Note**: 依存配列の詳細は **17_js-useeffect-reduce-dependency-drill.md** を、
> エラーハンドリングは **11_js-async-error-handling-drill.md** を参照してください。

---

## このドリルの狙い（重要）

useEffect は次の 3 点を **必ずセットで考える** 必要があります。

| 考慮点 | 質問 |
|--------|------|
| 1. いつ実行されるか | 依存配列に何を入れる？ |
| 2. 何を更新するか | どの state を更新する？ |
| 3. 再実行を引き起こすか | その更新で無限ループにならない？ |

このドリルでは、以下の事故を **意図的に踏ませて → 正解に修正** します。

| 事故パターン | 症状 |
|------------|------|
| 無限ループ | 画面がフリーズ、CPU 100% |
| 二重 fetch | 開発環境で API が 2 回呼ばれる |
| stale state | 古い値が表示される |
| cleanup 忘れ | メモリリーク、警告メッセージ |

---

# 🔹 Step 1：useEffect × 非同期の基本

## 問題 1：useEffect で async が書けない理由

次のコードはエラーになります。理由を説明し、正しい形に修正してください。

```jsx
useEffect(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();
  setUsers(data);
}, []);
```

現在の出力（コンソール）：

```
Warning: useEffect must not return anything besides a function,
which is used for clean-up.
```

質問：なぜこのエラーが出るのか説明し、正しい形に修正してください。

<details>
<summary>模範解答</summary>

### 問題点

`async` 関数は **必ず Promise を返す**。
useEffect のコールバックは **cleanup 関数 or undefined** を返す必要がある。

### なぜエラーになるか

```
useEffect(async () => { ... })
    ↓
async 関数は Promise を返す
    ↓
useEffect は Promise を cleanup 関数として扱おうとする
    ↓
エラー！
```

### 修正後のコード

```jsx
useEffect(() => {
  const fetchUsers = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    setUsers(data);
  };

  fetchUsers();
}, []);
```

### 解説

- useEffect のコールバック自体は **同期関数** にする
- 内部で async 関数を **定義して即座に呼び出す**
- こうすることで useEffect の戻り値は `undefined` になる

### 別の書き方（即時実行関数）

```jsx
useEffect(() => {
  (async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    setUsers(data);
  })();
}, []);
```

ただし、名前付き関数の方が可読性が高いため推奨。

</details>

---

# 🔹 Step 2：依存配列事故

## 問題 2：無限ループが起きる理由

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
  }, [count]);

  return <p>Count: {count}</p>;
}
```

現在の動作：

```
画面がフリーズする、またはブラウザが警告を出す
"Maximum update depth exceeded"
```

質問：なぜ無限ループになるのか説明してください。

<details>
<summary>模範解答</summary>

### 原因

**自分が更新する state に依存している**

### 無限ループの流れ

```
1. 初回レンダリング → count = 0
2. useEffect 実行 → setCount(0 + 1)
3. count が 1 に変わる
4. 依存配列 [count] が変化 → useEffect 再実行
5. setCount(1 + 1)
6. count が 2 に変わる
7. useEffect 再実行
... 無限に続く
```

### 図解

```
[count] に依存
    ↓
useEffect 実行
    ↓
setCount(count + 1)
    ↓
count 更新
    ↓
依存が変わった！
    ↓
useEffect 再実行 ← 無限ループ
```

### 修正後のコード

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((prev) => prev + 1);  // 関数型更新
  }, []);  // 依存配列を空に

  return <p>Count: {count}</p>;
}
```

### 解説

- **関数型更新** `setCount((prev) => prev + 1)` を使う
- これにより `count` を依存配列に入れる必要がなくなる
- 依存配列が `[]` なので、初回のみ実行される

### ポイント

| パターン | 結果 |
|----------|------|
| `setCount(count + 1)` + `[count]` | 無限ループ |
| `setCount((prev) => prev + 1)` + `[]` | 初回のみ実行 |

</details>

---

# 🔹 Step 3：fetch × 依存配列

## 問題 3：props 依存 fetch

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, []);  // ← 依存配列が空

  return <p>{user?.name}</p>;
}
```

現在の動作：

```
1. userId=1 で表示 → "Leanne Graham"
2. 親が userId=2 に変更
3. 画面は "Leanne Graham" のまま（更新されない！）
```

質問：問題点を指摘し、修正してください。

<details>
<summary>模範解答</summary>

### 問題点

**依存している値 `userId` が依存配列に含まれていない**

### なぜ更新されないか

```
1. 初回レンダリング → useEffect 実行 → userId=1 のデータ取得
2. userId が 2 に変更
3. 依存配列が [] なので useEffect は再実行されない
4. 古いデータ（userId=1）が表示されたまま
```

### 修正後のコード

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);  // ← userId を依存配列に追加

  return <p>{user?.name}</p>;
}
```

### 修正後の動作

```
1. userId=1 で表示 → "Leanne Graham"
2. 親が userId=2 に変更
3. 依存配列 [userId] が変化 → useEffect 再実行
4. userId=2 のデータ取得 → "Ervin Howell" に更新
```

### 原則

**effect 内で使っている値は、すべて依存配列に入れる**

| effect 内で使う値 | 依存配列 |
|------------------|----------|
| `userId` | `[userId]` |
| `userId` と `token` | `[userId, token]` |
| 何も使わない | `[]` |

### ESLint ルール

`react-hooks/exhaustive-deps` を有効にすると、依存配列の漏れを警告してくれる。

</details>

---

# 🔹 Step 4：二重 fetch 問題

## 問題 4：StrictMode で 2 回呼ばれる

```jsx
function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("fetch 実行");
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return <p>ユーザー数: {users.length}</p>;
}
```

開発環境のコンソール：

```
fetch 実行
fetch 実行
```

質問：なぜ fetch が 2 回走るのか説明してください。

<details>
<summary>模範解答</summary>

### 原因

**React 18 の StrictMode** が原因。

### なぜ 2 回実行されるか

StrictMode は開発環境で **副作用の安全性を確認** するため、意図的に useEffect を 2 回実行する。

```
1回目: マウント → useEffect 実行
       ↓
       アンマウント（シミュレート）
       ↓
2回目: 再マウント → useEffect 実行
```

### 本番環境では？

**1 回だけ実行される**。StrictMode の二重実行は開発環境のみ。

### StrictMode の目的

| 目的 | 説明 |
|------|------|
| cleanup 漏れの検出 | アンマウント → 再マウントで cleanup が正しく動くか確認 |
| 副作用の冪等性確認 | 2 回実行しても問題ないか確認 |

### 対策が必要？

基本的には **対策不要**。2 回実行されても問題ないコードを書くのが正解。

ただし、どうしても 1 回だけにしたい場合：

```jsx
useEffect(() => {
  let ignore = false;

  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => {
      if (!ignore) {
        setUsers(data);
      }
    });

  return () => {
    ignore = true;  // cleanup で ignore フラグを立てる
  };
}, []);
```

この書き方は **レースコンディション対策** にもなる（問題 5 で解説）。

</details>

---

# 🔹 Step 5：cleanup 忘れ

## 問題 5：タイマーの cleanup

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("tick");
      setCount((c) => c + 1);
    }, 1000);
  }, []);

  return <p>Count: {count}</p>;
}
```

このコンポーネントがアンマウントされた後のコンソール：

```
tick
tick
tick
... （アンマウント後も続く）

Warning: Can't perform a React state update on an unmounted component.
```

質問：問題点を修正してください。

<details>
<summary>模範解答</summary>

### 問題点

**cleanup 関数を返していない** ため、アンマウント後もタイマーが動き続ける。

### なぜ警告が出るか

```
1. Timer コンポーネントがマウント
2. setInterval 開始
3. Timer コンポーネントがアンマウント
4. setInterval は止まっていない
5. 1秒後に setCount が呼ばれる
6. アンマウント済みのコンポーネントに state 更新 → 警告！
```

### 修正後のコード

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("tick");
      setCount((c) => c + 1);
    }, 1000);

    return () => clearInterval(id);  // ← cleanup 関数を返す
  }, []);

  return <p>Count: {count}</p>;
}
```

### cleanup の動作タイミング

| タイミング | 動作 |
|-----------|------|
| アンマウント時 | cleanup 実行 |
| 依存配列の値が変化時 | 前の cleanup 実行 → 新しい effect 実行 |

### cleanup が必要なケース

| 副作用 | cleanup |
|--------|---------|
| `setInterval` | `clearInterval(id)` |
| `setTimeout` | `clearTimeout(id)` |
| `addEventListener` | `removeEventListener` |
| `WebSocket` | `socket.close()` |
| サブスクリプション | `unsubscribe()` |

### 原則

**開始したものは止める** - これが cleanup の基本。

</details>

---

# 🔹 Step 6：stale state

## 問題 6：古い state を参照してしまう

```jsx
function DelayedCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log("タイマー発火、count =", count);
      setCount(count + 1);
    }, 3000);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

操作手順と結果：

```
1. 初期表示 → Count: 0
2. 1秒後にボタンを3回クリック → Count: 3
3. 3秒後（タイマー発火）→ Count: 1（3ではなく1！）
   コンソール: "タイマー発火、count = 0"
```

質問：なぜ count が 1 になるのか説明し、修正してください。

<details>
<summary>模範解答</summary>

### 問題点

**stale closure（古いクロージャ）** が原因。

### なぜ起きるか

```
1. 初回レンダリング → count = 0
2. useEffect 実行 → setTimeout が作られる
   この時点の count (= 0) がクロージャに閉じ込められる
3. ボタンクリックで count が 3 に更新
4. 3秒後、setTimeout のコールバックが実行
5. クロージャ内の count は 0 のまま
6. setCount(0 + 1) → count = 1
```

### 図解

```
useEffect 実行時（count = 0）
    ↓
setTimeout(() => {
  setCount(count + 1);  // この count は「0」を閉じ込めている
}, 3000);
    ↓
3秒後に実行されても、count は「0」のまま
```

### 修正後のコード

```jsx
function DelayedCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount((prev) => prev + 1);  // 関数型更新で最新の値を取得
    }, 3000);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}
```

### 修正後の動作

```
1. 初期表示 → Count: 0
2. 1秒後にボタンを3回クリック → Count: 3
3. 3秒後（タイマー発火）→ Count: 4 ✅
```

### 解説

- `setCount((prev) => prev + 1)` で **最新の state を取得**
- クロージャに閉じ込められた古い値ではなく、現在の値を使う

### stale closure が起きるパターン

| パターン | 危険度 |
|----------|--------|
| setTimeout / setInterval 内 | 高 |
| イベントリスナー内 | 高 |
| async 関数内 | 中 |

### 対策

1. **関数型更新** `setState((prev) => ...)` を使う
2. **useRef** で最新の値を保持する
3. **依存配列に値を入れる**（ただし effect が再実行される）

</details>

---

# 🔹 Step 7：実務パターン

## 問題 7：ローディング & エラー管理

```jsx
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

現在の問題点：

- ローディング中に何も表示されない
- エラー時に何も表示されない
- レースコンディションの可能性がある

質問：loading / error state とレースコンディション対策を含めた形に修正してください。

<details>
<summary>模範解答</summary>

### 修正後のコード

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;  // レースコンディション対策

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        const data = await res.json();

        if (!ignore) {  // アンマウント済みなら state 更新しない
          setUsers(data);
        }
      } catch (e) {
        if (!ignore) {
          setError(e.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      ignore = true;  // cleanup で ignore フラグを立てる
    };
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 修正ポイント

| 対策 | 実装 |
|------|------|
| ローディング表示 | `loading` state + 条件分岐 |
| エラー表示 | `error` state + try/catch |
| HTTP エラー検出 | `res.ok` チェック |
| レースコンディション | `ignore` フラグ + cleanup |

### レースコンディションとは？

```
1. userId=1 で fetch 開始（遅い）
2. userId=2 に変更 → 新しい fetch 開始（速い）
3. userId=2 の結果が先に返ってくる → setUsers
4. userId=1 の結果が後から返ってくる → setUsers（古いデータで上書き！）
```

`ignore` フラグで、古い fetch の結果を無視する。

### カスタムフック化

この処理は汎用的なので、カスタムフックにすると便利：

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        if (!ignore) setData(json);
      } catch (e) {
        if (!ignore) setError(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();
    return () => { ignore = true; };
  }, [url]);

  return { data, loading, error };
}

// 使用例
function UserList() {
  const { data: users, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

</details>

---

## 🎯 このドリルのまとめ

### チェックリスト

- [ ] useEffect のコールバックに直接 async を付けないことを理解した
- [ ] 依存配列に必要な値を入れることを理解した
- [ ] 無限ループのパターンと回避方法を理解した
- [ ] cleanup の必要性を理解した
- [ ] stale closure の問題と関数型更新を理解した
- [ ] ローディング・エラー・レースコンディション対策を理解した

### パターン表

| 事故 | 原因 | 対策 |
|------|------|------|
| async エラー | useEffect に直接 async | 内部で async 関数を定義 |
| 無限ループ | setXxx と [xxx] | 関数型更新 + [] |
| 古いデータ | 依存配列が空 | 使用する値を依存に追加 |
| メモリリーク | cleanup 忘れ | return () => { ... } |
| stale closure | 古い値を参照 | 関数型更新 |
| レースコンディション | 古い fetch が後から返る | ignore フラグ |

### useEffect の 3 つの構成要素

```jsx
useEffect(() => {
  // 1. 副作用（effect）
  const id = setInterval(...);

  // 2. cleanup
  return () => clearInterval(id);

}, [/* 3. 依存配列 */]);
```

### 関連ドリル

- **17_js-useeffect-reduce-dependency-drill.md**：依存配列と map/reduce
- **11_js-async-error-handling-drill.md**：エラーハンドリング

---

以上。
