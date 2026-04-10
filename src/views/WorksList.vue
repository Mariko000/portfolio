<script setup>
import { ref, computed, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const { actionTemplates, formData } = storeToRefs(projectStore)

// --- 状態管理 ---
const selectedExt = ref('.vue')
const searchKeyword = ref('')
const selectedCategory = ref('')

// --- コマンド生成用の状態 ---
const osType = ref('mac') // 'mac' or 'win'
const includeMkdir = ref(true)
const targetDir = ref('src/components') // デフォルトのディレクトリ

// --- 拡張子とデフォルトパスの連動設定 ---
const pathPresets = {
  '.vue': 'src/components/',
  '.py': 'api/views/',
  '.js': 'src/utils/',
  '.html': 'templates/',
  '.css': 'src/assets/styles/',
  '.scss': 'src/assets/styles/',
  '.md': 'docs/'
}

// 拡張子が選ばれたら、パスも自動で書き換える
watch(selectedExt, (newExt) => {
  if (pathPresets[newExt]) {
    targetDir.value = pathPresets[newExt]
  }
})

// 表示されている全アイテムをコマンド化する関数
const generateAllFilesCommand = (isCommon = false) => {
  const items = isCommon ? commonComponents : (actionTemplates.value[selectedCategory.value] || [])
  if (items.length === 0) return ''

  // 全ファイル名の配列を作成
  const fileNames = items.map(name => {
    const fileName = generateFileName(name, !isCommon)
    return includeMkdir.value ? `${targetDir.value}/${fileName}` : fileName
  })

  if (osType.value === 'mac') {
    const mkdir = includeMkdir.value ? `mkdir -p ${targetDir.value} && ` : ''
    return `${mkdir}touch ${fileNames.join(' ')}`
  } else {
    // PowerShell用
    const mkdir = includeMkdir.value ? `if (!(Test-Path "${targetDir.value}")) { New-Item -ItemType Directory -Path "${targetDir.value}" }; ` : ''
    return `${mkdir}New-Item -Path ${fileNames.join(', ')} -ItemType File -Force`
  }
}

const exportCommand = () => {
  // 1. 全アイテム（共通 + カテゴリ）を収集して命名変換
  const commonFiles = commonComponents.map(name => generateFileName(name, false));
  const featureFiles = selectedCategory.value 
    ? (actionTemplates.value[selectedCategory.value] || []).map(name => generateFileName(name, true))
    : [];
  
  const allFiles = [...commonFiles, ...featureFiles];
  if (allFiles.length === 0) return;

  // 2. パスの成形（末尾の / の有無を調整）
  const baseDir = targetDir.value.endsWith('/') ? targetDir.value : `${targetDir.value}/`;

  const filePaths = allFiles.map(fileName => {
    return includeMkdir.value ? `${baseDir}${fileName}` : fileName;
  });

  // 3. OSごとのコマンド組み立て
  let command = "";
  const cleanDir = baseDir.replace(/\/$/, ""); // mkdir用には末尾スラッシュを除く

  if (osType.value === 'mac') {
    const mkdir = includeMkdir.value ? `mkdir -p ${cleanDir} && ` : "";
    command = `${mkdir}touch ${filePaths.join(' ')}`;
  } else {
    // Windows (PowerShell)
    const mkdir = includeMkdir.value ? `if (!(Test-Path "${cleanDir}")) { New-Item -ItemType Directory -Path "${cleanDir}" }; ` : "";
    command = `${mkdir}New-Item -Path ${filePaths.join(', ')} -ItemType File -Force`;
  }

  // 5. 別タブ出力
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head><title>Terminal Command Export</title></head>
        <body style="background: #1e1e1e; color: #d4d4d4; padding: 40px; font-family: monospace; line-height: 1.5;">
          <h2 style="color: #4ec9b0;">// Copy and Paste to your Terminal</h2>
          <pre style="background: #000; padding: 20px; border-radius: 8px; border: 1px solid #333; color: #fff; white-space: pre-wrap; word-break: break-all; font-size: 1rem;">${command}</pre>
          <div style="margin-top: 20px; color: #888;">
            <p>Included: Common Components ${selectedCategory.value ? '+ ' + selectedCategory.value : ''}</p>
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
  }
};

