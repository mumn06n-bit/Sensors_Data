import dotenv from 'dotenv';
// .env ファイルから環境変数をロード
dotenv.config();

const API_URL = process.env.BUOY_API_URL;

async function testApi() {
  console.log("=== API 接続テスト開始 ===");
  
  if (!API_URL) {
    console.error("エラー: BUOY_API_URL が設定されていません。");
    console.error(".env ファイルに BUOY_API_URL が正しく定義されているか確認してください。");
    return;
  }

  console.log(`接続先 URL: ${API_URL}`);

  try {
    const startTime = Date.now();
    const response = await fetch(API_URL, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'api_test_script/1.0',
      },
    });
    const duration = Date.now() - startTime;

    console.log(`ステータスコード: ${response.status} ${response.statusText}`);
    console.log(`応答時間: ${duration}ms`);

    if (response.ok) {
      const data = await response.text();
      console.log("=== レスポンスデータ (最初の500文字) ===");
      console.log(data.slice(0, 500));
      console.log("======================================");
      console.log("テスト結果: 成功 (APIからデータを正常に取得できました。)");
    } else {
      const errorText = await response.text();
      console.error("エラーレスポンス内容:");
      console.error(errorText.slice(0, 500));
      console.log("テスト結果: 失敗 (ステータスコードが 2xx 以外です。)");
    }
  } catch (error) {
    console.error("通信中にエラーが発生しました:", error);
    console.log("テスト結果: 失敗 (ネットワーク接続エラー、または無効なURLです。)");
  }
}

testApi();
