const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const drillNum = process.argv[2];

if (!drillNum) {
  console.log('使い方: npm run react <ドリル番号>');
  console.log('例: npm run react 13');
  console.log('');
  console.log('React ドリル一覧:');
  console.log('  13 - useState 判断力');
  console.log('  14 - useEffect 判断力');
  console.log('  15 - useRef');
  console.log('  16 - React map/key');
  console.log('  17 - useEffect 依存配列');
  console.log('  18 - useEffect 非同期');
  console.log('  19 - useMemo/useCallback');
  console.log('  21 - パフォーマンス事故');
  console.log('  22 - Next.js 設計');
  process.exit(1);
}

const paddedNum = drillNum.padStart(2, '0');
const drillDir = path.join(__dirname, '..', 'src', 'drills');
const files = fs.readdirSync(drillDir).filter(f => f.startsWith(paddedNum + '_'));

if (files.length === 0) {
  console.error(`エラー: ドリル ${drillNum} が見つかりません`);
  process.exit(1);
}

const drillFile = files[0];
const drillName = drillFile.replace('.jsx', '');

// main.jsx を更新
const mainJsxPath = path.join(__dirname, '..', 'src', 'main.jsx');
const mainContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './drills/${drillName}'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
`;

fs.writeFileSync(mainJsxPath, mainContent);
console.log(`ドリル ${drillNum} を読み込みました: ${drillFile}`);
console.log('');

// Vite 起動
const vite = spawn('npx', ['vite'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit'
});

vite.on('error', (err) => {
  console.error('Vite の起動に失敗しました:', err);
});
