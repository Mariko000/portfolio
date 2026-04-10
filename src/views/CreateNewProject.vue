<template>
  <!-- 工期計算ツールに特化 -->
  <div class="project">
    <h2>プロジェクト定義</h2>

    <div class="form-group">
    <label for="projectName">プロジェクト名:</label>
    <input type="text" id="projectName" v-model="formData.projectName"><br>
  </div>


  <div class="form-group">
    <label>1. プロジェクトの目的（ゴール）:</label>
    <textarea v-model="formData.purpose" placeholder="例：手入力の工数管理を自動化し、作業時間を削減する"></textarea>
  </div>

  <div class="form-group">
    <label>2. 実施範囲（スコープ）:</label>
    <textarea v-model="formData.scope" placeholder="例：ログイン画面、案件入力画面、レポート出力機能"></textarea>
  </div>

    <div class="form-group">
    <label>開発人数:</label>
    <input type="text" v-model="formData.people"><br>
    </div>

    <div class="form-group">
    <label>開始日:</label>
    <input type="date" v-model="formData.startDate">

    <div class="form-group">
    <label>納期:</label>
    <input type="date" v-model="formData.deadline"><br>
   </div>
   
    <RouterLink to="/tools/task-manager/Estimated-Construction">
      <button class="btn">工期目安へ</button></RouterLink>
    </div>


  



    <div class="form-group">
    <label>プロジェクト規模:</label>
    <select v-model="formData.projectType">
      <option value="">選択</option>
      <option value="小規模">小規模 （MVP・個人開発）</option>
      <option value="中規模">中規模（社内ツール・LP付きアプリ）</option>
      <option value="大規模">大規模（商用EC・SNSアプリ）</option> </select><br>
    </div>
   
 
<div v-if="formData.projectType">
  <h4>開発スケジュール</h4>
  <div v-for="(value, phase) in workDays" :key="phase" class="phase-input-group">
    <label>{{ phase }}</label>
    <input type="number" v-model="workDays[phase]" @input="recalculateSchedule" /> 日
    <span class="phase-note" v-if="phaseNotes[phase]">
      （{{ phaseNotes[phase] }}）
    </span>
  </div>
 

  <p>合計工期：{{ totalDays }} 日</p>

  <div class="form-group">
  <label>
    <input type="checkbox" v-model="formData.excludeWeekends" @change="recalculateSchedule">
    土日を除外して計算（標準プラン）
  </label>
  
  <p v-if="diffDays > 0" style="font-size: 0.9rem; color: #d35400; margin-top: 5px;">
    💡 土日も稼働する「特急プラン」なら、標準より <strong>{{ diffDays }}日間</strong> 早く完了します。
  </p>

  <span v-if="formData.excludeWeekends" style="font-size: 0.8rem; color: #666; margin-left: 10px;">
    ※実働日数で計算します
  </span>
  <span v-else style="font-size: 0.8rem; color: #e67e22; margin-left: 10px;">
    ※特急プラン（土日返上）
  </span>
</div>

</div>



<!--  再計算ボタン -->
<button @click="recalculateSchedule">スケジュールを計算</button>

