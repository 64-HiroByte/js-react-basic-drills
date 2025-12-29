# 非同期 × エラー処理 地獄ドリル（完全反復）

**保存用ファイル名：`js-async-error-handling-drill.md`**

対象：React / Next.js 経験者
目的：非同期エラー処理を「雰囲気」ではなく**安全に設計できる状態**にする

---

## このドリルの前提（重要）

- Promise は「成功 or 失敗」を持つオブジェクト
- `await` は **throw されたエラーをそのまま投げ直す**
- エラー処理が甘いコードは

  - 本番で落ちる
  - バグ調査が地獄

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

何が起きるか説明してください。

<details>
<summary>模範解答</summary>

```js
// catch されない
```

**解説**
`await` していない Promise の reject は try/catch で捕まらない。

</details>

---

## 問題 2：正しく catch される形に修正

上のコードを **try / catch で確実にエラーを捕まえる** よう修正してください。

<details>
<summary>模範解答</summary>

```js
const fn = async () => {
  try {
    await Promise.reject("error!");
  } catch (e) {
    console.log("caught", e);
  }
};
```

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

<details>
<summary>模範解答</summary>

```js
// 動く
```

**解説**
`.then` 内で throw されたエラーは、自動的に reject 扱いになる。

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

<details>
<summary>模範解答</summary>

```js
// 動く
```

**解説**
`async` 関数は throw = reject。

</details>

---

# 🔹 Step 3：Promise.all の恐怖

## 問題 5：1 つ失敗したらどうなる？

```js
const tasks = [Promise.resolve(1), Promise.reject("error"), Promise.resolve(3)];

Promise.all(tasks).then(console.log).catch(console.error);
```

<details>
<summary>模範解答</summary>

```js
// catch が実行される
```

**解説**
Promise.all は **1 つでも reject された時点で全体が reject**。

</details>

---

## 問題 6：全件結果を必ず取得したい

全 Promise の成功 / 失敗を把握できるよう修正してください。

<details>
<summary>模範解答</summary>

```js
Promise.allSettled(tasks).then(console.log);
```

</details>

---

# 🔹 Step 4：map × async の地雷

## 問題 7：このコードの問題点は？

```js
const results = [1, 2, 3].map(async (n) => {
  if (n === 2) throw new Error("error");
  return n * 2;
});

console.log(results);
```

<details>
<summary>模範解答</summary>

```js
// results は Promise の配列
```

**解説**
map + async = Promise[]。値はまだ解決されていない。

</details>

---

## 問題 8：正しく値を取得する

上記を **エラー処理込み** で修正してください。

<details>
<summary>模範解答</summary>

```js
try {
  const results = await Promise.all(
    [1, 2, 3].map(async (n) => {
      if (n === 2) throw new Error("error");
      return n * 2;
    })
  );
} catch (e) {
  console.error(e);
}
```

</details>

---

# 🔹 Step 5：実務パターン

## 問題 9：API 呼び出し安全設計

```js
const fetchUser = async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};
```

最低限の安全対策を追加してください。

<details>
<summary>模範解答</summary>

```js
const fetchUser = async (id) => {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) {
    throw new Error("API error");
  }
  return res.json();
};
```

</details>

---

## 問題 10：呼び出し側での責務分離

```js
// 呼び出し側
```

どこで try / catch すべきか説明してください。

<details>
<summary>模範解答</summary>

```js
// API関数では throw
// UI / useEffect 側で catch
```

**解説**
データ取得層と UI 層で責務を分離する。

</details>

---

## 🎯 最重要まとめ

- try/catch は await しないと効かない
- map + async = Promise[]
- Promise.all は 1 件失敗で全滅
- 実務では「どこで握りつぶすか」を決める

---

次は 👉 **React × 非同期（useEffect 地獄ドリル）** に進むのが最短ルートです。
