<template>
  <div class="project-summary">
    <h1>プロジェクト確認</h1>
    
    <section class="summary-section">
      <h3>■ 基本定義</h3>
      <p><strong>プロジェクト名:</strong> {{ formData.projectName || '未設定' }}</p>
      <p><strong>目的:</strong> {{ formData.purpose || '未設定' }}</p>
      <p><strong>実施範囲:</strong> {{ formData.scope || '未設定' }}</p>
      <p><strong>開発人数:</strong> {{ formData.people }}名</p>
    </section>

    <section class="summary-section">
      <h3>■ スケジュール</h3>
      <p><strong>開始日:</strong> {{ formData.startDate }}</p>
      <p><strong>最終納期:</strong> {{ formData.deadline }}</p>
      <p><strong>合計工期:</strong> {{ totalDays }} 日</p>
      
      <table v-if="Object.keys(projectStore.features).length > 0">
        <thead>
          <tr><th>工程</th><th>終了予定日</th></tr>
        </thead>
        <tbody>
          <tr v-for="(endDate, task) in projectStore.features" :key="task">
            <td>{{ task }}</td>
            <td>{{ endDate }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="summary-section">
      <h3>■ 技術スタック・環境</h3>
      <p><strong>対応ブラウザ:</strong> {{ formData.browser }}</p>
      <p><strong>使用言語・ライブラリ:</strong> 
        {{ formData.language && formData.language.length > 0 ? formData.language.join(' / ') : '未選択' }}
      </p>
      <p><strong>公開予定先:</strong> {{ formData.publishTo }}</p>
      <p><strong>納品物:</strong> {{ formData.delivery }}</p>
    </section>

    <div class="button-group">
      <button @click="$router.back()" class="btn-secondary">修正する</button>
      <button @click="confirmProject" class="btn-primary">この内容で確定</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const router = useRouter()
const projectStore = useProjectStore()
// ストアからリアクティブにデータを取得
const { formData, workDays } = storeToRefs(projectStore)

// 合計工期の計算（ここでも再計算できるようにしておくと安心です）
const totalDays = computed(() => {
  return Object.values(workDays.value).reduce((sum, days) => sum + Number(days), 0)
})


// 「確定」ボタンを押したときに、この保存アクションを走らせてから遷移
const confirmProject = () => {
  alert('プロジェクトを確定しました！')
  // 1. 名前が空でないかチェック
  if (!formData.value.projectName) {
    alert('プロジェクト名を入力してください')
    return
  }

  // 2. LocalStorageへ保存
  projectStore.saveProjectToLocal()

  // 3. 次のページへ
  router.push('/tools/task-manager/progress-project')
}

</script>

<style scoped>
.project-summary {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  text-align: left;
}

.summary-section {
  margin-bottom: 30px;
}

h3 {
  border-bottom: 1px solid #42b983;
  padding-bottom: 5px;
  color: #2c3e50;
}

/* スケジュールを行形式にするためのスタイル */
.schedule-rows {
  margin-top: 15px;
  border-top: 1px solid #eee;
}

.schedule-line {
  display: flex;
  justify-content: space-between; /* 両端に配置 */
  padding: 10px 5px;
  border-bottom: 1px solid #f9f9f9;
}

/* 「【客確】」が含まれる行を以前の表のように青くする */
.highlight-client {
  background-color: #f0f7ff;
  font-weight: bold;
}

.task-name {
  color: #333;
}

.task-date {
  font-family: monospace; /* 数字の幅を揃える */
  color: #666;
}

.date-summary {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

.total-days {
  font-size: 1.1rem;
  color: #e67e22;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
}

button {
  padding: 10px 25px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary { background: #42b983; color: white; }
.btn-secondary { background: #eee; color: #666; }
</style>