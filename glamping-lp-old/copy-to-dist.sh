#!/bin/bash

# dist ディレクトリをクリア
rm -rf dist/*

# 必要なすべてのファイルを dist にコピー
cp -R *.html *.css *.js images css js dist/

# _redirects と netlify.toml ファイルをコピー
cp _redirects netlify.toml dist/

# 正常終了を表示
echo "ファイルを dist ディレクトリにコピーしました。"
ls -la dist/
