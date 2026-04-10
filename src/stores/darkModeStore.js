import { defineStore } from 'pinia'

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    isDark: false
  }),
  actions: {
    toggleDarkMode() {
      this.isDark = !this.isDark
      document.body.className = this.isDark ? 'dark-mode' : 'light-mode'
    }
  }
})
