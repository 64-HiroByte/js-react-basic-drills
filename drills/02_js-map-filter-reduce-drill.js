/**
 * 02_js-map-filter-reduce-drill
 *
 * 対応する問題ファイル:
 * 02_js-map-filter-reduce-drill.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 02
 */

// --- 問題 1 ---
// 各要素を 2 倍した配列を作る
// const numbers = [1, 2, 3, 4];
// const doubleNumbers = numbers.map((num) => num * 2);
// console.log(doubleNumbers);

// ---　問題 2 ---
// name だけの配列を作る
// const users = [
//   { id: 1, name: "Taro" },
//   { id: 2, name: "Jiro" },
// ];
// const names = users.map((user) => user.name);
// console.log(names);

// --- 問題 3 ---
// const numbers = [1, 2, 3, 4];
// const result = numbers.map((n) => {
//   return n * 2;
// });
/** or */
// const result = numbers.map((n) => n * 2);
// console.log(result);

// --- 問題 4 ---
// { label: "Apple", price: 100 } の形に変換する
// const products = [
//   { name: "Apple", price: 100 },
//   { name: "Banana", price: 200 },
// ];
// const result = products.map((product) => ({
//   label: product.name,
//   price: product.price,
// }));
// console.log(result);

/**
ポイント: アロー関数でオブジェクトを返す

(product) => ({ ... })
//           ↑ この括弧が重要
オブジェクトの{}をそのまま書くと関数のブロックと解釈されるため、括弧()で囲む必要があります。

// NG: {}がブロックとして解釈される
(product) => { label: product.name }

// OK: ()で囲むとオブジェクトリテラルになる
(product) => ({ label: product.name })
 */

// --- 問題 5 ---
// 偶数だけを抽出する
// const numbers = [1, 2, 3, 4, 5, 6];
// const evenNumbers = numbers.filter((num) => num % 2 === 0);
// console.log(evenNumbers);

// --- 問題 6 ---
// 20歳以上のユーザーだけ残す
// const users = [
//   { name: "Taro", age: 20 },
//   { name: "Jiro", age: 30 },
//   { name: "Saburo", age: 15 },
// ];
// const adultUsers = users.filter((user) => user.age >= 20);
// console.log(adultUsers);

// --- 問題 7 ---
// 次のコードの意図を説明し、必要であれば修正してください。
// const numbers = [1, 2, 3, 4];
// const result = numbers.filter((n) => n * 2);
// console.log(result);

/**
 * filter() は true または false を返す関数を書く必要がある。
 * この場合、n = 0 以外は truthy となるため、仮にnumbersから偶数のみをフィルタリングしたいなら
 * const result = numbers.filter((n) => n % 2 === 0);
 * としなければならない。
 */
// 正しくは
// const numbers = [1, 2, 3, 4];
// const result = numbers.filter((n) => n % 2 === 0);
// console.log(result);

// --- 問題 8 ---
// 偶数だけを 2 倍した配列を作る
// const numbers = [1, 2, 3, 4, 5, 6];
// const result = numbers.filter((n) => n % 2 === 0).map((n) => n * 2);
// console.log(result);

// --- 問題 9 ---
// 合計を求める
// const numbers = [1, 2, 3, 4];
// const result = numbers.reduce((acc, n) => acc + n, 0);
// console.log(result);

// -- 問題 10 ---
// const numbers = [1, 2, 3, 4];
// const sum = numbers.reduce((acc, n) => acc + n);
// console.log(sum);

/**
 * 一見すると正常に動作しそうだが、初期値を設定していないため、対象となる配列が空配列の場合はエラーになる
 * const sum = numbers.reduce((acc, n) => acc + n, 0);
 * このように 初期値は設定しておくこと
 */

// --- 問題 11 ---
// { 1: "Taro", 2: "Jiro" } に変換する
// const users = [
//   { id: 1, name: "Taro" },
//   { id: 2, name: "Jiro" },
// ];
// const result = users.reduce((acc, user) => {
//   acc[user.id] = user.name;
//   return acc;
// }, {});
// console.log(result);

// --- 問題 12 ---
// role ごとにグループ化する
const users = [
  { name: "Taro", role: "admin" },
  { name: "Jiro", role: "user" },
  { name: "Hanako", role: "admin" },
];

// 解法１ 一般的な書き方
// const grouped = users.reduce((acc, user) => {
//   // キー（role）が存在しなければ、空配列を代入して初期化する
//   if (!acc[user.role]) {
//     acc[user.role] = [];
//   }
//   acc[user.role].push(user.name);
//   return acc;
// }, {});

// 解法２ 論理OR代入演算子を使う（ES2021）
// const grouped = users.reduce((acc, user) => {
//   acc[user.role] ||= [];
//   acc[user.role].push(user.name);
//   return acc;
// }, {});

// 解法３ Null合体代入演算子を使う
// const grouped = users.reduce((acc, user) => {
//   acc[user.role] ??= [];
//   acc[user.role].push(user.name);
//   return acc;
// }, {});
// console.log(grouped);

// --- 問題 13 ---
// 偶数だけを 2 倍した配列を reduce で作る
// const numbers = [1, 2, 3, 4, 5, 6];
// const result = numbers.reduce((acc, num) => {
//   if (num % 2 === 0) acc.push(num * 2);
//   return acc;
// }, []);
// console.log(result);

// --- 問題 14 ---
// id === 2 の count を +1
const cart = [
  { id: 1, count: 1 },
  { id: 2, count: 2 },
];
// mapを使用（一般的）
// const updatedCart = cart.map((item) =>
//   item.id === 2 ? { ...item, count: item.count + 1 } : item
// );

// reduceを使用（参考・一般的ではない）
const updatedCart = cart.reduce((acc, item) => {
  acc.push(item.id === 2 ? { ...item, count: item.count + 1 } : item);
  return acc;
}, []);
console.log(updatedCart);
