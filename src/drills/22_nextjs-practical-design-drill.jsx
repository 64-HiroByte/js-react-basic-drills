/**
 * 22_nextjs-practical-design-drill
 *
 * Next.js 設計パターンドリル
 *
 * 対応する問題ファイル:
 * drills/22_nextjs-practical-design-drill.md
 *
 * ※ このドリルは Next.js 固有の機能を扱うため、
 *    完全な動作確認には Next.js プロジェクトが必要です。
 *    ここでは概念の確認とコード例の練習を行います。
 *
 * 使い方:
 * 1. 問題のコメントを外す
 * 2. コードの構造を確認
 * 3. Next.js プロジェクトで実際に試す
 *
 * 実行方法:
 * npm run react 22
 */

import { useState, useEffect } from 'react'

// ========== 解答欄 ==========
function Answer() {
  // --- 問題 1：Server Component vs Client Component ---
  // Next.js では、デフォルトで Server Component
  // 'use client' をつけると Client Component

  // Server Component（データフェッチ）
  // async function UserList() {
  //   const users = await fetch('https://api.example.com/users').then(r => r.json());
  //   return (
  //     <ul>
  //       {users.map(user => <li key={user.id}>{user.name}</li>)}
  //     </ul>
  //   );
  // }

  // Client Component（インタラクティブ）
  // 'use client'
  // function Counter() {
  //   const [count, setCount] = useState(0);
  //   return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
  // }
  // return <Counter />;

  // --- 問題 2：データフェッチの場所 ---
  // ❌ Client Component でフェッチ
  // 'use client'
  // function UserProfile({ userId }) {
  //   const [user, setUser] = useState(null);
  //   useEffect(() => {
  //     fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser);
  //   }, [userId]);
  //   return user ? <p>{user.name}</p> : <p>Loading...</p>;
  // }
  // return <UserProfile userId={1} />;

  // ✅ Server Component でフェッチ
  // async function UserProfile({ userId }) {
  //   const user = await fetch(`https://api.example.com/users/${userId}`).then(r => r.json());
  //   return <p>{user.name}</p>;
  // }

  // --- 問題 3：Client Component の境界 ---
  // 'use client' をどこに置くか

  // ❌ ページ全体を Client Component に
  // 'use client'
  // export default function Page() {
  //   const [search, setSearch] = useState('');
  //   return (
  //     <div>
  //       <h1>Users</h1>
  //       <input value={search} onChange={e => setSearch(e.target.value)} />
  //       <UserList search={search} />
  //     </div>
  //   );
  // }

  // ✅ インタラクティブな部分だけ Client Component に
  // SearchInput.jsx ('use client')
  // function SearchInput({ onSearch }) {
  //   const [value, setValue] = useState('');
  //   return (
  //     <input
  //       value={value}
  //       onChange={e => {
  //         setValue(e.target.value);
  //         onSearch(e.target.value);
  //       }}
  //     />
  //   );
  // }
  // return <SearchInput onSearch={(v) => console.log(v)} />;

  // --- 問題 4：Server Actions ---
  // 'use server'
  // async function createUser(formData) {
  //   const name = formData.get('name');
  //   await db.user.create({ data: { name } });
  // }

  // --- 問題 5：Suspense とローディング ---
  // import { Suspense } from 'react';
  //
  // function Page() {
  //   return (
  //     <Suspense fallback={<p>Loading...</p>}>
  //       <AsyncUserList />
  //     </Suspense>
  //   );
  // }
  //
  // async function AsyncUserList() {
  //   const users = await fetchUsers();
  //   return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
  // }

  // --- 問題 6：並列データフェッチ ---
  // ❌ 直列（遅い）
  // async function Page() {
  //   const user = await fetchUser();
  //   const posts = await fetchPosts(); // user が終わるまで待つ
  //   return <div>...</div>;
  // }

  // ✅ 並列（速い）
  // async function Page() {
  //   const [user, posts] = await Promise.all([
  //     fetchUser(),
  //     fetchPosts()
  //   ]);
  //   return <div>...</div>;
  // }

  return null;
}

// ========== App ==========
export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ドリル 22: Next.js 設計パターン</h1>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>概念の確認</h2>

        <h3>Server Component vs Client Component</h3>
        <ul>
          <li><strong>Server Component</strong>: データフェッチ、SEO、初期表示</li>
          <li><strong>Client Component</strong>: useState, イベント, ブラウザAPI</li>
        </ul>

        <h3>判断基準</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>機能</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Server</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Client</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>async/await でデータ取得</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>✅</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>❌</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>useState / useEffect</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>❌</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>✅</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>onClick などイベント</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>❌</td>
              <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>✅</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: '20px', color: '#666' }}>
          詳細は <code>drills/22_nextjs-practical-design-drill.md</code> を参照してください。
        </p>
      </div>

      <Answer />
    </div>
  );
}
