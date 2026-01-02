/**
 * 06_js-closure-drill
 *
 * クロージャ 完全理解ドリル
 *
 * 対応する問題ファイル:
 * 06_js-closure-drill.md
 *
 * 使い方:
 * - 解きたい問題のコードを書く
 *
 * 実行方法:
 * npm run drill 06
 */

// --- 問題 1：基本判定 ---

// --- 問題 2：外部変数の参照 ---

// --- 問題 3：関数を返す関数 ---
// function createCounter() {
//   let count = 0;

//   return () => {
//     count++;
//     return count;
//   };
// }

// const counter = createCounter();
// console.log(counter());
// console.log(counter());

// --- 問題 4：即時判定トレーニング ---

// --- 問題 5：プライベート変数 ---
// const createAccount = (initialBalance) => {
//   let balance = initialBalance;
//   return {
//     deposit(amount) {
//       balance += amount;
//     },
//     withDraw(amount) {
//       if (amount >= balance) return "残高不足（残高: ${balance）";
//       balance -= amount;
//       return `${amount} を引き出し（残高: ${balance}）`;
//     },
//     getBalance() {
//       return balance;
//     },
//   };
// };

// const account = createAccount(1000);
// account.deposit(500);
// console.log(account.getBalance());
// console.log(account.withDraw(2000));
// console.log(account.withDraw(900));
// console.log(account.getBalance());
// console.log(account.balance); // undefined（アクセス不可）

// --- 問題 6：ファクトリ関数 ---
// 使用例
const createTaxCalculator = (ratio) => {
  return (price) => price * (1 + ratio);
};
const calcWithTax10 = createTaxCalculator(0.1);
const calcWithTax8 = createTaxCalculator(0.08);

console.log(calcWithTax10(100)); // 110
console.log(calcWithTax10(1230));
console.log(calcWithTax8(100)); // 108
console.log(calcWithTax8(2400));
// --- 問題 7：イベントハンドラでのクロージャ ---

// --- 問題 8：ループと var ---

// --- 問題 9：stale closure（React） ---

// --- 問題 10：クロージャを意識した修正（React） ---
