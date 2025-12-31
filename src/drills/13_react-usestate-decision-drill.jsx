/**
 * 13_react-usestate-decision-drill
 *
 * useState 判断力・削減トレーニング
 *
 * 対応する問題ファイル:
 * drills/13_react-usestate-decision-drill.md
 *
 * 使い方:
 * 1. 解きたい問題のコメントを外す（function内のコードとreturn文）
 * 2. 保存して動作確認
 * 3. 完了したらコメントアウトして次へ
 *
 * 実行方法:
 * npm run react 13
 */

import { useState, useEffect, useRef, useMemo } from 'react'

// ========== サンプルデータ ==========
const sampleUsers = [
  { id: 1, name: 'Taro' },
  { id: 2, name: 'Jiro' },
  { id: 3, name: 'Saburo' },
]

const sampleItems = [1, 5, 12, 8, 20, 3, 15]

// ========== 解答欄 ==========
function Answer() {
  // --- 問題 1：派生 state（典型）---
  // function UserList({ users }) {
  //   const [count, setCount] = useState(0);
  //   useEffect(() => {
  //     setCount(users.length);
  //   }, [users]);
  //   return <p>User count: {count}</p>;
  // }
  // return <UserList users={sampleUsers} />;

  // --- 問題 2：冗長な boolean state ---
  // function SubmitButton({ disabled }) {
  //   const [isDisabled, setIsDisabled] = useState(false);
  //   useEffect(() => {
  //     setIsDisabled(disabled);
  //   }, [disabled]);
  //   return <button disabled={isDisabled}>Submit</button>;
  // }
  // return <SubmitButton disabled={true} />;

  // --- 問題 3：本当に state が必要なケース ---
  // function Counter() {
  //   const [count, setCount] = useState(0);
  //   return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
  // }
  // return <Counter />;

  // --- 問題 4：複数 state を 1 つにまとめる ---
  // function Form() {
  //   const [name, setName] = useState('');
  //   const [email, setEmail] = useState('');
  //   return (
  //     <form>
  //       <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
  //       <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
  //       <p>Name: {name}, Email: {email}</p>
  //     </form>
  //   );
  // }
  // return <Form />;

  // --- 問題 5：useState + useEffect の削減 ---
  // function FilteredList({ items }) {
  //   const [filtered, setFiltered] = useState([]);
  //   useEffect(() => {
  //     setFiltered(items.filter((n) => n > 10));
  //   }, [items]);
  //   return <div>{filtered.length} 件（10より大きい）</div>;
  // }
  // return <FilteredList items={sampleItems} />;

  // --- 問題 6：useState を使わない選択 ---
  // function Timer() {
  //   const start = Date.now();
  //   return <p>経過時間: {Date.now() - start}ms</p>;
  // }
  // return <Timer />;

  // --- 問題 7：useRef と迷うケース ---
  // function ClickCounter() {
  //   const countRef = useRef(0);
  //   const handleClick = () => {
  //     countRef.current++;
  //     console.log(countRef.current);
  //   };
  //   return <button onClick={handleClick}>Click ({countRef.current})</button>;
  // }
  // return <ClickCounter />;

  // --- 問題 8：配列を直接変更してしまう ---
  // function TodoList() {
  //   const [items, setItems] = useState(['買い物', '掃除']);
  //   const handleAdd = () => {
  //     items.push('新しいタスク');
  //     setItems(items);
  //   };
  //   return (
  //     <div>
  //       <button onClick={handleAdd}>追加</button>
  //       <ul>
  //         {items.map((item, i) => <li key={i}>{item}</li>)}
  //       </ul>
  //     </div>
  //   );
  // }
  // return <TodoList />;

  return null;
}

// ========== App ==========
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ドリル 13: useState 判断力</h1>
      <Answer />
    </div>
  );
}
