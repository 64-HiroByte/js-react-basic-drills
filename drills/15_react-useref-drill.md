# useRef 完全理解ドリル

対象：React / Next.js 経験者

解答ファイル: `src/drills/15_react-useref-drill.jsx`

---

## 目的

useRef を「正しい場面で使える」状態にする

> **関連ドリル**:
> - useState との使い分けは **13_react-usestate-decision-drill.md** を参照
> - stale closure との関係は **06_js-closure-drill.md** を参照

---

## このドリルの狙い

- useRef の **2つの用途** を理解する
- useState との **使い分け** ができる
- **再レンダリングを起こさない** 値の保持ができる

---

## useRef の2つの用途

| 用途 | 説明 |
|------|------|
| DOM 参照 | 要素に直接アクセスする |
| 値の保持 | 再レンダリングを起こさずに値を保持する |

---

# 🔹 DOM 参照

## 問題 1：input にフォーカス

ボタンをクリックしたら、input にフォーカスを当ててください。

```jsx
function FocusInput() {
  const handleClick = () => {
    // input にフォーカスを当てたい
  };

  return (
    <div>
      <input type="text" />
      <button onClick={handleClick}>フォーカス</button>
    </div>
  );
}
```

<details>
<summary>模範解答・解説</summary>

```jsx
function FocusInput() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>フォーカス</button>
    </div>
  );
}
```

### ポイント

| 要素 | 説明 |
|------|------|
| `useRef(null)` | ref オブジェクトを作成 |
| `ref={inputRef}` | DOM 要素に ref を紐付け |
| `inputRef.current` | DOM 要素にアクセス |

</details>

---

## 問題 2：スクロール位置の制御

リストの一番下にスクロールする機能を実装してください。

```jsx
function ChatList({ messages }) {
  // メッセージが追加されたら一番下にスクロールしたい

  return (
    <div style={{ height: "300px", overflow: "auto" }}>
      {messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
    </div>
  );
}
```

<details>
<summary>模範解答・解説</summary>

```jsx
function ChatList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ height: "300px", overflow: "auto" }}>
      {messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```

### ポイント

- リストの最後に空の `div` を置いて ref を付ける
- `scrollIntoView()` でその要素までスクロール

</details>

---

# 🔹 値の保持（再レンダリングなし）

## 問題 3：useRef vs useState

次のコードの問題点を説明してください。

```jsx
function ClickCounter() {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current++;
    console.log(countRef.current);
  };

  return <button onClick={handleClick}>クリック ({countRef.current})</button>;
}
```

<details>
<summary>模範解答・解説</summary>

### 問題点

**画面が更新されない**

### 動作

```
クリック
    ↓
countRef.current++ → 値は増える
    ↓
console.log() → コンソールには表示される
    ↓
画面は更新されない！ ← useRef は再レンダリングしない
```

### 修正：useState を使う

```jsx
function ClickCounter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(c => c + 1);
  };

  return <button onClick={handleClick}>クリック ({count})</button>;
}
```

### 使い分け

| 用途 | 使う Hook |
|------|-----------|
| 画面に表示する値 | useState |
| 画面に表示しない値 | useRef |

</details>

---

## 問題 4：前回の値を記憶

前回の値と現在の値を両方表示してください。

```jsx
function ValueTracker({ value }) {
  // 前回の value を表示したい
  return (
    <div>
      <p>現在: {value}</p>
      <p>前回: {/* ??? */}</p>
    </div>
  );
}
```

<details>
<summary>模範解答・解説</summary>

```jsx
function ValueTracker({ value }) {
  const prevRef = useRef();

  useEffect(() => {
    prevRef.current = value;
  }, [value]);

  return (
    <div>
      <p>現在: {value}</p>
      <p>前回: {prevRef.current}</p>
    </div>
  );
}
```

### 動作の流れ

```
1. render（value: 10, prevRef.current: undefined）
     ↓
2. useEffect 実行 → prevRef.current = 10
     ↓
3. props 変更（value: 20）
     ↓
4. render（value: 20, prevRef.current: 10）← 前回の値が取れる
     ↓
5. useEffect 実行 → prevRef.current = 20
```

</details>

---

## 問題 5：タイマー ID の保持

