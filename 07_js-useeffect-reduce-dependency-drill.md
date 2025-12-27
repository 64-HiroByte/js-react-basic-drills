# useEffect × reduce 依存配列事故防止ドリル

**保存用ファイル名：`js-useeffect-reduce-dependency-drill.md`**

対象：React / Next.js 経験者
目的：useEffect の依存配列を「感覚」ではなく「ロジック」で書けるようにする

---

## このドリルの狙い（重要）

- useEffect の再実行条件を **言語化できる** ようにする
- reduce / map が依存配列に与える影響を理解する
- 「なぜ無限ループが起きるのか」を構造で説明できるようにする

---

# 🔹 Step 1：useEffect の再実行条件

## 問題 1：いつ useEffect は再実行されるか

次の useEffect は **いつ実行されるか** 説明してください。

```js
useEffect(() => {
  console.log("effect");
}, [count]);
```

<details>
<summary>模範解答</summary>

- 初回レンダリング時
- `count` の参照が前回と変わったとき

</details>

---

## 問題 2：依存配列に配列を入れると？

```js
useEffect(() => {
  console.log("effect");
}, [items]);
```

`items` が配列の場合、注意点を説明してください。

<details>
<summary>模範解答</summary>

- 配列は参照型
- 中身が同じでも、新しい配列を作ると参照が変わる
- その結果、useEffect が再実行される

</details>

---

# 🔹 Step 2：map / reduce と依存配列

## 問題 3：map が引き起こす再実行

```js
const doubled = numbers.map((n) => n * 2);

useEffect(() => {
  console.log(doubled);
}, [doubled]);
```

このコードで起きる問題を説明してください。

<details>
<summary>模範解答</summary>

- render のたびに map が実行される
- 毎回新しい配列が生成される
- `doubled` の参照が毎回変わる
- useEffect が毎回再実行される

</details>

---

## 問題 4：解決策を考える

問題 3 のコードを **無限再実行しない形** に修正してください。

<details>
<summary>模範解答</summary>

```js
const doubled = useMemo(() => {
  return numbers.map((n) => n * 2);
}, [numbers]);
```

- useMemo で参照を安定させる

</details>

---

# 🔹 Step 3：reduce × useEffect

## 問題 5：reduce を依存配列に入れる罠

```js
const summary = items.reduce(
  (acc, item) => {
    acc.total += item.price;
    return acc;
  },
  { total: 0 }
);

useEffect(() => {
  console.log(summary);
}, [summary]);
```

このコードの問題点を説明してください。

<details>
<summary>模範解答</summary>

- reduce によって毎回新しいオブジェクトが生成される
- summary の参照が毎回変わる
- useEffect が毎回実行される

</details>

---

## 問題 6：正しい設計

reduce の結果を使いつつ、useEffect の再実行を制御してください。

<details>
<summary>模範解答</summary>

```js
const summary = useMemo(() => {
  return items.reduce(
    (acc, item) => {
      acc.total += item.price;
      return acc;
    },
    { total: 0 }
  );
}, [items]);
```

- 依存は `items` のみにする

</details>

---

# 🔹 Step 4：依存配列事故の典型例

## 問題 7：なぜ無限ループになる？

```js
useEffect(() => {
  const result = data.reduce((acc, d) => {
    acc.push(d.value);
    return acc;
  }, []);

  setValues(result);
}, [values]);
```

なぜ無限ループが起きるか説明してください。

<details>
<summary>模範解答</summary>

- useEffect が `values` に依存している
- effect 内で `setValues` を呼んでいる
- state 更新 → 再レンダリング → effect 再実行

</details>

---

## 問題 8：正しい依存設計

上記コードを正しく修正してください。

<details>
<summary>模範解答</summary>

```js
useEffect(() => {
  const result = data.reduce((acc, d) => {
    acc.push(d.value);
    return acc;
  }, []);

  setValues(result);
}, [data]);
```

- effect の依存は「入力データ」にする

</details>

---

# 🔹 Step 5：設計思考チェック

## 問題 9：依存配列に入れる基準を言語化

次の問いに答えてください。

- 依存配列には **何を入れるべきか**？

<details>
<summary>模範解答</summary>

- effect の中で使っている
- かつ、外部から変化しうる値
- 「この値が変わったら再実行したいか？」で判断する

</details>

---

以上。
