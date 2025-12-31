/**
 * 04_js-condition-loop-drill
 *
 * 対応する問題ファイル:
 * 04_js-condition-loop-drill.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 04
 */

// --- 問題 1 ---
// const score = 75;

// 80以上: "A"
// 60以上: "B"
// それ以外: "C"

// let result;
// if (score >= 80) {
//   result = "A";
// } else if (score >= 60) {
//   result = "B";
// } else {
//   result = "C";
// }
// console.log(result);

/**
 * この場合、　let result = "" と初期値を設定する必要はない
 * （必ずどれかに当てはまるため）
 */

// --- 問題 2 ---
// const isLogin = true;

// isLogin が true の場合 "Welcome"、false の場合 "Please login"
// const message = isLogin ? "Wellcome" : "Pleace login";
// console.log(message);

// --- 問題 3 ---
// const value = "";

// if (value) {
//   console.log("true");
// } else {
//   console.log("false");
// }
// 問題文のままでOK（空文字はfalthyな値）

// --- 問題 4 ---
// const role = "admin";
/**
 * admin -> "管理者"
 * user -> "一般ユーザー"
 * guest -> "ゲスト"
 */

// let label;
// switch (role) {
//   case "admin":
//     label = "管理者";
//     break;  // 該当した場合は必ず break
//   case "user":
//     label = "一般ユーザー";
//     break;
//   case "guest":
//     label = "ゲスト";
//     break;
//   default: // 該当なしの場合を定義しておく
//     label = "不明";
// }
// console.log(label);

// --- 問題 5 ---
// 0 から 4 まで出力
// for (let i = 0; i < 5; i++) {
//   console.log(i);
// }

// --- 問題 6 ---
// const fruits = ["apple", "banana", "orange"];

// 各要素を出力
// for (const fruit of fruits) {
//   console.log(fruit);
// }
/**
 * ループごとに新しい変数が作成されるので、const を使う
 * letは使わない。
 */

// --- 問題 7 ---
// const user = { name: "Taro", age: 20 };

// key と value を出力（for in を使用）
// for (const key in user) {
//   console.log(key, user[key]);
// }

/**
 * for in はキー（インデックス）を取得する
 * for in はプロトタイプチェーンのプロパティも列挙される可能性がある
 * Object.entries() を使うことが多い
 */
// Object.entries()を使った例
// for (const [key, value] of Object.entries(user)) {
//   console.log(key, value);
// }

// --- 問題 8 ---
// let count = 3;

// count が 0 になるまで出力
// while (count > 0) {
//   console.log(count);
//   count--;
// }

// --- 問題 9 ---
// 1〜5 を出力。ただし 3 はスキップ
// for (let i = 1; i < 6; i++) {
//   if (i === 3) continue;
//   console.log(i);
// }

// --- 問題 10 ---
items.forEach((item) => {
  setState(item);
});

/**
 * Reactにおいて、setStateでstateを更新すると、その都度レンダリングが行われる
 * ループの中でstate更新するのはアンチパターン
 * map or reduce でまとめてから1回だけstate 更新するのが正しい
 */
