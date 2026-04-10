<script setup>
import { useDarkModeStore } from '../../stores/darkModeStore'

const darkModeStore = useDarkModeStore()
//import { inject } from 'vue'
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

</script>

<template>
     <nav class="custom-navbar">
      <div class="custom-container-fluid">
       
      <!-- ナビメニュー -->
      <div class="custom-navbar-collapse" :class="{ active: isMenuOpen }">
  <ul class="custom-navbar-nav">
    <li class="custom-nav-item"><router-link class="custom-nav-link" to="/WorksList">命名ツール</router-link></li>
    <li class="custom-nav-item"><router-link class="custom-nav-link" to="/template">テンプレート</router-link></li>
    <li class="custom-nav-item"><router-link class="custom-nav-link" to="/tools/task-manager/create-new-project">CreateNewProject</router-link></li>
    <li class="custom-nav-item">
  <router-link class="custom-nav-link" :to="{ name: 'TaskManager' }">
    TaskManager
  </router-link>
</li>
    <li class="custom-nav-item">
    </li>
  </ul>
</div>
<button class="custom-navbar-toggler" type="button" @click="toggleMenu">
  <span class="custom-navbar-toggler-icon"></span>
</button>




    </div>
    </nav>
  </template>
  
  <style scoped>
  nav {
    background-color: #333;
    padding: 0.5rem;
  }
  ul {
    list-style: none;
    display: flex;
    gap: 1rem;
  }
  li {
    color: white;
  }
  a {
    color: white;
    text-decoration: none;
  }

  /* ブランド名 */
.custom-navbar-brand {
    padding-top: 0.3125rem;
    padding-bottom: 0.3125rem;
    margin-right: 1rem;
    font-size: 1.25rem; /* Bootstrapのデフォルト */
    color: #fff; /* 白い文字色 */
    white-space: nowrap; /* テキストの折り返しを防ぐ */
    text-decoration: none; /* リンクの下線をなくす */
}

/* ハンバーガーメニューボタン */
.custom-navbar-toggler {
    padding: 0.25rem 0.75rem;
    font-size: 1.25rem;
    line-height: 1;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1); /* 白っぽいボーダー */
    border-radius: 0.25rem;
    cursor: pointer;
    display: none; /* 初期状態では非表示（メディアクエリで表示） */
}

/* ハンバーガーアイコン自体 */
.custom-navbar-toggler-icon {
    display: inline-block;
    width: 1.5em; /* Bootstrapのデフォルト */
    height: 1.5em; /* Bootstrapのデフォルト */
    vertical-align: middle;
    /* 白いハンバーガーアイコンのSVGデータ */
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
}

/* ナビゲーションメニューの折りたたみ部分 */
.custom-navbar-collapse {
    /* デフォルトで展開状態（lg以上） */
    display: flex; /* これがナビバーが表示されている状態 */
    flex-basis: auto;
    flex-grow: 1; /* 残りのスペースを埋める */
    align-items: center;
}

/* ナビゲーションリンクのリスト (ms-auto相当) */
.custom-navbar-nav {
    display: flex; /* 横並び */
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    margin-left: auto; /* ms-auto を再現 */
}


/* ナビゲーションリンク */
.custom-nav-link {
    display: block; /* クリック可能領域を広げる */
    padding: 0.5rem 1rem; /* 上下左右のパディング */
    color: rgba(255, 255, 255, 0.55); /* 通常のリンク色 */
    text-decoration: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
}

.custom-nav-link:hover {
    color: rgba(255, 255, 255, 0.75); /* ホバー時の色 */
}

.custom-nav-link.active {
    color: #fff; /* active時の色 */
    font-weight: bold;
}

.custom-nav-link[aria-disabled="true"] { /* disabledリンク */
    color: rgba(255, 255, 255, 0.25);
    pointer-events: none;
    cursor: default;
}


/* ======================================================= */
/* ここからが「navbar-expand-lg」のブレークポイントのロジックです */
/* ======================================================= */

/* lg (992px) 未満の画面でのスタイル */
@media (max-width: 991.98px) {
    .custom-navbar-toggler {
        display: block; /* lg未満でハンバーガーボタンを表示 */
    }

    /* メニューの折りたたみ部分全体のスタイル調整 */
    .custom-navbar-collapse {
        /* ★★★ここが重要：ブロック要素として表示し、高さをアニメーションで制御★★★ */
        display: block; /* メニュー全体をブロック要素として次の行に配置 */
        flex-basis: 100%; /* 親が flex-wrap: wrap; の場合、これで次の行の全幅を占める */
        flex-grow: 1;
        
        max-height: 0; /* 初期状態でメニューを隠す（アニメーション用） */
        overflow: hidden; /* 高さが0のときに内容を隠す */
        transition: max-height 0.35s ease-in-out; /* スムーズな展開アニメーション */
        
        border-top: 1px solid rgba(255, 255, 255, 0.15); /* 上部に線を追加 */
        padding-top: 0.5rem; /* 展開時の上パディング */
        margin-top: 0.5rem; /* 上の要素との間隔 */
        width: 100%; /* フル幅に展開 */
    }

    /* JavaScriptで追加される active クラスでメニューを展開 */
    .custom-navbar-collapse.active {
        /* メニューのコンテンツ量に合わせて調整。十分な高さを確保する。 */
        max-height: 300px; /* ここはあなたのメニュー項目数に合わせて調整してください */
    }

    /* ナビゲーションリンクのリストを縦並びにする */
    .custom-navbar-nav {
        /* ★★★ここが重要：縦並びにするためのFlexbox設定★★★ */
        display: flex; 
        flex-direction: column; /* 縦並び */
        margin-left: 0 !important; /* ms-auto をリセットして左寄せ */
        padding-left: 0; /* リストのデフォルトパディングを削除 */
        width: 100%; /* 親の幅いっぱいに広げる */
    }

    /* ナビゲーションアイテムとリンクの調整 */
    .custom-nav-item {
        width: 100%; /* 各アイテムが全幅を占める */
        text-align: left; /* 左揃え */
        padding: 0; /* アイテム自体のパディングをリセット */
    }

    .custom-nav-link {
        padding: 0.5rem 1rem; /* リンク自体のパディング */
        border-bottom: 1px solid rgba(255, 255, 255, 0.08); /* 各リンクの下に区切り線 */
    }
    /* 最後のリンクのボーダーを削除 */
    .custom-nav-item:last-child .custom-nav-link {
        border-bottom: none;
    }
}

/* lg (992px) 以上の画面でのスタイル */
@media (min-width: 992px) {
    .custom-navbar-toggler {
        display: none; /* lg以上でハンバーガーボタンを非表示に */
    }

    .custom-navbar-collapse {
        display: flex !important; /* lg以上でメニューを展開して表示 */
        flex-basis: auto;
        flex-grow: 1;
        align-items: center;
        max-height: none; /* モバイル用のmax-heightを解除 */
        overflow: visible; /* モバイル用のoverflowを解除 */
        border-top: none; /* モバイル用の線を除去 */
        padding-top: 0;
        margin-top: 0;
    }

    .custom-navbar-nav {
        flex-direction: row; /* 横並びに戻す */
        margin-left: auto !important; /* ms-auto を維持 */
    }

    .custom-nav-item {
        padding: 0; 
    }

    .custom-nav-link {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        border-bottom: none; /* デスクトップではリンクのボーダーは不要 */
    }
}
  </style>
  