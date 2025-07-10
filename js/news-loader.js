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
        
        // データファイルのパスを取得
        const newsFiles = [
            '/_data/news/20250514-line.yml',
            '/_data/news/20250513-crowdfunding.yml',
            '/_data/news/20250501-holiday.yml'
        ];
        
        // 各ファイルのデータを取得
        const newsPromises = newsFiles.map(async filePath => {
            try {
                const fileResponse = await fetch(filePath);
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
                const dateA = a.date.split('.').join('-');
                const dateB = b.date.split('.').join('-');
                return new Date(dateB) - new Date(dateA);
            });
        
        // 公開状態がオンのもののみ表示
        newsItems = newsItems.filter(item => item.published !== false);
        
        // HTMLを生成
        if (newsItems.length > 0) {
            newsContainer.innerHTML = '';
            newsItems.forEach(item => {
                const newsElement = document.createElement('div');
                newsElement.className = 'border-b border-gray-200 pb-6';
                newsElement.innerHTML = `
                    <div class="flex items-center mb-2">
                        <span class="text-turquoise font-semibold mr-4">${item.date}</span>
                        <h3 class="text-xl font-semibold">${item.title}</h3>
                    </div>
                    <div class="text-gray-600 news-content">${item.content}</div>
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

// YAMLデータをパースする関数
function parseYaml(yamlText, filePath) {
    try {
        const lines = yamlText.split('\n');
        const data = {};
        
        // ファイル名からIDを抽出
        const filename = filePath.split('/').pop();
        data.id = filename.replace('.yml', '');
        
        // 各行を解析
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
        
        // published が文字列の場合は変換
        if (data.published === 'true') data.published = true;
        if (data.published === 'false') data.published = false;
        
        return data;
    } catch (e) {
        console.error('Error parsing YAML:', e);
        return null;
    }
}
