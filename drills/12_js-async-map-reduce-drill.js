/**
 * 06_js-async-map-reduce-drill
 *
 * 対応する問題ファイル:
 * 06_js-async-map-reduce-drill.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 06
 */

// --- 問題 1 ---
// const ids = [1, 2, 3];

// const results = ids.map(async (id) => {
//   return id * 2;
// });

// console.log(results);

/**  出力のされ方
 * [ Promise { 2 }, Promise { 4 }, Promise { 6 } ]
 *
 * results は Promise の配列（Promise[]）になる。
 * async 関数は必ず Promise を返すため、map の戻り値は Promise[] になる。
 */

// --- 問題 2 ---
const ids = [1, 2, 3];

const main = async () => {
  const results = ids.map(async (id) => {
    return id * 2;
  });
  const values = await Promise.all(results);
  console.log(values);
};

main();

/**
 * 解説：
 * - map + async は Promise の配列を返す
 * - Promise.all() で全ての Promise が解決するのを待つ
 * - await Promise.all() の戻り値は、各 Promise の結果の配列
 *
 * 実務での使用例：
 * const fetchUsers = async (ids) => {
 *   const users = await Promise.all(
 *     ids.map(async (id) => {
 *       const res = await fetch(`/api/users/${id}`);
 *       return res.json();
 *     })
 *   );
 *   return users;
 * };
 *
 * 注意：
 * この例の id * 2 は同期処理なので、本来 async は不要。
 * 「async を付けると Promise[] になる」ことを示すための例。
 */
