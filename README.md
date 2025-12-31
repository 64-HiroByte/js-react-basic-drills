# JavaScript / React ドリル集

React / Next.js 開発者向けの実践的なドリル集です。

---

## セットアップ

React ドリル（13-19, 21-22）の実行には Vite + React が必要です。
以下のコマンドを実行して、実行環境を構築してください。

```bash
npm install
```

JavaScript ドリル（01-12, 20）は Node.js のみで実行可能です。

---

## 学習順序

### Phase 1: JavaScript 基礎

| # | ファイル | テーマ | 問題数 |
|---|----------|--------|--------|
| 01 | js-basic-syntax-drill | 変数・関数・スコープ | 9問 |
| 02 | js-condition-loop-drill | 条件分岐・ループ | 6問 |
| 03 | js-destructuring-drill | 分割代入 | 8問 |
| 04 | js-spread-syntax-drill | スプレッド構文・残余引数 | 10問 |
| 05 | js-optional-nullish-drill | オプショナルチェーン・Nullish | 12問 |
| 06 | js-closure-drill | クロージャ | 10問 |
| 07 | js-map-filter-drill | map / filter | 8問 |
| 08 | js-reduce-drill | reduce | 8問 |
| 09 | js-immutability-practice-drill | イミュータブル操作 | 8問 |

### Phase 2: JavaScript 非同期

| # | ファイル | テーマ | 問題数 |
|---|----------|--------|--------|
| 10 | js-async-complete-drill | async/await 総合 | 15問 |
| 11 | js-async-error-handling-drill | 非同期エラー処理 | 12問 |
| 12 | js-async-map-reduce-drill | 非同期 + 配列操作 | 10問 |

### Phase 3: React 基礎

| # | ファイル | テーマ | 問題数 |
|---|----------|--------|--------|
| 13 | react-usestate-decision-drill | useState の判断力 | 8問 |
| 14 | react-useeffect-decision-drill | useEffect の判断力 | 10問 |
| 15 | react-useref-drill | useRef | 8問 |
| 16 | js-react-map-rendering-pitfalls | map / key の罠 | 7問 |

### Phase 4: React 応用

| # | ファイル | テーマ | 問題数 |
|---|----------|--------|--------|
| 17 | js-useeffect-reduce-dependency-drill | 依存配列の最適化 | 10問 |
| 18 | js-react-async-useeffect-drill | useEffect 内の非同期処理 | 16問 |
| 19 | js-usememo-usecallback-drill | useMemo / useCallback | 16問 |

### Phase 5: 実践・応用

| # | ファイル | テーマ | 問題数 |
|---|----------|--------|--------|
| 20 | js-api-response-transform-drill | API レスポンス変換 | 12問 |
| 21 | js-performance-accident-drill | パフォーマンス事故 | 10問 |
| 22 | nextjs-practical-design-drill | Next.js 設計パターン | 10問 |

---

## ドリルの実行方法

### JavaScript ドリル（01-12, 20）

```bash
npm run drill 01    # 番号を指定して実行
```

解答ファイル: `drills/XX_xxx-drill.js`

### React ドリル（13-19, 21-22）

```bash
npm run react 13    # 番号を指定して実行
```

解答ファイル: `src/drills/XX_xxx-drill.jsx`

---

## 効果的な使い方

### 基本の流れ

1. **MD ファイルを読む** — 問題文と解説を理解
2. **出力を予測する** — コードを見て結果を予想
3. **解答ファイルを編集** — 自分の解答を書く
4. **実行して確認** — `npm run drill XX` または `npm run react XX`
5. **なぜそうなるか説明** — 言語化できれば理解できている

### React ドリルの使い方

```jsx
// src/drills/XX_xxx-drill.jsx

function Answer() {
  // --- 問題 1：タイトル ---
  // ここのコメントを外して解答
  // function Component() { ... }
  // return <Component />;

  return null;
}
```

1. 解きたい問題のコメントを外す
2. 保存すると自動でブラウザに反映
3. 解き終わったらコメントアウトして次へ

### 学習のコツ

| やること | 理由 |
|----------|------|
| 番号順に進める | 前提知識が積み上がる構成 |
| 予測してから実行 | 「動いた」で終わらせない |
| エラーを読む | 何が間違っているか理解する |
| 解説を言語化 | 人に説明できれば本当の理解 |
| 関連ドリルを参照 | 知識を繋げる |

### よくある間違い

- ❌ コードをコピペして動かすだけ
- ❌ エラーが出たらすぐ答えを見る
- ❌ 「なんとなく動いた」で次へ進む

