// お知らせデータを読み込むスクリプト

// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', function() {
    // お知らせデータを読み込む
    loadNewsData();
});

// CMSのお知らせデータを読み込む関数
async function loadNewsData() {
    try {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer) return;
        
        // キャッシュバスト用のランダムクエリパラメータを生成
        const cacheBuster = `?_=${new Date().getTime()}`;
        
        // ニュースディレクトリの全ファイルを取得する関数
        async function getNewsFiles() {
            try {
                // まずはディレクトリのリストを取得する試み
                const response = await fetch(`/_data/news/${cacheBuster}`);
                const text = await response.text();
                
                // HTMLからファイル名を抽出
                const fileRegex = /href="([^"]+\.(md|yml))"/g;
                const files = [];
                let match;
                
                while ((match = fileRegex.exec(text)) !== null) {
                    if (match[1] !== 'index.json') {
                        files.push(`/_data/news/${match[1]}`);
                    }
                }
                
                return files;
            } catch (e) {
                console.error('Error getting news files:', e);
                // フォールバック: 既知のファイルを返す
                return [
                    '/_data/news/20250710-テスト.md'
                ];
            }
        }
        
        // ニュースファイルを取得
        const newsFiles = await getNewsFiles();
        
        // 各ファイルのデータを取得
        const newsPromises = newsFiles.map(async filePath => {
            try {
                const fileResponse = await fetch(`${filePath}${cacheBuster}`);
                if (!fileResponse.ok) return null;
                const yamlText = await fileResponse.text();
                return parseYaml(yamlText, filePath);
            } catch (e) {
                console.error('Error fetching news file:', filePath, e);
                return null;
            }
        });
        
        // 全てのデータを取得
        let newsItems = await Promise.all(newsPromises);
        
        // nullを除外し、日付でソート
        newsItems = newsItems
            .filter(item => item !== null)
            .sort((a, b) => {
                const dateA = a.date ? a.date.split('.').join('-') : '1900-01-01';
                const dateB = b.date ? b.date.split('.').join('-') : '1900-01-01';
                return new Date(dateB) - new Date(dateA);
            });
        
        // 公開状態がオンで、日付とタイトルがあるもののみ表示
        newsItems = newsItems.filter(item => {
            // 非公開の記事を除外
            if (item.published === false) return false;
            
            // 日付またはタイトルがない記事を除外
            if (!item.date || !item.title) return false;
            
            return true;
        });
        
        // HTMLを生成
        if (newsItems.length > 0) {
            newsContainer.innerHTML = '';
            newsItems.forEach(item => {
                const newsElement = document.createElement('div');
                newsElement.className = 'border-b border-gray-200 pb-6';
                newsElement.innerHTML = `
                    <div class="flex items-center mb-2">
                        <span class="text-turquoise font-semibold mr-4">${item.date || '日付なし'}</span>
                        <h3 class="text-xl font-semibold">${item.title || 'タイトルなし'}</h3>
                    </div>
                    <div class="text-gray-600 news-content">${item.content || ''}</div>
                `;
                newsContainer.appendChild(newsElement);
            });
        } else {
            newsContainer.innerHTML = '<p class="text-center py-4 text-gray-500">お知らせはありません</p>';
        }
    } catch (error) {
        console.error('Error loading news:', error);
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            newsContainer.innerHTML = '<p class="text-center py-4 text-gray-500">お知らせの読み込みに失敗しました</p>';
        }
    }
}

// YAMLまたはMarkdownデータをパースする関数
function parseYaml(text, filePath) {
    try {
        const data = {};
        
        // ファイル名からIDを抽出
        const filename = filePath.split('/').pop();
        data.id = filename.replace(/\.(yml|md)$/, '');
        
        // Markdown形式かどうかを確認
        const isMarkdown = filePath.endsWith('.md');
        
        // Markdown形式の場合はフロントマターを抽出
        if (isMarkdown) {
            // フロントマターを抽出する正規表現
            const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
            const match = text.match(frontMatterRegex);
            
            if (match && match[1]) {
                // フロントマターを解析
                const frontMatter = match[1];
                const lines = frontMatter.split('\n');
                
                let currentKey = null;
                let currentValue = '';
                let inMultilineValue = false;
                
                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    
                    // 空行はスキップ
                    if (!trimmedLine) return;
                    
                    // 複数行の値の開始または終了をチェック
                    if (trimmedLine === '|-' || trimmedLine === '|+' || trimmedLine === '|') {
                        inMultilineValue = true;
                        return;
                    }
                    
                    // キーと値のペアを探す
                    if (!inMultilineValue && trimmedLine.includes(':')) {
                        // 前のキーの処理を完了する
                        if (currentKey && currentValue) {
                            data[currentKey] = currentValue.trim();
                            currentValue = '';
                        }
                        
                        const colonIndex = trimmedLine.indexOf(':');
                        const key = trimmedLine.substring(0, colonIndex).trim();
                        const value = trimmedLine.substring(colonIndex + 1).trim();
                        
                        currentKey = key;
                        
                        // 値が空でない場合は保存
                        if (value && value !== '|-' && value !== '|+' && value !== '|') {
                            // 値が引用符で囲まれている場合は除去
                            data[currentKey] = value.replace(/^["'](.+)["']$/, '$1');
                            currentKey = null;
                            inMultilineValue = false;
                        } else {
                            inMultilineValue = true;
                        }
                    } else if (currentKey) {
                        // 複数行の値の場合は追加
                        currentValue += (currentValue ? '\n' : '') + trimmedLine;
                    }
                });
                
                // 最後のキーの処理
                if (currentKey && currentValue) {
                    data[currentKey] = currentValue.trim();
                }
            }
        } else {
            // YAML形式の場合の解析
            const lines = text.split('\n');
            let currentKey = null;
            let currentValue = '';
            
            lines.forEach(line => {
                const trimmedLine = line.trim();
                
                // 空行はスキップ
                if (!trimmedLine) return;
                
                // キーと値のペアを探す
                if (trimmedLine.includes(':')) {
                    // 前のキーの処理を完了する
                    if (currentKey && currentValue) {
                        data[currentKey] = currentValue.trim();
                        currentValue = '';
                    }
                    
                    const colonIndex = trimmedLine.indexOf(':');
                    const key = trimmedLine.substring(0, colonIndex).trim();
                    const value = trimmedLine.substring(colonIndex + 1).trim();
                    
                    currentKey = key;
                    
                    // 値が空でない場合は保存
                    if (value) {
                        // 値が引用符で囲まれている場合は除去
                        data[currentKey] = value.replace(/^["'](.+)["']$/, '$1');
                        currentKey = null;
                    }
                } else if (currentKey) {
                    // 複数行の値の場合は追加
                    currentValue += (currentValue ? '\n' : '') + trimmedLine;
                }
            });
            
            // 最後のキーの処理
            if (currentKey && currentValue) {
                data[currentKey] = currentValue.trim();
            }
        }
        
        // published が文字列の場合は変換
        if (data.published === 'true') data.published = true;
        if (data.published === 'false') data.published = false;
        
        return data;
    } catch (e) {
        console.error('Error parsing file:', e);
        return null;
    }
}
