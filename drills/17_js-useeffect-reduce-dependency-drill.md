# useEffect × reduce 依存配列事故防止ドリル

対象：React / Next.js 経験者

解答ファイル: `src/drills/17_useeffect-reduce-dependency-drill.jsx`

---

## 目的

useEffect の依存配列を「感覚」ではなく「ロジック」で書けるようにする

---

## このドリルの狙い（重要）

- useEffect の再実行条件を **言語化できる** ようにする
- reduce / map が依存配列に与える影響を理解する
- 「なぜ無限ループが起きるのか」を構造で説明できるようにする

---

# 🔹 Step 1：useEffect の再実行条件

> **Note**: このドリルは以下のドリルと関連しています：
> - **19_js-usememo-usecallback-drill.md**：useMemo / useCallback の判断
> - **21_js-performance-accident-drill.md**：パフォーマンス事故

## 問題 1：いつ useEffect は再実行されるか

次の useEffect は **いつ実行されるか** 説明してください。

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log("effect");
}, [count]);
```

<details>
<summary>模範解答</summary>

- 初回レンダリング時
- `count` の値が前回と変わったとき

### 解説：

React は依存配列の値を **前回のレンダリング時の値と比較** する。
`count` がプリミティブ型（number）なので、**値が同じなら再実行されない**。

```
count: 0 → 0  // 変わらない → effect 実行されない
count: 0 → 1  // 変わった → effect 実行される
```

</details>

---

## 問題 2：依存配列に配列を入れると？

```jsx
const [items, setItems] = useState(["a", "b"]);

useEffect(() => {
  console.log("effect");
}, [items]);
```

`items` が配列の場合、注意点を説明してください。

<details>
<summary>模範解答</summary>

- 配列は **参照型**
- 中身が同じでも、新しい配列を作ると **参照が変わる**
- その結果、useEffect が再実行される

### 具体例：

```jsx
// ❌ 毎回新しい配列を作ると、毎回 effect が実行される
setItems([...items]); // 中身は同じでも参照が違う

// ✅ 同じ参照なら effect は実行されない
setItems(items); // 参照が変わらない
```

### 比較のイメージ：

```
// プリミティブ型（値で比較）
1 === 1  // true

// 参照型（参照で比較）
["a", "b"] === ["a", "b"]  // false（別の配列）
```

</details>

---

# 🔹 Step 2：map / reduce と依存配列

## 問題 3：map が引き起こす再実行

```jsx
function Example({ numbers }) {
  const doubled = numbers.map((n) => n * 2);

  useEffect(() => {
    console.log(doubled);
  }, [doubled]);

  return <div>{doubled.join(", ")}</div>;
}
```

このコードで起きる問題を説明してください。

<details>
<summary>模範解答</summary>

**毎回 useEffect が再実行される**（意図しない再実行）

### なぜ起きるか：

1. コンポーネントがレンダリングされる
2. `numbers.map(...)` が実行される → **毎回新しい配列が生成**
3. `doubled` の参照が前回と異なる
4. React は「依存が変わった」と判断
5. useEffect が再実行される

### 流れのイメージ：

```
1回目: doubled = [2, 4, 6] (参照: A)
2回目: doubled = [2, 4, 6] (参照: B) ← 中身同じでも参照が違う！
       → effect 再実行
```

</details>

---

## 問題 4：解決策を考える

問題 3 のコードを **毎回再実行しない形** に修正してください。

<details>
<summary>模範解答</summary>

```jsx
function Example({ numbers }) {
  const doubled = useMemo(() => {
    return numbers.map((n) => n * 2);
  }, [numbers]);

  useEffect(() => {
    console.log(doubled);
  }, [doubled]);

  return <div>{doubled.join(", ")}</div>;
}
```

### 解説：

- `useMemo` で `doubled` の参照を安定させる
- `numbers` が変わらない限り、同じ参照が返される
- 結果、`doubled` の参照が変わらず、useEffect も再実行されない

### useMemo の動作：

```
numbers: [1,2,3] → [1,2,3]  // 変わらない
doubled: 参照A → 参照A       // useMemoが同じ参照を返す
→ effect 再実行されない

