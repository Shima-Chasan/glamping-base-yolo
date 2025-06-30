#!/bin/bash

# 出力ファイル
output_file="index_complete.html"

# ヘッダー部分（既存のindex.htmlから<body>タグまで）
cat index.html | sed -n '1,/<body/p' > $output_file
echo '>' >> $output_file

# ナビゲーションとHeroセクションを追加
cat nav-section.html >> $output_file

# 各セクションファイルの内容を結合
cat about-section.html >> $output_file
cat services-section.html >> $output_file
cat rooms-section.html >> $output_file
cat booking-section.html >> $output_file
cat faq-section.html >> $output_file
cat access-footer-section.html >> $output_file

# JavaScriptの参照を追加
echo '    <script src="js/main.js"></script>' >> $output_file
echo '</body>' >> $output_file
echo '</html>' >> $output_file

# 元のindex.htmlを置き換え
mv $output_file index.html

echo "HTMLファイルの結合が完了しました。"
