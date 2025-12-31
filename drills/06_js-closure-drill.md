# クロージャ 完全理解ドリル

対象：React / Next.js 経験者
目的：クロージャを「見た瞬間に判断できる」状態にする

> **関連ドリル**:
> - stale closure の実例は **16_js-react-map-rendering-pitfalls.md** を参照
> - useCallback との関係は **19_js-usememo-usecallback-drill.md** を参照

---

## このドリルの狙い

- クロージャの定義を **一言で説明できる**
- コードを見て **「これはクロージャ」と即判断できる**
- クロージャが原因のバグを **事前に防げる**

---

## クロージャとは（超重要）

> **クロージャ = 関数 + その関数が作られた時の変数環境**

```js
function outer() {
  const message = "Hello"; // outer の変数

  function inner() {
    console.log(message); // outer の変数を参照
  }

  return inner;
}

const fn = outer(); // outer は実行終了
fn(); // "Hello" ← まだ message にアクセスできる！
```

**ポイント**: `outer()` の実行は終わっているのに、`inner` は `message` を覚えている。
これがクロージャ。

---

# 🔹 判別編：これはクロージャか？

## 問題 1：基本判定

次のコードにクロージャはありますか？

```js
function greet(name) {
  return `Hello, ${name}`;
}

greet("Taro");
```

<details>
<summary>模範解答・解説</summary>

**クロージャ: なし**

`greet` 関数は外部の変数を参照していない。
引数 `name` は関数自身のローカル変数。

### クロージャの判定基準

関数が **自分のスコープ外の変数** を参照しているか？
- YES → クロージャ
- NO → クロージャではない

</details>

---

## 問題 2：外部変数の参照

次のコードにクロージャはありますか？

```js
const tax = 0.1;

function calcPrice(price) {
  return price * (1 + tax);
}

calcPrice(100);
```

<details>
<summary>模範解答・解説</summary>

**クロージャ: あり**

`calcPrice` は自身のスコープ外にある `tax` を参照している。

```
グローバルスコープ
├── tax = 0.1        ← この変数を
└── calcPrice()
    └── price * (1 + tax)  ← ここで参照
```

**補足**: グローバル変数を参照する場合も技術的にはクロージャだが、
実務で「クロージャ」と呼ぶのは主に**関数内関数**のパターン。

</details>

---

## 問題 3：関数を返す関数

次のコードにクロージャはありますか？

```js
function createCounter() {
  let count = 0;

  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // ?
console.log(counter()); // ?
```

<details>
<summary>模範解答・解説</summary>

**クロージャ: あり（典型パターン）**

**出力**:
```
1
2
```

**構造**:
```
createCounter のスコープ
├── count = 0              ← この変数を
└── return function()
    └── count++; return count;  ← ここで参照・更新
```

`createCounter()` の実行は終わっているのに、返された関数は `count` を覚えている。
これが**クロージャの典型パターン**。

</details>

---

## 問題 4：即時判定トレーニング

次の3つのコードについて、クロージャかどうか即答してください。

**コード A**:
```js
const add = (a, b) => a + b;
```

**コード B**:
```js
function outer() {
  const x = 10;
  return () => x * 2;
}
```

**コード C**:
```js
const numbers = [1, 2, 3];
numbers.map(n => n * 2);
```

<details>
<summary>模範解答</summary>

| コード | クロージャ | 理由 |
|-------|----------|------|
| A | ❌ なし | 外部変数を参照していない |
| B | ✅ あり | 返される関数が `x` を参照 |
| C | ❌ なし | コールバック内で外部変数を参照していない |

</details>

---

# 🔹 実用パターン編

## 問題 5：プライベート変数

次のコードの `_balance` を外部から直接アクセスできないようにしてください。

```js
const account = {
  _balance: 1000,
  deposit(amount) {
    this._balance += amount;
  },
  getBalance() {
    return this._balance;
  }
};

// 問題: 外部から直接変更できてしまう
account._balance = 999999;
```

<details>
<summary>模範解答・解説</summary>

**クロージャで隠蔽する**:

```js
function createAccount(initialBalance) {
  let balance = initialBalance; // プライベート変数

  return {
    deposit(amount) {
      balance += amount;
    },
    withdraw(amount) {
      if (balance >= amount) {
        balance -= amount;
        return true;
      }
      return false;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
console.log(account.balance); // undefined（アクセス不可）
```

**ポイント**: `balance` は `createAccount` のスコープ内にあり、
返されたオブジェクトのメソッドからのみアクセス可能。

</details>

---

## 問題 6：ファクトリ関数

特定の税率を持つ価格計算関数を生成するファクトリを作ってください。

```js
// 使用例
const calcWithTax10 = createTaxCalculator(0.1);
const calcWithTax8 = createTaxCalculator(0.08);

console.log(calcWithTax10(100)); // 110
console.log(calcWithTax8(100));  // 108
```

<details>
<summary>模範解答・解説</summary>

```js
function createTaxCalculator(taxRate) {
  return function(price) {
    return price * (1 + taxRate);
  };
}

// または アロー関数で
const createTaxCalculator = (taxRate) => (price) => price * (1 + taxRate);
```

**ポイント**: 返された関数は `taxRate` を「記憶」している。
同じ税率で何度も計算する場合に便利。

### 実務での使用例

```js
// API エンドポイント生成
const createEndpoint = (baseUrl) => (path) => `${baseUrl}${path}`;
const api = createEndpoint("https://api.example.com");
api("/users");  // "https://api.example.com/users"
api("/posts");  // "https://api.example.com/posts"
```