// --- 1. Common Components（共通パーツの定義） ---
const commonComponents = [
  'Home', 'About', 'Contact', 'Login', 'Signup', 
  'Profile', 'Settings', 'PrivacyPolicy', 'TermsOfService', 
  'NotFound', 'Faq'
]

// --- 2. 翻訳・命名辞書 ---
const nameDictionary = {
  // --- 共通 / 汎用ページ ---
  'ホーム / トップページ': 'Home',
  'ログインページ': 'Login',
  '新規登録ページ': 'Signup',
  'プロフィールページ': 'Profile',

  // --- ゲームアプリ制作 ---
  'プレイヤー登録/ログイン': 'PlayerAuth',
  'ゲーム開始': 'GameStart',
  'キャラクター選択': 'CharSelect',
  'アイテム購入': 'ItemPurchase',
  '対戦相手の検索': 'Matching',
  'チャットメッセージ送信': 'ChatMessage',
  'ギルドに参加': 'GuildJoin',
  '実績確認': 'Achievement',

  // --- SNSアプリ制作 ---
  'ユーザー登録/ログイン': 'UserAuth',
  'プロフィール作成/編集': 'ProfileEdit',
  '投稿作成/共有': 'PostCreate',
  '友達検索/フォロー': 'FriendSearch',
  'ダイレクトメッセージ送信': 'DirectMessage',
  'フィード閲覧': 'FeedView',
  'ライブ配信開始/視聴': 'LiveStream',
  'ストーリー投稿/閲覧': 'StoryView',

  // --- スケジュール管理アプリ制作 ---
  'イベント/タスクの追加': 'TaskAdd',
  '予定の編集/削除': 'TaskEdit',
  'カレンダー表示切替': 'CalendarToggle',
  'リマインダー設定': 'ReminderSet',
  '会議室の予約': 'RoomBooking',
  'タスクの完了マーク': 'TaskComplete',

  // --- メモ・ノートアプリ制作 ---
  '新規ノート作成': 'NoteCreate',
  'テキスト入力/編集': 'TextEdit',
  '画像/音声の添付': 'AttachmentAdd',
  'ノートのタグ付け': 'NoteTagging',
  'PDF/Word形式でエクスポート': 'NoteExport',
  'バージョン履歴確認': 'VersionHistory',

  // --- クイズアプリ制作 ---
  'クイズジャンル選択': 'GenreSelect',
  'クイズ開始': 'QuizStart',
  '回答入力': 'AnswerInput',
  'ヒント表示': 'HintDisplay',
  'スコア確認': 'ScoreCheck',
  '問題の作成/投稿': 'QuestionCreate',

  // --- タイマー＆ツール系アプリ制作 ---
  'ストップウォッチ開始/停止/リセット': 'StopwatchControl',
  'カウントダウンタイマー設定': 'TimerSet',
  'プリセットタイマー選択': 'PresetSelect',
  '作業ログ記録': 'WorkLog',
  'カスタム通知設定': 'NotificationSet',

  // --- 学習管理アプリ制作 ---
  '教材の選択/閲覧': 'MaterialView',
  '小テストの実施': 'QuizTake',
  '進捗状況確認': 'ProgressCheck',
  '学習時間記録': 'StudyLog',
  '学習仲間との連携': 'StudyConnect',
  'レポートの閲覧': 'ReportView',

  // --- チャットアプリ制作 ---
  '新規チャット作成': 'ChatCreate',
  'メッセージ送信/受信': 'MessageExchange',
  '絵文字/スタンプ選択': 'EmojiSelect',
  'ファイル添付/共有': 'FileShare',
  '音声通話開始': 'VoiceCall',
  'ビデオ通話開始': 'VideoCall',
  'メッセージ検索': 'MessageSearch',

  // --- ECサイト制作 ---
  '商品検索/フィルター適用': 'ProductSearch',
  '商品をカートに追加': 'AddToCart',
  'レジに進む': 'Checkout',
  '支払い方法選択': 'PaymentSelect',
  '注文履歴確認': 'OrderHistory',
  '配送状況追跡': 'ShippingTrack',
  'クーポン利用': 'CouponApply',
  '返品/交換申請': 'ReturnRequest',

  // --- フリマアプリ制作 ---
  '商品出品': 'ItemList',
  '商品検索/閲覧': 'ItemSearch',
  '商品購入': 'ItemPurchase',
  '出品者とコメントでやり取り': 'TradeComment',
  '配送通知の確認': 'ShippingNotify',
  '売上金確認': 'SalesManage',
  '専用出品の依頼': 'PrivateListRequest',

  // --- ネット予約サイト制作 ---
  '空き状況の確認': 'AvailabilityCheck',
  '日付/時間/店舗/担当者選択': 'BookingSelect',
  '予約の確定': 'BookingConfirm',
  '予約内容の変更/キャンセル': 'BookingEdit',
  'オンライン決済': 'OnlinePayment',
  'リマインド通知受信': 'RemindNotify',
  'クーポン適用': 'CouponUse',

  // --- サブスクリプションサービス構築 ---
  'プラン選択/契約': 'PlanSelect',
  '利用状況ダッシュボード確認': 'UsageDashboard',
  '無料トライアル開始': 'TrialStart',
  'プランのアップグレード/ダウングレード': 'PlanChange',
  '領収書発行': 'ReceiptIssue',
  '特典コンテンツへのアクセス': 'PremiumAccess',

  // --- クラウドファンディングサイト制作 ---
  'プロジェクトの作成/編集': 'ProjectEdit',
  'プロジェクトへの支援': 'ProjectSupport',
  '活動報告の投稿/閲覧': 'ActivityReport',
  'SNSでシェア': 'SnsShare',
  '支援者リスト確認': 'BackerList',
  '目標達成率の確認': 'GoalProgress',

  // --- プロジェクト管理ツール制作 ---
  'タスクの追加/編集': 'TaskManage',
  'タスクの期限設定': 'TaskDeadline',
  'コメント投稿': 'CommentPost',
  'ファイル添付': 'FileUpload',
  'マイルストーン設定': 'MilestoneSet',
  '担当者の割り当て': 'AssignUser',

  // --- データ可視化ダッシュボード制作 ---
  'グラフ表示の切り替え': 'ChartToggle',
  'フィルター適用': 'FilterApply',
  '期間指定': 'RangeSelect',
  'データダウンロード': 'DataDownload',
  'レポート印刷': 'ReportPrint',

  // --- 売上分析ツール制作 ---
  '商品別売上データ閲覧': 'SalesByProduct',
  '顧客セグメント別分析': 'SegmentAnalysis',
  '予測モデルの適用': 'PredictModel',
  '目標設定/達成度確認': 'GoalCheck',
  'CSV/Excelデータのインポート': 'DataImport',

  // --- 在庫管理システム制作 ---
  '商品の入庫/出庫記録': 'StockInOutput',
  'バーコードスキャン': 'BarcodeScan',
  '棚卸し実施': 'InventoryCheck',
  'サプライヤー情報の管理': 'SupplierManage',
  '多店舗間での在庫連携': 'MultiStoreLink',
  '在庫推移レポート出力': 'StockReport',

  // --- 顧客管理システム制作 ---
  '顧客情報の登録/編集': 'CrmEdit',
  'コンタクト履歴の記録': 'ContactLog',
  '案件の管理': 'DealManage',
  'セールスパイプラインの確認': 'SalesPipeline',
  'タスク/リマインダー設定': 'CrmReminder',
  'メールの一斉配信': 'BulkEmail',

  // --- 動画配信プラットフォーム制作 ---
  '動画の検索/再生': 'VideoPlay',
  '再生速度調整': 'PlaybackSpeed',
  '字幕の表示/非表示': 'CaptionToggle',
  'プレイリスト作成': 'PlaylistCreate',
  'ライブ配信視聴/開始': 'LiveStreamAction',
  '視聴履歴確認': 'WatchHistory',

  // --- 音楽プレイヤーアプリ制作 ---
  '楽曲検索/再生': 'MusicPlay',
  'シャッフル/リピート再生': 'PlaybackMode',
  '歌詞表示': 'LyricsDisplay',
  'イコライザー調整': 'EqualizerSet',
  'オフライン再生リスト作成': 'OfflinePlaylist',
  'アルバム/アーティスト情報表示': 'ArtistInfo',

  // --- ポッドキャスト配信アプリ制作 ---
  'エピソード検索/再生': 'EpisodePlay',
  '倍速再生': 'SpeedPlayback',
  'エピソードの自動ダウンロード設定': 'AutoDownload',
  '番組の購読管理': 'SubscriptionManage',
  'チャプター表示': 'ChapterDisplay',

  // --- 電子書籍ビューワー制作 ---
  '書籍の選択/閲覧': 'BookView',
  '文字サイズ/フォント変更': 'FontConfig',
  'ハイライト/メモ追加': 'AnnotationAdd',
  '辞書検索': 'DictSearch',
  'ダークモード切替': 'DarkModeToggle',
  '複数デバイスでのページ同期': 'PageSync',

  // --- AIチャットボット制作 ---
  'テキスト入力': 'TextInput',
  '音声入力': 'VoiceInput',
  'ファイルの添付': 'FileAttach',
  '会話履歴確認': 'ChatHistory',
  '言語切り替え': 'LangSwitch',

  // --- 画像認識アプリ制作 ---
  'カメラでのリアルタイム認識': 'RealtimeVision',
  '画像アップロード/認識': 'ImageUploadVision',
  '物体検出の実行': 'ObjectDetection',
  '顔認識の実行': 'FaceRecognition',
  '認識結果のタグ付け/保存': 'VisionResultTag',

  // --- 音声認識アプリ制作 ---
  'リアルタイム文字起こし開始/停止': 'RealtimeTranscription',
  '音声データのアップロード/文字起こし': 'AudioTranscription',
  '特定キーワードの抽出': 'KeywordExtract',
  '話者分離の適用': 'SpeakerDiarization',
  '文字起こし結果の編集': 'TranscriptEdit',

  // --- 機械学習モデル管理システム ---
  'モデルの登録/バージョン管理': 'ModelVersionManage',
  '学習プロセスの監視': 'TrainingMonitor',
  'モデルのデプロイ': 'ModelDeploy',
  'A/Bテストの実施': 'AbTestRun',
  'データ前処理ツールの利用': 'PreprocessTool',
  '学習結果の比較': 'TrainingCompare'
}

