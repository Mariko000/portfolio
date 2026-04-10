<template>
  <div>

    <h1>Typing Game</h1>

    <select v-model="selectedDifficulty">
      <option value="">選んでください</option>
      <option value="easy">Easy</option>
      <option value="normal">Normal</option>
      <option value="hard">Hard</option>
    </select>

    <button @click="startGame">スタート</button>

    <div v-if="currentWord">{{ currentWord }}</div>

    <input v-model="inputValue" @keydown.enter="checkAnswer" :disabled="!gameStarted" />

    <div>{{ resultMessage }}</div>

    <p>カウンター: {{ count }}</p>
    <p>残り時間: {{ timeLeft }}秒</p>

    <button @click="retryGame" v-if="showRetryButton">もう一度</button>
  </div>
  <AppFooter />
</template>

<script setup>
import { RouterView } from 'vue-router';
import { ref } from 'vue'

const selectedDifficulty = ref('')
const currentWord = ref('')
const inputValue = ref('')
const resultMessage = ref('')
const count = ref(0)
const showRetryButton = ref(false)
const gameStarted = ref(false)
const timeLeft = ref(30)
let timerId = null

const wordLists = {
  easy: ['apple', 'banana'],
  normal: ['computer'],
  hard: ['internationalization']
}

function getRandomWord(list) {
  const index = Math.floor(Math.random() * list.length)
  return list[index]
}

function startGame() {
  if (!selectedDifficulty.value) {
    alert('難易度を選んでください！')
    return
  }

  // 初期化
  count.value = 0
  resultMessage.value = ''
  showRetryButton.value = false
  gameStarted.value = true
  inputValue.value = ''
  timeLeft.value = 30
  currentWord.value = getRandomWord(wordLists[selectedDifficulty.value])

  // タイマー開始
  timerId && clearInterval(timerId)
  timerId = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerId)
      resultMessage.value = '時間切れ！'
      gameStarted.value = false
      showRetryButton.value = true
      currentWord.value = ''
    }
  }, 1000)
}

function checkAnswer() {
  if (!gameStarted.value) return

  if (inputValue.value === currentWord.value) {
    resultMessage.value = '正解！'
    count.value++
    inputValue.value = ''

    if (count.value >= 5) {
      resultMessage.value = 'ゲームクリア！'
      gameStarted.value = false
      showRetryButton.value = true
      currentWord.value = ''
      clearInterval(timerId)
      return
    }

    currentWord.value = getRandomWord(wordLists[selectedDifficulty.value])
  } else {
    resultMessage.value = '不正解！もう1回！'
  }
}

function retryGame() {
  selectedDifficulty.value = ''
  count.value = 0
  inputValue.value = ''
  resultMessage.value = ''
  showRetryButton.value = false
  gameStarted.value = false
  currentWord.value = ''
  timeLeft.value = 30
  clearInterval(timerId)
}
</script>

<style scoped>
/* 必要ならここにスタイルを記述 */
</style>
