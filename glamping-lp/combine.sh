#!/bin/bash

# 出力ファイル
output_file="index_complete.html"

# テンプレートファイルを作成
cat > template.html << 'EOL'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>glamping base YOLO - 星空とジャングルで、ととのう休暇を。</title>
    <meta name="description" content="沖縄北部、今帰仁村の自然に囲まれたグランピング施設。ファンシーで快適なテントでの宿泊、BBQ、プール、サウナを楽しめます。">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        turquoise: '#1EC2C8',
                        sunset: '#FF9B6A',
                    }
                }
            }
        }
    </script>
    
    <!-- カスタムCSS -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-white text-gray-800">
EOL

# テンプレートをoutput_fileにコピー
cp template.html $output_file

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

# 一時ファイルを削除
rm template.html

echo "HTMLファイルの結合が完了しました。"
