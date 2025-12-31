# スプレッド構文・残余引数 完全理解ドリル

対象：React / Next.js 経験者
目的：スプレッド構文と残余引数（rest）を「迷わず使える」状態にする

> **関連ドリル**:
> - 分割代入は **03_js-destructuring-drill.md** を参照
> - イミュータブル操作は **09_js-immutability-practice-drill.md** を参照

---

## このドリルの狙い

- スプレッド構文で **コピー・マージ・展開** ができる
- 残余引数（rest）で **残りをまとめて取得** できる
- React の state 更新で **正しく使える**

---

# 🔹 配列のスプレッド構文

## 問題 1：配列のコピー

次の配列をコピーしてください。元の配列に影響を与えないようにしてください。

```js
const original = [1, 2, 3];

// コピーを作成
const copy = ???

copy.push(4);
console.log(original); // [1, 2, 3] のままにしたい
```

<details>
<summary>模範解答・解説</summary>

```js
const original = [1, 2, 3];

const copy = [...original];

copy.push(4);
console.log(original); // [1, 2, 3]
console.log(copy);     // [1, 2, 3, 4]
```

### なぜ直接代入ではダメか

```js
const copy = original; // ❌ 参照のコピー（同じ配列を指す）
copy.push(4);
console.log(original); // [1, 2, 3, 4] ← 元も変わる！
```

</details>

---

## 問題 2：配列の結合

2つの配列を結合して新しい配列を作ってください。

```js
const arr1 = [1, 2];
const arr2 = [3, 4];

// [1, 2, 3, 4] を作りたい
```

<details>
<summary>模範解答・解説</summary>

```js
const arr1 = [1, 2];
const arr2 = [3, 4];

const merged = [...arr1, ...arr2];
console.log(merged); // [1, 2, 3, 4]
```

### 従来の方法との比較

```js
// concat
const merged = arr1.concat(arr2);

// スプレッド（より直感的）
const merged = [...arr1, ...arr2];
```

</details>

---

## 問題 3：配列の先頭・末尾に追加

配列の先頭に `0`、末尾に `4` を追加した新しい配列を作ってください。

```js
const numbers = [1, 2, 3];

// [0, 1, 2, 3, 4] を作りたい
```

<details>
<summary>模範解答・解説</summary>

```js
const numbers = [1, 2, 3];

const result = [0, ...numbers, 4];
console.log(result); // [0, 1, 2, 3, 4]
```

### 従来の方法との比較

```js
// 従来（元の配列を変更）
numbers.unshift(0);
numbers.push(4);

// スプレッド（元の配列は変わらない）
const result = [0, ...numbers, 4];
```

</details>

---

# 🔹 オブジェクトのスプレッド構文

## 問題 4：オブジェクトのコピーと更新

次のオブジェクトをコピーし、`age` を `26` に更新した新しいオブジェクトを作ってください。

```js
const user = { name: "Taro", age: 25 };

// age を 26 に更新した新しいオブジェクトを作成
```

<details>
<summary>模範解答・解説</summary>

```js
const user = { name: "Taro", age: 25 };

const updated = { ...user, age: 26 };

console.log(user);    // { name: "Taro", age: 25 } ← 元は変わらない
console.log(updated); // { name: "Taro", age: 26 }
```

### 順番が重要

```js
const a = { ...user, age: 26 }; // age = 26 ✅
const b = { age: 26, ...user }; // age = 25 ❌（user.age で上書き）
```

</details>

---

## 問題 5：オブジェクトのマージ

2つのオブジェクトをマージしてください。

```js
const defaults = { theme: "light", lang: "ja" };
const userSettings = { theme: "dark" };

// { theme: "dark", lang: "ja" } を作りたい
```

<details>
<summary>模範解答・解説</summary>

```js
const defaults = { theme: "light", lang: "ja" };
const userSettings = { theme: "dark" };

const settings = { ...defaults, ...userSettings };
console.log(settings); // { theme: "dark", lang: "ja" }
```

### ポイント

後から書いたオブジェクトのプロパティが優先される。

</details>

---

# 🔹 残余引数（rest）

## 問題 6：オブジェクトから特定のプロパティを除外

オブジェクトから `id` を除いた残りを取得してください。

```js
const user = { id: 1, name: "Taro", age: 25 };

// id を除いた { name: "Taro", age: 25 } を取得したい
```

<details>
<summary>模範解答・解説</summary>

```js
const user = { id: 1, name: "Taro", age: 25 };

const { id, ...rest } = user;

console.log(id);   // 1
console.log(rest); // { name: "Taro", age: 25 }
```

### 実務での使用例

```js
// API に送信する前に不要なプロパティを除外
const { _id, __v, ...dataToSend } = document;
```

</details>

---

## 問題 7：配列の残余引数

配列の最初の要素と、残りを分けて取得してください。

```js
const numbers = [1, 2, 3, 4, 5];

// head = 1, tail = [2, 3, 4, 5] としたい
```

<details>
<summary>模範解答・解説</summary>

```js
const numbers = [1, 2, 3, 4, 5];

const [head, ...tail] = numbers;

console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]
```

### 注意

残余引数は **最後** にしか置けない。

```js
const [...rest, last] = numbers; // ❌ SyntaxError
```

</details>

---

# 🔹 React での実践

## 問題 8：props の残余引数

`variant` にデフォルト値を設定し、残りの props を `button` に渡してください。

```jsx
function Button(props) {
  // variant がなければ "primary" をデフォルトに
  // 残りの props は button に渡す
  return <button>{props.children}</button>;
}
```

<details>
<summary>模範解答・解説</summary>

```jsx
function Button({ variant = "primary", children, ...rest }) {
  return (
    <button className={`btn-${variant}`} {...rest}>
      {children}
    </button>
  );
}

// 使用例
<Button onClick={handleClick} disabled={isLoading}>
  送信
</Button>
```

### 解説

| 部分 | 説明 |
|------|------|
| `...rest` | 残りの props を収集 |
| `{...rest}` | 収集した props を button に展開 |

</details>

---

## 問題 9：イミュータブルな state 更新

配列の state に新しい要素を追加してください。

```jsx
const [items, setItems] = useState(["A", "B"]);

const handleAdd = () => {
  // "C" を追加したい
};
```

<details>
<summary>模範解答・解説</summary>

```jsx
const handleAdd = () => {
  setItems([...items, "C"]);
};
```

### よくある間違い

```js
// ❌ 直接変更
items.push("C");
setItems(items); // 参照が同じなので React が検知できない
```

</details>

---

## 問題 10：ネストしたオブジェクトの更新

次の state で `address.city` を `"Osaka"` に更新してください。

```jsx
const [user, setUser] = useState({
  name: "Taro",
  address: { city: "Tokyo", zip: "100-0001" }
});
```

<details>
<summary>模範解答・解説</summary>

```jsx
setUser(prev => ({
  ...prev,
  address: {
    ...prev.address,
    city: "Osaka"
  }
}));
```

### 解説

1. `...prev` で user 全体をコピー
2. `address` を新しいオブジェクトで上書き
3. `...prev.address` で address の他のプロパティを保持
4. `city` を新しい値で上書き

詳しくは **09_js-immutability-practice-drill.md** を参照。

</details>

---

以上。
