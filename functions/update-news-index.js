// Netlify Function to update news index.json when news articles are added or removed
const { Octokit } = require("@octokit/rest");
const crypto = require("crypto");

exports.handler = async (event, context) => {
  try {
    // リクエストがPOSTでない場合は終了
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // GitHub Webhookからの署名を検証
    const signature = event.headers["x-hub-signature-256"];
    if (!signature) {
      console.log("No signature found");
      return { statusCode: 401, body: "Unauthorized" };
    }

    // GitHubからのペイロードを解析
    const payload = JSON.parse(event.body);
    const { repository, ref } = payload;

    // mainブランチへのプッシュイベントのみ処理
    if (ref !== "refs/heads/main") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Not a push to main branch" }),
      };
    }

    // GitHubリポジトリ情報
    const owner = repository.owner.name || repository.owner.login;
    const repo = repository.name;

    // GitHub APIクライアントを初期化
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // _data/newsディレクトリの内容を取得
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: "_data/news",
    });

    // Markdownファイルのみをフィルタリング
    const newsFiles = contents
      .filter(item => item.type === "file" && item.name.endsWith(".md"))
      .map(item => item.name);

    // index.jsonファイルの内容を取得
    const { data: indexFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: "_data/news/index.json",
    });

    // Base64でエンコードされたコンテンツをデコード
    const content = Buffer.from(indexFile.content, "base64").toString();
    const indexData = JSON.parse(content);
    
    // 新しいファイルリストで更新
    indexData.files = newsFiles;
    
    // 更新したindex.jsonをコミット
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: "_data/news/index.json",
      message: "自動更新: news/index.json",
      content: Buffer.from(JSON.stringify(indexData, null, 2)).toString("base64"),
      sha: indexFile.sha,
      branch: "main",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "News index updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating news index:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating news index", error: error.message }),
    };
  }
};
