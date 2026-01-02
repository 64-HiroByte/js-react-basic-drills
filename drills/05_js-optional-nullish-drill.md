# オプショナルチェーン・Nullish 完全理解ドリル

対象：React / Next.js 経験者
目的：`?.` と `??` を「迷わず使える」状態にする

> **関連ドリル**:
> - 分割代入のデフォルト値は **03_js-destructuring-drill.md** を参照
> - API レスポンス処理は **20_js-api-response-transform-drill.md** を参照

---

## このドリルの狙い

- オプショナルチェーン（`?.`）で **安全にプロパティアクセス** できる
- Nullish coalescing（`??`）と `||` の **違いを理解** する
- API レスポンス処理で **正しく使い分け** できる

---

# 🔹 オプショナルチェーン（?.）

## 問題 1：基本

次のコードを `?.` を使って安全に書き換えてください。

```js
const user = null;

// user.name を取得したいが、user が null の場合はエラーになる
console.log(user.name); // TypeError!
```

<details>
<summary>模範解答・解説</summary>

```js
const user = null;

console.log(user?.name); // undefined（エラーにならない）
```

### オプショナルチェーンの動作

| 左辺の値 | `user?.name` の結果 |
|---------|-------------------|
| `null` | `undefined` |
| `undefined` | `undefined` |
| `{ name: "Taro" }` | `"Taro"` |

</details>

---

## 問題 2：ネストしたプロパティ

次のオブジェクトから `city` を安全に取得してください。`address` が存在しない場合もあります。

```js
const user1 = { name: "Taro", address: { city: "Tokyo" } };
const user2 = { name: "Jiro" }; // address がない

// 両方のケースで安全に city を取得したい
```

<details>
<summary>模範解答・解説</summary>

```js
console.log(user1?.address?.city); // "Tokyo"
console.log(user2?.address?.city); // undefined
```

### 従来の方法との比較

```js
// 従来（冗長）
const city = user && user.address && user.address.city;

// オプショナルチェーン（簡潔）
const city = user?.address?.city;
```

</details>

---

## 問題 3：配列アクセス

配列の最初の要素を安全に取得してください。配列が存在しない場合もあります。

```js
const data1 = { items: ["a", "b", "c"] };
const data2 = {}; // items がない

// 最初の要素を安全に取得したい
```

<details>
<summary>模範解答・解説</summary>

```js
console.log(data1.items?.[0]); // "a"
console.log(data2.items?.[0]); // undefined
```

### 構文

```js
配列?.[ インデックス ]
```

</details>

---

## 問題 4：メソッド呼び出し

メソッドが存在する場合のみ呼び出してください。

```js
const obj1 = {
  greet() {
    return "Hello";
  }
};
const obj2 = {}; // greet がない

// greet を安全に呼び出したい
```

<details>
<summary>模範解答・解説</summary>

```js
console.log(obj1.greet?.()); // "Hello"
console.log(obj2.greet?.()); // undefined
```

### 構文

```js
オブジェクト.メソッド?.()
```

### 実務での使用例

```js
// コールバックが渡された場合のみ実行
props.onChange?.(newValue);
```

</details>

---

# 🔹 Nullish Coalescing（??）

## 問題 5：?? の基本

次のコードの出力を予測してください。

```js
const a = null ?? "default";
const b = undefined ?? "default";
const c = 0 ?? "default";
const d = "" ?? "default";
const e = false ?? "default";

console.log(a, b, c, d, e);
```

<details>
<summary>模範解答・解説</summary>

### 出力

```js
"default" "default" 0 "" false
```

### ?? の動作

`??` は **`null` または `undefined` の場合のみ** 右辺を返す。

| 左辺の値 | `左辺 ?? "default"` |
|---------|-------------------|
| `null` | `"default"` |
| `undefined` | `"default"` |
| `0` | `0` |
| `""` | `""` |
| `false` | `false` |

</details>

---

## 問題 6：?? と || の違い

次のコードの出力を予測してください。

```js
const count1 = 0 || 10;
const count2 = 0 ?? 10;

const name1 = "" || "名無し";
const name2 = "" ?? "名無し";

console.log(count1, count2);
console.log(name1, name2);
```

<details>
<summary>模範解答・解説</summary>

### 出力

```js
10 0       // count1, count2
"名無し" "" // name1, name2
```

### || と ?? の違い

| 演算子 | falsy で右辺を返す |
|--------|-------------------|
| `\|\|` | `false`, `0`, `""`, `null`, `undefined`, `NaN` |
| `??` | `null`, `undefined` のみ |

### 使い分け

```js
// 0 や "" を有効な値として扱いたい場合
const count = userInput ?? 10;  // ✅ 0 は有効

// falsy 全般をデフォルトに置き換えたい場合
const name = userInput || "名無し";  // "" も置き換わる
```

</details>

---

