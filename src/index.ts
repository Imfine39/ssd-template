/**
 * SSD Template - Entry Point
 *
 * このファイルはテンプレートのエントリーポイントです。
 * 実際のプロジェクトでは、アプリケーションの初期化処理を記述します。
 */

export function main(): void {
  console.log("SSD Template initialized");
}

// アプリケーションが直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
