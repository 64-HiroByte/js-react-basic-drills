/**
 * 16_react-map-rendering-pitfalls
 *
 * React map/key の罠ドリル
 *
 * 対応する問題ファイル:
 * drills/16_js-react-map-rendering-pitfalls.md
 *
 * 使い方:
 * 1. 解きたい問題のコメントを外す（function内のコードとreturn文）
 * 2. 保存して動作確認
 * 3. 完了したらコメントアウトして次へ
 *
 * 実行方法:
 * npm run react 16
 */

import { useState } from 'react'

// ========== サンプルデータ ==========
const sampleUsers = [
  { id: 1, name: 'Taro', age: 20 },
  { id: 2, name: 'Jiro', age: 25 },
  { id: 3, name: 'Saburo', age: 30 },
]

const sampleItems = [
  { id: 'a', text: 'アイテムA' },
  { id: 'b', text: 'アイテムB' },
  { id: 'c', text: 'アイテムC' },
]

// ========== 解答欄 ==========
function Answer() {
  // --- 問題 1：key にインデックスを使う問題 ---
  // function TodoList() {
  //   const [items, setItems] = useState(['A', 'B', 'C']);
  //
  //   const addToTop = () => {
  //     setItems(['New', ...items]);
  //   };
  //
  //   return (
  //     <div>
  //       <button onClick={addToTop}>先頭に追加</button>
  //       <ul>
  //         {items.map((item, index) => (
  //           <li key={index}>
  //             <input defaultValue={item} />
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // }
  // return <TodoList />;

  // --- 問題 2：key を使わない場合 ---
  // function UserList({ users }) {
  //   return (
  //     <ul>
  //       {users.map(user => (
  //         <li>{user.name}</li>
  //       ))}
  //     </ul>
  //   );
  // }
  // return <UserList users={sampleUsers} />;

  // --- 問題 3：適切な key の選択 ---
  // function ItemList({ items }) {
  //   return (
  //     <ul>
  //       {items.map(item => (
  //         <li key={item.id}>{item.text}</li>
  //       ))}
  //     </ul>
  //   );
  // }
  // return <ItemList items={sampleItems} />;

  // --- 問題 4：key の重複 ---
  // function DuplicateKeyList() {
  //   const items = [
  //     { id: 1, name: 'A' },
  //     { id: 1, name: 'B' }, // 重複した id
  //     { id: 2, name: 'C' },
  //   ];
  //
  //   return (
  //     <ul>
  //       {items.map(item => (
  //         <li key={item.id}>{item.name}</li>
  //       ))}
  //     </ul>
  //   );
  // }
  // return <DuplicateKeyList />;

  // --- 問題 5：フィルタリングと key ---
  // const [minAge, setMinAge] = useState(0);
  //
  // function FilteredList({ users, minAge }) {
  //   const filtered = users.filter(u => u.age >= minAge);
  //
  //   return (
  //     <ul>
  //       {filtered.map((user, index) => (
  //         <li key={index}>{user.name} ({user.age}歳)</li>
  //       ))}
  //     </ul>
  //   );
  // }
  // return (
  //   <div>
  //     <FilteredList users={sampleUsers} minAge={minAge} />
  //     <input type="number" value={minAge} onChange={e => setMinAge(Number(e.target.value))} />
  //   </div>
  // );

  // --- 問題 6：コンポーネントの分離と key ---
  // function UserCard({ user }) {
  //   return (
  //     <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
  //       <h3>{user.name}</h3>
  //       <p>Age: {user.age}</p>
  //     </div>
  //   );
  // }
  //
  // function UserCardList({ users }) {
  //   return (
  //     <div>
  //       {users.map(user => (
  //         <UserCard key={user.id} user={user} />
  //       ))}
  //     </div>
  //   );
  // }
  // return <UserCardList users={sampleUsers} />;

  // --- 問題 7：動的リストの追加・削除 ---
  // function DynamicList() {
  //   const [items, setItems] = useState([
  //     { id: 1, text: 'Item 1' },
  //     { id: 2, text: 'Item 2' },
  //   ]);
  //   const [nextId, setNextId] = useState(3);
  //
  //   const addItem = () => {
  //     setItems([...items, { id: nextId, text: `Item ${nextId}` }]);
  //     setNextId(nextId + 1);
  //   };
  //
  //   const removeItem = (id) => {
  //     setItems(items.filter(item => item.id !== id));
  //   };
  //
  //   return (
  //     <div>
  //       <button onClick={addItem}>追加</button>
  //       <ul>
  //         {items.map(item => (
  //           <li key={item.id}>
  //             {item.text}
  //             <button onClick={() => removeItem(item.id)}>削除</button>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // }
  // return <DynamicList />;

  return null;
}

// ========== App ==========
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ドリル 16: React map/key</h1>
      <Answer />
    </div>
  );
}
