# 非同期 × エラー処理 地獄ドリル（完全反復）

**保存用ファイル名：`js-async-error-handling-drill.md`**

対象：React / Next.js 経験者
目的：非同期エラー処理を「雰囲気」ではなく**安全に設計できる状態**にする

> **Note**: map × async の基本については **12_js-async-map-reduce-drill.md** を、
> Promise の基礎については **10_js-async-complete-drill.md** を参照してください。

---

## このドリルの前提（重要）

- Promise は「成功 or 失敗」を持つオブジェクト
- `await` は **throw されたエラーをそのまま投げ直す**
- エラー処理が甘いコードは本番で落ち、バグ調査が地獄になる

| Promise の状態 | 説明 |
|--------------|------|
| pending | まだ結果が出ていない |
| fulfilled | 成功（resolve された） |
| rejected | 失敗（reject された or throw された） |

---

# 🔹 Step 1：try / catch の基本確認

## 問題 1：try / catch はどこまで捕まえる？

```js
const fn = async () => {
  try {
    Promise.reject("error!");
  } catch (e) {
    console.log("caught", e);
  }
};

fn();
```

現在の出力：

```
（何も出力されない）
UnhandledPromiseRejectionWarning: error!
```

質問：なぜ catch されないのか説明してください。

<details>
<summary>模範解答</summary>

### 回答

**catch されない**。`await` していない Promise の reject は try/catch で捕まらない。

### なぜ catch されないか

```
Promise.reject("error!")
    ↓
await がない → 同期的に Promise を「発射」しただけ
    ↓
try/catch は同期的なエラーしか捕まえない
    ↓
Promise は「後で」reject される
    ↓
catch に到達せず、Unhandled Rejection になる
```

### 重要なポイント

| コード | catch される？ |
|--------|--------------|
| `throw new Error()` | ✅ される（同期エラー） |
| `await Promise.reject()` | ✅ される（await が throw に変換） |
| `Promise.reject()` | ❌ されない（非同期で reject） |

</details>

---

## 問題 2：正しく catch される形に修正

問題 1 のコードを **try / catch で確実にエラーを捕まえる** よう修正してください。

期待する出力：

```
caught error!
```

<details>
<summary>模範解答</summary>

### 修正後のコード

```js
const fn = async () => {
  try {
    await Promise.reject("error!");  // ← await を追加
  } catch (e) {
    console.log("caught", e);
  }
};

fn();
```

### 出力

```
caught error!
```

### 解説

`await` を追加することで、Promise の reject が **同期的な throw に変換** される。

```
await Promise.reject("error!")
    ↓
throw "error!" と同等になる
    ↓
try/catch で捕まえられる
```

### ポイント

**async/await を使うなら、必ず await する**。
await しない Promise は「発射して忘れた」状態になり、エラーを見逃す。

</details>

---

# 🔹 Step 2：Promise.then / catch 地獄

## 問題 3：この catch は動く？

```js
Promise.resolve(1)
  .then((v) => {
    throw new Error("boom");
  })
  .catch((e) => {
    console.log("caught");
  });
```

質問：`"caught"` は出力されますか？

<details>
<summary>模範解答</summary>

### 回答

**動く**。`"caught"` が出力される。

### 出力

```
caught
```

### 解説

`.then` 内で throw されたエラーは、自動的に **reject された Promise** として扱われる。

### 流れ

```
Promise.resolve(1)
    ↓
.then() 実行 → throw new Error("boom")
    ↓
.then() が reject された Promise を返す
    ↓
.catch() がそれを受け取る
    ↓
"caught" 出力
```

### ポイント

| .then 内の動作 | 結果 |
|--------------|------|
| return 値 | resolve された Promise |
| throw | reject された Promise |
| return Promise.reject() | reject された Promise |

</details>

---

## 問題 4：then の中で async を使うと？

```js
Promise.resolve(1)
  .then(async () => {
    throw new Error("boom");
  })
  .catch(() => {
    console.log("caught");
  });
```

質問：問題 3 と同じく `"caught"` は出力されますか？

<details>
<summary>模範解答</summary>

### 回答

**動く**。`"caught"` が出力される。

### 出力

```
caught
```

### 解説

`async` 関数内での throw は、その関数が返す Promise を reject する。

```
.then(async () => { throw new Error("boom"); })
    ↓
async 関数が reject された Promise を返す
    ↓
.catch() がそれを受け取る
```

### 比較

| 書き方 | throw の効果 |
|--------|------------|
| `.then(() => { throw ... })` | reject |
| `.then(async () => { throw ... })` | reject |

どちらも同じ結果になる。async 関数は「throw = reject」と覚える。

</details>

---

# 🔹 Step 3：Promise.all の恐怖

> **Note**: Promise.all の基本は **10_js-async-complete-drill.md** を参照。

## 問題 5：1 つ失敗したらどうなる？

```js
const tasks = [Promise.resolve(1), Promise.reject("error"), Promise.resolve(3)];

Promise.all(tasks).then(console.log).catch(console.error);
```

