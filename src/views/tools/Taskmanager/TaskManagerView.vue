<template>
  <div class="task-manager">
    <h1>プロジェクト管理ダッシュボード</h1>
    
    <div v-if="savedProjects.length > 0" class="project-grid">
      <div v-for="project in savedProjects" :key="project.id" class="project-card">
        <div class="card-header">
          <h3>{{ project.projectName || '名称未設定' }}</h3>
          <span class="status-badge" :class="project.status">{{ project.status }}</span>
        </div>
        
        <div class="project-info">
          <p><strong>納期:</strong> {{ project.deadline || '未設定' }}</p>
        </div>
        
        <div class="card-actions">
          <button @click="goToMessage(project)" class="btn-msg">✉️ メッセージ</button>
          <button @click="editProject(project)" class="btn-edit">確認</button>
          <button @click="confirmDelete(project.id)" class="btn-delete">🗑️</button>
        </div>

        <div class="status-updater">
          <label>現在の工程:</label>
          <select v-model="project.status" @change="updateStatus(project)">
            <option v-for="option in projectStore.statusOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📂</div>
      <p>現在プロジェクトがありません</p>
      <button @click="$router.push('/tools/task-manager/create-new-project')" class="btn-create">
        新しいプロジェクトを作成する
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProjectStore } from '@/stores/projectStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()
const projectStore = useProjectStore()
const { savedProjects } = storeToRefs(projectStore)

const goToMessage = (project) => {
  projectStore.loadProject(project)
  router.push('/tools/task-manager/progress-project')
}

const editProject = (project) => {
  projectStore.loadProject(project)
  router.push('/tools/task-manager/create-new-home')
}

const updateStatus = (project) => {
  projectStore.saveProjectToLocal(project)
}

const confirmDelete = (id) => {
  if (confirm('このプロジェクトを削除しますか？')) {
    projectStore.deleteProject(id)
  }
}
</script>

<style scoped>
.task-manager {
  padding: 10px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.project-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.status-badge {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 12px;
  background: #f0f0f0;
  color: #666;
  white-space: nowrap;
}

.status-kakunin {
  background: #fff3e0 !important;
  color: #e65100 !important;
  font-weight: bold;
  border: 1px solid #ffcc80;
}

.status-badge.進行中 { background: #e3f2fd; color: #1976d2; }
.status-badge.客確中 { background: #fff3e0; color: #f57c00; }
.status-done {
  background: #e8f5e9 !important;
  color: #2e7d32 !important;
}

.status-updater label {
  display: block;
  font-size: 0.75rem;
  color: #999;
  margin-bottom: 4px;
}

.project-info {
  font-size: 0.9rem;
  margin-bottom: 15px;
  color: #666;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.card-actions button {
  flex: 1;
  padding: 8px 4px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-msg { border-color: #42b983 !important; color: #42b983; }
.btn-msg:hover { background: #f0fff4; }
.btn-delete { flex: 0 0 45px !important; color: #d32f2f; }
.btn-delete:hover { background: #ffebee; }

.status-updater select {
  width: 100%;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fdfdfd;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #ddd;
}

.btn-create {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  margin-top: 15px;
  cursor: pointer;
}
</style>