<div v-if="Object.keys(projectStore.features).length > 0">
  <h4>工程別スケジュール</h4>
  <table>
    <thead>
      <tr>
        <th>工程</th>
        <th>終了予定日</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(endDate, task) in projectStore.features" :key="task">
        <td>{{ task }}</td>
        <td>{{ endDate }}</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="form-group">



  <RouterLink to="/tools/task-manager/schedule-calendar.vue" class="grid-item">
        <button class="btn">カレンダー</button>
      </RouterLink>
    </div>

    <div class="form-section shadow-box">
  <h3>4. 動作環境・技術スタック</h3>

  <div class="input-row">
    <label class="sub-label">対応ブラウザ</label>
    <input 
      type="text" 
      v-model="formData.browser" 
      placeholder="例: Google Chrome / Safari（最新版）" 
      class="full-width-input"
    >
  </div>

  <div class="input-row">
    <label class="sub-label">使用言語・ライブラリ <small>（*複数選択可能）</small></label>
    <div class="checkbox-grid">
      <div v-for="option in languageOptions" :key="option" class="checkbox-item">
        <label>
          <input
            type="checkbox"
            :value="option"
            v-model="formData.language"
          />
          {{ option }}
        </label>
      </div>
    </div>
  </div>

  <div class="input-row">
    <label class="sub-label">公開予定先</label>
    <input 
      type="text" 
      v-model="formData.publishTo" 
      placeholder="例: Vercel / Heroku / Xserver" 
      class="full-width-input"
    >
  </div>
</div>

    <button @click="addFeatureToProjectStore">機能を追加</button>

   <p>↑新規作成ボタン(NewProjectHome.vueへ反映)</p>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router' 
import { workDays, setDefaultWorkDays } from '@/stores/projectStore'
import dayjs from 'dayjs'

const router = useRouter() 
const projectStore = useProjectStore()
const {languageOptions, formData, recommendedSubFeatures } = storeToRefs(projectStore)

// --- 計算用の比率設定 ---
// --- 計算用の比率設定（合計100になるよう調整済み） ---
const projectRatios = {
  '小規模': { 
    '企画・要件定義': 10, 
    '情報設計・ワイヤー': 10, 
    '【客確】構成・遷移確認': 5, 
    'UIデザイン確定': 15, 
    '【客確】デザイン最終確認': 5, 
    'フロント実装(UI完成)': 30, 
    '【客確】最終動作確認': 5, 
    'テスト・調整': 15, 
    'リリース準備': 5 
  },
  '中規模': { 
    '企画・要件定義': 10, 
    '情報設計・ワイヤー': 10, 
    '【客確】構成・遷移確認': 5, 
    'UIデザイン確定': 15, 
    '【客確】デザイン最終確認': 5, 
    'フロント実装(UI完成)': 30, 
    '【客確】最終動作確認': 5, 
    'テスト・調整': 15, 
    'リリース準備': 5 
  },
  '大規模': { 
    '企画・要件定義': 10, 
    '情報設計・ワイヤー': 10, 
    '【客確】構成・遷移確認': 5, 
    'UIデザイン確定': 15, 
    '【客確】デザイン最終確認': 5, 
    'フロント実装(UI完成)': 30, 
    '【客確】最終動作確認': 5, 
    'テスト・調整': 15, 
    'リリース準備': 5 
  }
};

// テンプレート表示用の注釈
const phaseNotes = {
  '企画・要件定義': '何を作るかの合意',
  '情報設計・ワイヤー': '画面の骨組みの完成',
  '【客確】構成・遷移確認': '★お客様：遷移・配置のチェック',
  'UIデザイン確定': '【MS①】 ビジュアルのFIX',
  '【客確】デザイン最終確認': '★お客様：デザインの最終承諾',
  'フロント実装(UI完成)': '【MS②】 ブラウザで動く状態',
  '【客確】最終動作確認': '★お客様：全機能の最終動作チェック',
  'テスト・調整': 'バグ修正・微調整',
  'リリース準備': '本番公開'
};

// --- ロジック：納期から逆算して日数を割り当てる ---
function adjustWorkDaysByDeadline() {
  const start = dayjs(formData.value.startDate);
  const end = dayjs(formData.value.deadline);
  const type = formData.value.projectType;

  if (!start.isValid() || !end.isValid() || !type) return;

  const totalAvailableDays = end.diff(start, 'day') + 1;
  if (totalAvailableDays <= 0) return;

  const ratios = projectRatios[type];
  const newWorkDays = {};

  Object.keys(ratios).forEach(phase => {
    // 整数比率を 100 で割って計算
    newWorkDays[phase] = Math.max(1, Math.round(totalAvailableDays * (ratios[phase] / 100)));
  });

  workDays.value = newWorkDays;
  recalculateSchedule();
}

