<template>
    <div>
        <main>
        <h1>アプリ開発における一般的な内容と工期</h1>
        <table>
            <caption></caption>
   
                <thead>
                    <tr>
                        <th></th>
                        <td>規模</td>
                        <td>種類</td>
                        <td>工期</td>
                    </tr>  
               </thead>
                 <tbody>
                    <tr>
                        <th>小規模アプリ開発</th>
                        <td>個人利用・表示や情報入力が中心</td>
                        <td>例:電卓アプリ・イベント告知・情報表示アプリ</td>
                        <td>3ヶ月程度</td>
                    </tr>  

                    <tr>
                        <th>中規模アプリ開発</th>
                        <td>小ビジネス利用・データベースを利用したユーザー管理、認証機能、決済機能、外部API連携などが含まれるアプリ</td>
                        <td>例:予約システムアプリ・社内業務効率化アプリ・ECサイト向けモバイルアプリ</td>
                        <td>6ヶ月程度</td>
                    </tr>  

                    <tr>
                        <th>大規模アプリ開発</th>
                        <td>ビジネス利用・大量データ処理、AI/機械学習連携、リアルタイム処理</td>
                        <td>例:SNSアプリ・マッチングアプリ・大規模な企業向け基幹業務アプリ</td>
                        <td>9ヶ月〜</td>
                    </tr>  

                    </tbody>

                    <tfoot>
                        <tr>
                        </tr>  
                    </tfoot>   
     
    </table>
</main>
    </div>

  </template>
  
  <script setup>
  // 今はまだ何もなし
  </script>

  <style>

body {
    font-family: sans-serif;
    margin: 20px;
    background-color: #f8f8f8; /* 明るい背景色 */
}
h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

table{
    width: 80%; /* テーブルの幅を調整 */
    margin: 0 auto; /* 中央揃え */
    border-collapse: collapse; /* ボーダーの結合 */
    border: 1px solid #000000; /* テーブル全体のボーダー */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 影をつけて立体感を出す */
    overflow: hidden; /* 角丸を反映させるために必要 */
}

th,
td {
 
    padding: 0.8rem 1.2rem; /* パディングを調整して見やすく */
    line-height: 1.6; /* 行の高さを調整して読みやすく */
}



/* 奇数行の背景色（ゼブラストライプ） */
tbody tr:nth-child(odd) {
    background-color: #f9f9f9; /* 明るいグレー */
}

/* 偶数行の背景色（ゼブラストライプ） */
tbody tr:nth-child(even) {
    background-color: #ffffff; /* 白 */
}

/* ホバー時のスタイル（任意） */
tbody tr:hover {
    background-color: #e0f2f7; /* ホバーで少し明るい青 */
    cursor: pointer;
}

thead th {
    border: 1px solid #000000; /* セルのボーダーを薄い灰色に */
    color: #333;

}

thead td {
    border: 1px solid #000000; /* セルのボーダーを薄い灰色に */
    color: #333;

}

/* 最初の列の<th>（例：小規模アプリ開発、中規模アプリ開発、大規模アプリ開発）のスタイル */
    tbody th {
    border: 1px solid #000000; /* セルのボーダーを薄い灰色に */
    color: #333;
    font-weight: bold;
    text-align: left; /* 左寄せ */
    width: 15%; /* 適切な幅を設定（例: 15%）*/
    min-width: 150px;
    white-space: nowrap; /* テキストの折り返しを防ぐ（必要であれば） */
}

tbody td {
    border: 1px solid #000000; /* セルのボーダーを薄い灰色に */
    color: #333;

}
  
  

  </style>
