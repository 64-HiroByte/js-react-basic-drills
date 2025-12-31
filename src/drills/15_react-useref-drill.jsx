/**
 * 15_react-useref-drill
 *
 * useRef 完全理解ドリル
 *
 * 対応する問題ファイル:
 * drills/15_react-useref-drill.md
 *
 * 使い方:
 * 1. 解きたい問題のコメントを外す（function内のコードとreturn文）
 * 2. 保存して動作確認
 * 3. 完了したらコメントアウトして次へ
 *
 * 実行方法:
 * npm run react 15
 */

import { useState, useEffect, useRef } from 'react'

// ========== 解答欄 ==========
function Answer() {
  // --- 問題 1：input にフォーカス ---
  // function FocusInput() {
  //   const handleClick = () => {
  //     // input にフォーカスを当てたい
  //   };
  //
  //   return (
  //     <div>
  //       <input type="text" />
  //       <button onClick={handleClick}>フォーカス</button>
  //     </div>
  //   );
  // }
  // return <FocusInput />;

  // --- 問題 2：スクロール位置の制御 ---
  // const [messages, setMessages] = useState(['メッセージ1', 'メッセージ2', 'メッセージ3']);
  // const addMessage = () => setMessages(prev => [...prev, `メッセージ${prev.length + 1}`]);
  //
  // function ChatList({ messages }) {
  //   return (
  //     <div style={{ height: '200px', overflow: 'auto', border: '1px solid #ccc' }}>
  //       {messages.map((msg, i) => (
  //         <p key={i} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{msg}</p>
  //       ))}
  //     </div>
  //   );
  // }
  // return (
  //   <div>
  //     <ChatList messages={messages} />
  //     <button onClick={addMessage}>メッセージ追加</button>
  //   </div>
  // );

  // --- 問題 3：useRef vs useState ---
  // function ClickCounter() {
  //   const countRef = useRef(0);
  //
  //   const handleClick = () => {
  //     countRef.current++;
  //     console.log(countRef.current);
  //   };
  //
  //   return <button onClick={handleClick}>クリック ({countRef.current})</button>;
  // }
  // return <ClickCounter />;

  // --- 問題 4：前回の値を記憶 ---
  // const [value, setValue] = useState(10);
  //
  // function ValueTracker({ value }) {
  //   return (
  //     <div>
  //       <p>現在: {value}</p>
  //       <p>前回: {/* ??? */}</p>
  //     </div>
  //   );
  // }
  // return (
  //   <div>
  //     <ValueTracker value={value} />
  //     <button onClick={() => setValue(v => v + 1)}>+1</button>
  //   </div>
  // );

  // --- 問題 5：タイマー ID の保持 ---
  // function Timer() {
  //   const [count, setCount] = useState(0);
  //
  //   const handleStart = () => {
  //     // タイマーを開始
  //   };
  //
  //   const handleStop = () => {
  //     // タイマーを停止
  //   };
  //
  //   return (
  //     <div>
  //       <p>{count}</p>
  //       <button onClick={handleStart}>開始</button>
  //       <button onClick={handleStop}>停止</button>
  //     </div>
  //   );
  // }
  // return <Timer />;

  // --- 問題 6：最新の値を参照する ---
  // function DelayedAlert() {
  //   const [count, setCount] = useState(0);
  //
  //   const handleClick = () => {
  //     setTimeout(() => {
  //       alert(count); // クリック時の count が表示される
  //     }, 3000);
  //   };
  //
  //   return (
  //     <div>
  //       <p>{count}</p>
  //       <button onClick={() => setCount(c => c + 1)}>+1</button>
  //       <button onClick={handleClick}>3秒後にアラート</button>
  //     </div>
  //   );
  // }
  // return <DelayedAlert />;

  // --- 問題 7：コールバック関数の最新化 ---
  // function TimerWithCallback({ duration, onComplete }) {
  //   useEffect(() => {
  //     const id = setTimeout(() => {
  //       onComplete();
  //     }, duration);
  //     return () => clearTimeout(id);
  //   }, [duration]);
  //
  //   return <p>タイマー実行中...</p>;
  // }
  // return <TimerWithCallback duration={3000} onComplete={() => alert('完了！')} />;

  // --- 問題 8：ref を依存配列に入れる ---
  // function Example() {
  //   const ref = useRef(0);
  //
  //   useEffect(() => {
  //     console.log(ref.current);
  //   }, [ref.current]); // ← これは正しい？
  //
  //   return <button onClick={() => ref.current++}>+1</button>;
  // }
  // return <Example />;

  return null;
}

// ========== App ==========
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ドリル 15: useRef</h1>
      <Answer />
    </div>
  );
}
