module.exports = function(eleventyConfig) {
  // パススルーファイルの設定（コピーするだけのファイル）
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("functions");
  
  // データディレクトリの設定
  eleventyConfig.setDataDeepMerge(true);
  
  // カスタムフィルターの追加
  // sliceフィルターを追加
  eleventyConfig.addFilter("slice", function(array, start, end) {
    if (!Array.isArray(array)) return [];
    return array.slice(start, end);
  });
  
  // slugフィルターを追加
  eleventyConfig.addFilter("slug", function(str) {
    if (!str) return "";
    return str
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  });
  
  return {
    dir: {
      input: ".",      // ソースディレクトリ
      output: "_site", // 出力ディレクトリ
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
