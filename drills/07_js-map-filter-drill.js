/**
 * 07_js-map-filter-drill
 *
 * 対応する問題ファイル:
 * 07_js-map-filter-drill.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 07
 */

// --- 問題 1：基本の map ---
// 各要素を 2 倍した配列を作る
// const numbers = [1, 2, 3, 4];
// 各要素を 2 倍した配列を作る
// const double = numbers.map((n) => n * 2);
// console.log(double);

// --- 問題 2：map + アロー関数省略形 ---
// name だけの配列を作る
// const users = [
//   { id: 1, name: "Taro" },
//   { id: 2, name: "Jiro" },
// ];
// const names = users.map((user) => user.name);
// console.log(names);

// --- 問題 3：map の return 忘れ ---
// const numbers = [1, 2, 3, 4];
// const result = numbers.map((n) => {
//   return n * 2;
// });
/** or */
// const result = numbers.map((n) => n * 2);
// console.log(result);

// --- 問題 4：オブジェクトを返す map ---
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

// --- 問題 5：基本の filter ---
// 偶数だけを抽出する
// const numbers = [1, 2, 3, 4, 5, 6];
// const evenNumbers = numbers.filter((num) => num % 2 === 0);
// console.log(evenNumbers);

// --- 問題 6：条件式の書き方 ---
// 20歳以上のユーザーだけ残す
// const users = [
//   { name: "Taro", age: 20 },
//   { name: "Jiro", age: 30 },
//   { name: "Saburo", age: 15 },
// ];
// const adultUsers = users.filter((user) => user.age >= 20);
// console.log(adultUsers);

// --- 問題 7：filter の戻り値 ---
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

// --- 問題 8：よくある実務パターン ---
// 偶数だけを 2 倍した配列を作る
// const numbers = [1, 2, 3, 4, 5, 6];
// const result = numbers.filter((n) => n % 2 === 0).map((n) => n * 2);
// console.log(result);

// --- 問題 9 ---
// 合計を求める
// const numbers = [1, 2, 3, 4];
// const result = numbers.reduce((acc, n) => acc + n, 0);
// console.log(result);