質問：何が出力されますか？成功した 1 と 3 は取得できますか？

<details>
<summary>模範解答</summary>

### 出力

```
error
```

### 回答

**catch が実行される**。成功した 1 と 3 の値は取得できない。

### 解説

Promise.all は **1 つでも reject された時点で全体が reject** される。

```
Promise.all([
  Promise.resolve(1),    // 成功
  Promise.reject("error"), // 失敗 ← これで全体が失敗
  Promise.resolve(3),    // 成功（でも結果は捨てられる）
])
    ↓
全体が reject("error") になる
    ↓
.catch() が実行される
```

### Promise.all の特性

| 状況 | Promise.all の結果 |
|------|------------------|
| 全て成功 | `[結果1, 結果2, ...]` |
| 1つでも失敗 | 最初の reject 理由 |

**「一人でもコケたら全員道連れ」** と覚える。

</details>

---

## 問題 6：全件結果を必ず取得したい

問題 5 のコードを修正して、全 Promise の成功 / 失敗を把握できるようにしてください。

期待する出力：

```
[
  { status: 'fulfilled', value: 1 },
  { status: 'rejected', reason: 'error' },
  { status: 'fulfilled', value: 3 }
]
```

<details>
<summary>模範解答</summary>

### 修正後のコード

```js
const tasks = [Promise.resolve(1), Promise.reject("error"), Promise.resolve(3)];

Promise.allSettled(tasks).then(console.log);
```

### 出力

```
[
  { status: 'fulfilled', value: 1 },
  { status: 'rejected', reason: 'error' },
  { status: 'fulfilled', value: 3 }
]
```

### 解説

`Promise.allSettled` は **全ての Promise が完了するまで待ち、各結果を配列で返す**。

### Promise.all vs Promise.allSettled

| メソッド | 1つ失敗時 | 結果の形式 |
|----------|----------|----------|
| `Promise.all` | 即座に reject | 値の配列 or エラー |
| `Promise.allSettled` | 全て待つ | `{status, value/reason}[]` |

### 使い分け

| シナリオ | 使うべきメソッド |
|----------|----------------|
| 全て成功が前提 | `Promise.all` |
| 一部失敗してもOK | `Promise.allSettled` |
| 成功分だけ使いたい | `Promise.allSettled` + filter |

### 成功分だけ取り出す例

```js
const tasks = [Promise.resolve(1), Promise.reject("error"), Promise.resolve(3)];

const results = await Promise.allSettled(tasks);
const successValues = results
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value);

console.log(successValues); // [1, 3]
```

</details>

---

# 🔹 Step 4：map × async の地雷

> **Note**: map × async の基本は **12_js-async-map-reduce-drill.md** を参照。

## 問題 7：このコードの問題点は？

```js
const results = [1, 2, 3].map(async (n) => {
  if (n === 2) throw new Error("error");
  return n * 2;
});

console.log(results);
```

現在の出力：

```
[ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]
UnhandledPromiseRejectionWarning: Error: error
```

質問：このコードの問題点を説明してください。

<details>
<summary>模範解答</summary>

### 問題点

1. **results は Promise の配列**（値ではない）
2. **エラーが捕まえられていない**（n === 2 の throw が漏れる）

### なぜ Promise の配列になるか

```
[1, 2, 3].map(async (n) => ...)
    ↓
async 関数は必ず Promise を返す
    ↓
[Promise { 2 }, Promise { rejected }, Promise { 6 }]
```

### なぜエラーが漏れるか

- `map` は Promise の配列を返すだけ
- 各 Promise の reject は **誰も待っていない**
- 結果として Unhandled Promise Rejection になる

### 図解

```
n=1 → async関数 → Promise { 2 }      ← 誰も await していない
n=2 → async関数 → Promise { rejected } ← エラーが漏れる！
n=3 → async関数 → Promise { 6 }      ← 誰も await していない
```

</details>

---

## 問題 8：正しく値を取得する

問題 7 のコードを **エラー処理込み** で修正してください。

期待する出力：

```
Error: error
```

（エラーが適切に捕まえられること）

<details>
<summary>模範解答</summary>

### 修正後のコード

```js
const main = async () => {
  try {
    const results = await Promise.all(
      [1, 2, 3].map(async (n) => {
        if (n === 2) throw new Error("error");
        return n * 2;
      })
    );
    console.log(results);
  } catch (e) {
    console.error(e.message);
  }
};

main();
```

### 出力

```
error
```

### 解説

1. `map(async ...)` で `Promise[]` を取得
2. `Promise.all()` で全ての Promise を待つ
3. `await` で Promise.all の結果を取得
4. `try/catch` でエラーを捕まえる

### 流れ

```
[1, 2, 3].map(async ...)
    ↓
[Promise { 2 }, Promise { rejected }, Promise { 6 }]
    ↓
Promise.all([...])
    ↓
1つ reject → 全体が reject
    ↓
await が throw に変換
    ↓
catch で捕まえる
```

### 全件の結果が必要な場合

