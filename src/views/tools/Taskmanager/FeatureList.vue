<template>
  <div>
    <h3>機能・要件リスト</h3>

    <label>プロジェクト名</label>
    <input type="text" v-model="formData.projectName"><br>

    <label>目的・背景</label>
    <input type="text" v-model="formData.purpose"><br>

    <label>ターゲットユーザー</label>
    <input type="text" v-model="formData.targetUser"><br>

    <label>メイン機能</label><br>
    <input type="text" v-model="formData.overview" :disabled="isSelectFilled"><br>
    <select @change="onSelectChange" :value="formData.overview" :disabled="isInputFilled">
      <option value="">選択してください</option>
      <option v-for="item in mainFeatureList" :key="item" :value="item">{{ item }}</option>
    </select><br>

    <label>サブ機能</label><br>
    <input type="text" v-model="newSubFeatureInput" @keyup.enter="addManualSubFeature"><br>

    <div>
      <span v-for="(func, index) in formData.function" :key="index" @click="removeSubFeature(index)">
        {{ func }} ✖
      </span>
    </div>

    <div v-if="currentRecommendedSubFeatures.length">
      <p>おすすめ機能:</p>
      <div>
        <span v-for="subFeature in currentRecommendedSubFeatures" :key="subFeature" @click="addRecommendedSubFeature(subFeature)">
          {{ subFeature }}
        </span>
      </div>
    </div>

    <label>開始日</label>
    <input type="text" v-model="formData.startDate"><br>

    <label>納期</label>
    <input type="text" v-model="formData.releaseDate"><br>

    <label>プロジェクト種別</label>
    <select v-model="formData.projectType">
      <option value="">選択</option>
      <option value="小規模">小規模</option>
      <option value="中規模">中規模</option>
    </select><br>

    <label>使用言語・ライブラリ</label>
    <select v-model="formData.language">
      <option value="">--選択--</option>
      <option value="HTML / CSS / JavaScript">HTML / CSS / JavaScript</option>
      <option value="Vue.js / React / Svelte">Vue.js / React / Svelte</option>
    </select><br>

    <label>開発環境</label>
    <select v-model="formData.environment">
      <option value="">--選択--</option>
      <option value="VSCode">VSCode</option>
      <option value="WebStorm">WebStorm</option>
    </select><br>

    <button @click="addFeature">機能を追加</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { defineProps } from 'vue'

const props = defineProps({
  features: {
    type: Array,
    default: () => []
  }
})

const projectStore = useProjectStore()
const formData = projectStore.formData
const recommendedSubFeatures = projectStore.recommendedSubFeatures

const newSubFeatureInput = ref('')

const mainFeatureList = Object.keys(recommendedSubFeatures)

const isInputFilled = computed(() => formData.value.overview !== '' && !mainFeatureList.includes(formData.overview))
const isSelectFilled = computed(() => mainFeatureList.includes(formData.overview))

const currentRecommendedSubFeatures = computed(() =>
  recommendedSubFeatures.value[formData.overview] || []
)

const addManualSubFeature = () => {
  if (newSubFeatureInput.value) {
    formData.value.function.push(newSubFeatureInput.value)
    newSubFeatureInput.value = ''
  }
}

const addRecommendedSubFeature = (subFeature) => {
  if (!formData.value.function.includes(subFeature)) {
    formData.value.function.push(subFeature)
  }
}

const removeSubFeature = (index) => {
  formData.value.function.splice(index, 1)
}

const onSelectChange = (e) => {
  formData.value.overview = e.target.value
}

const addFeature = () => {
  console.log('追加された機能:', formData.value)
}
</script>

    
    
    <style scoped>
    /* Your GameView styles will go here */
    input:disabled,
  select:disabled {
    background-color: #e0e0e0;
    color: #a0a0a0;
    cursor: not-allowed;
    border: 1px solid #ccc;
    opacity: 0.8;
  }

  /* おすすめ機能のラベルに少し余白 */
  .recommended-features-label {
    margin-top: 20px;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .recommended-features {
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* 要素間のスペース */
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .recommended-feature-tag {
    background-color: #e0f2f7; /* おすすめ機能の背景色 */
    color: #007bff; /* 文字色 */
    border: 1px solid #a0d8ef;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap; /* テキストが途中で改行しないように */
  }

  .recommended-feature-tag:hover {
    background-color: #cce9f2;
  }

  .selected-sub-features {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    border: 1px dashed #ddd; /* 選択エリアを視覚的に区別 */
    padding: 8px;
    min-height: 40px; /* 選択がない場合でも最低限の高さ */
    align-items: center;
    box-sizing: border-box; /* paddingがwidth/heightに含まれるように */
  }

  .selected-feature-tag {
    background-color: #007bff; /* 選択された機能の背景色 */
    color: white; /* 文字色 */
    border-radius: 4px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    cursor: pointer; /* 削除可能であることを示す */
    font-size: 0.9em;
    white-space: nowrap;
  }

  .remove-icon {
    margin-left: 8px;
    font-weight: bold;
    cursor: pointer;
    padding: 0 3px;
  }

  .remove-icon:hover {
    color: #ffcc00; /* ホバー時の色 */
  }
    </style>