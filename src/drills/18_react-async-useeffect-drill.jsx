/**
 * 18_react-async-useeffect-drill
 *
 * useEffect 内の非同期処理ドリル
 *
 * 対応する問題ファイル:
 * drills/18_js-react-async-useeffect-drill.md
 *
 * 使い方:
 * 1. 解きたい問題のコメントを外す（function内のコードとreturn文）
 * 2. 保存して動作確認
 * 3. 完了したらコメントアウトして次へ
 *
 * 実行方法:
 * npm run react 18
 */

import { useState, useEffect, useRef } from 'react'

// ========== 解答欄 ==========
function Answer() {
  // --- 問題 1：基本的な fetch ---
  // const [userId, setUserId] = useState(1);
  //
  // function UserProfile({ userId }) {
  //   const [user, setUser] = useState(null);
  //
  //   useEffect(() => {
  //     fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  //       .then(res => res.json())
  //       .then(setUser);
  //   }, [userId]);
  //
  //   if (!user) return <p>Loading...</p>;
  //   return <p>{user.name}</p>;
  // }
  // return (
  //   <div>
  //     <UserProfile userId={userId} />
  //     <button onClick={() => setUserId(id => id % 10 + 1)}>次のユーザー</button>
  //   </div>
  // );

  // --- 問題 2：クリーンアップなしの問題（競合状態）---
  // const [query, setQuery] = useState('');
  //
  // function SearchResults({ query }) {
  //   const [results, setResults] = useState([]);
  //
  //   useEffect(() => {
  //     fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`)
  //       .then(res => res.json())
  //       .then(setResults);
  //   }, [query]);
  //
  //   return <p>{results.length} 件</p>;
  // }
  // return (
  //   <div>
  //     <SearchResults query={query} />
  //     <input value={query} onChange={e => setQuery(e.target.value)} placeholder="検索..." />
  //   </div>
  // );

  // --- 問題 3：ignore フラグでクリーンアップ ---
  // const [userId, setUserId] = useState(1);
  //
  // function UserProfileWithCleanup({ userId }) {
  //   const [user, setUser] = useState(null);
  //
  //   useEffect(() => {
  //     let ignore = false;
  //
  //     fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  //       .then(res => res.json())
  //       .then(data => {
  //         if (!ignore) setUser(data);
  //       });
  //
  //     return () => {
  //       ignore = true;
  //     };
  //   }, [userId]);
  //
  //   if (!user) return <p>Loading...</p>;
  //   return <p>{user.name}</p>;
  // }
  // return (
  //   <div>
  //     <UserProfileWithCleanup userId={userId} />
  //     <button onClick={() => setUserId(id => id % 10 + 1)}>次のユーザー</button>
  //   </div>
  // );

  // --- 問題 4：async/await を使う場合 ---
  // function PostList() {
  //   const [posts, setPosts] = useState([]);
  //
  //   useEffect(() => {
  //     const fetchPosts = async () => {
  //       const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  //       const data = await res.json();
  //       setPosts(data);
  //     };
  //     fetchPosts();
  //   }, []);
  //
  //   return (
  //     <ul>
  //       {posts.map(post => <li key={post.id}>{post.title}</li>)}
  //     </ul>
  //   );
  // }
  // return <PostList />;

  // --- 問題 5：エラーハンドリング ---
  // const [userId, setUserId] = useState(1);
  //
  // function UserWithError({ userId }) {
  //   const [user, setUser] = useState(null);
  //   const [error, setError] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //
  //   useEffect(() => {
  //     setLoading(true);
  //     setError(null);
  //
  //     fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  //       .then(res => {
  //         if (!res.ok) throw new Error('User not found');
  //         return res.json();
  //       })
  //       .then(setUser)
  //       .catch(setError)
  //       .finally(() => setLoading(false));
  //   }, [userId]);
  //
  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error: {error.message}</p>;
  //   return <p>{user.name}</p>;
  // }
  // return (
  //   <div>
  //     <UserWithError userId={userId} />
  //     <button onClick={() => setUserId(id => id % 10 + 1)}>次のユーザー</button>
  //     <button onClick={() => setUserId(999)}>存在しないユーザー</button>
  //   </div>
  // );

  // --- 問題 6：AbortController でキャンセル ---
  // const [query, setQuery] = useState('');
  //
  // function SearchWithAbort({ query }) {
  //   const [results, setResults] = useState([]);
  //
  //   useEffect(() => {
  //     const controller = new AbortController();
  //
  //     fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`, {
  //       signal: controller.signal
  //     })
  //       .then(res => res.json())
  //       .then(setResults)
  //       .catch(err => {
  //         if (err.name !== 'AbortError') console.error(err);
  //       });
  //
  //     return () => controller.abort();
  //   }, [query]);
  //
  //   return <p>{results.length} 件</p>;
  // }
  // return (
  //   <div>
  //     <SearchWithAbort query={query} />
  //     <input value={query} onChange={e => setQuery(e.target.value)} placeholder="検索..." />
  //   </div>
  // );

  // --- 問題 7：依存配列とフェッチの関係 ---
  // const [userId, setUserId] = useState(1);
  //
  // function UserPosts({ userId }) {
  //   const [posts, setPosts] = useState([]);
  //
  //   useEffect(() => {
  //     fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
  //       .then(res => res.json())
  //       .then(setPosts);
  //   }, []); // ← userId が依存配列にない
  //
  //   return <p>{posts.length} posts</p>;
  // }
  // return (
  //   <div>
  //     <UserPosts userId={userId} />
  //     <button onClick={() => setUserId(id => id % 10 + 1)}>次のユーザー (userId: {userId})</button>
  //   </div>
  // );

  return null;
}

// ========== App ==========
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ドリル 18: useEffect 非同期処理</h1>
      <Answer />
    </div>
  );
}
