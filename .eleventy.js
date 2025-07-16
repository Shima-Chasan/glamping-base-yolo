module.exports = function(eleventyConfig) {
  // パススルーファイルコピー
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("admin");

  // データの変更を監視
  eleventyConfig.addWatchTarget("./_data/");
  
  // 1) news コレクションを追加（_data/news/*.md を対象）
  eleventyConfig.addCollection("news", (coll) =>
    coll.getFilteredByGlob("./_data/news/*.md")
        .sort((a, b) => b.date - a.date)   // 日付降順
  );

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
