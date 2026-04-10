<script setup>
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const { formData, workDays, features } = storeToRefs(projectStore)

// 合計工期の計算
const totalDays = computed(() => {
  return Object.values(workDays.value).reduce((sum, days) => sum + Number(days), 0)
})

// --- メッセージ辞書（各工程のテンプレート） ---
const messageTemplates = computed(() => {
  // 共通の変数
  const client = formData.value.clientName || 'お客様'
  const title = formData.value.projectName || '本プロジェクト'
  
  // 1. 【企画・要件定義用】詳細な提案メッセージ
  const ms1 = features.value['UIデザイン確定'] || '未定'
  const ms2 = features.value['フロント実装(UI完成)'] || '未定'
  const selectedTech = formData.value.language?.length > 0 ? formData.value.language.join(' / ') : '未設定'
  const scopeText = formData.value.scope || (formData.value.functions?.length > 0 ? formData.value.functions.join('、') : '未設定')

  const proposal = `
【プロジェクト概要】
■プロジェクト名: ${title}
■目的: ${formData.value.purpose || '未設定'}
■実施範囲: ${scopeText}

■スケジュール
・着手予定日: ${formData.value.startDate || '未定'}
・デザインFIX: ${ms1}（★ご確認依頼）
・機能・UI完成: ${ms2}（★動作確認開始）
・最終納期: ${formData.value.deadline || '未定'}

■動作環境・技術
・対応ブラウザ: ${formData.value.browser || 'Google Chrome / Safari'}
・開発技術: ${selectedTech}
・公開先: ${formData.value.publishTo || '未定'}

■納品物
・${formData.value.delivery || 'ソースコード一式'}
----------------------------------
ご確認のほど、よろしくお願いいたします。`.trim()

  // 2. 辞書本体
  return {
    '企画・要件定義': proposal,
    
    '【客確】構成・遷移確認': 
      `${client} 様\n\nお世話になっております。画面遷移図および各ページの構成案（ワイヤーフレーム）がまとまりました。\n本格的なデザインに入る前に、情報の優先順位や機能の過不足がないかご確認をお願いいたします。\n特に、TOPページからお問い合わせまでの流れがスムーズか、意図と相違ないか重点的に見ていただけますと幸いです。\n\nご確認のほど、よろしくお願いいたします。`,
    
    '【客確】デザイン最終確認': 
      `${client} 様\n\nお世話になっております。UIデザインの最終案が完成いたしました。\n前回ご提案した構成に基づき、ブランドカラーを反映したトーンで仕上げております。配色、フォント、各パーツの視認性など、デザイン面での最終的なチェックをお願いいたします。\nこちらで確定いただけますと、以降のプログラム実装工程へと進ませていただきます。\n\nよろしくお願いいたします。`,
    
    '【客確】最終動作確認': 
      `${client} 様\n\nお世話になっております。すべての機能の実装およびテストが完了いたしました。\n実際のブラウザで操作いただける検証環境を用意しましたので、最終的な動作確認をお願いいたします。各ボタンの動作や、フォームの送信、スマートフォンの表示崩れがないか等、お気づきの点がございましたらお知らせください。\n問題なければ、こちらをもちましてリリース準備へと移行いたします。\n\nよろしくお願いいたします。`,
      
    '完了': 
      `${client} 様\n\nお世話になっております。本プロジェクトの全工程が完了いたしました。\nご協力いただき誠にありがとうございました。今後ともよろしくお願いいたします。`
  }
})

// 現在のステータスに基づいて表示するメッセージを決定
const activeMessage = computed(() => {
  const currentStatus = formData.value.status
  const defaultMsg = `${formData.value.clientName || 'お客様'} 様\n\nお世話になっております。現在「${currentStatus}」の工程を進めております。\n予定通り順調に進捗しておりますので、今しばらくお待ちください。`
  
  return messageTemplates.value[currentStatus] || defaultMsg
})

// コピー機能
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(activeMessage.value)
    alert('メッセージをコピーしました！')
  } catch (err) {
    alert('コピーに失敗しました。')
  }
}
</script>

<template>
  <div class="progress-container">
    <h1>プロジェクト進捗・メッセージ作成</h1>

    <section class="message-section shadow-box">
      <h3>✉️ お客様への報告メッセージ（{{ formData.status }}）</h3>
      <div class="message-preview">
        <pre>{{ activeMessage }}</pre>
      </div>
      <button @click="copyToClipboard" class="btn-copy">
        メッセージをコピーする
      </button>
    </section>

    <section class="details-section shadow-box">
      <h3>📅 スケジュール詳細</h3>
      <div class="schedule-list">
        <div 
          v-for="(endDate, task) in features" 
          :key="task" 
          class="schedule-row"
          :class="{ 'is-client-check': task.includes('【客確】') }"
        >
          <span class="task-name">{{ task }}</span>
          <span class="task-date">{{ endDate }}</span>
        </div>
      </div>
      
      <div class="summary-footer">
        <p><strong>合計工期:</strong> {{ totalDays }} 日</p>
        <p><strong>最終納期:</strong> {{ formData.deadline }}</p>
      </div>
    </section>

    <div class="nav-actions">
      <button @click="$router.back()" class="btn-back">戻る</button>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fdfdfd;
}

.shadow-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  margin-bottom: 25px;
  text-align: left;
}

h3 {
  border-left: 4px solid #42b983;
  padding-left: 10px;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

/* メッセージプレビュー */
.message-preview {
  background: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
}

pre {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 0.9rem;
  margin: 0;
}

/* ★ スケジュール行表示のスタイル ★ */
.schedule-list {
  border-top: 1px solid #eee;
}

.schedule-row {
  display: flex;
  justify-content: space-between; /* 工程名を左、日付を右に */
  padding: 12px 5px;
  border-bottom: 1px solid #eee;
}

/* 【客確】の行をハイライト */
.is-client-check {
  background-color: #f0f7ff;
  font-weight: bold;
}

.task-date {
  font-family: monospace;
  font-weight: bold;
  color: #555;
}

.summary-footer {
  margin-top: 15px;
  text-align: right;
  color: #e67e22;
}

.btn-copy {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.btn-back {
  background: #eee;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>