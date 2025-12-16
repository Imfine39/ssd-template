/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // 循環依存を禁止
    {
      name: "no-circular",
      severity: "error",
      comment: "循環依存はメンテナンス性を著しく低下させます",
      from: {},
      to: {
        circular: true
      }
    },
    // 孤立ファイル（どこからも参照されていない）を警告
    {
      name: "no-orphans",
      severity: "warn",
      comment: "このファイルはどこからも参照されていません。不要なら削除を検討してください",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$", // 設定ファイル
          "\\.d\\.ts$",                             // 型定義ファイル
          "(^|/)index\\.(ts|js)$",                  // インデックスファイル
          "^src/main\\.(ts|tsx)$",                  // エントリーポイント
          "^src/App\\.(ts|tsx)$"                    // Appコンポーネント
        ]
      },
      to: {}
    },
    // 非推奨パッケージへの依存を禁止
    {
      name: "no-deprecated-npm",
      severity: "error",
      comment: "非推奨のnpmパッケージは使用しないでください",
      from: {},
      to: {
        dependencyTypes: ["deprecated"]
      }
    },
    // devDependencies を本番コードで使用することを禁止
    {
      name: "no-dev-deps-in-src",
      severity: "error",
      comment: "devDependencies は本番コードで使用できません",
      from: {
        path: "^src/"
      },
      to: {
        dependencyTypes: ["npm-dev"]
      }
    },
    // UI層（components）から直接データ層（db/api）へのアクセスを禁止
    {
      name: "no-ui-to-data-layer",
      severity: "error",
      comment: "UIコンポーネントはサービス/フック経由でデータにアクセスしてください",
      from: {
        path: "^src/components/"
      },
      to: {
        path: "^src/(db|api|repositories)/"
      }
    },
    // テストコードを本番コードでインポートすることを禁止
    {
      name: "no-test-in-src",
      severity: "error",
      comment: "テストコードを本番コードからインポートしないでください",
      from: {
        path: "^src/",
        pathNot: "\\.(test|spec)\\.(ts|tsx|js|jsx)$"
      },
      to: {
        path: "\\.(test|spec)\\.(ts|tsx|js|jsx)$"
      }
    }
  ],
  options: {
    doNotFollow: {
      path: "node_modules"
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json"
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"]
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/(@[^/]+/[^/]+|[^/]+)"
      },
      text: {
        highlightFocused: true
      }
    }
  }
};