## 問題 7：?? を使うべき場面

ユーザーが入力した「ページ番号」を取得します。未入力の場合は 1 をデフォルトにしてください。
ただし、ユーザーが 0 を入力した場合は 0 を使いたいです。

```js
function getPage(input) {
  // input が null/undefined なら 1、それ以外はそのまま
}

console.log(getPage(0));         // 0 にしたい
console.log(getPage(5));         // 5 にしたい
console.log(getPage(null));      // 1 にしたい
console.log(getPage(undefined)); // 1 にしたい
```

<details>
<summary>模範解答・解説</summary>

```js
function getPage(input) {
  return input ?? 1;
}
```

### || を使うと問題

```js
function getPage(input) {
  return input || 1;
}

console.log(getPage(0)); // 1 ❌（0 が無視される）
```

</details>

---

# 🔹 ?. と ?? の組み合わせ

## 問題 8：API レスポンスの安全な処理

API レスポンスから `user.profile.nickname` を取得してください。
存在しない場合は `"ゲスト"` をデフォルトにしてください。

```js
const response1 = {
  user: {
    profile: { nickname: "Taro" }
  }
};

const response2 = {
  user: {}  // profile がない
};

const response3 = null;  // レスポンス自体がない
```

<details>
<summary>模範解答・解説</summary>

```js
const name1 = response1?.user?.profile?.nickname ?? "ゲスト";
// "Taro"

const name2 = response2?.user?.profile?.nickname ?? "ゲスト";
// "ゲスト"

const name3 = response3?.user?.profile?.nickname ?? "ゲスト";
// "ゲスト"
```

### パターン

```js
データ?.プロパティ?.ネスト ?? デフォルト値
```

</details>

---

## 問題 9：配列の最初の要素にデフォルト

API から返ってきたタグの最初の要素を取得してください。
タグがない場合は `"未分類"` にしてください。

```js
const post1 = { title: "Hello", tags: ["React", "Next.js"] };
const post2 = { title: "World" };  // tags がない
const post3 = { title: "Test", tags: [] };  // tags が空配列
```

<details>
<summary>模範解答・解説</summary>

```js
const tag1 = post1.tags?.[0] ?? "未分類";
// "React"

const tag2 = post2.tags?.[0] ?? "未分類";
// "未分類"

const tag3 = post3.tags?.[0] ?? "未分類";
// "未分類"（tags[0] は undefined）
```

</details>

---

# 🔹 React での実践

## 問題 10：props の安全なアクセス

次のコンポーネントで、`user.name` を安全に表示してください。
`user` が渡されない場合は `"ゲスト"` と表示してください。

```jsx
function UserGreeting({ user }) {
  return <h1>こんにちは、{/* ??? */}さん</h1>;
}

// 使用例
<UserGreeting user={{ name: "Taro" }} />
<UserGreeting user={null} />
<UserGreeting />
```

<details>
<summary>模範解答・解説</summary>

```jsx
function UserGreeting({ user }) {
  return <h1>こんにちは、{user?.name ?? "ゲスト"}さん</h1>;
}
```

### 出力

```
こんにちは、Taroさん
こんにちは、ゲストさん
こんにちは、ゲストさん
```

</details>

---

## 問題 11：イベントハンドラの安全な呼び出し

`onChange` が渡された場合のみ呼び出してください。

```jsx
function Input({ value, onChange }) {
  const handleChange = (e) => {
    // onChange が存在する場合のみ呼び出す
  };

  return <input value={value} onChange={handleChange} />;
}
```

<details>
<summary>模範解答・解説</summary>

```jsx
function Input({ value, onChange }) {
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return <input value={value} onChange={handleChange} />;
}
```

### 従来の書き方との比較

```js
// 従来
if (onChange) {
  onChange(e.target.value);
}

// オプショナルチェーン
onChange?.(e.target.value);
```

</details>

---

## 問題 12：API データの表示

次のコンポーネントで、`data` が null/undefined の場合は「データが存在しません」を表示し、
それ以外は `data.items` の件数を表示してください。

```jsx
function ItemCount({ data }) {
  // data が null/undefined の場合は「データが存在しません」
  // data.items が存在しない場合は 0 件
  return <p>{/* ??? */}</p>;
}

// 使用例
<ItemCount data={null} />                        // "データが存在しません"
<ItemCount data={{}} />                          // "0 件"
<ItemCount data={{ items: ["a", "b", "c"] }} />  // "3 件"
```

<details>
<summary>模範解答・解説</summary>

```jsx
function ItemCount({ data }) {
  if (data == null) {
    return <p>データが存在しません</p>;
  }

  const count = data.items?.length ?? 0;
  return <p>{count} 件</p>;
}
```

### ポイント

- `data == null` で `null` と `undefined` 両方をチェック
- `data.items?.length ?? 0` で items がない場合は 0

</details>

---

以上。