// --- 監視：入力状態に合わせてスケジュールを自動更新 ---
watch(
  [() => formData.value.startDate, () => formData.value.deadline, () => formData.value.projectType],
  ([newStart, newDeadline, newType]) => {
    if (!newType) {
      workDays.value = {};
      return;
    }

    // 開始日と納期が両方あれば「比率で逆算」、なければ「デフォルト値をセット」
    if (newStart && newDeadline) {
      adjustWorkDaysByDeadline();
    } else {
      setDefaultWorkDays(newType);
    }
  },
  { deep: true }
);

// --- スケジュール計算関連 ---
const totalDays = computed(() => {
  return Object.values(workDays.value).reduce((sum, days) => sum + Number(days), 0)
})

const standardCalendarDays = computed(() => {
  if (!formData.value.startDate || totalDays.value <= 0) return 0;
  let current = dayjs(formData.value.startDate);
  let workDaysCount = 0;
  let calendarDays = 0;
  while (workDaysCount < totalDays.value) {
    calendarDays++;
    current = current.add(1, 'day');
    if (current.day() !== 0 && current.day() !== 6) workDaysCount++;
  }
  return calendarDays;
});

const diffDays = computed(() => standardCalendarDays.value - totalDays.value);

function addWorkDays(startDate, days, excludeWeekends) {
  let current = dayjs(startDate);
  if (!excludeWeekends) return current.add(days, 'day');
  let addedDays = 0;
  while (addedDays < days) {
    current = current.add(1, 'day');
    if (current.day() !== 0 && current.day() !== 6) addedDays++;
  }
  return current;
}

function calculateFeatureSchedule(startDate, workDaysObj) {
  let lastEndDate = dayjs(startDate);
  const result = {};
  const excludeWeekends = formData.value.excludeWeekends;
  for (const phase in workDaysObj) {
    const days = workDaysObj[phase];
    if (days > 0) {
      lastEndDate = addWorkDays(lastEndDate, days, excludeWeekends);
      result[phase] = lastEndDate.format('YYYY/MM/DD');
    }
  }
  return result;
}

const scheduleList = ref([])
function recalculateSchedule() {
  const projectStart = formData.value.startDate;
  if (!projectStart) return;
  const featureSchedule = calculateFeatureSchedule(projectStart, workDays.value)
  projectStore.features = featureSchedule
  scheduleList.value = Object.entries(featureSchedule).map(([phase, date]) => ({ phase, date }))
}

// --- サブ機能操作関連 ---
const newSubFeatureInput = ref('');
const mainFeatureList = computed(() => Object.keys(recommendedSubFeatures.value || {}));
const isInputFilled = computed(() => formData.value?.overview !== '' && !mainFeatureList.value.includes(formData.value?.overview));
const isSelectFilled = computed(() => mainFeatureList.value.includes(formData.value?.overview));
const currentRecommendedSubFeatures = computed(() => (recommendedSubFeatures.value || {})[formData.value?.overview] || []);

const addManualSubFeature = () => {
  if (newSubFeatureInput.value && formData.value?.functions && !formData.value.functions.includes(newSubFeatureInput.value)) {
    formData.value.functions.push(newSubFeatureInput.value);
    newSubFeatureInput.value = '';
  }
};

const addRecommendedSubFeature = (subFeature) => {
  if (formData.value?.functions && !formData.value.functions.includes(subFeature)) {
    formData.value.functions.push(subFeature);
    const overviewKey = formData.value?.overview;
    if (overviewKey && recommendedSubFeatures.value[overviewKey]) {
      const index = recommendedSubFeatures.value[overviewKey].indexOf(subFeature);
      if (index > -1) recommendedSubFeatures.value[overviewKey].splice(index, 1);
    }
  }
};