```js
const main = async () => {
  const results = await Promise.allSettled(
    [1, 2, 3].map(async (n) => {
      if (n === 2) throw new Error("error");
      return n * 2;
    })
  );
  console.log(results);
};

main();
// [
//   { status: 'fulfilled', value: 2 },
//   { status: 'rejected', reason: Error: error },
//   { status: 'fulfilled', value: 6 }
// ]
```

</details>

---

# 🔹 Step 5：実務パターン

※ この演習では例として [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します。

## 問題 9：API 呼び出し安全設計

```js
const fetchUser = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  return res.json();
};

// 存在しないユーザーを取得
fetchUser(9999).then(console.log);
```

現在の出力：

```
{}
```

（エラーにならず、空オブジェクトが返る）

質問：最低限の安全対策を追加してください。

<details>
<summary>模範解答</summary>

### 修正後のコード

```js
const fetchUser = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
};

// 使用例
const main = async () => {
  try {
    const user = await fetchUser(9999);
    console.log(user);
  } catch (e) {
    console.error(e.message);
  }
};

main();
```

### 出力

```
API error: 404
```

### 解説

`fetch` は **HTTP エラー（404, 500 など）でも reject しない**。
`res.ok` をチェックして手動で throw する必要がある。

### fetch の罠

| レスポンス | res.ok | reject される？ |
|-----------|--------|---------------|
| 200 OK | true | ❌ |
| 404 Not Found | false | ❌ |
| 500 Server Error | false | ❌ |
| ネットワークエラー | - | ✅ |

**HTTP エラーでは reject されない** ので、必ず `res.ok` をチェックする。

### より詳細なエラー情報

```js
const fetchUser = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};
```

</details>

---

## 問題 10：呼び出し側での責務分離

以下の 2 つの書き方を比較してください。

```js
// パターン A: API 関数内で catch
const fetchUser = async (id) => {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!res.ok) throw new Error("API error");
    return res.json();
  } catch (e) {
    console.error(e);
    return null;  // エラー時は null を返す
  }
};

// パターン B: API 関数では throw、呼び出し側で catch
const fetchUser = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error("API error");
  return res.json();
};

// 呼び出し側で catch
try {
  const user = await fetchUser(1);
} catch (e) {
  // エラー処理
}
```

質問：どちらが良い設計ですか？理由も説明してください。

<details>
<summary>模範解答</summary>

### 回答

**パターン B が良い設計**

### 理由

| 観点 | パターン A | パターン B |
|------|----------|----------|
| 責務分離 | ❌ API 関数がエラー表示まで担当 | ✅ 明確に分離 |
| 再利用性 | ❌ 呼び出し側でエラー処理できない | ✅ 呼び出し側が自由に処理 |
| テスト | ❌ エラーケースのテストが困難 | ✅ throw をテストできる |
| 型安全性 | ❌ null チェックが必要 | ✅ 戻り値の型が明確 |

### 責務の分離

```
┌─────────────────────────────────┐
│ データ取得層（API 関数）          │
│ - fetch する                     │
│ - エラーがあれば throw           │
│ - データを返す                   │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ UI 層（Component / useEffect）   │
│ - API を呼ぶ                     │
│ - エラーを catch して表示        │
│ - 成功データを state にセット    │
└─────────────────────────────────┘
```

### 実装例

```js
// API 関数（throw する）
const fetchUser = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

// React コンポーネント側（catch する）
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch((e) => setError(e.message));
  }, [userId]);

  if (error) return <p>エラー: {error}</p>;
  if (!user) return <p>読み込み中...</p>;
  return <p>{user.name}</p>;
};
```

### ポイント

- **API 関数では throw する**（エラーを隠さない）
- **UI 層で catch する**（ユーザーへの表示方法を決める）
- **「どこで握りつぶすか」を設計時に決める**

</details>

---

## 🎯 このドリルのまとめ

### チェックリスト

- [ ] try/catch は `await` しないと効かないことを理解した
- [ ] `.then` 内の throw は catch で捕まえられることを理解した
- [ ] `Promise.all` は 1 件失敗で全滅することを理解した
- [ ] `Promise.allSettled` で全件の結果を取得できることを理解した
- [ ] `fetch` は HTTP エラーで reject しないことを理解した
- [ ] 責務分離（API で throw、UI で catch）を理解した

### パターン表

| シナリオ | 解決策 |
|----------|--------|
| await なしの Promise のエラー | `await` を追加 |
| 1つ失敗で全滅を防ぎたい | `Promise.allSettled` |
| fetch の HTTP エラー | `res.ok` をチェック |
| map × async のエラー | `Promise.all` + `try/catch` |

### エラー処理の設計原則

```
1. API / データ取得層 → throw する（エラーを隠さない）
2. UI / 表示層 → catch する（ユーザーに見せる）
3. 「どこで握りつぶすか」を設計時に決める
```

### 関連ドリル

- **12_js-async-map-reduce-drill.md**：map × async の基本
- **10_js-async-complete-drill.md**：Promise の基礎
- **18_js-react-async-useeffect-drill.md**：useEffect 内での非同期処理

---

以上。
