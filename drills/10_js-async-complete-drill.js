/**
 * 10_js-async-complete-drill
 *
 * 非同期処理 完全反復ドリル（Promise / async-await）
 *
 * 対応する問題ファイル:
 * 10_js-async-complete-drill.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 10
 */

// --- 問題 1：この戻り値は何？ ---
// const fn = () => {
//   return Promise.resolve(10);
// };

// const result = fn();
// console.log(result);  // -> promiseオブジェクト

// --- 問題 2：async の戻り値 ---
// const fn = async () => {
//   return 10;
// };

// const result = fn();
// console.log(result);

// --- 問題 3：await しているものは何？ ---

// --- 問題 4：出力順を答える ---

// --- 問題 5：この結果は何になる？ ---

// --- 問題 6：正しく値を得る ---
// const numbers = [1, 2, 3];

// const main = async () => {
//   const result = await Promise.all(numbers.map(async (n) => n * 2));
//   console.log(result);
// };
// main();

// --- 問題 7：次のコードの問題点を説明する ---
// const numbers = [1, 2, 3];

// const result = numbers.reduce(async (acc, n) => {
//   const sum = await acc;
//   return sum + n;
// }, 0);

// console.log(result);

// --- 問題 8：どちらが並列？ ---

// --- 問題 9：API をまとめて取得する ---
const userIds = [1, 2, 3];

const fetchUsers = async (ids) => {
  const users = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      return res.json();
    })
  );
  return users;
};

// 実行
fetchUsers(userIds).then((users) => {
  console.log(users);
});
