/**
 * 08_js-reduce-drill
 *
 * 対応する問題ファイル:
 * 08_js-reduce-drill.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 08
 */

// --- 問題 1：合計値を求める ---
// const numbers = [1, 2, 3, 4];

// // 合計を reduce で求める
// const total = numbers.reduce((acc, num) => acc + num, 0);
// console.log(total);

// --- 問題 2：初期値の重要性 ---
/**
 * numbers.reduce((acc, n) => acc + n);
 * このように初期値を省略した場合の挙動は
 * 1番目のaccはnumbersの先頭の要素が入る
 * nubmersが空配列の場合は、初期値を省略するとエラーになるので、初期値は設定するのが望ましい
 */

// --- 問題 3：map を reduce で書く ---
// const numbers = [1, 2, 3, 4];

// 各要素を 2 倍した配列を reduce で作る
// const result = numbers.reduce((acc, num) => {
//   acc.push(num * 2);
//   return acc;
// }, []);
// console.log(result);

/**
 * const result = numbers.reduce((acc, num) => acc.push(num * 2), []);
 * このように1行で記述してもエラーになる！
 * pushメソッドの戻り値は、追加後の配列の長さを返すため。
 *
 * 1行で書くならスプレッド構文を使う方法があるが推奨しない
 * （毎回新しい配列を作成するためパフォーマンスが悪い）
 * numbers.reduce((acc, num) => [...acc, num * 2], [])
 */

// --- 問題 4：filter を reduce で書く ---
// const numbers = [1, 2, 3, 4, 5, 6];

// 偶数だけの配列を reduce で作る
// const result = numbers.reduce((acc, num) => {
//   if (num % 2 === 0) acc.push(num);
//   return acc;
// }, []);
// console.log(result);

/**
 * num % 2 === 0 ? acc.push(num) : acc;
 * このように三項演算子を使う場合、false（奇数）の値は使われない
 * このような場合は if文で条件付き処理をするのが望ましい
 * 三項演算子は true, false で値を選択する場合に用いる
 */

// --- 問題 5：配列 → オブジェクト ---
// const users = [
//   { id: 1, name: "Taro" },
//   { id: 2, name: "Jiro" },
// ];

// { 1: "Taro", 2: "Jiro" } に変換
// const obj = users.reduce((acc, user) => {
//   acc[user.id] = user.name;
//   return acc;
// }, {});
// console.log(obj);

// --- 問題 6：カウント集計（頻出） ---
// const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

// 各フルーツの出現回数を集計
// const counts = fruits.reduce((acc, fruit) => {
// 王道のカウントアップの記述方法
// acc[fruit] = (acc[fruit] || 0) + 1;

//   return acc;
// }, {});
// console.log(counts);

/**
 * 【参考】 Null合体代入演算子を使う記述方法（ES2021）
 * acc[fruit] ??= 0;
 * acc[fruit] += 1;
 * この場合は、王道の記述方法が好まれるし、一般的
 */

// --- 問題 7：groupBy（頻出） ---
// const users = [
//   { name: "Taro", role: "admin" },
//   { name: "Jiro", role: "user" },
//   { name: "Hanako", role: "admin" },
// ];

// role ごとにグループ化して表示
// 期待される出力 -> { admin: [ 'Taro', 'Hanako' ], user: [ 'Jiro' ] }
// const grouped = users.reduce((acc, user) => {
//   if (!acc[user.role]) acc[user.role] = [];
//   acc[user.role].push(user);
//   return acc;
// }, {});
// console.log(grouped);

// --- 問題 8：イミュータブル更新（reduce 版） ---
// const cart = [
//   { id: 1, count: 1 },
//   { id: 2, count: 2 },
// ];
// id === 2 の count を +1（reduce で）
// const updatedCart = cart.reduce((acc, item) => {
//   if (item.id === 2) {
//     acc.push({ ...item, count: item.count + 1 });
//   } else {
//     acc.push(item);
//   }
//   return acc;
// }, []);
// console.log(updatedCart);

/** 注意！
 * if (item.id === 2) item.count += 1;
 * acc.push(item);
 * この書き方をすると一見良さそうだが、元のcartの値を直接変更してしまうので、避ける
 */

// --- 問題 9：state 初期化ロジック ---
// const fields = ["name", "email", "password"];

// // { name: "", email: "", password: "" } を作る
// const defaults = fields.reduce((acc, field) => {
//   acc[field] = "";
//   return acc;
// }, {});
// console.log(defaults);

/**
 * 初期値の設定を目的とするなら、if文を使わずにシンプルに記述する
 * 初期化の時点で重複をきにするなら、その前段で重複チェックを行うべき
 */
