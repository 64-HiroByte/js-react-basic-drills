/**
 * 12_js-async-map-reduce-drill
 *
 * 非同期 × map / reduce 完全攻略ドリル（Promise.all / await）
 *
 * 対応する問題ファイル:
 * 12_js-async-map-reduce-drill.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 12
 */

// --- 問題 1：map に async を書くと何が返る？ ---
// const ids = [1, 2, 3];

// const results = ids.map(async (id) => {
//   return id * 2;
// });

// console.log(results);

// --- 問題 2：Promise[] を値の配列にする ---
// const ids = [1, 2, 3];

// const main = async () => {
//   const results = ids.map(async (id) => {
//     return id * 2;
//   });
//   const values = await Promise.all(results);
//   console.log(values);

//   /** 別解（結果は同じ）
//    * const results = await Promise.all(
//    *   ids.map(async (id) => {
//    *     return id * 2;
//    *   })
//    * );
//    * console.log(results);
//    */
// };

// main();

// --- 問題 3：API を複数取得する ---
// const urls = [
//   "https://jsonplaceholder.typicode.com/users/1",
//   "https://jsonplaceholder.typicode.com/users/2",
//   "https://jsonplaceholder.typicode.com/users/3",
// ];
// const fetchUsers = async (urls) => {
//   const data = await Promise.all(
//     urls.map(async (url) => {
//       const res = await fetch(url);
//       return res.json();
//     })
//   );
//   return data;
// };
// // console.log(fetchUsers(urls)); // ❌️ これだけでは <pending> となる
// fetchUsers(urls).then((data) => {
//   console.log(data);
// });

// --- 問題 4：並列実行と直列実行の違い ---
// 共通の準備
// const items = [1, 2, 3];
// const doAsync = async (item) => {
//   console.log(`開始: ${item}`);
//   await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒待つ
//   console.log(`完了: ${item}`);
//   return item * 2;
// };

// --- A: Promise.all ---
// const runA = async () => {
//   const results = await Promise.all(items.map((item) => doAsync(item)));
//   console.log(results);
// };
// runA();

// // --- B: for...of ---
// const runB = async () => {
//   const results = [];
//   for (const item of items) {
//     const result = await doAsync(item);
//     results.push(result);
//   }
//   console.log(results);
// };
// runB();

// --- 問題 5：なぜこれは危険か ---

// --- 問題 6：直列処理が必要なケース ---
