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
        
        // ニュースファイルのリストを直接指定
        // ディレクトリ一覧の取得はセキュリティ上の制限があるため、既知のファイルを指定
        const newsFiles = [
            '/_data/news/20250710-テスト.md'
        ];
        
        console.log('読み込むニュースファイル:', newsFiles);
        
        // 各ファイルのデータを取得
        const newsPromises = newsFiles.map(async filePath => {
            try {
                // キャッシュバスト用のクエリパラメータを追加
                const url = `${filePath}${cacheBuster}`;
                console.log(`ファイルを読み込み中: ${url}`);
                
                const response = await fetch(url);
                if (!response.ok) {
                    console.error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
                    return null;
                }
                
                const text = await response.text();
                console.log(`ファイル内容: ${text.substring(0, 100)}...`);
                
                const data = parseYaml(text, filePath);
                console.log('パース結果:', data);
                return data;
            } catch (e) {
                console.error(`Error loading news file ${filePath}:`, e);
                return null;
            }
        });
        
        // ニュースデータを取得して表示
        const newsData = await Promise.all(newsPromises);
        console.log('取得したニュースデータ:', newsData);
        
        // 有効なデータのみをフィルタリング
        const validNewsData = newsData
            .filter(item => {
                if (item === null) {
                    console.log('無効なデータ: null');
                    return false;
                }
                if (!item.date) console.log(`日付なし: ${item.id}`);
                if (!item.title) console.log(`タイトルなし: ${item.id}`);
                return item.date && item.title; // 日付とタイトルがあるもののみ
            })
            .sort((a, b) => {
                // 日付で降順にソート
                const dateA = new Date(a.date.replace(/\./g, '-'));
                const dateB = new Date(b.date.replace(/\./g, '-'));
                return dateB - dateA;
            });
        
        console.log('有効なニュースデータ:', validNewsData);
        
        // ニュースコンテナをクリア
        newsContainer.innerHTML = '';
        
        // テスト記事を強制的に表示
        if (validNewsData.length === 0) {
            // テスト記事を手動で追加
            const testArticle = {
                id: '20250710-テスト',
                title: 'テスト',
                date: '2025.07.10',
                content: 'テストのお知らせです。\n公式サイトを公開しました！',
                published: true
            };
            
            console.log('データがないため、テスト記事を追加:', testArticle);
            validNewsData.push(testArticle);
        }
        
        // モーダル要素を作成
        let modalOverlay = document.getElementById('news-modal-overlay');
        
        // 既存のモーダルがあれば削除
        if (modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
        
        // 新しいモーダルを作成
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'news-modal-overlay';
        modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden';
        modalOverlay.style.display = 'none';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.justifyContent = 'center';
        
        const modalContent = document.createElement('div');
        modalContent.id = 'news-modal-content';
        modalContent.className = 'bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative';
        modalContent.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 id="modal-title" class="text-xl font-bold"></h3>
                <button id="modal-close" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="mb-2">
                <span id="modal-date" class="text-sm text-turquoise font-semibold"></span>
            </div>
            <div id="modal-content" class="text-gray-700 whitespace-pre-line"></div>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // モーダルの表示・非表示関数
        function showModal(title, date, content) {
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-date').textContent = date;
            
            // published: trueを除去して表示
            let contentText = content || '';
            contentText = contentText.replace(/published:\s*true/g, '').trim();
            document.getElementById('modal-content').textContent = contentText;
            
            modalOverlay.style.display = 'flex';
        }
        
        function hideModal() {
            modalOverlay.style.display = 'none';
        }
        
        // モーダルの閉じるボタンのイベントリスナー
        document.getElementById('modal-close').addEventListener('click', hideModal);
        
        // モーダルの外側をクリックしたときに閉じる
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                hideModal();
            }
        });
        
        // HTMLを生成
        if (validNewsData.length > 0) {
            validNewsData.forEach(item => {
                // 記事の内容から最初の一文を取得
                // publishedの文字を除去して表示
                let contentText = item.content || '';
                contentText = contentText.replace(/published:\s*true/g, '').trim();
                const firstSentence = contentText ? contentText.split('\n')[0].substring(0, 100) : '';
                
                const newsElement = document.createElement('div');
                newsElement.className = 'border-b border-gray-200 py-4 cursor-pointer transition duration-300 relative';
                
                // ホバーエフェクトを強化
                newsElement.addEventListener('mouseenter', function() {
                    this.classList.add('bg-gray-50');
                    this.style.transform = 'translateX(5px)';
                    this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                });
                
                newsElement.addEventListener('mouseleave', function() {
                    this.classList.remove('bg-gray-50');
                    this.style.transform = 'translateX(0)';
                    this.style.boxShadow = 'none';
                });
                newsElement.innerHTML = `
                    <div class="flex items-start">
                        <span class="text-turquoise font-semibold mr-4 w-24 flex-shrink-0">${item.date}</span>
                        <div>
                            <h3 class="text-lg font-semibold mb-1">${item.title}</h3>
                            <p class="text-gray-600 text-sm line-clamp-1">${firstSentence}</p>
                        </div>
                    </div>
                `;
                
                // クリックイベントでモーダルを表示
                newsElement.addEventListener('click', function() {
                    showModal(item.title, item.date, item.content);
                });
                
                newsContainer.appendChild(newsElement);
            });
        } else {
            newsContainer.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500">お知らせはありません。</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading news data:', error);
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            newsContainer.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500">お知らせの読み込み中にエラーが発生しました。</p>
                </div>
            `;
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
