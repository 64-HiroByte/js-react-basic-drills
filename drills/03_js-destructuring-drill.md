# 分割代入 完全理解ドリル

対象：React / Next.js 経験者
目的：分割代入を「迷わず使える」状態にする

> **関連ドリル**:
> - スプレッド構文は **04_js-spread-syntax-drill.md** を参照
> - イミュータブル操作は **09_js-immutability-practice-drill.md** を参照

---

## このドリルの狙い

- 分割代入を **配列・オブジェクト両方で使いこなせる**
- React でよく使うパターンを **即座に書ける**

---

# 🔹 オブジェクトの分割代入

## 問題 1：基本

次のコードを分割代入を使って書き換えてください。

```js
const user = { name: "Taro", age: 25, city: "Tokyo" };

const name = user.name;
const age = user.age;
```

<details>
<summary>模範解答・解説</summary>

```js
const user = { name: "Taro", age: 25, city: "Tokyo" };

const { name, age } = user;
```

### ポイント

| 従来の書き方 | 分割代入 |
|-------------|---------|
| `const name = user.name` | `const { name } = user` |
| 3行必要 | 1行で完了 |

</details>

---

## 問題 2：別名（エイリアス）

API から返ってきたデータのプロパティ名が分かりにくいです。別名をつけてください。

```js
const response = { n: "Taro", a: 25 };

// n を userName、a を userAge という変数名で取り出したい
```

<details>
<summary>模範解答・解説</summary>

```js
const response = { n: "Taro", a: 25 };

const { n: userName, a: userAge } = response;

console.log(userName); // "Taro"
console.log(userAge);  // 25
```

### 構文

```js
const { 元のプロパティ名: 新しい変数名 } = オブジェクト;
```

</details>

---

## 問題 3：デフォルト値

`role` が存在しない場合に `"guest"` をデフォルト値として設定してください。

```js
const user = { name: "Taro" };

// role を取り出したいが、存在しない場合は "guest" にしたい
```

<details>
<summary>模範解答・解説</summary>

```js
const user = { name: "Taro" };

const { name, role = "guest" } = user;

console.log(role); // "guest"
```

### デフォルト値が適用される条件

| 値 | デフォルト適用 |
|----|---------------|
| `undefined` | ✅ 適用される |
| `null` | ❌ 適用されない |
| `0`, `""` | ❌ 適用されない |

</details>

---

## 問題 4：ネストしたオブジェクト

次のオブジェクトから `city` を取り出してください。

```js
const user = {
  name: "Taro",
  address: {
    city: "Tokyo",
    zip: "100-0001"
  }
};
```

<details>
<summary>模範解答・解説</summary>

```js
const { address: { city } } = user;
console.log(city); // "Tokyo"
```

### 注意点

```js
const { address: { city } } = user;
// address 変数は作られない！city のみ

// address も使いたい場合
const { address, address: { city } } = user;
```

</details>

---

# 🔹 配列の分割代入

## 問題 5：基本

次のコードを分割代入で書き換えてください。

```js
const colors = ["red", "green", "blue"];

const first = colors[0];
const second = colors[1];
```

<details>
<summary>模範解答・解説</summary>

```js
const colors = ["red", "green", "blue"];

const [first, second] = colors;
```

### オブジェクト vs 配列

| 種類 | 構文 | マッチ基準 |
|------|------|-----------|
| オブジェクト | `{ }` | プロパティ名 |
| 配列 | `[ ]` | インデックス |

</details>

---

## 問題 6：要素のスキップ

配列から **1番目と3番目** の要素だけを取り出してください。

```js
const numbers = [10, 20, 30, 40];

// first = 10, third = 30 としたい
```

<details>
<summary>模範解答・解説</summary>

```js
const numbers = [10, 20, 30, 40];

const [first, , third] = numbers;

console.log(first); // 10
console.log(third); // 30
```

### React での使用例

```jsx
// setter だけ使いたい場合
const [, setCount] = useState(0);
```

</details>

---

# 🔹 React での実践

## 問題 7：props の分割代入

次のコンポーネントを分割代入で書き換えてください。

```jsx
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.email}</p>
    </div>
  );
}
```

<details>
<summary>模範解答・解説</summary>

```jsx
function UserCard({ name, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}
```

### 引数で分割する理由

| 観点 | 引数で分割 | 関数内で分割 |
|------|-----------|-------------|
| 使う props が明確 | ✅ 一目でわかる | 読まないとわからない |
| 行数 | 少ない | 多い |

</details>

---

## 問題 8：useState の戻り値

次のコードの出力を予測してください。

```jsx
function Example() {
  const result = useState(0);
  console.log(result);
  return null;
}
```

<details>
<summary>模範解答・解説</summary>

### 出力

```js
[0, function]  // [現在の値, setter関数]
```

### なぜ配列なのか

```js
// 配列だと好きな名前をつけられる
const [count, setCount] = useState(0);
const [name, setName] = useState("");
```

</details>

---

以上。