const removeSubFeature = (index) => {
  if (formData.value?.functions) formData.value.functions.splice(index, 1);
};

// --- 保存・遷移 ---
const addFeatureToProjectStore = () => {
  recalculateSchedule();

  // projectStore.projectInfo に現在の入力を全て詰め込む
  projectStore.projectInfo = {
    ...formData.value, // これで purpose も scope も language も全て入る
    workDays: { ...workDays.value },
    features: { ...projectStore.features },
    schedule: [...scheduleList.value],
    totalDays: totalDays.value
  }

  projectStore.addFeature(formData.value.overview)
  router.push("/tools/task-manager/create-new-home")
}
</script>

<style scoped>
body {
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background-color: #f4f7f6;
  margin: 0;
  padding: 0;
}
.project{
  padding-left: 30px;
  padding-right: 30px;

}

/* 全体のコンテナに余白と中央寄せを設定 */
.project-dashboard-container {
  max-width: 900px; /* 最大幅を設定してコンテンツが広がりすぎないようにする */
  margin: 40px auto; /* 上下に40px、左右は自動で中央寄せ */
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 控えめな影 */
}

h1, h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 25px;
}

h1 {
  font-size: 2.2em;
  margin-top: 0;
}

h2 {
  font-size: 1.6em;
  color: #555;

}

/* フォームセクションのグループ化 */
.form-section {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05); /* 内部に控えめな影 */
}

.form-group {
  margin-bottom: 30px;
  display: flex; /* labelとinputを横並びにする */
  align-items: center; /* 垂直方向中央寄せ */
}

.form-group label {
  display: block;
  text-align: right;
  padding-right:5px;
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
  min-width: 150px; /* ラベルの幅を揃える */
  flex-shrink: 0; /* ラベルが縮まないようにする */
}

/* フォーム要素の統一的なスタイル */
input[type="text"],
textarea,
select {
  width: calc(100% - 170px); /* labelの幅とpaddingを考慮 */
  padding: 12px 15px;
  border: 1px solid #ccd;
  border-radius: 6px;
  font-size: 1em;
  color: #333;
  transition: border-color 0.3s, box-shadow 0.3s;
  flex-grow: 1; /* 残りのスペースを埋める */
}

textarea {
  min-height: 80px; /* テキストエリアの最小高さを設定 */
  resize: vertical; /* 垂直方向のみリサイズ可能にする */
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  outline: none;
}

/* インライン要素の調整 */
.form-group-inline {
  display: flex;
  align-items: center;
  gap: 15px; /* 要素間のスペース */
  margin-bottom: 20px;
  flex-wrap: wrap; /* 小さい画面で折り返す */
}

.form-group-inline label {
  font-weight: 600;
  color: #444;
  flex-shrink: 0;
}

.form-group-inline .inline-input {
  flex-grow: 1;
  min-width: 200px; /* インライン入力の最小幅 */
}

/* ボタンのスタイル */
button {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-weight: 600;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

/* タグのスタイル */
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* タグ間のスペース */
  margin-top: 10px;
}

.sub-feature-tag, .selected-sub-feature-tag {
  display: inline-flex; /* flexboxで中央寄せしやすいように */
  align-items: center;
  background-color: #e9ecef; /* 淡いグレー */
  border-radius: 20px; /* より丸く */
  padding: 8px 15px;
  cursor: pointer;
  font-size: 0.9em;
  color: #495057;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.sub-feature-tag:hover {
  background-color: #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selected-sub-feature-tag {
  background-color: #28a745; /* グリーン */
  color: white;
  padding-right: 10px; /* xボタンがあるので少し調整 */
}

.selected-sub-feature-tag button {
  background: none;
  border: none;
  color: white; /* xボタンの色を白に */
  cursor: pointer;
  margin-left: 8px;
  font-weight: bold;
  font-size: 1em;
  line-height: 1; /* xボタンの行高を調整 */
  padding: 0; /* デフォルトのpaddingをなくす */
}

