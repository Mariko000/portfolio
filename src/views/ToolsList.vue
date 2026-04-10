<template>
  <div class="center-box-wrapper">
    <h1>DashboardView.vue</h1>

    <div class="center-box">
      <RouterLink to="/tools/Taskmanager" class="grid-item">
        <button class="btn">TaskManager</button>
      </RouterLink>

      <RouterLink to="/tools/task-manager/project-detail" class="grid-item">
        <button class="btn">プロジェクト一覧/進行状況</button>
      </RouterLink>

      <RouterLink to="/tools/task-manager/schedule-calendar.vue" class="grid-item">
        <button class="btn">カレンダー</button>
      </RouterLink>

      <RouterLink to="/tools/task-manager/create-new-project" class="grid-item">
        <button class="btn">新規プロジェクト作成ボタン</button>
      </RouterLink>

      <RouterLink to="/tools/task-manager/project-archive" class="grid-item">
        <button class="btn">プロジェクト履歴</button>
      </RouterLink>

      <RouterLink to="/tools/some-other-tool" class="grid-item">
        <button class="btn">その他ツール（仮）</button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
// 今はまだ何もなし
</script>

<style scoped>
.center-box-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center; /* h1とcenter-boxを中央寄せ */
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.center-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3列 */
  grid-template-rows: repeat(2, auto); /* 2行。コンテンツの高さに合わせて自動調整 */
  gap: 20px; /* グリッドアイテム間の間隔を調整 */
  max-width: 900px; /* グリッド全体の最大幅を設定（任意） */
  width: 100%; /* 親要素の幅いっぱいに広げる */
}

.grid-item {
  display: flex; /* ボタンをRouterLink内で中央寄せするためにflexboxを使用 */
  justify-content: center;
  align-items: center;
  text-decoration: none; /* RouterLinkのデフォルトの下線を消す */
  color: inherit; /* RouterLinkのデフォルトの文字色を継承 */
}

.btn {
  width: 100%; /* 親のグリッドアイテムの幅いっぱいに広げる */
  height: 100%; /* 親のグリッドアイテムの高さいっぱいに広げる */
  background-color: #d0dfff;
  padding: 20px;
  text-align: center;
  font-size: 18px; /* フォントサイズを少し調整 */
  border: 1px solid #aaa;
  border-radius: 8px; /* 角を丸くする（任意） */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* 影を追加 */
  cursor: pointer;
  display: flex; /* ボタンのテキストを中央寄せするため */
  justify-content: center;
  align-items: center;
  white-space: normal; /* テキストが折り返すように */
  word-break: break-word; /* 長い単語も改行 */
  transition: background-color 0.3s ease, transform 0.3s ease; /* ホバー時のアニメーション */
}

.btn:hover {
  background: #c7d8fc;/* ホバー時の色 */
  transform: translateY(-3px); /* 少し上に浮き上がる効果 */
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2); /* 影を強調 */
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .center-box {
    grid-template-columns: repeat(2, 1fr); /* 2列にする */
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .center-box {
    grid-template-columns: 1fr; /* 1列にする */
    gap: 10px;
  }
  .btn {
    font-size: 16px;
    padding: 15px;
  }
}
</style>