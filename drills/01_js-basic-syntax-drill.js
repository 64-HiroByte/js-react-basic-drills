/**
 * 01_js-basic-syntax-drill
 *
 * 対応する問題ファイル:
 * 01_js-basic-syntax-drill.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 01
 */

// --- 問題 1 ---
// let userName = "Taro";
// userName = "Jiro";
// console.log(userName);

// --- 問題 2 ---
// for (let i = 0; i < 3; i++) {
//   setTimeout(() => {
//     console.log(i);
//   }, 100);
// }

// --- 問題 3 ---
// function add(a, b) {
//   return a + b;
// }
// アロー関数に書き換え
// const add = (a, b) => a + b;
// console.log(add(100, 20));

// --- 問題 4 ---
// const double = (n) => {
//   return n * 2;
// };

// console.log(double(5)); // 10 を期待

// --- 問題 5 ---
// const numbers = [1, 2, 3, 4, 5, 6];
// const result = numbers.filter((num) => num % 2 === 0).map((num) => num * 2);
// console.log(result);

// --- 問題 6　---
// const users = [
//   { name: "Taro", age: 20 },
//   { name: "Jiro", age: 30 },
// ];

// const names = users.map((user) => {
//   return user.name;
// });
/** or */
// const names = users.map((user) => user.name);
// console.log(names);

// --- 問題 7 ---
// const book = {
//   title: "JavaScript Guide",
//   price: 2800,
// };
// const { title, price } = book; // 分割代入
// console.log(`title: ${title}, price: ${price}`);

// --- 問題 8 ---
// const user = {
//   id: 1,
//   name: "Taro",
//   age: 20,
// };

// const updatedUser = { ...user, age: 21 };
// console.log(updatedUser);

// --- 問題 9 ---
// const value = "0"; // 文字列なので "truthy"

// if (value) {
//   console.log("true");
// } else {
//   console.log("false");
// }

// --- 問題 10 ---
// const addItem = (items, item) => {
//   return [...items, item]
// };
/** or */
// const addItem = (items, item) => [...items, item];
