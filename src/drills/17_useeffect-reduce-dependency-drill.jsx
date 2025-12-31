/**
 * 17_useeffect-reduce-dependency-drill
 *
 * useEffect 依存配列の最適化ドリル
 *
 * 対応する問題ファイル:
 * drills/17_js-useeffect-reduce-dependency-drill.md
 *
 * 使い方:
 * 1. 解きたい問題のコメントを外す（function内のコードとreturn文）
 * 2. 保存して動作確認
 * 3. 完了したらコメントアウトして次へ
 *
 * 実行方法:
 * npm run react 17
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

// ========== 解答欄 ==========
function Answer() {
  // --- 問題 1：オブジェクトを依存配列に入れる ---
  // const [count, setCount] = useState(0);
  // const user = { id: 1, name: 'Taro' };
  //
  // function UserLogger({ user }) {
  //   useEffect(() => {
  //     console.log('User changed:', user);
  //   }, [user]);
  //
  //   return <p>{user.name}</p>;
  // }
  // return (
  //   <div>
  //     <UserLogger user={user} />
  //     <button onClick={() => setCount(c => c + 1)}>再レンダリング ({count})</button>
  //   </div>
  // );

  // --- 問題 2：関数を依存配列に入れる ---
  // const [count, setCount] = useState(0);
  //
  // const fetchData = () => Promise.resolve({ data: 'test' });
  //
  // function DataFetcher({ fetchData }) {
  //   const [data, setData] = useState(null);
  //
  //   useEffect(() => {
  //     fetchData().then(setData);
  //   }, [fetchData]);
  //
  //   return <pre>{JSON.stringify(data)}</pre>;
  // }
  // return (
  //   <div>
  //     <DataFetcher fetchData={fetchData} />
  //     <button onClick={() => setCount(c => c + 1)}>再レンダリング ({count})</button>
  //   </div>
  // );

  // --- 問題 3：useCallback で関数を安定化 ---
  // function Parent() {
  //   const [count, setCount] = useState(0);
  //
  //   const handleClick = () => {
  //     console.log('clicked');
  //   };
  //
  //   return (
  //     <div>
  //       <p>{count}</p>
  //       <button onClick={() => setCount(c => c + 1)}>+1</button>
  //       <Child onClick={handleClick} />
  //     </div>
  //   );
  // }
  //
  // function Child({ onClick }) {
  //   useEffect(() => {
  //     console.log('Child: onClick changed');
  //   }, [onClick]);
  //
  //   return <button onClick={onClick}>Child Button</button>;
  // }
  // return <Parent />;

  // --- 問題 4：useMemo でオブジェクトを安定化 ---
  // const [count, setCount] = useState(0);
  //
  // const config = { theme: 'dark', lang: 'ja' };
  //
  // function ConfigDisplay({ config }) {
  //   useEffect(() => {
  //     console.log('Config changed:', config);
  //   }, [config]);
  //
  //   return <pre>{JSON.stringify(config)}</pre>;
  // }
  // return (
  //   <div>
  //     <ConfigDisplay config={config} />
  //     <button onClick={() => setCount(c => c + 1)}>再レンダリング ({count})</button>
  //   </div>
  // );

  // --- 問題 5：依存を減らすリファクタリング ---
  // function SearchResults({ query, filters }) {
  //   const [results, setResults] = useState([]);
  //
  //   useEffect(() => {
  //     // query と filters 両方が依存
  //     const searchUrl = `/api/search?q=${query}&filter=${filters.join(',')}`;
  //     console.log('Fetching:', searchUrl);
  //     // fetch(searchUrl).then(res => res.json()).then(setResults);
  //     setResults([{ id: 1, name: 'Result' }]);
  //   }, [query, filters]);
  //
  //   return <div>{results.length} 件</div>;
  // }
  // return <SearchResults query="test" filters={['a', 'b']} />;

  // --- 問題 6：関数形式の setState で依存を減らす ---
  // function Counter() {
  //   const [count, setCount] = useState(0);
  //
  //   useEffect(() => {
  //     const id = setInterval(() => {
  //       setCount(count + 1); // count が依存に必要
  //     }, 1000);
  //     return () => clearInterval(id);
  //   }, [count]);
  //
  //   return <p>{count}</p>;
  // }
  // return <Counter />;

  // --- 問題 7：useRef で依存を避ける ---
  // const [value, setValue] = useState(0);
  //
  // function Logger({ value }) {
  //   useEffect(() => {
  //     console.log('Current value:', value);
  //   }, [value]);
  //
  //   return <p>{value}</p>;
  // }
  // return (
  //   <div>
  //     <Logger value={value} />
  //     <button onClick={() => setValue(v => v + 1)}>+1</button>
  //   </div>
  // );

  return null;
}

// ========== App ==========
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ドリル 17: useEffect 依存配列</h1>
      <Answer />
    </div>
  );
}
