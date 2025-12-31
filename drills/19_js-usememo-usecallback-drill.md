# useMemo / useCallback 判断ドリル（最適化事故防止）

対象：React / Next.js 経験者

解答ファイル: `src/drills/19_usememo-usecallback-drill.jsx`

---

## 目的

useMemo / useCallback を「雰囲気」ではなく **判断基準** で使えるようにする

> **Note**: このドリルは以下のドリルと関連しています：
> - **17_js-useeffect-reduce-dependency-drill.md**：依存配列の最適化
> - **21_js-performance-accident-drill.md**：パフォーマンス事故

---

## このドリルの狙い

- useMemo / useCallback の **役割の違い** を明確にする
- 最適化が **逆効果になるケース** を理解する
- 「使う／使わない」を説明できるようにする

---

## 🔰 大前提

> **useMemo / useCallback は最適化であり、必須ではない**

| フック | 目的 | メモ化の対象 |
|--------|------|-------------|
| useMemo | 計算結果をキャッシュ | 値 |
| useCallback | 関数の参照を安定化 | 関数 |

---

# 🔹 Step 1：useMemo の基礎判断

## 問題 1：この useMemo は必要？

```jsx
function Example() {
  const [count, setCount] = useState(0);

  const doubled = useMemo(() => count * 2, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

質問：この `useMemo` は必要ですか？理由とともに答えてください。

<details>
<summary>模範解答</summary>

### 判断

❌ **不要**

### 理由

1. **計算コストが極小**：掛け算 1 回は十分軽い
2. **useMemo 自体にもコスト**がある：
   - 依存配列の比較処理
   - キャッシュの保持
3. 単純な計算では **最適化のオーバーヘッドの方が大きい**

### 修正後のコード

```jsx
function Example() {
  const [count, setCount] = useState(0);

  const doubled = count * 2;  // シンプルに計算

  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

### 判断基準

👉 **重い計算 or 参照の安定化が必要なときのみ useMemo を使う**

</details>

---

# 🔹 Step 2：useMemo が必要なケース

## 問題 2：どこに useMemo を使うべきか

```jsx
function ItemList({ items }) {
  const [searchQuery, setSearchQuery] = useState("");

  // items は親コンポーネントから渡される大量のデータ（1000件以上）
  const filtered = items
    .filter((item) => item.active)
    .map((item) => ({ ...item, label: item.name }));

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="検索..."
      />
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}
```

現在の動作：`searchQuery` が変わるたびに `filter` と `map` が再実行される。

質問：この状況で `useMemo` を使うべきですか？使う場合はどう書きますか？

<details>
<summary>模範解答</summary>

### 判断

✅ **使うべき**（items が大量の場合）

### 理由

1. `searchQuery` の変更で再レンダリングが発生
2. **items は変わっていないのに** 毎回 filter + map が実行される
3. items が大量（1000件以上）だと無駄な計算コストになる

### 修正後のコード

```jsx
function ItemList({ items }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    console.log("filter + map 実行");  // デバッグ用
    return items
      .filter((item) => item.active)
      .map((item) => ({ ...item, label: item.name }));
  }, [items]);  // items が変わったときだけ再計算

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="検索..."
      />
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 動作の違い

```
❌ useMemo なし:
searchQuery 変更 → filter + map 実行（毎回）

✅ useMemo あり:
searchQuery 変更 → filter + map スキップ（items が同じなら）
items 変更     → filter + map 実行
```

### 注意

- items が小規模（数十件程度）なら useMemo は不要
- 「重いかどうか」は **実測して判断** するのが確実

</details>

---

# 🔹 Step 3：useCallback の誤用

## 問題 3：この useCallback は意味がある？

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+1</button>
    </div>
  );
}
```

質問：この `useCallback` は意味がありますか？理由とともに答えてください。

<details>
<summary>模範解答</summary>

### 判断

❌ **意味がない**（むしろ逆効果）

### 理由

1. `count` が依存配列に入っている
2. count が変わるたびに **関数も再生成される**
3. useCallback の「参照を安定させる」メリットがない
4. useCallback 自体のオーバーヘッドだけが残る

### 流れのイメージ

```
count: 0 → handleClick 生成（参照A）
count: 1 → handleClick 再生成（参照B）← useCallback の意味なし！
count: 2 → handleClick 再生成（参照C）
```

### 修正後のコード（useCallback を外す）

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>+1</button>
    </div>
  );
}
```

### 補足：useCallback を使う意味があるパターン

関数型更新を使えば依存配列を空にできる：

```jsx
const handleClick = useCallback(() => {
  setCount(c => c + 1);  // 関数型更新
}, []);  // 依存なし → 参照が安定
```

ただし、これも **子コンポーネントに渡す場合のみ意味がある**。

</details>

---

# 🔹 Step 4：依存配列事故

## 問題 4：何が問題か説明してください

```jsx
function TodoList() {
  const [items, setItems] = useState(["買い物", "掃除"]);
  const [newItem, setNewItem] = useState("");

  const handleAdd = useCallback(() => {
    setItems([...items, newItem]);
    setNewItem("");
  }, []);

  return (
    <div>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button onClick={handleAdd}>追加</button>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
```

現在の動作：
1. 「洗濯」と入力して「追加」をクリック → `["買い物", "掃除", "洗濯"]`
2. 「料理」と入力して「追加」をクリック → `["買い物", "掃除", "料理"]`（洗濯が消える！）

質問：なぜこのバグが起きますか？正しく動作するコードに修正してください。

<details>
<summary>模範解答</summary>

### 問題点

**stale closure（古いクロージャ）** が発生している

### なぜ起きるか

1. `handleAdd` は初回レンダリング時に作成される
2. その時点の `items`（`["買い物", "掃除"]`）を**閉じ込めている**
3. 依存配列が `[]` なので、`items` が更新されても関数は再生成されない
4. 2 回目の追加でも **古い items** を参照してしまう

### 流れのイメージ

```
初回: items = ["買い物", "掃除"]
      handleAdd が作成され、この items を閉じ込める

1回目追加: items = ["買い物", "掃除", "洗濯"]（state は更新）
           handleAdd は更新されない（依存配列が空）

2回目追加: handleAdd 内の items は ["買い物", "掃除"] のまま！
           結果: ["買い物", "掃除", "料理"]
```

### 修正後のコード

```jsx
function TodoList() {
  const [items, setItems] = useState(["買い物", "掃除"]);
  const [newItem, setNewItem] = useState("");

  const handleAdd = useCallback(() => {
    setItems((prev) => [...prev, newItem]);  // 関数型更新で最新の items を取得
    setNewItem("");
  }, [newItem]);  // newItem だけを依存に

  return (
    <div>
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button onClick={handleAdd}>追加</button>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
```

### ポイント

- `setItems((prev) => ...)` の **関数型更新** で最新の state を取得
- これにより `items` を依存配列に入れる必要がなくなる
- `newItem` は関数内で使っているので依存配列に入れる

</details>

---

## 問題 4-2：setTimeout と stale closure

```jsx
function Example({ value }) {
  const handleClick = () => {
    setTimeout(() => {
      console.log(value);  // ← クリック時の value？最新の value？
    }, 1000);
  };

  return <button onClick={handleClick}>Click</button>;
}
```

質問：1秒以内に props が変わった場合、どうなりますか？

<details>
<summary>模範解答</summary>

### 動作

- **クリック時の value** が出力される（最新ではない）

### 流れ

```
1. value = 10 の状態でクリック
   handleClick が実行 → setTimeout 登録
       │
       ▼ setTimeout は value = 10 を閉じ込める

2. 500ms 後に value = 20 に変更
       │
       ▼ handleClick 内の value は 10 のまま

3. 1000ms 後に setTimeout 実行
   → console.log(10)  ← 最新の 20 ではない！
```

### 最新の値が必要な場合：useRef

```jsx
function Example({ value }) {
  const valueRef = useRef(value);
  valueRef.current = value;  // 毎 render で更新

  const handleClick = () => {
    setTimeout(() => {
      console.log(valueRef.current);  // 常に最新
    }, 1000);
  };

  return <button onClick={handleClick}>Click</button>;
}
```

### ポイント

| 取得したい値 | 方法 |
|-------------|------|
| クリック時点の値 | そのまま使う |
| 実行時点の最新値 | useRef に保持 |

</details>

---

## 問題 4-3：cleanup の stale closure

```jsx
useEffect(() => {
  console.log("effect:", count);

  return () => {
    console.log("cleanup:", count);  // ← この count は？
  };
}, [count]);
```

質問：cleanup 関数の `count` は最新値ですか？

<details>
<summary>模範解答</summary>

### 回答

- ❌ **最新値ではない**
- cleanup は **前回の effect 実行時の値** を参照

### 流れ

```
count: 0 → 1 に変更

1. 前回の cleanup 実行
   → console.log("cleanup:", 0)  ← 前回の値！

2. 今回の effect 実行
   → console.log("effect:", 1)
```

### なぜこうなるか

- cleanup 関数は「前回の effect が作った関数」
- 前回の effect は `count = 0` を閉じ込めている

### 活用例：前回の値と今回の値を比較

```jsx
useEffect(() => {
  console.log("今回:", count);

  return () => {
    console.log("前回:", count);  // 意図的に前回の値を使う
  };
}, [count]);
```

</details>

---

# 🔹 Step 5：子コンポーネント最適化

## 問題 5：React.memo とセットで考える

```jsx
// 子コンポーネント（React.memo で最適化済み）
const ExpensiveChild = React.memo(({ onClick }) => {
  console.log("ExpensiveChild レンダリング");
  // 重い処理があると想定
  return <button onClick={onClick}>子コンポーネントのボタン</button>;
});

// 親コンポーネント
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  const handleChildClick = () => {
    console.log("clicked");
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>

      <input value={text} onChange={(e) => setText(e.target.value)} />

      <ExpensiveChild onClick={handleChildClick} />
    </div>
  );
}
```

現在の動作：
- `count` を変更 → `"ExpensiveChild レンダリング"` が出力される
- `text` を変更 → `"ExpensiveChild レンダリング"` が出力される
- **React.memo を使っているのに毎回レンダリングされる！**

質問：なぜ `React.memo` が効いていないのですか？どう修正すれば効くようになりますか？

<details>
<summary>模範解答</summary>

### 問題点

`handleChildClick` が **毎回新しい関数** として生成されている

### なぜ React.memo が効かないか

1. Parent が再レンダリングされる
2. `handleChildClick` が新しく作成される（新しい参照）
3. `ExpensiveChild` に渡される `onClick` の**参照が変わる**
4. React.memo は「props が変わった」と判断
5. 子コンポーネントも再レンダリングされる

### 流れのイメージ

```
count: 0 → 1
  Parent 再レンダリング
    handleChildClick 再生成（参照A → 参照B）
    ExpensiveChild の onClick が変わった！
    → React.memo が効かない
    → ExpensiveChild 再レンダリング
```

### 修正後のコード

```jsx
const ExpensiveChild = React.memo(({ onClick }) => {
  console.log("ExpensiveChild レンダリング");
  return <button onClick={onClick}>子コンポーネントのボタン</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // useCallback で関数の参照を安定させる
  const handleChildClick = useCallback(() => {
    console.log("clicked");
  }, []);  // 依存なし → 参照が変わらない

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>

      <input value={text} onChange={(e) => setText(e.target.value)} />

      <ExpensiveChild onClick={handleChildClick} />
    </div>
  );
}
```

### 修正後の動作

```
count: 0 → 1
  Parent 再レンダリング
    handleChildClick は同じ参照（useCallback）
    ExpensiveChild の onClick は変わらない
    → React.memo が効く
    → ExpensiveChild はレンダリングされない ✅
```

### ポイント

| 状況 | useCallback |
|------|-------------|
| 普通のボタン（子に渡さない） | 不要 |
| React.memo した子に渡す | **必要** |

**React.memo と useCallback はセットで使う**

</details>

---

## 問題 5-2：オブジェクト生成と React.memo

```jsx
function Parent({ value }) {
  const options = { doubled: value * 2 };
  return <MemoChild options={options} />;
}

const MemoChild = React.memo(({ options }) => {
  console.log("MemoChild レンダリング");
  return <p>{options.doubled}</p>;
});
```

質問：`MemoChild` は React.memo されているのに、なぜ毎回再レンダリングされますか？

<details>
<summary>模範解答</summary>

### 問題点

- `options` オブジェクトが **毎レンダリングで新規作成** される
- オブジェクトの参照が変わるため、React.memo が効かない

### 流れのイメージ

```
render 1: options = { doubled: 4 }  (参照 A)
    │
    ▼ MemoChild に渡す

render 2: options = { doubled: 4 }  (参照 B)← 値は同じでも参照が違う！
    │
    ▼ React.memo「props が変わった」と判断
    ▼ MemoChild 再レンダリング
```

### 修正後のコード

```jsx
function Parent({ value }) {
  const options = useMemo(() => ({ doubled: value * 2 }), [value]);
  return <MemoChild options={options} />;
}
```

### ポイント

| 子に渡す props | 安定化の方法 |
|----------------|--------------|
| 関数 | useCallback |
| オブジェクト / 配列 | useMemo |
| プリミティブ値（数値・文字列） | そのままで OK |

</details>

---

# 🔹 Step 6：判断基準まとめ

## 問題 6：次の判断を言語化してください

以下の質問に答えてください：

1. useMemo を使うべき条件は？
2. useMemo を使わない方がいいケースは？
3. useCallback を使うべき条件は？
4. useCallback を使わない方がいいケースは？

<details>
<summary>模範解答</summary>

### 1. useMemo を使うべき条件

| 条件 | 例 |
|------|-----|
| 計算コストが高い | 大量データの filter/map/reduce |
| 参照の安定化が必要 | React.memo した子に渡すオブジェクト |
| 依存が安定している | props や state が頻繁に変わらない |

### 2. useMemo を使わない方がいいケース

| ケース | 理由 |
|--------|------|
| 軽い計算（掛け算など） | オーバーヘッドの方が大きい |
| 依存が毎回変わる | メモ化の意味がない |
| とりあえず付ける | コードが複雑になるだけ |

### 3. useCallback を使うべき条件

| 条件 | 例 |
|------|-----|
| React.memo した子に関数を渡す | `<MemoChild onClick={fn} />` |
| useEffect の依存に関数を入れる | `useEffect(() => {}, [fn])` |
| 関数の参照を安定させたい | カスタムフックの戻り値 |

### 4. useCallback を使わない方がいいケース

| ケース | 理由 |
|--------|------|
| 子コンポーネントに渡さない関数 | 最適化効果がない |
| 依存が毎回変わる | 関数も毎回再生成されるため意味なし |
| とりあえず付ける | コードが複雑になるだけ |

### 判断フローチャート（useMemo）

```
Q1: 計算コストは高い？ or 参照の安定化が必要？
    No  → useMemo を使わない
    Yes → Q2へ

Q2: 依存配列は安定している？
    No  → useMemo を使わない
    Yes → useMemo を使う
```

### 判断フローチャート（useCallback）

```
Q1: React.memo した子に関数を渡す？ or useEffect の依存にする？
    No  → useCallback を使わない
    Yes → Q2へ

Q2: 依存配列は安定している？
    No  → useCallback を使わない
    Yes → useCallback を使う
```

</details>

---

## 🎯 このドリルのまとめ

### チェックリスト

useMemo / useCallback を使う前に自問しよう：

- [ ] 本当にパフォーマンス問題がある？（推測ではなく計測した？）
- [ ] React.memo した子コンポーネントがある？
- [ ] 外すと何が壊れる？

### 原則

| 原則 | 説明 |
|------|------|
| 迷ったら書かない | 最適化は必要になってから |
| 計測してから入れる | 推測で最適化しない |
| セットで使う | React.memo + useCallback |

### 関連ドリル

- **17_js-useeffect-reduce-dependency-drill.md**：依存配列の最適化
- **21_js-performance-accident-drill.md**：パフォーマンス事故

---

以上。
