const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

module.exports = function() {
  // ニュース記事のディレクトリパス
  const newsDir = path.join(__dirname, 'news');
  
  // index.jsonファイルを読み込む
  let newsFiles = [];
  try {
    const indexPath = path.join(newsDir, 'index.json');
    if (fs.existsSync(indexPath)) {
      const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      if (Array.isArray(indexData.files)) {
        newsFiles = indexData.files;
      }
    }
  } catch (e) {
    console.error('Error reading index.json:', e);
  }
  
  // ファイルが見つからない場合は直接ディレクトリを読む
  if (newsFiles.length === 0 && fs.existsSync(newsDir)) {
    try {
      newsFiles = fs.readdirSync(newsDir)
        .filter(file => file.endsWith('.md') && file !== 'index.md');
    } catch (e) {
      console.error('Error reading news directory:', e);
    }
  }
  
  // 各ファイルのデータを解析
  const articles = newsFiles.map(filename => {
    try {
      const filePath = path.join(newsDir, filename);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      // IDを生成（ファイル名から拡張子を除去）
      const id = filename.replace(/\.md$/, '');
      
      // Markdownをパース
      const parsedContent = marked.parse(content);
      
      // バックスラッシュを削除
      const cleanContent = parsedContent
        .replace(/\\\\/g, '')
        .replace(/\\/g, '');
      
      return {
        id,
        title: data.title || id,
        date: data.date || new Date().toISOString().split('T')[0],
        content: cleanContent,
        published: data.published !== false // デフォルトはtrue
      };
    } catch (e) {
      console.error(`Error processing file ${filename}:`, e);
      return null;
    }
  }).filter(article => article && article.published);
  
  // 日付でソート（降順）
  return articles.sort((a, b) => {
    const dateA = new Date(a.date.replace(/\./g, '-'));
    const dateB = new Date(b.date.replace(/\./g, '-'));
    return dateB - dateA;
  });
};
