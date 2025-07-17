module.exports = function(eleventyConfig) {
  // パススルーファイルコピー
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("thanks.html");
  eleventyConfig.addPassthroughCopy("contact-thanks.html");

  // データの変更を監視
  eleventyConfig.addWatchTarget("./_data/");
  
  // 1) news コレクションを追加（_data/news/*.md を対象）
  eleventyConfig.addCollection("news", function(collection) {
    const fs = require('fs');
    const path = require('path');
    const newsDir = './_data/news';
    
    // ファイルシステムから直接ファイルを取得
    const files = fs.readdirSync(newsDir)
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        inputPath: path.join(newsDir, file),
        fileSlug: path.basename(file, '.md')
      }));
    
    return files;
  });

  // 2) Markdown と生成した JSON を公開ディレクトリへコピー
  eleventyConfig.addPassthroughCopy({ "_data/news": "data/news" });
  
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
