/**
 * 05_js-optional-nullish-drill
 *
 * オプショナルチェーン・Nullish 完全理解ドリル
 *
 * 対応する問題ファイル:
 * 05_js-optional-nullish-drill.md
 *
 * 使い方:
 * - 解きたい問題のコードを書く
 *
 * 実行方法:
 * npm run drill 05
 */

// --- 問題 1：オプショナルチェーン（基本） ---
// const user = null;
// console.log(user?.name);

// --- 問題 2：ネストしたプロパティ ---
// const user1 = { name: "Taro", address: { city: "Tokyo" } };
// const user2 = { name: "Jiro" };

// console.log(user1.address?.city);
// console.log(user2?.address?.city);

// --- 問題 3：配列アクセス ---
// const data1 = { items: ["a", "b", "c"] };
// const data2 = {}; // items がない

// console.log(data1.items?.[0]);
// console.log(data2.items);

// --- 問題 4：メソッド呼び出し ---
// const obj1 = {
//   greet() {
//     return "Hello";
//   },
// };
// const obj2 = {};

// console.log(obj1.greet?.());
// console.log(obj2.greet?.());

// --- 問題 5：?? の基本 ---
// const a = null ?? "default";
// const b = undefined ?? "default";
// const c = 0 ?? "default";
// const d = "" ?? "default";
// const e = false ?? "default";

// console.log(a, b, c, d, e);

// --- 問題 6：?? と || の違い ---
// const count1 = 0 || 10;
// const count2 = 0 ?? 10;

// const name1 = "" || "名無し";
// const name2 = "" ?? "名無し";

// console.log(count1, count2);
// console.log(name1, name2);

// --- 問題 7：?? を使うべき場面 ---
// function getPage(input) {
//   // input が null/undefined なら 1、それ以外はそのまま
//   return input ?? 1;
// }

// console.log(getPage(0)); // 0 にしたい
// console.log(getPage(5)); // 5 にしたい
// console.log(getPage(null)); // 1 にしたい
// console.log(getPage(undefined)); // 1 にしたい

// --- 問題 8：?. と ?? の組み合わせ ---
// const response1 = {
//   user: {
//     profile: { nickname: "Taro" },
//   },
// };

// const response2 = {
//   user: {}, // profile がない
// };

// const response3 = null; // レスポンス自体がない

// console.log(response1?.user?.profile?.nickname ?? "ゲスト");
// console.log(response2?.user?.profile?.nickname ?? "ゲスト");
// console.log(response3?.user?.profile?.nickname ?? "ゲスト");

// --- 問題 9：配列の最初の要素にデフォルト ---
const post1 = { title: "Hello", tags: ["React", "Next.js"] };
const post2 = { title: "World" }; // tags がない
const post3 = { title: "Test", tags: [] }; // tags が空配列

console.log(post1.tags?.[0] ?? "未分類");
console.log(post2.tags?.[0] ?? "未分類");
console.log(post3.tags?.[0] ?? "未分類");

// --- 問題 10：props の安全なアクセス（React） ---

// --- 問題 11：イベントハンドラの安全な呼び出し（React） ---

// --- 問題 12：API データの表示（React） ---
