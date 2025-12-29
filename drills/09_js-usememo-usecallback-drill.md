# useMemo / useCallback 判断ドリル（最適化事故防止）

**保存用ファイル名：`js-usememo-usecallback-drill.md`**

対象：React / Next.js 経験者
目的：useMemo / useCallback を「雰囲気」ではなく **判断基準** で使えるようにする

---

## このドリルの狙い

- useMemo / useCallback の **役割の違い** を明確にする
- 最適化が **逆効果になるケース** を理解する
- 「使う／使わない」を説明できるようにする

---

# 🔹 Step 1：useMemo の基礎判断

## 問題 1：この useMemo は必要？

```js
const doubled = useMemo(() => count * 2, [count]);
```

<details>
<summary>模範解答</summary>

- 不要
- 計算コストが極小で、再計算しても問題ない
- useMemo 自体にもコストがある

👉 **重い計算 or 再レンダリング抑制が目的のときのみ使う**

</details>

---

# 🔹 Step 2：useMemo が必要なケース

## 問題 2：どこに useMemo を使うべきか

```js
const filtered = items
  .filter((item) => item.active)
  .map((item) => ({ ...item, label: item.name }));
```

<details>
<summary>模範解答</summary>

- items が大きい or 再レンダリング頻発なら useMemo

```js
const filtered = useMemo(() => {
  return items
    .filter((item) => item.active)
    .map((item) => ({ ...item, label: item.name }));
}, [items]);
```

</details>

---

# 🔹 Step 3：useCallback の誤用

## 問題 3：この useCallback は意味がある？

```js
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);
```

<details>
<summary>模範解答</summary>

- 多くの場合で不要
- 毎回 count が変わるため関数も再生成される
- useCallback の恩恵がない

👉 **子コンポーネントに渡す場合のみ意味を持つことが多い**

</details>

---

# 🔹 Step 4：依存配列事故

## 問題 4：何が問題か説明してください

```js
const handleAdd = useCallback(() => {
  setItems([...items, newItem]);
}, []);
```

<details>
<summary>模範解答</summary>

- items を参照しているのに依存配列に入っていない
- stale closure が発生する

```js
const handleAdd = useCallback(() => {
  setItems((prev) => [...prev, newItem]);
}, [newItem]);
```

</details>

---

# 🔹 Step 5：子コンポーネント最適化

## 問題 5：React.memo とセットで考える

```js
const Child = React.memo(({ onClick }) => {
  console.log("render");
  return <button onClick={onClick}>+</button>;
});
```

親側はどう書くべきか？

<details>
<summary>模範解答</summary>

```js
const onClick = useCallback(() => {
  setCount((c) => c + 1);
}, []);
```

- React.memo + useCallback がセット
- props の参照が安定する

</details>

---

# 🔹 Step 6：判断基準まとめ

## 問題 6：次の判断を言語化してください

- useMemo を使う条件
- useCallback を使う条件

<details>
<summary>模範解答</summary>

### useMemo

- 計算コストが高い
- 再レンダリングが頻発する
- 依存配列が安定している

### useCallback

- 関数を props として渡す
- React.memo と組み合わせる

</details>

---

## 🎯 このドリルのゴール

- 「とりあえず使う」を卒業する
- 最適化によるバグを防げる
- レビューで理由を説明できる

---

以上。
