#!/bin/bash

# glamping-lpディレクトリからルートディレクトリにファイルを移動
echo "ファイルをglamping-lpからリポジトリルートに移動しています..."

# 必要なディレクトリを作成
mkdir -p css js images

# HTMLファイルを移動
cp -v glamping-lp/*.html ./
# CSSファイルを移動
cp -rv glamping-lp/css/* ./css/
# JSファイルを移動
cp -rv glamping-lp/js/* ./js/
# 画像ファイルを移動
cp -rv glamping-lp/images/* ./images/
# その他の必要なファイルを移動
cp -v glamping-lp/_redirects ./ 2>/dev/null || echo "_redirectsファイルはスキップされました"
cp -v glamping-lp/404.html ./ 2>/dev/null || echo "404.htmlファイルはスキップされました"

echo "ファイルの移動が完了しました。"
