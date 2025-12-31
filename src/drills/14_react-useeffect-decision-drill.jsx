/**
 * 14_react-useeffect-decision-drill
 *
 * useEffect 要不要・設計判断トレーニング
 *
 * 対応する問題ファイル:
 * drills/14_react-useeffect-decision-drill.md
 *
 * 使い方:
 * 1. 解きたい問題のコメントを外す（function内のコードとreturn文）
 * 2. 保存して動作確認
 * 3. 完了したらコメントアウトして次へ
 *
 * 実行方法:
 * npm run react 14
 */

import { useState, useEffect, useCallback, useMemo } from 'react'

// ========== サンプルデータ ==========
const sampleUsers = [
  { id: 1, name: 'Taro' },
  { id: 2, name: 'Jiro' },
]

const sampleItems = [1, 5, 12, 8, 20, 3, 15]

// ========== 解答欄 ==========
function Answer() {
  // --- 問題 1：useEffect が完全に不要な例 ---
  // function UserCount({ users }) {
  //   const [count, setCount] = useState(0);
  //   useEffect(() => {
  //     setCount(users.length);
  //   }, [users]);
  //   return <p>{count}</p>;
  // }
  // return <UserCount users={sampleUsers} />;

  // --- 問題 2：「とりあえず useEffect」パターン ---
  // function TotalPrice({ items }) {
  //   const [total, setTotal] = useState(0);
  //   useEffect(() => {
  //     const sum = items.reduce((a, b) => a + b, 0);
  //     setTotal(sum);
  //   }, [items]);
  //   return <p>合計: {total}</p>;
  // }
  // return <TotalPrice items={sampleItems} />;

  // --- 問題 3：useEffect が必要な基本例 ---
  // function PageTitle({ title }) {
  //   useEffect(() => {
  //     document.title = title;
  //   }, [title]);
  //   return <p>タイトルを「{title}」に設定しました</p>;
  // }
  // return <PageTitle title="テストタイトル" />;

  // --- 問題 4：依存配列が怪しいケース ---
  // function Logger({ value }) {
  //   useEffect(() => {
  //     console.log('value:', value);
  //   }, []); // ← 空の依存配列
  //   return <p>value: {value}（コンソールを確認）</p>;
  // }
  // const [v, setV] = useState(10);
  // return (
  //   <div>
  //     <Logger value={v} />
  //     <button onClick={() => setV(v + 1)}>+1</button>
  //   </div>
  // );

  // --- 問題 5：useEffect を書かなくていいケース ---
  // function FilteredList({ items }) {
  //   const [filtered, setFiltered] = useState([]);
  //   useEffect(() => {
  //     setFiltered(items.filter((n) => n > 5));
  //   }, [items]);
  //   return <div>{filtered.length} 件</div>;
  // }
  // return <FilteredList items={sampleItems} />;

  // --- 問題 6：useEffect が本当に必要な非同期処理 ---
  // function UserProfile() {
  //   const [user, setUser] = useState(null);
  //   useEffect(() => {
  //     fetch('https://jsonplaceholder.typicode.com/users/1')
  //       .then((res) => res.json())
  //       .then(setUser);
  //   }, []);
  //   if (!user) return <p>Loading...</p>;
  //   return <p>{user.name} ({user.email})</p>;
  // }
  // return <UserProfile />;

  // --- 問題 7：依存配列に関数がある場合 ---
  // function Calculator({ value }) {
  //   const calc = () => value * 2;
  //   useEffect(() => {
  //     console.log('計算結果:', calc());
  //   }, [calc]);
  //   return <p>value: {value}（コンソールを確認）</p>;
  // }
  // const [v, setV] = useState(10);
  // return (
  //   <div>
  //     <Calculator value={v} />
  //     <button onClick={() => setV(v + 1)}>+1</button>
  //   </div>
  // );

  // --- 問題 8：useEffect に書いてはいけない処理 ---
  // function OrderTotal({ items }) {
  //   const [total, setTotal] = useState(0);
  //   useEffect(() => {
  //     const sum = items.reduce((a, b) => a + b, 0);
  //     setTotal(sum);
  //   }, [items]);
  //   return <p>合計: {total}</p>;
  // }
  // return <OrderTotal items={sampleItems} />;

  // --- 問題 9：条件付き useEffect（Hooks rules 違反）---
  // ※ これはエラーになるので実行注意
  // function Example({ isOpen }) {
  //   if (isOpen) {
  //     useEffect(() => {
  //       console.log('opened');
  //     }, []);
  //   }
  //   return <div>{isOpen ? 'Open' : 'Closed'}</div>;
  // }
  // return <Example isOpen={true} />;

  // --- 問題 10：render 中の setState ---
  // ※ これは無限ループになるので実行注意
  // function Example({ items }) {
  //   const [data, setData] = useState([]);
  //   if (items.length === 0) {
  //     setData(['default']);
  //   }
  //   return <div>{data.length}</div>;
  // }
  // return <Example items={[]} />;

  return null;
}

// ========== App ==========
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ドリル 14: useEffect 判断力</h1>
      <Answer />
    </div>
  );
}
