import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

/**
 * React ドリル実行環境
 *
 * 使い方:
 * 1. mdファイルから問題コードをコピー
 * 2. 下の App コンポーネントを書き換え
 * 3. 保存すると自動で画面が更新される
 */

// ここに問題のコードを書く
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Drill</h1>
      <p>mdファイルから問題コードをコピーして、このファイルを書き換えてください。</p>
    </div>
  )
}

export default App
