/**
 * 05_js-react-map-rendering-pitfalls
 *
 * 対応する問題ファイル:
 * 05_js-react-map-rendering-pitfalls.md
 *
 * 使い方:
 * - 解きたい問題だけコメントアウトを外す
 *
 * 実行方法:
 * npm run drill 05
 */

// --- 問題 1 ---
// {
//   items.map((item, index) => <ListItem key={index} value={item} />);
// }

/**
 * 要素の追加・削除・並び替えが起きると、React が「同じ要素」と誤認し、
 * 状態や入力値が別の行にズレて紐づく。
 * key は idなど一意なものを使う
 */

// --- 問題 2 ---
// const users = [
//   { id: 10, name: "Taro" },
//   { id: 20, name: "Jiro" },
// ];

// 正しい key を設定する
// users.map((user) => <UserData key={user.id} name={user.name} />)

// --- 問題 3 ---
// <Component key={count} />
/**
 * key が変わるたびにコンポーネントはアンマウントされ、
 * state や effect がすべて初期化される。
 */

// --- 問題 4 ---
// items.map((item) => {
//   setCount(item.value);
// });

/**
 * map内でsetStateを行うとループのたびにレンダリングが行われる
 * mapは変換のための関数である
 * 意図しない挙動やパフォーマンスの低下を招くアンチパターン
 */

// --- 問題 5 ---
// const items = [
//   { name: "item1", value: 2 },
//   { name: "item2", value: 3 },
//   { name: "item3", value: 5 },
//   { name: "item4", value: 4 },
// ];
// items の合計値を state に入れたい
// total = items.reduce((acc, item) => acc + item.value, 0);
// setCount(total);  // setCountはReact hooksなので、ここでは実行できないので注意

// --- 問題 6 ---
// useEffect(() => {
//   const id = setInterval(() => {
//     setCount(count + 1);
//   }, 1000);
//   return () => clearInterval(id);
// }, []);

// count は初期値（例えば 0）のままクロージャに閉じ込められる。
// 更新には関数形式の setState を使う必要がある。

// --- 問題 7 ---
useEffect(() => {
  const id = setInterval(() => {
    setCount((prev) => prev + 1); // ✅ 関数形式に変更
  }, 1000);
  return () => clearInterval(id);
}, []);

/**
 * setCount((prev) => prev + 1);

 * 関数形式の setState を使うことで、クロージャに閉じ込められた古い値ではなく、
 * React が渡す最新の state を参照できる。
 */

// --- 問題 8 --- （問題１と重複しています）
// {
//   items.map((item, index) => <input key={index} value={item.value} />);
// }

/**
 * 要素の追加・削除・並び替えが起きると、React が「同じ要素」と誤認し、
 * 状態や入力値が別の行にズレて紐づく。
 * key は idなど一意なものを使う
 */
