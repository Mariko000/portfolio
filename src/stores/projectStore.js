// stores/projectStore.js
import { defineStore } from 'pinia' // onMounted をここから削除
import { ref, computed, onMounted } from 'vue' // ★ onMounted は Vue からインポート


 // 工数管理
 const workDays = ref({})

// 合計が 1.0 (100%) になるように設定
// 「納期から逆算して、各工程に適切な比率で日数を割り振る」ロジック
// ポイントは、「開始日から納期まで、実質何日あるか」を出し、それを比率で分ける

export const defaultWorkDays = {
  '小規模': {
    '企画・要件定義': 4,
    '情報設計・ワイヤー': 3,
    '【客確】構成・遷移確認': 2,
    'UIデザイン確定': 7,
    '【客確】デザイン最終確認': 2,
    'フロント実装(UI完成)': 14,
    '【客確】最終動作確認': 2,
    'テスト・調整': 5,
    'リリース準備': 2
  },
  '中規模': {
    '企画・要件定義': 8,
    '情報設計・ワイヤー': 8,
    '【客確】構成・遷移確認': 4,
    'UIデザイン確定': 15,
    '【客確】デザイン最終確認': 4,
    'フロント実装(UI完成)': 35,
    '【客確】最終動作確認': 4,
    'テスト・調整': 12,
    'リリース準備': 5
  },
  '大規模': {
    '企画・要件定義': 25,
    '情報設計・ワイヤー': 25,
    '【客確】構成・遷移確認': 10,
    'UIデザイン確定': 50,
    '【客確】デザイン最終確認': 10,
    'フロント実装(UI完成)': 100,
    '【客確】最終動作確認': 10,
    'テスト・調整': 40,
    'リリース準備': 15
  }
};



function setDefaultWorkDays(scale) {
  workDays.value = { ...defaultWorkDays[scale] }
}

export {
  workDays,
  setDefaultWorkDays
}