</details>

---

## 問題 7：イベントハンドラでのクロージャ

次のコードで、各ボタンをクリックしたときに何が出力されるか予測してください。

```js
function setupButtons() {
  const buttons = document.querySelectorAll("button");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
      console.log("Button " + i);
    });
  }
}
// ボタンが3つあると仮定
```

<details>
<summary>模範解答・解説</summary>

**出力**: どのボタンをクリックしても `"Button 3"`

**理由**:
- `var` は関数スコープなので、ループ終了時に `i = 3`
- クリック時にはすべてのコールバックが同じ `i` を参照
- これが **クロージャの罠**

**修正方法 1: let を使う**

```js
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    console.log("Button " + i);
  });
}
```

`let` はブロックスコープなので、各ループで別の `i` が作られる。

**修正方法 2: クロージャで閉じ込める**

```js
for (var i = 0; i < buttons.length; i++) {
  (function(index) {
    buttons[index].addEventListener("click", function() {
      console.log("Button " + index);
    });
  })(i);
}
```

即時実行関数で `i` の値をコピーして閉じ込める。

</details>

---

# 🔹 罠編：クロージャが原因のバグ

## 問題 8：ループと var

次のコードの出力を予測してください。

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 100);
}
```

<details>
<summary>模範解答・解説</summary>

**出力**:
```
3
3
3
```

**理由**:
1. `var` は関数スコープ（ブロックスコープではない）
2. `setTimeout` のコールバックが実行される時点で、ループは終了済み
3. 全コールバックが同じ `i`（= 3）を参照

**修正方法**:

```js
// let を使う（推奨）
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 100);
}
// 出力: 0, 1, 2
```

### なぜ let で解決するか

```
var の場合:
┌─────────────────────────┐
│ i = 0 → 1 → 2 → 3      │ ← 1つの i を共有
│  ↑     ↑     ↑         │
│ cb1   cb2   cb3        │
└─────────────────────────┘

let の場合:
┌───────┐ ┌───────┐ ┌───────┐
│ i = 0 │ │ i = 1 │ │ i = 2 │ ← 各ループで別の i
│  ↑    │ │  ↑    │ │  ↑    │
│ cb1   │ │ cb2   │ │ cb3   │
└───────┘ └───────┘ └───────┘
```

</details>

---

## 問題 9：stale closure（React 頻出）

次の React コードの問題点を説明してください。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div>{count}</div>;
}
```

<details>
<summary>模範解答・解説</summary>

**問題**: `count` が常に `0` のまま

**出力**:
```
0  // 1秒後
0  // 2秒後
0  // 3秒後（ずっと 0）
```

**理由**:
1. `useEffect` は初回レンダリング時のみ実行（依存配列 `[]`）
2. その時点の `count`（= 0）がクロージャに閉じ込められる
3. `setInterval` 内の関数は古い `count` を参照し続ける

**これが stale closure（古いクロージャ）**

**修正方法**:

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1); // 関数形式を使う
  }, 1000);
  return () => clearInterval(id);
}, []);
```

**なぜ関数形式で解決するか**:
- `setCount(count + 1)` → 古い `count` を参照
- `setCount(prev => prev + 1)` → React が最新値を `prev` に渡す

</details>

---

## 問題 10：クロージャを意識した修正

次のコードは、ボタンをクリックしても常に最初の value が表示されます。修正してください。

```jsx
function Example() {
  const [value, setValue] = useState("initial");

  const handleClick = () => {
    setTimeout(() => {
      alert(value); // クリック時の value ではなく、古い value が表示される
    }, 3000);
  };

  return (
    <div>
      <input onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleClick}>3秒後にアラート</button>
    </div>
  );
}
```

<details>
<summary>模範解答・解説</summary>

**方法 1: useRef を使う**

```jsx
function Example() {
  const [value, setValue] = useState("initial");
  const valueRef = useRef(value);

  // 最新値を常に ref に保存
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleClick = () => {
    setTimeout(() => {
      alert(valueRef.current); // ref から最新値を取得
    }, 3000);
  };

  return (
    <div>
      <input onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleClick}>3秒後にアラート</button>
    </div>
  );
}
```

**方法 2: クリック時の値を閉じ込める（意図的なクロージャ）**

```jsx
const handleClick = () => {
  const currentValue = value; // クリック時点の値をコピー
  setTimeout(() => {
    alert(currentValue); // コピーした値を使う
  }, 3000);
};
```

**使い分け**:
- 「3秒後の最新値」が欲しい → useRef
- 「クリック時点の値」が欲しい → 変数コピー

</details>

---

# 🔹 まとめ：クロージャ判定チェックリスト

```
□ 関数の中に関数があるか？
□ 内側の関数が外側の変数を参照しているか？
□ 外側の関数が終了した後も、内側の関数が使われるか？

3つすべて YES → クロージャ
```

### クロージャが役立つ場面

| パターン | 用途 |
|---------|------|
| プライベート変数 | データの隠蔽 |
| ファクトリ関数 | 設定を持つ関数の生成 |
| イベントハンドラ | 状態を保持したコールバック |
| カリー化 | 引数の部分適用 |

### クロージャで事故る場面

| パターン | 原因 | 対策 |
|---------|------|------|
| ループ + var | 全コールバックが同じ変数を参照 | let を使う |
| stale closure | 古い値が閉じ込められる | 関数形式 setState / useRef |
| メモリリーク | 不要な参照が残る | クリーンアップ処理 |

---

以上。
