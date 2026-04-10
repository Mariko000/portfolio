<template>
  <div>
    <h1>ProjectDetailsPage.vue</h1>
    <p>進行状況</p>
    <p>進行中のタスク/期日が近いタスクは色変更 or 通知表示</p>
    <p>ダッシュボードに「今週の進行率」＋残タスクカウント表示</p>

      <p>進捗中プロジェクト</p>
      <p>プロジェクト一覧の表示</p>
      <RouterLink to="/tools/task-manager/progress-project">ProgressProject.vueへ</RouterLink>
      <p>進捗バー</p>
      <p>プロジェクトを選んだら詳細ページへ遷移するリンク ProjectDetailsPage.vueへ</p>
      <RouterLink to="/tools/task-manager/project-detail-page">進捗中プロジェクト詳細へ</RouterLink>


      <RouterLink to="/tools/task-manager/project-archive">過去プロジェクトアーカイブ</RouterLink>

     




    <h3>参考資料まとめ</h3>
      <p>URLリスト保存</p>
      <p>スクショ添付</p>


  
  </div>
</template>

<script setup>
// 今はまだ何もなし
</script>