.selected-sub-feature-tag button:hover {
  opacity: 0.8;
}

/* その他のテキスト */
.section-title {
  font-weight: 600;
  color: #444;
  margin-top: 25px;
  margin-bottom: 10px;
  border-bottom: 1px dashed #e0e0e0;
  padding-bottom: 5px;
}

.note {
  font-size: 0.85em;
  color: #6c757d;
  margin-top: 5px;
  margin-bottom: 15px;
}

.action-buttons {
  display: flex;
  flex-direction: column; /* ボタンを縦に並べる */
  gap: 15px; /* ボタン間のスペース */
  margin-top: 40px;
  align-items: flex-start; /* 左寄せ */
}

.action-buttons .btn {
  width: auto; /* ボタンの幅をコンテンツに合わせる */
  min-width: 200px; /* 最小幅を設定して統一感を出す */
}

.action-buttons .link-text {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.action-buttons .link-text:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* RouterLinkのデフォルトスタイルを上書き */
a {
  text-decoration: none; /* デフォルトの下線をなくす */
  color: inherit; /* 親要素の文字色を継承 */
}

/* Small adjustments for RouterLink inside button */
.btn a {
  display: block;
  width: 100%;
  height: 100%;
  padding: inherit; /* ボタンのpaddingを継承 */
  box-sizing: border-box; /* paddingを含めて幅を計算 */
}

/* CSSに追加 */
.phase-note {
  font-size: 0.85rem;
  color: #666;
  margin-left: 10px;
}

/* 「★」や「客確」が入っている注釈を強調 */
/* .phase-note:contains('客確'), */
/* .phase-note:contains('★') { 
  color: #2980b9;
  font-weight: bold;
}*/
/* Optional: Dark mode toggle styling, if you have one */
/* .dark-mode-toggle { ... } */

/* 技術スタックの入力エリア全体 */
.shadow-box {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  border: 1px solid #eaeaea;
}

/* 各入力行のラベル（対応ブラウザ、使用言語など） */
.sub-label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #2c3e50;
  font-size: 0.95rem;
}

.sub-label small {
  font-weight: normal;
  color: #7f8c8d;
  margin-left: 5px;
}

/* ★ 3列×3段のグリッドレイアウト ★ */
.checkbox-grid {
  display: grid;
  /* 1行に3つの要素を等幅(1fr)で並べる */
  grid-template-columns: repeat(3, 1fr); 
  /* 縦の隙間を12px、横の隙間を10pxに設定 */
  gap: 12px 10px; 
  padding: 15px;
  border-radius: 6px;
}

/* 各チェックボックス項目のスタイル */
.checkbox-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  cursor: pointer;
  /* 文字が長い場合に勝手に改行されないようにする */
  white-space: nowrap; 
}

.checkbox-item input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* テキスト入力欄の共通スタイル */
.full-width-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 5px;
  font-size: 0.9rem;
  box-sizing: border-box; /* paddingを含めた幅に固定 */
  transition: border-color 0.2s;
}

.full-width-input:focus {
  outline: none;
  border-color: #42b983; /* Vueっぽい緑色にフォーカス */
}

.input-row {
  margin-bottom: 18px;
}
/* Responsive considerations (simple example) */
@media (max-width: 768px) {
  .project-dashboard-container {
    margin: 20px;
    padding: 20px;
  }

  .form-group {
    flex-direction: column; /* 小さい画面では縦積みに */
    align-items: flex-start;
  }

  .form-group label {
    min-width: unset;
    margin-bottom: 5px;
  }

  input[type="text"],
  textarea,
  select {
    width: 100%; /* フル幅に */
  }

  .form-group-inline {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .form-group-inline .inline-input {
    width: 100%;
    min-width: unset;
  }
}
</style>