// --- 3. ロジック ---

const filteredCategories = computed(() => {
  const keys = Object.keys(actionTemplates.value)
  if (!searchKeyword.value) return keys
  return keys.filter(key => key.includes(searchKeyword.value))
})

// 命名生成（共通パーツとアクション両方に対応）
const generateFileName = (baseName, isJp = false) => {
  // 1. 英語パートを決定
  const engPart = isJp ? (nameDictionary[baseName] || baseName.replace(/[\/\s]/g, '')) : baseName
  
  // 2. プレフィックスを取得
  const prefix = formData.value.projectName || 'MyProject'
  
  // 3. 結合して返す
  return `${prefix}${engPart}${selectedExt.value}`
}


const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  alert(`Copied: ${text}`)
}
</script>

<template>
  <div class="naming-tool">
    <div class="card setup-bar">
      <div class="group">
        <label>PROJECT NAME</label>
        <input v-model="formData.projectName" type="text" placeholder="Project Name..." class="input-project" />
      </div>
      <div class="group">
        <label>EXTENSION</label>
        <div class="ext-switches">
          <!-- 配列の中に使いたい拡張子を書き足すだけ -->
          <button v-for="ext in ['.vue', '.py', '.js', '.html', '.css', '.scss', '.md']" :key="ext" 
                  @click="selectedExt = ext" 
                  :class="{ active: selectedExt === ext }">
            {{ ext }}
          </button>
        </div>
        <label>OS / DIRECTORY</label>
  <div class="os-controls">
    <div class="ext-switches">
      <button @click="osType = 'mac'" :class="{ active: osType === 'mac' }">Mac/Linux</button>
      <button @click="osType = 'win'" :class="{ active: osType === 'win' }">Windows</button>
    </div>
    <input v-model="targetDir" type="text" placeholder="dir path..." class="input-dir" />
    <label class="check-label">
      <input type="checkbox" v-model="includeMkdir"> mkdir
    </label>
  </div>

  <div class="card common-card">
  <div class="card-header">
    <h3 class="title-en">Common Components</h3>
    <button class="btn-command" @click="exportCommand(true)">>_ Copy Command</button>
  </div>
  </div>
      </div>
    </div>

    <div class="card filter-bar">
      <label>CATEGORY SEARCH</label>
      <input v-model="searchKeyword" type="text" placeholder="Search categories..." class="input-search" />
      <div class="tag-container">
        <button v-for="cat in filteredCategories" :key="cat" 
                @click="selectedCategory = cat" 
                :class="{ active: selectedCategory === cat }" class="tag">
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="card common-card">
      <h3 class="title-en">Common Components</h3>
      <div class="list">
        <div v-for="name in commonComponents" :key="name" 
             class="item" @click="copyToClipboard(generateFileName(name))">
          <span class="jp">Standard</span>
          <code class="en">{{ generateFileName(name) }}</code>
        </div>
      </div>
    </div>



    <div class="result-grid">
      <div class="card result-card">
        <h3 class="title-en">{{ selectedCategory || 'Feature Components' }}</h3>
        <div v-if="selectedCategory" class="list">
         <div v-for="action in actionTemplates[selectedCategory]" :key="action" 
           class="item" @click="copyToClipboard(generateFileName(action, true))">
         <span class="jp">{{ action }}</span>
        <code class="en">{{ generateFileName(action, true) }}</code>
       </div>
     </div>
        <div v-else class="placeholder">
          Select a category to generate component names.
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.naming-tool { padding: 20px; background: #f8f9fa; min-height: 100vh; font-family: sans-serif; }
.card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

/* タイトル英語化 */
.title-en { margin-top: 0; color: #42b983; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }

/* 1段目：セットアップ */
.setup-bar { display: flex; gap: 40px; align-items: center; }
.group { display: flex; flex-direction: column; gap: 5px; }
label { font-size: 10px; font-weight: bold; color: #aaa; }
.input-project { font-size: 1.2rem; padding: 5px 10px; border: 2px solid #eee; border-radius: 4px; outline: none; }
.input-project:focus { border-color: #42b983; }

.ext-switches { 
  display: flex; 
  flex-wrap: wrap; /* ボタンが増えても自動で改行されるように */
  gap: 5px; 
  background: #eee; 
  padding: 3px; 
  border-radius: 6px; 
}
.ext-switches button { border: none; background: none; padding: 5px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; }
.ext-switches button.active { background: white; color: #42b983; }

/* 2段目：フィルタリング */
.input-search { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
.tag-container { display: flex; flex-wrap: wrap; gap: 8px; max-height: 120px; overflow-y: auto; padding: 5px; }
.tag { padding: 5px 12px; border: 1px solid #ddd; background: white; border-radius: 15px; cursor: pointer; font-size: 12px; }
.tag.active { background: #42b983; color: white; border-color: #42b983; }

/* 3段目：結果表示 */
.list { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 15px;
}
.item { 
  display: flex; 
  flex-direction: column; /* 上下に並べる */
  align-items: flex-start; /* 左寄せ */
  gap: 6px; /* 日本語と英語の間の余白 */
  background: #f1f3f5; 
  padding: 15px; /* 余白を少し多めに */
  border-radius: 8px; 
  cursor: pointer; 
  transition: 0.2s;
}
.item:hover { 
  background: #e9ecef; 
  transform: translateY(-2px); 
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.jp { 
  font-size: 12px;
  color: #666; 
  line-height: 1.4; /* 日本語が複数行になっても読みやすく */
  text-align: left;
}
.en { 
  font-weight: bold; 
  color: #2c3e50; 
  font-family: monospace; 
  word-break: break-all; /* 長い名前が枠からはみ出さないように */
}
.placeholder { text-align: center; color: #ccc; padding: 40px; }

.os-controls { display: flex; align-items: center; gap: 10px; }
.input-dir { padding: 5px 10px; border: 2px solid #eee; border-radius: 4px; font-size: 0.9rem; width: 150px; }
.check-label { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #666; cursor: pointer; }

.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; border-bottom: 1px solid #eee; }
.card-header .title-en { border-bottom: none; margin-bottom: 0; padding-bottom: 10px; }

.btn-command {
  background: #333;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  cursor: pointer;
  transition: 0.2s;
}
.btn-command:hover { background: #000; transform: translateY(-1px); }
</style>