/**
 * 21_performance-accident-drill
 *
 * パフォーマンス事故ドリル
 *
 * 対応する問題ファイル:
 * drills/21_js-performance-accident-drill.md
 *
 * 使い方:
 * 1. 解きたい問題のコメントを外す（function内のコードとreturn文）
 * 2. 保存して動作確認
 * 3. 完了したらコメントアウトして次へ
 *
 * 実行方法:
 * npm run react 21
 */

import { useState, useEffect, useMemo, useCallback, memo } from 'react'

// ========== サンプルデータ ==========
const sampleItems = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
}))

// ========== 解答欄 ==========
function Answer() {
  // --- 問題 1：不要な再レンダリング ---
  // function ExpensiveChild() {
  //   console.log('ExpensiveChild rendered');
  //   // 重い処理をシミュレート
  //   const start = Date.now();
  //   while (Date.now() - start < 10) {}
  //   return <p>Expensive Child</p>;
  // }
  //
  // function Parent() {
  //   const [count, setCount] = useState(0);
  //   const [text, setText] = useState('');
  //
  //   return (
  //     <div>
  //       <input value={text} onChange={e => setText(e.target.value)} />
  //       <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
  //       <ExpensiveChild />
  //     </div>
  //   );
  // }
  // return <Parent />;

  // --- 問題 2：インラインオブジェクト ---
  // function ListItem({ item, style }) {
  //   console.log('ListItem rendered:', item.id);
  //   return <li style={style}>{item.name}</li>;
  // }
  //
  // const MemoizedListItem = memo(ListItem);
  //
  // function List({ items }) {
  //   return (
  //     <ul>
  //       {items.map(item => (
  //         <MemoizedListItem
  //           key={item.id}
  //           item={item}
  //           style={{ color: 'blue' }} // ← 毎回新しいオブジェクト
  //         />
  //       ))}
  //     </ul>
  //   );
  // }
  // const [count, setCount] = useState(0);
  // return (
  //   <div>
  //     <List items={sampleItems.slice(0, 5)} />
  //     <button onClick={() => setCount(c => c + 1)}>Re-render ({count})</button>
  //   </div>
  // );

  // --- 問題 3：インライン関数 ---
  // const MemoizedButton = memo(function MemoizedButton({ label, onClick }) {
  //   console.log('Button rendered:', label);
  //   return <button onClick={onClick}>{label}</button>;
  // });
  //
  // function ButtonList({ items, onSelect }) {
  //   return (
  //     <div>
  //       {items.map(item => (
  //         <MemoizedButton
  //           key={item.id}
  //           label={item.name}
  //           onClick={() => onSelect(item.id)} // ← 毎回新しい関数
  //         />
  //       ))}
  //     </div>
  //   );
  // }
  // const [count, setCount] = useState(0);
  // const handleSelect = (id) => console.log('Selected:', id);
  // return (
  //   <div>
  //     <ButtonList items={sampleItems.slice(0, 5)} onSelect={handleSelect} />
  //     <button onClick={() => setCount(c => c + 1)}>Re-render ({count})</button>
  //   </div>
  // );

  // --- 問題 4：useEffect の無限ループ ---
  // ※ 注意: これは無限ループになります
  // function InfiniteLoop() {
  //   const [data, setData] = useState({ count: 0 });
  //
  //   useEffect(() => {
  //     console.log('Effect running');
  //     setData({ count: data.count }); // ← 新しいオブジェクトを作成
  //   }, [data]); // ← data が変わるたびに実行
  //
  //   return <p>{data.count}</p>;
  // }
  // return <InfiniteLoop />;

  // --- 問題 5：重い計算を毎回実行 ---
  // const [multiplier, setMultiplier] = useState(1);
  //
  // function HeavyCalculation({ items, multiplier }) {
  //   // 重い計算（毎レンダリングで実行される）
  //   const total = items.reduce((sum, item) => {
  //     // 重い処理をシミュレート
  //     let result = 0;
  //     for (let i = 0; i < 10000; i++) {
  //       result += item.id * multiplier;
  //     }
  //     return sum + result;
  //   }, 0);
  //
  //   return <p>Total: {total}</p>;
  // }
  // return (
  //   <div>
  //     <HeavyCalculation items={sampleItems.slice(0, 10)} multiplier={multiplier} />
  //     <button onClick={() => setMultiplier(m => m + 1)}>multiplier: {multiplier}</button>
  //   </div>
  // );

  // --- 問題 6：key にインデックスを使う ---
  // function ReorderableList() {
  //   const [items, setItems] = useState(['A', 'B', 'C']);
  //
  //   const shuffle = () => {
  //     setItems([...items].sort(() => Math.random() - 0.5));
  //   };
  //
  //   return (
  //     <div>
  //       <button onClick={shuffle}>シャッフル</button>
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
  // return <ReorderableList />;

  // --- 問題 7：state の過剰な分割 ---
  // function FormWithTooManyStates() {
  //   const [name, setName] = useState('');
  //   const [email, setEmail] = useState('');
  //   const [phone, setPhone] = useState('');
  //   const [address, setAddress] = useState('');
  //   const [city, setCity] = useState('');
  //   const [zip, setZip] = useState('');
  //
  //   // 各入力で全体が再レンダリング
  //
  //   return (
  //     <form>
  //       <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
  //       <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
  //       <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
  //       <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
  //       <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
  //       <input value={zip} onChange={e => setZip(e.target.value)} placeholder="ZIP" />
  //     </form>
  //   );
  // }
  // return <FormWithTooManyStates />;

  return null;
}

// ========== App ==========
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ドリル 21: パフォーマンス事故</h1>
      <p style={{ color: '#666', fontSize: '14px' }}>
        コンソールを開いて再レンダリングを確認してください
      </p>
      <Answer />
    </div>
  );
}
