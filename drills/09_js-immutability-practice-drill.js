/**
 * 09_js-immutability-practice-drill
 *
 * Immutability 実践ドリル（事故例ベース）
 *
 * 対応する問題ファイル:
 * 09_js-immutability-practice-drill.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 09
 */

// --- 問題 1：push の罠 ---
// const items = [1, 2, 3];

// const addItem = (list, item) => {
//   return [...list, item];
// };

// const newItems = addItem(items, 4);
// console.log(items);
// console.log(newItems);

// --- 問題 2：直接代入 ---
// const user = { id: 1, name: "Taro", age: 20 };

// const updateAge = (u) => ({ ...u, age: 21 });

// const newUser = updateAge(user);
// console.log(user.age);
// console.log(newUser.age);
// console.log(user === newUser);

// --- 問題 3：map = 安全、ではない ---
// const users = [
//   { id: 1, name: "Taro", active: false },
//   { id: 2, name: "Jiro", active: false },
// ];

// const updated = users.map((user) => ({ ...user, active: true }));

// console.log(users[0].active);
// console.log(updated[0].active);

// --- 問題 4：ネストした配列 ---
const state = {
  users: [
    { id: 1, name: "Taro", tags: ["a"] },
    { id: 2, name: "Jiro", tags: ["b"] },
  ],
};

const nextState = {
  ...state,
  users: state.users.map((user) =>
    user.id === 1 ? { ...user, tags: [...user.tags, "c"] } : user
  ),
};

console.log(nextState.users[0].tags); // ["a", "c"]
console.log(state.users[0].tags); // ["a"] ← 元のまま

// --- 問題 5：条件付き更新 ---
