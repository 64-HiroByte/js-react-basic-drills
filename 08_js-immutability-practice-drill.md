# Immutability 実践ドリル（事故例ベース）

**保存用ファイル名：`js-immutability-practice-drill.md`**

対象：React / Next.js 経験者
目的：破壊的変更によるバグを即座に見抜き、安全な更新を書けるようにする

---

## このドリルの狙い

- 「動いているように見えるけど危険」なコードを見抜く
- React state 更新で **なぜ immutability が必要か** を説明できる
- map / reduce / spread を正しく使い分ける

---

# 🔹 Step 1：配列の破壊的変更

## 問題 1：push の罠

```js
const items = [1, 2, 3];

const addItem = (list, item) => {
  list.push(item);
  return list;
};
```

質問：この関数の問題点を説明し、修正してください。

<details>
<summary>模範解答</summary>

- push は元の配列を直接変更する（破壊的）
- React state に使うと再レンダリング不整合の原因

```js
const addItem = (list, item) => {
  return [...list, item];
};
```

</details>

---

# 🔹 Step 2：オブジェクトの破壊的変更

## 問題 2：直接代入

```js
const user = { id: 1, name: "Taro", age: 20 };

const updateAge = (u) => {
  u.age = 21;
  return u;
};
```

<details>
<summary>模範解答</summary>

- プロパティ直接代入は破壊的

```js
const updateAge = (u) => ({
  ...u,
  age: 21,
});
```

</details>

---

# 🔹 Step 3：map でも壊れる例

## 問題 3：map = 安全、ではない

```js
const users = [
  { id: 1, name: "Taro", active: false },
  { id: 2, name: "Jiro", active: false },
];

const updated = users.map((user) => {
  user.active = true;
  return user;
});
```

<details>
<summary>模範解答</summary>

- map 自体は非破壊だが、中でオブジェクトを壊している

```js
const updated = users.map((user) => ({
  ...user,
  active: true,
}));
```

</details>

---

# 🔹 Step 4：ネスト構造の更新

## 問題 4：ネストした配列

```js
const state = {
  users: [
    { id: 1, name: "Taro", tags: ["a"] },
    { id: 2, name: "Jiro", tags: ["b"] },
  ],
};

// id === 1 の user に tag "c" を追加
```

<details>
<summary>模範解答</summary>

```js
const nextState = {
  ...state,
  users: state.users.map((user) =>
    user.id === 1 ? { ...user, tags: [...user.tags, "c"] } : user
  ),
};
```

</details>

---

# 🔹 Step 5：reduce での安全な更新

## 問題 5：条件付き更新

```js
const cart = [
  { id: 1, count: 1 },
  { id: 2, count: 2 },
];

// id === 2 の count を +1（reduce）
```

<details>
<summary>模範解答</summary>

```js
const updated = cart.reduce((acc, item) => {
  if (item.id === 2) {
    acc.push({ ...item, count: item.count + 1 });
  } else {
    acc.push(item);
  }
  return acc;
}, []);
```

</details>

---

## 🎯 このドリルのゴール

- 「これは壊しているか？」を反射的に判断できる
- map / reduce の中でも immutability を保てる
- React state 更新に迷いがなくなる

---

以上。