export const useProjectStore = defineStore('projectStore', () => {

  const projectInfo = ref({})
  const features = ref([])
  const featureList = ref([])
  

  const selectedActions = ref([])


//メイン機能とサブ機能の組み合わせ
const recommendedSubFeatures = ref({
  'ゲームアプリ制作': ['対戦相手とチャット機能', 'アイテム購入', 'キャラクターカスタマイズ', 'マルチプレイヤーモード', 'ギルド/チーム機能'],
  'SNSアプリ制作': ['ダイレクトメッセージ送信', 'ハッシュタグ検索', 'ライブ配信機能', 'ストーリー投稿', 'プロフィール編集'],
  'スケジュール管理アプリ制作': ['タスクリスト管理', '繰り返し予定設定', '場所の追加（マップ連携）', '会議室予約', 'ガントチャート表示'],
  'メモ・ノートアプリ制作': ['画像/音声添付', '手書き入力', 'タグ付け', 'PDF/Wordエクスポート', 'バージョン管理'],
  'クイズアプリ制作': ['問題作成（ユーザー投稿）', 'ジャンル選択', 'タイムアタックモード', 'ヒント機能', '復習モード'],
  'タイマー＆ツール系アプリ制作': ['ストップウォッチ機能', 'カウントダウンタイマー', 'プリセット保存', '作業ログ記録', 'カスタム通知'],
  '学習管理アプリ制作': ['教材閲覧（PDF/動画）', '小テスト機能', '学習仲間との連携', 'レポート自動生成', '学習時間の分析'],
  'チャットアプリ制作': ['絵文字/スタンプ送信', 'ファイル共有', '音声通話/ビデオ通話', 'メッセージ検索', 'リアクション機能'],
  'ECサイト制作': ['商品検索フィルター', 'クーポン適用', 'おすすめ商品表示', '配送状況追跡', '返品・交換申請'],
  'フリマアプリ制作': ['コメント機能（出品者と購入者間）', 'カテゴリー検索', '発送通知', '専用出品（特定ユーザー向け）', '売上金管理'],
  'ネット予約サイト制作': ['空き状況確認（リアルタイム）', '店舗/担当者選択', 'リマインドメール/SMS送信', 'オンライン決済', 'クーポン利用'],
  'サブスクリプションサービス構築': ['利用状況ダッシュボード', '無料トライアル設定', 'アップグレード/ダウングレード', '領収書発行', '特典アクセス'],
  'クラウドファンディングサイト制作': ['プロジェクトの作成・編集', '活動報告', 'SNSシェア機能', '支援者リスト管理', '目標達成率表示'],
  'プロジェクト管理ツール制作': ['期限設定', 'コメント機能', 'ファイル添付', 'マイルストーン設定', '担当者割り当て'],
  'データ可視化ダッシュボード制作': ['グラフ表示', 'フィルター適用', 'データダウンロード', '期間指定'],
  '売上分析ツール制作': ['商品別分析', '顧客セグメント分析', '予測モデル', '目標設定と達成度表示', 'CSV/Excelインポート'],
  '在庫管理システム制作': ['バーコードスキャン', '棚卸し機能', 'サプライヤー管理', '多店舗連携', 'レポート出力（在庫推移など）'],
  '顧客管理システム制作': ['コンタクト管理（電話、メール記録）', '案件管理', 'セールスパイプライン表示', 'タスク/リマインダー', 'メール配信連携'],
  '動画配信プラットフォーム制作': ['再生速度調整', '字幕表示', 'プレイリスト作成', 'ライブ配信', '視聴履歴'],
  '音楽プレイヤーアプリ制作': ['シャッフル/リピート再生', '歌詞表示', 'イコライザー調整', 'オフライン再生', 'アルバム/アーティスト表示'],
  'ポッドキャスト配信アプリ制作': ['倍速再生', '自動ダウンロード', 'エピソード検索', '購読管理', 'チャプター表示'],
  '電子書籍ビューワー制作': ['文字サイズ/フォント変更', 'ハイライト/メモ', '辞書連携', 'ダークモード', 'ページ同期（複数デバイス）'],
  'AIチャットボット制作': ['音声入力', 'ファイル添付', '多言語対応', 'シナリオ分岐', 'オペレーター連携'],
  '画像認識アプリ制作': ['リアルタイム認識（カメラ連携）', '物体検出', '顔認識', '結果のタグ付け', 'データセット管理'],
  '音声認識アプリ制作': ['リアルタイム文字起こし', '特定キーワード抽出', '話者分離', '多言語対応', '音声データの編集'],
  '機械学習モデル管理システム': ['モデルバージョン管理', '学習プロセス監視', 'デプロイ管理', 'A/Bテスト', 'データ前処理ツール'],
})



//ユーザーアクション
const actionTemplates = ref({
  'ゲームアプリ制作': [
    'プレイヤー登録/ログイン', 'ゲーム開始', 'キャラクター選択', 'アイテム購入', '対戦相手の検索',
    'チャットメッセージ送信', 'ギルドに参加', '実績確認'
  ],
  'SNSアプリ制作': [
    'ユーザー登録/ログイン', 'プロフィール作成/編集', '投稿作成/共有', '友達検索/フォロー',
    'ダイレクトメッセージ送信', 'フィード閲覧', 'ライブ配信開始/視聴', 'ストーリー投稿/閲覧'
  ],
  'スケジュール管理アプリ制作': [
    'イベント/タスクの追加', '予定の編集/削除', 'カレンダー表示切替', 'リマインダー設定',
    '会議室の予約', 'タスクの完了マーク'
  ],
  'メモ・ノートアプリ制作': [
    '新規ノート作成', 'テキスト入力/編集', '画像/音声の添付', 'ノートのタグ付け',
    'PDF/Word形式でエクスポート', 'バージョン履歴確認'
  ],
  'クイズアプリ制作': [
    'クイズジャンル選択', 'クイズ開始', '回答入力', 'ヒント表示', 'スコア確認', '問題の作成/投稿'
  ],
  'タイマー＆ツール系アプリ制作': [
    'ストップウォッチ開始/停止/リセット', 'カウントダウンタイマー設定', 'プリセットタイマー選択',
    '作業ログ記録', 'カスタム通知設定'
  ],
  '学習管理アプリ制作': [
    '教材の選択/閲覧', '小テストの実施', '進捗状況確認', '学習時間記録', '学習仲間との連携', 'レポートの閲覧'
  ],
  'チャットアプリ制作': [
    '新規チャット作成', 'メッセージ送信/受信', '絵文字/スタンプ選択', 'ファイル添付/共有',
    '音声通話開始', 'ビデオ通話開始', 'メッセージ検索'
  ],
  'ECサイト制作': [
    '商品検索/フィルター適用', '商品をカートに追加', 'レジに進む', '支払い方法選択',
    '注文履歴確認', '配送状況追跡', 'クーポン利用', '返品/交換申請'
  ],
  'フリマアプリ制作': [
    '商品出品', '商品検索/閲覧', '商品購入', '出品者とコメントでやり取り', '配送通知の確認',
    '売上金確認', '専用出品の依頼'
  ],
  'ネット予約サイト制作': [
    '空き状況の確認', '日付/時間/店舗/担当者選択', '予約の確定', '予約内容の変更/キャンセル',
    'オンライン決済', 'リマインド通知受信', 'クーポン適用'
  ],
  'サブスクリプションサービス構築': [
    'プラン選択/契約', '利用状況ダッシュボード確認', '無料トライアル開始',
    'プランのアップグレード/ダウングレード', '領収書発行', '特典コンテンツへのアクセス'
  ],
  'クラウドファンディングサイト制作': [
    'プロジェクトの作成/編集', 'プロジェクトへの支援', '活動報告の投稿/閲覧',
    'SNSでシェア', '支援者リスト確認', '目標達成率の確認'
  ],
  'プロジェクト管理ツール制作': [
    'タスクの追加/編集', 'タスクの期限設定', 'コメント投稿', 'ファイル添付',
    'マイルストーン設定', '担当者の割り当て'
  ],
  'データ可視化ダッシュボード制作': [
    'グラフ表示の切り替え', 'フィルター適用', '期間指定', 'データダウンロード', 'レポート印刷'
  ],
  '売上分析ツール制作': [
    '商品別売上データ閲覧', '顧客セグメント別分析', '予測モデルの適用',
    '目標設定/達成度確認', 'CSV/Excelデータのインポート'
  ],
  '在庫管理システム制作': [
    '商品の入庫/出庫記録', 'バーコードスキャン', '棚卸し実施',
    'サプライヤー情報の管理', '多店舗間での在庫連携', '在庫推移レポート出力'
  ],
  '顧客管理システム制作': [
    '顧客情報の登録/編集', 'コンタクト履歴の記録', '案件の管理',
    'セールスパイプラインの確認', 'タスク/リマインダー設定', 'メールの一斉配信'
  ],
  '動画配信プラットフォーム制作': [
    '動画の検索/再生', '再生速度調整', '字幕の表示/非表示',
    'プレイリスト作成', 'ライブ配信視聴/開始', '視聴履歴確認'
  ],
  '音楽プレイヤーアプリ制作': [
    '楽曲検索/再生', 'シャッフル/リピート再生', '歌詞表示',
    'イコライザー調整', 'オフライン再生リスト作成', 'アルバム/アーティスト情報表示'
  ],
  'ポッドキャスト配信アプリ制作': [
    'エピソード検索/再生', '倍速再生', 'エピソードの自動ダウンロード設定',
    '番組の購読管理', 'チャプター表示'
  ],
  '電子書籍ビューワー制作': [
    '書籍の選択/閲覧', '文字サイズ/フォント変更', 'ハイライト/メモ追加',
    '辞書検索', 'ダークモード切替', '複数デバイスでのページ同期'
  ],
  'AIチャットボット制作': [
    'テキスト入力', '音声入力', 'ファイルの添付', '会話履歴確認', '言語切り替え'
  ],
  '画像認識アプリ制作': [
    'カメラでのリアルタイム認識', '画像アップロード/認識', '物体検出の実行',
    '顔認識の実行', '認識結果のタグ付け/保存'
  ],
  '音声認識アプリ制作': [
    'リアルタイム文字起こし開始/停止', '音声データのアップロード/文字起こし',
    '特定キーワードの抽出', '話者分離の適用', '文字起こし結果の編集'
  ],
  '機械学習モデル管理システム': [
    'モデルの登録/バージョン管理', '学習プロセスの監視', 'モデルのデプロイ',
    'A/Bテストの実施', 'データ前処理ツールの利用', '学習結果の比較'
  ]
})

//言語と環境のデータ
const languageOptions = ref([
  'HTML' ,' CSS',' JavaScript',
  'Vue.js','Python',
  'Django','PostgreSQL',
]);

//＊これは元からあります
// const environmentOptions = ref([
  // 'VSCode',
  // 'Eclipse',
  // 'WebStorm',
// ]);



//PageStructureEditor.vueの
  const pages = ref([
    // トップレベルの共通ページ
    // 1. 基本的なサイト共通ページ / グローバル要素
    { id: 'home', name: 'ホーム / トップページ', parentId: null, isExpanded: true },
    { id: 'header-footer', name: 'ヘッダー / フッター', parentId: 'home', isExpanded: true }, // 親を 'home' に設定
    { id: 'about', name: 'アバウトページ', parentId: null, isExpanded: true },
    { id: 'contact', name: 'お問い合わせページ', parentId: 'home', isExpanded: true }, // 親を 'home' に設定
    { id: 'terms', name: '利用規約', parentId: 'home', isExpanded: true }, // 親を 'home' に設定
    { id: '404-error', name: 'エラーページ (404/500)', parentId: 'home', isExpanded: true }, // 親を 'home' に設定

    // ユーザー認証関連 (既存の適切な親子関係を維持)
    { id: 'login', name: 'ログインページ', parentId: 'home', isExpanded: true },
    { id: 'signup', name: '新規登録ページ', parentId: 'login', isExpanded: true },
    { id: 'profile', name: 'プロフィールページ', parentId: 'home', isExpanded: true },
    { id: 'password-reset', name: 'パスワードリセット', parentId: 'login', isExpanded: true },

  ]);
   

//PageStructureEditor.vueの受け取ったユーザーアクションの保存先state
const selectedFeature = ref('')

const addActionTemplate = (feature, action) => {
  if (!actionTemplates.value[feature]) {
    actionTemplates.value[feature] = []
  }
  actionTemplates.value[feature].push(action)
}



const addFeature = (item) => {
  featureList.value.push(item)
}


const setSelectedActions = (actions) => { selectedActions.value = actions }
 
  const getPageTree = computed(() => {
    const pagesById = pages.value.reduce((acc, page) => {
      // ページオブジェクトをコピーして children と isExpanded を追加
      acc[page.id] = { ...page, children: [], isExpanded: page.isExpanded !== undefined ? page.isExpanded : true };
      return acc;
    }, {});

    const rootPages = [];
    pages.value.forEach(page => {
      if (page.parentId === null) {
        // ルートページの場合
        if (pagesById[page.id]) { // pagesById に存在することを確認
          rootPages.push(pagesById[page.id]);
        }
      } else {
        // 子ページの場合、親に children として追加
        if (pagesById[page.parentId] && pagesById[page.id]) { // 親と子の両方が存在することを確認
          pagesById[page.parentId].children.push(pagesById[page.id]);
        }
      }
    });
    // ★ ここに return ステートメントを追加して、rootPages を返す
    return rootPages;
 
  });

  // stores/projectStore.js 内の addPage 関数

const addPage = (pageData) => {
  console.log(`Adding page: ${pageData.name} (ID: ${pageData.id || 'generated'}) with parentId: ${pageData.parentId}`);
  console.trace('addPage called from:'); // 呼び出し元を追跡するために維持

  const newId = pageData.id || `page-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // 1. IDによる重複チェック
  // もしページが既にユニークなIDを持っていて、それが既に存在する場合
  if (pageData.id && pages.value.some(p => p.id === pageData.id)) {
    console.warn(`Page with pre-defined ID "${pageData.id}" already exists. Skipping add.`);
    return;
  }
  // (ランダムなIDの場合は、このチェックでは防げないが、以下の名前+親IDチェックでカバーされる)


  // 2. 特定の名前のページに対する厳格な重複チェック（親ID不問）
  // デフォルトで用意されている「固定の」ページ名リスト
  const defaultFixedPageNames = [
    'ホーム / トップページ',
    'ヘッダー / フッター',
    'アバウトページ',
    'お問い合わせページ',
    '利用規約',
    'エラーページ (404/500)',
    'ログインページ', // ★ここにログインページを追加★
    '新規登録ページ',
    'プロフィールページ',
    'パスワードリセット',
    // その他、今後デフォルトでストアに初期定義される可能性のある固定的なページ名があればここに追加
  ];

  // 追加しようとしているページ名が固定ページリストに含まれ、かつ、その名前のページが既にストアに存在する場合
  if (defaultFixedPageNames.includes(pageData.name) && pages.value.some(p => p.name === pageData.name)) {
      console.warn(`Default/Fixed page "${pageData.name}" already exists (regardless of parentId). Skipping add.`);
      return;
  }

  // 3. それ以外のページ、または固定ページリストに含まれないページに対する「名前 + 親ID」による重複チェック
  // 同じ名前で同じ親を持つページが既に存在する場合
  if (pages.value.some(p => p.name === pageData.name && p.parentId === (pageData.parentId || null))) {
      console.warn(`Page with name "${pageData.name}" and parentId "${(pageData.parentId || 'null')}" already exists. Skipping add.`);
      return;
  }

  // すべての重複チェックをクリアした場合のみページを追加
  pages.value.push({
    id: newId,
    name: pageData.name,
    parentId: pageData.parentId || null,
    isExpanded: pageData.isExpanded !== undefined ? pageData.isExpanded : true,
    startDate: pageData.startDate || new Date().toISOString().slice(0, 10),
    endDate: pageData.endDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    status: pageData.status || '未着手',
  });
};

  const removePage = (pageId) => {
    const pagesToDelete = new Set();
    const findChildren = (pId) => {
      pagesToDelete.add(pId);
      pages.value.forEach(page => {
        if (page.parentId === pId) {
          findChildren(page.id);
        }
      });
    };
    findChildren(pageId);

    pages.value = pages.value.filter(page => !pagesToDelete.has(page.id));
  };

  const togglePageExpansion = (pageId) => {
    const page = pages.value.find(p => p.id === pageId);
    if (page) {
      page.isExpanded = !page.isExpanded;
    }
  };

  // ★★★ updatePageParent アクションの実装 ★★★
  const updatePageParent = ({ pageId, newParentId, oldParentId, newIndex }) => {
    const pageToMove = pages.value.find(p => p.id === pageId);
    if (!pageToMove) {
      console.error(`Page with id ${pageId} not found for updatePageParent.`);
      return;
    }

    // ページの parentId を更新
    pageToMove.parentId = newParentId;

    console.log(`Moved page "${pageToMove.name}" (ID: ${pageId}) from parent "${oldParentId}" to "${newParentId}".`);
  };


  // movePageToParentアクションを書く
  const movePageToParent = ({ pageId, newParentId }) => {
    const pageToMove = pages.value.find(p => p.id === pageId);
    if (!pageToMove) return;
  
    // 移動先の親が自分自身だったら無視
    if (pageId === newParentId) return;
  
    // 親を更新
    pageToMove.parentId = newParentId;
  
    console.log(`Moved page "${pageToMove.name}" to parent "${newParentId}"`);
  };

  //renamePageでPageStructureEditor.vue（親）とPageTree.vue（子）で出力した各タスクの名前を別名保存
  //名前を更新
  const renamePage = (pageId, newName) => {
    const targetPage = pages.value.find(p => p.id === pageId);
    if (targetPage) {
      targetPage.name = newName;
    } else {
      console.warn(`renamePage: Page with ID ${pageId} not found`);
    }
  };
  
  

  //ページリストを置き換える関数を追加
  const findPageById = (id) => {
    return pages.value.find(p => p.id === id)
  }
// stores/project.js
  function setPages(newPages) {
    pages.value = newPages
  }

  // フォームデータ
const formData = ref({
  startDate: '',
  deadline: '',
  projectType: '',
  projectName: '', // 初期値を空文字列に変更
  functions: [], // ★★★ 初期値を空配列に変更 ★★★
  purpose: '',
  people:'',
  targetUser: '',
  overview: '', // ★★★ 初期値を空文字列に変更（選択肢の初期値） ★★★
  releaseDate: '',
  language: [],
  environment: [],
  purpose: '',        // 目的
  scope: '',          // 実施範囲
  browser: 'Google Chrome / Safari（最新版）', 
  publishTo: 'Vercel / Heroku',
  delivery: 'ソースコード一式および公開URL'
});
// ローカルストレージから保存済みリストを取得（初期化）
const savedProjects = ref(JSON.parse(localStorage.getItem('my_projects') || '[]'))

// --- 2. 実行処理（Actions） ---

// ステータスの選択肢を配列で定義
const statusOptions = [
  '企画・要件定義',
  '情報設計・ワイヤー',
  '【客確】構成・遷移確認',
  'UIデザイン確定',
  '【客確】デザイン最終確認',
  'フロント実装(UI完成)',
  '【客確】最終動作確認',
  'テスト・調整',
  'リリース準備',
  '完了'
]

// 【保存・更新】詳細スケジュール（features, workDays）も含めて保存
const saveProjectToLocal = (projectData = null) => {
  const targetData = projectData || formData.value;
  const index = savedProjects.value.findIndex(p => p.id === targetData.id);

  const projectToSave = {
    ...targetData,
    id: targetData.id || Date.now(),
    features: targetData.features || { ...features.value },
    workDays: targetData.workDays || { ...workDays.value },
    updateDate: new Date().toLocaleString()
  };

  if (index !== -1) {
    savedProjects.value[index] = { ...savedProjects.value[index], ...projectToSave };
  } else {
    savedProjects.value.push({
      ...projectToSave,
      saveDate: new Date().toLocaleString(),
      status: targetData.status || statusOptions[0] // デフォルトを最初の工程に
    });
  }

  localStorage.setItem('my_projects', JSON.stringify(savedProjects.value));
  
  if (!projectData) {
    alert(`プロジェクト「${projectToSave.projectName}」を保存しました！`);
  }
}

// 【削除】リストから除外して保存
const deleteProject = (id) => {
  savedProjects.value = savedProjects.value.filter(p => p.id !== id);
  localStorage.setItem('my_projects', JSON.stringify(savedProjects.value));
}

// 【読込】編集やメッセージ作成のために現在のフォームにセット
const loadProject = (project) => {
  formData.value = { ...project };
  // 保存されていたスケジュール情報を各 ref に書き戻す
  if (project.features) features.value = { ...project.features };
  if (project.workDays) workDays.value = { ...project.workDays };
};


  return {
    features,
    featureList,
    formData,
    languageOptions,
    projectInfo,
    pages,
    getPageTree,
    actionTemplates,
    setSelectedActions,
    addActionTemplate,
    addFeature,
    addPage, // ★変更後の addPage を公開
    removePage,
    togglePageExpansion,
    workDays,
    defaultWorkDays,
    setDefaultWorkDays,
    selectedActions,
    recommendedSubFeatures,
    selectedFeature,
    updatePageParent,
    movePageToParent,
    renamePage,
    findPageById,
    setPages,
    purpose: '',         // プロジェクトの目的
  scope: '',           // 実施範囲（自由記述または自動生成）
  browser: 'Google Chrome / Safari（最新版）', // デフォルト値を入れておくと楽
  techStack: 'Vue.js / Python (Django)',       // デフォルト値
  publishTo: 'Vercel / Heroku',                // デフォルト値
  delivery: 'ソースコード一式および公開URL',      // 納品物
  saveProjectToLocal,
  statusOptions,
  savedProjects,
  deleteProject,
  loadProject

  }
})