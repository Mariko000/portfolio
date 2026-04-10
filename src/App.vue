<template>
    <div :class="{ 'dark-mode': darkModeStore.isDark, 'light-mode': !darkModeStore.isDark }">
      <HeaderNav />
      <main class="main-layout">
      <router-view></router-view>
    </main>
      <AppFooter />
    </div>
  </template>
  
  <script setup>
  import { useDarkModeStore } from './stores/darkModeStore'
  const darkModeStore = useDarkModeStore()




  
  import HeaderNav from '@/components/shared/HeaderNav.vue'
  import AppFooter from '@/components/shared/AppFooter.vue'
  </script>
  
  <style>
  /* グローバルCSS */
  .light-mode {
  background-color: #fff;
  color: #000;
}

.dark-mode {
  background-color: #222;
  color: #fff;
}

/* 表示領域の縮小ロジック
  max-widthで幅を絞り、margin: 0 autoで中央に寄せます
*/
.router-container {
  max-width: 900px; /* ここでお好みの幅にギュッと絞る */
  margin: 0 auto;   /* 中央配置 */
  padding: 10px 20px; /* 上下の余白も少し詰める */
}

/* ついでにヘッダーとの隙間も少し詰めるとさらに良くなります */
nav {
  margin-bottom: 0 !important;
}

  </style>
  