numbers: [1,2,3] → [1,2,3,4]  // 変わった
doubled: 参照A → 参照B         // 新しい配列を生成
→ effect 再実行される
```

</details>

---

# 🔹 Step 3：reduce × useEffect

## 問題 5：reduce を依存配列に入れる罠

```jsx
function Cart({ items }) {
  const summary = items.reduce(
    (acc, item) => {
      acc.total += item.price;
      return acc;
    },
    { total: 0 }
  );

  useEffect(() => {
    // 合計金額が変わったらログを送信
    console.log("合計:", summary.total);
  }, [summary]);

  return <div>合計: {summary.total}円</div>;
}
```

このコードの問題点を説明してください。

<details>
<summary>模範解答</summary>

**問題3と同じ：毎回 useEffect が再実行される**

### なぜ起きるか：

- `reduce` によって **毎回新しいオブジェクト `{ total: 0 }` が生成** される
- `summary` の参照が毎回変わる
- useEffect が毎回実行される

### 問題3との共通点：

| 問題3 (map) | 問題5 (reduce) |
|------------|----------------|
| 毎回新しい配列 | 毎回新しいオブジェクト |
| 参照が変わる | 参照が変わる |
| effect再実行 | effect再実行 |

**map も reduce も、呼び出すたびに新しい値を生成する** という点で同じ。

</details>

---

## 問題 6：正しい設計

reduce の結果を使いつつ、useEffect の再実行を制御してください。

<details>
<summary>模範解答</summary>

```jsx
function Cart({ items }) {
  const summary = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.total += item.price;
        return acc;
      },
      { total: 0 }
    );
  }, [items]);

  useEffect(() => {
    console.log("合計:", summary.total);
  }, [summary]);

  return <div>合計: {summary.total}円</div>;
}
```

### 解説：

- `useMemo` で `summary` の参照を安定させる
- 依存は `items` のみ
- `items` が変わらない限り、`summary` は同じ参照を返す

### 別解：プリミティブ値を依存にする

```jsx
const total = useMemo(() => {
  return items.reduce((acc, item) => acc + item.price, 0);
}, [items]);

useEffect(() => {
  console.log("合計:", total);
}, [total]); // total は number なので、値で比較される
```

プリミティブ値（number, string など）は **値で比較** されるため、
同じ値なら参照問題は起きない。

</details>

---

# 🔹 Step 4：依存配列事故の典型例

## 問題 7：なぜ無限ループになる？

```jsx
function Example({ data }) {
  const [values, setValues] = useState([]);

  useEffect(() => {
    const result = data.reduce((acc, d) => {
      acc.push(d.value);
      return acc;
    }, []);

    setValues(result);
  }, [values]); // ← 問題: valuesに依存している

  return <div>{values.join(", ")}</div>;
}
```

なぜ無限ループが起きるか説明してください。

<details>
<summary>模範解答</summary>

### 無限ループの流れ：

```
1. 初回レンダリング → useEffect 実行
2. setValues(result) → values が新しい配列に更新
3. values が変わった → useEffect 再実行
4. setValues(result) → values が新しい配列に更新
5. values が変わった → useEffect 再実行
... 無限に続く
```

### 問題点：

- **自分が更新する state に依存している**
- effect 内で `setValues` → `values` が変わる → effect 再実行 → 無限ループ

### 図解：

```
[values] 依存
    ↓
useEffect 実行
    ↓
setValues(result)
    ↓
values 更新（新しい参照）
    ↓
依存が変わった！
    ↓
useEffect 再実行 ← 無限ループ
```

</details>

---

## 問題 8：正しい依存設計

上記コードを正しく修正してください。

<details>
<summary>模範解答</summary>

```jsx
function Example({ data }) {
  const [values, setValues] = useState([]);

  useEffect(() => {
    const result = data.reduce((acc, d) => {
      acc.push(d.value);
      return acc;
    }, []);

    setValues(result);
  }, [data]); // ← 修正: dataに依存

  return <div>{values.join(", ")}</div>;
}
```

### 修正ポイント：

- 依存配列を `[values]` → `[data]` に変更
- effect の依存は **「入力データ」** にする
- **「出力先の state」には依存しない**

### 原則：

```
❌ setXxx を呼ぶ effect で [xxx] に依存 → 無限ループ
✅ setXxx を呼ぶ effect で [入力データ] に依存 → OK
```

### 補足：そもそも useEffect が必要か？

このケースでは `useMemo` で済む可能性もある：

```jsx
function Example({ data }) {
  const values = useMemo(() => {
    return data.map((d) => d.value);
  }, [data]);

  return <div>{values.join(", ")}</div>;
}
```

「data から values を派生させる」だけなら、state + useEffect より `useMemo` の方がシンプル。

</details>

---

# 🔹 Step 5：設計思考チェック

## 問題 9：依存配列に入れる基準を言語化

次の問いに答えてください。

- 依存配列には **何を入れるべきか**？

<details>
<summary>模範解答</summary>

### 基準：

1. **effect の中で使っている値**
2. **かつ、レンダリングごとに変わりうる値**

### 具体的には：

| 入れるべき | 入れなくてよい |
|-----------|---------------|
| state | setState 関数（安定している） |
| props | 定数 |
| コンポーネント内で定義した変数 | useRef の `.current` |
| コンポーネント内で定義した関数 | コンポーネント外の値 |

### 判断フロー：

```
Q1: effect 内で使っている？
    No → 入れない
    Yes → Q2へ

Q2: レンダリングで変わる可能性がある？
    No → 入れなくてよい
    Yes → 入れる
```

### このドリルのまとめ：

| 罠 | 原因 | 対策 |
|----|------|------|
| map/reduce の結果を依存に | 毎回新しい参照 | useMemo で安定化 |
| setXxx と [xxx] | 自分で自分を更新 | 入力データに依存 |

</details>

---

以上。
