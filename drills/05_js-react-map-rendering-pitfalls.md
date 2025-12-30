# React で壊れやすい map・key・再レンダリング ドリル

**保存用ファイル名：`js-react-map-rendering-pitfalls.md`**

対象：React / Next.js 経験者
目的：map・key・再レンダリングの関係を理解し、UI バグを未然に防ぐ

---

## このドリルの狙い

- map と再レンダリングの関係を説明できるようにする
- key の役割と「壊れる理由」を理解する
- stale closure をループと結びつけて理解する

---

# 🔹 map と key 編

## 問題 1：key に index を使うと何が起きるか

```jsx
{
  items.map((item, index) => <ListItem key={index} value={item} />);
}
```

このコードが将来的にバグを生む理由を説明してください。

<details>
<summary>模範解答</summary>

```txt
要素の追加・削除・並び替えが起きると、
React が「同じ要素」と誤認し、
状態や入力値が別の行にズレて紐づく。
```

</details>

---

## 問題 2：正しい key の付け方

```jsx
const users = [
  { id: 10, name: "Taro" },
  { id: 20, name: "Jiro" },
];

// 正しい key を設定する
```

<details>
<summary>模範解答</summary>

```jsx
{
  users.map((user) => <UserRow key={user.id} user={user} />);
}
```

</details>

---

## 問題 3：key が変わると何が起きるか

```jsx
<Component key={count} />
```

このコードの挙動を説明してください。

<details>
<summary>模範解答</summary>

```txt
key が変わるたびにコンポーネントはアンマウントされ、
state や effect がすべて初期化される。
```

</details>

---

# 🔹 再レンダリング 編

## 問題 4：map 内で state 更新

```jsx
items.map((item) => {
  setCount(item.value);
});
```

このコードの問題点を説明してください。

<details>
<summary>模範解答</summary>

```txt
map は「変換」のための関数。
ループ内で state を更新すると再レンダリングが多発し、
意図しない挙動やパフォーマンス低下を招く。
```

</details>

---

## 問題 5：正しい state 更新

```jsx
// items の合計値を state に入れたい
```

<details>
<summary>模範解答</summary>

```jsx
const total = items.reduce((acc, item) => acc + item.value, 0);
setCount(total);
```

</details>

---

# 🔹 stale closure 編

## 問題 6：古い state を参照するバグ

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);
```

このコードの問題点を説明してください。

<details>
<summary>模範解答</summary>

```txt
count は初期値のままクロージャに閉じ込められる。
更新には関数形式の setState を使う必要がある。
```

count の初期値を 0 と仮定する。

初回レンダリング時: count = 0

useEffect が実行される
↓
setInterval 内の関数が作られる
↓
この関数は count = 0 を「記憶」している（クロージャ）
↓
1 秒後: setCount(0 + 1) → count = 1
2 秒後: setCount(0 + 1) → count = 1 ← また 0+1！
3 秒後: setCount(0 + 1) → count = 1 ← ずっと 0+1！

</details>

---

## 問題 7：stale closure の修正

<details>
<summary>模範解答</summary>

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount((prev) => prev + 1); // ✅ 関数形式に変更
  }, 1000);
  return () => clearInterval(id);
}, []);
```

関数形式の setState を使うことで、クロージャに閉じ込められた古い値ではなく、
React が渡す最新の state を参照できる。

</details>

---

# 🔹 実務トラブル再現

## 問題 8：入力フォームがズレる

```jsx
{
  items.map((item, index) => <input key={index} value={item.value} />);
}
```

なぜ入力値がズレるのか説明してください。

<details>
<summary>模範解答</summary>

```txt
key に index を使っているため、
要素の順序変更時に React が DOM を再利用してしまう。
```

</details>

---

以上。
