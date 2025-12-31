/**
 * 19_usememo-usecallback-drill
 *
 * useMemo / useCallback ドリル
 *
 * 対応する問題ファイル:
 * drills/19_js-usememo-usecallback-drill.md
 *
 * 使い方:
 * 1. 解きたい問題のコメントを外す（function内のコードとreturn文）
 * 2. 保存して動作確認
 * 3. 完了したらコメントアウトして次へ
 *
 * 実行方法:
 * npm run react 19
 */

import { useState, useEffect, useMemo, useCallback, memo } from 'react'

// ========== サンプルデータ ==========
const sampleItems = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  value: Math.random() * 100
}))

// ========== 解答欄 ==========
function Answer() {
  // --- 問題 1：useMemo が不要なケース ---
  // function SimpleCalc({ a, b }) {
  //   const sum = useMemo(() => a + b, [a, b]);
  //   return <p>Sum: {sum}</p>;
  // }
  // return <SimpleCalc a={10} b={20} />;

  // --- 問題 2：useMemo が必要なケース ---
  // const [filter, setFilter] = useState('');
  //
  // function ExpensiveList({ items, filter }) {
  //   const filtered = items.filter(item => item.name.includes(filter));
  //   return (
  //     <ul>
  //       {filtered.slice(0, 10).map(item => (
  //         <li key={item.id}>{item.name}</li>
  //       ))}
  //     </ul>
  //   );
  // }
  // return (
  //   <div>
  //     <ExpensiveList items={sampleItems} filter={filter} />
  //     <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter..." />
  //   </div>
  // );

  // --- 問題 3：useCallback が不要なケース ---
  // function Counter() {
  //   const [count, setCount] = useState(0);
  //
  //   const increment = useCallback(() => {
  //     setCount(c => c + 1);
  //   }, []);
  //
  //   return <button onClick={increment}>{count}</button>;
  // }
  // return <Counter />;

  // --- 問題 4：useCallback + memo の組み合わせ ---
  // const ExpensiveChild = memo(function ExpensiveChild({ onClick, label }) {
  //   console.log('ExpensiveChild rendered:', label);
  //   return <button onClick={onClick}>{label}</button>;
  // });
  //
  // function Parent() {
  //   const [count, setCount] = useState(0);
  //   const [text, setText] = useState('');
  //
  //   const handleClick = () => {
  //     console.log('clicked');
  //   };
  //
  //   return (
  //     <div>
  //       <input value={text} onChange={e => setText(e.target.value)} />
  //       <p>Count: {count}</p>
  //       <button onClick={() => setCount(c => c + 1)}>+1</button>
  //       <ExpensiveChild onClick={handleClick} label="Click me" />
  //     </div>
  //   );
  // }
  // return <Parent />;

  // --- 問題 5：依存配列の間違い ---
  // function SearchInput({ onSearch }) {
  //   const [query, setQuery] = useState('');
  //
  //   const handleSubmit = useCallback(() => {
  //     onSearch(query);
  //   }, []); // ← query が依存配列にない
  //
  //   return (
  //     <div>
  //       <input value={query} onChange={e => setQuery(e.target.value)} />
  //       <button onClick={handleSubmit}>Search</button>
  //     </div>
  //   );
  // }
  // return <SearchInput onSearch={(q) => alert(`検索: ${q}`)} />;

  // --- 問題 6：useMemo で参照を安定化 ---
  // const ConfigConsumer = memo(function ConfigConsumer({ config }) {
  //   console.log('ConfigConsumer rendered');
  //   return <p>Theme: {config.theme}</p>;
  // });
  //
  // function ConfigProvider() {
  //   const [theme, setTheme] = useState('light');
  //
  //   const config = { theme, version: '1.0' };
  //
  //   return (
  //     <div>
  //       <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
  //         Toggle Theme
  //       </button>
  //       <ConfigConsumer config={config} />
  //     </div>
  //   );
  // }
  // return <ConfigProvider />;

  // --- 問題 7：過剰な最適化 ---
  // function OverOptimized({ items }) {
  //   const [selected, setSelected] = useState(null);
  //
  //   const sortedItems = useMemo(() => {
  //     return [...items].sort((a, b) => a.name.localeCompare(b.name));
  //   }, [items]);
  //
  //   const handleSelect = useCallback((id) => {
  //     setSelected(id);
  //   }, []);
  //
  //   const selectedItem = useMemo(() => {
  //     return items.find(item => item.id === selected);
  //   }, [items, selected]);
  //
  //   return (
  //     <div>
  //       <p>Selected: {selectedItem?.name || 'None'}</p>
  //       <ul>
  //         {sortedItems.slice(0, 5).map(item => (
  //           <li key={item.id} onClick={() => handleSelect(item.id)}>
  //             {item.name}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // }
  // return <OverOptimized items={sampleItems.slice(0, 20)} />;

  return null;
}

// ========== App ==========
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ドリル 19: useMemo / useCallback</h1>
      <Answer />
    </div>
  );
}