1秒ごとにカウントアップするタイマーを作り、ストップボタンで止めてください。

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  const handleStart = () => {
    // タイマーを開始
  };

  const handleStop = () => {
    // タイマーを停止
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleStart}>開始</button>
      <button onClick={handleStop}>停止</button>
    </div>
  );
}
```

<details>
<summary>模範解答・解説</summary>

```jsx
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const handleStart = () => {
    if (intervalRef.current) return; // 二重起動防止

    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  // クリーンアップ
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleStart}>開始</button>
      <button onClick={handleStop}>停止</button>
    </div>
  );
}
```

### なぜ useRef を使うか

- タイマー ID は**画面に表示しない**
- useState だと不要な再レンダリングが起きる
- **複数のレンダリングをまたいで同じ ID を保持**する必要がある

</details>

---

# 🔹 stale closure 対策

## 問題 6：最新の値を参照する

次のコードは、3秒後に「クリック時の count」ではなく「最新の count」を表示したいです。修正してください。

```jsx
function DelayedAlert() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      alert(count); // クリック時の count が表示される
    }, 3000);
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={handleClick}>3秒後にアラート</button>
    </div>
  );
}
```

<details>
<summary>模範解答・解説</summary>

```jsx
function DelayedAlert() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // 最新値を常に ref に保存
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const handleClick = () => {
    setTimeout(() => {
      alert(countRef.current); // ref から最新値を取得
    }, 3000);
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={handleClick}>3秒後にアラート</button>
    </div>
  );
}
```

### なぜ useState だけでは最新値が取れないか

```
1. count = 0 の状態でクリック
     ↓
2. setTimeout のコールバックが count = 0 を「閉じ込める」（クロージャ）
     ↓
3. 3秒の間に count が増える（count = 5）
     ↓
4. setTimeout 実行 → alert(0) ← 古い値！
```

### useRef を使うと

```
1. countRef.current は常に最新の count を保持
2. setTimeout 内で countRef.current を参照
3. 実行時に最新値が取れる
```

</details>

---

## 問題 7：コールバック関数の最新化

親から渡された `onComplete` コールバックを、タイマー完了時に呼び出してください。
ただし、タイマー実行中に `onComplete` が変わった場合は最新のものを呼び出してください。

```jsx
function Timer({ duration, onComplete }) {
  useEffect(() => {
    const id = setTimeout(() => {
      onComplete(); // 古い onComplete が呼ばれる可能性がある
    }, duration);

    return () => clearTimeout(id);
  }, [duration]); // onComplete を依存に入れるとタイマーがリセットされる

  return <p>タイマー実行中...</p>;
}
```

<details>
<summary>模範解答・解説</summary>

```jsx
function Timer({ duration, onComplete }) {
  const onCompleteRef = useRef(onComplete);

  // 最新のコールバックを ref に保存
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const id = setTimeout(() => {
      onCompleteRef.current(); // ref から最新のコールバックを呼ぶ
    }, duration);

    return () => clearTimeout(id);
  }, [duration]);

  return <p>タイマー実行中...</p>;
}
```

### ポイント

- `onComplete` を依存配列に入れると、変更のたびにタイマーがリセットされる
- ref に保存することで、タイマーをリセットせずに最新のコールバックを使える

</details>

---

# 🔹 よくある間違い

## 問題 8：ref を依存配列に入れる

次のコードの問題点を説明してください。

```jsx
function Example() {
  const ref = useRef(0);

  useEffect(() => {
    console.log(ref.current);
  }, [ref.current]); // ← これは正しい？

  return <button onClick={() => ref.current++}>+1</button>;
}
```

<details>
<summary>模範解答・解説</summary>

### 問題点

**ref.current の変更は React に検知されない**

### 何が起きるか

```
1. ボタンクリック → ref.current++
2. ref.current は変わる
3. でも再レンダリングは起きない
4. useEffect も実行されない！
```

### ref.current を依存配列に入れても意味がない理由

- ref.current の変更は React のレンダリングサイクル外
- React は ref.current の変更を追跡しない
- 依存配列のチェックはレンダリング時のみ行われる

### 正しいパターン

ref.current の変更をトリガーにしたい場合は、useState と併用する。

```jsx
function Example() {
  const [, forceRender] = useState(0);
  const ref = useRef(0);

  const handleClick = () => {
    ref.current++;
    forceRender(n => n + 1); // 強制的に再レンダリング
  };

  // ...
}
```

</details>

---

# 🔹 判断フローチャート

```
値を保持したい
    │
    ├─ 画面に表示する？
    │      │
    │      ├─ Yes → useState
    │      │
    │      └─ No → useRef
    │
    └─ DOM 要素にアクセスしたい？
           │
           └─ Yes → useRef
```

### 使い分け早見表

| 用途 | Hook |
|------|------|
| 画面に表示する値 | useState |
| DOM 要素への参照 | useRef |
| タイマー ID | useRef |
| 前回の値 | useRef |
| 最新値の参照（stale closure 対策）| useRef |
| 再レンダリングを起こしたくない値 | useRef |

---

以上。
