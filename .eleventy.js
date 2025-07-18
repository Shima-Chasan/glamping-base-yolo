module.exports = function(eleventyConfig) {
  // パススルーファイルコピー
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("thanks.html");

  // データの変更を監視
  eleventyConfig.addWatchTarget("./_data/");
  
  // 1) news コレクションを追加（_data/news/*.md を対象）
  eleventyConfig.addCollection("news", function(collection) {
    const fs = require('fs');
    const path = require('path');
    const newsDir = './_data/news';
    
    // ディレクトリが存在するか確認
    try {
      // ディレクトリが存在しない場合は作成
      if (!fs.existsSync(newsDir)) {
        fs.mkdirSync(newsDir, { recursive: true });
        console.log(`Created directory: ${newsDir}`);
        return []; // ディレクトリが新しく作成された場合は空の配列を返す
      }
      
      // ファイルシステムから直接ファイルを取得
      const files = fs.readdirSync(newsDir)
        .filter(file => file.endsWith('.md'))
        .map(file => ({
          inputPath: path.join(newsDir, file),
          fileSlug: path.basename(file, '.md')
        }));
      
      return files;
    } catch (error) {
      console.error(`Error processing news directory: ${error.message}`);
      return []; // エラーが発生した場合は空の配列を返す
    }
  });

  // 2) Markdown と生成した JSON を公開ディレクトリへコピー
  const fs = require('fs');
  if (fs.existsSync('./_data/news')) {
    eleventyConfig.addPassthroughCopy({ "_data/news": "data/news" });
  } else {
    console.log('_data/news directory does not exist, skipping passthrough copy');
  }
  
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["html", "njk", "md", "liquid"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid"
  };
};
