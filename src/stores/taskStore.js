import { defineStore } from 'pinia'
import { watch } from 'vue'
import { ref } from 'vue'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([])

  const addTask = (task) => {
    tasks.value.push(task)
  }

  const removeTask = (index) => {
    tasks.value.splice(index, 1)
  }

 // タスクが変わるたびにlocalStorageに保存する
 watch(tasks, (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }, { deep: true })

  return { tasks, addTask, removeTask }
})
