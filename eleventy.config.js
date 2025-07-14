module.exports = (eleventyConfig) => {
  // 既存ファイルのパススルーコピー
  eleventyConfig.addPassthroughCopy({ "./images": "images" });
  eleventyConfig.addPassthroughCopy("./*.html"); // 既存 HTML をそのままコピー
  eleventyConfig.addPassthroughCopy("./css");
  eleventyConfig.addPassthroughCopy("./js");
  eleventyConfig.addPassthroughCopy("./admin");

  // ニュース記事のコレクション設定
  eleventyConfig.addCollection("news", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./news/_posts/*.md");
  });

  // 日付フォーマットフィルター
  eleventyConfig.addFilter("date", function(date, format) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('ja-JP', options).replace(/\//g, '.');
  });

  // 文字列切り詰めフィルター
  eleventyConfig.addFilter("truncate", function(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  });

  // 設定を返す
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
