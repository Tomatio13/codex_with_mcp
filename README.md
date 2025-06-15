<h1 align="center">OpenAI Codex CLI</h1>
<p align="center">ターミナルで動作する軽量なコーディングエージェント</p>

<p align="center"><code>npm i -g @openai/codex</code></p>

![Codex demo GIF using: codex "explain this codebase to me"](./.github/demo.gif)

---

<details>
<summary><strong>目次</strong></summary>

<!-- Begin ToC -->

- [実験的技術に関する免責事項](#実験的技術に関する免責事項)
- [クイックスタート](#クイックスタート)
- [なぜCodex？](#なぜcodex)
- [セキュリティモデルと権限](#セキュリティモデルと権限)
  - [プラットフォームサンドボックスの詳細](#プラットフォームサンドボックスの詳細)
- [システム要件](#システム要件)
- [CLIリファレンス](#cliリファレンス)
- [メモリとプロジェクトドキュメント](#メモリとプロジェクトドキュメント)
- [非対話/CIモード](#非対話ciモード)
- [トレース/詳細ログ](#トレース詳細ログ)
- [レシピ](#レシピ)
- [インストール](#インストール)
- [MCP（Model Control Protocol）統合](#mcpmodel-control-protocol統合)
  - [MCPとは？](#mcpとは)
  - [MCPサーバー設定](#mcpサーバー設定)
  - [利用可能なMCPサーバー](#利用可能なmcpサーバー)
  - [MCP状態監視](#mcp状態監視)
- [設定ガイド](#設定ガイド)
  - [基本設定パラメータ](#基本設定パラメータ)
  - [カスタムAIプロバイダー設定](#カスタムaiプロバイダー設定)
  - [履歴設定](#履歴設定)
  - [設定例](#設定例)
  - [完全設定例](#完全設定例)
  - [カスタム指示](#カスタム指示)
  - [環境変数の設定](#環境変数の設定)
- [カスタムコマンド](#カスタムコマンド)
  - [カスタムコマンドとは](#カスタムコマンドとは)
  - [カスタムコマンドの作成](#カスタムコマンドの作成)
    - [1. ディレクトリ作成](#1-ディレクトリ作成)
    - [2. 基本的なコマンド作成](#2-基本的なコマンド作成)
    - [3. 階層構造でのコマンド作成](#3-階層構造でのコマンド作成)
  - [使用例](#使用例)
  - [引数対応コマンド](#引数対応コマンド)
    - [コマンド作成例](#コマンド作成例)
    - [使用方法](#使用方法)
  - [実用的なカスタムコマンド例](#実用的なカスタムコマンド例)
    - [コードベース分析コマンド](#コードベース分析コマンド)
    - [パフォーマンス最適化コマンド](#パフォーマンス最適化コマンド)
  - [ヒントとベストプラクティス](#ヒントとベストプラクティス)
- [FAQ](#faq)
- [ゼロデータ保持（ZDR）の使用](#ゼロデータ保持zdrの使用)
- [Codexオープンソースファンド](#codexオープンソースファンド)
- [貢献](#貢献)
  - [開発ワークフロー](#開発ワークフロー)
  - [Huskyを使用したGitフック](#huskyを使用したgitフック)
  - [デバッグ](#デバッグ)
  - [高インパクトなコード変更の作成](#高インパクトなコード変更の作成)
  - [プルリクエストの作成](#プルリクエストの作成)
  - [レビュープロセス](#レビュープロセス)
  - [コミュニティの価値観](#コミュニティの価値観)
  - [ヘルプの取得](#ヘルプの取得)
  - [貢献者ライセンス契約（CLA）](#貢献者ライセンス契約cla)
    - [クイックフィックス](#クイックフィックス)
  - [Codexのリリース](#codexのリリース)
  - [代替ビルドオプション](#代替ビルドオプション)
    - [Nix flake開発](#nix-flake開発)
- [セキュリティと責任あるAI](#セキュリティと責任あるai)
- [ライセンス](#ライセンス)

<!-- End ToC -->

</details>

---

## 実験的技術に関する免責事項

Codex CLIは活発に開発中の実験的プロジェクトです。まだ安定していないため、バグ、未完成の機能、または破壊的な変更が含まれる可能性があります。私たちはコミュニティと一緒にオープンに開発しており、以下を歓迎します：

- バグレポート
- 機能リクエスト
- プルリクエスト
- 良い雰囲気

課題を報告したりPRを提出したりして、改善にご協力ください（貢献方法については以下のセクションをご覧ください）！

## クイックスタート

グローバルインストール：

```shell
npm install -g @openai/codex
```

次に、OpenAI APIキーを環境変数として設定します：

```shell
export OPENAI_API_KEY="your-api-key-here"
```

> **注意：** このコマンドは現在のターミナルセッションでのみキーを設定します。シェルの設定ファイル（例：`~/.zshrc`）に`export`行を追加できますが、セッション用に設定することを推奨します。**ヒント：** プロジェクトのルートに`.env`ファイルを作成してAPIキーを配置することもできます：
>
> ```env
> OPENAI_API_KEY=your-api-key-here
> ```
>
> CLIは`.env`から変数を自動的に読み込みます（`dotenv/config`経由）。

<details>
<summary><strong><code>--provider</code>を使用して他のモデルを使用</strong></summary>

> Codexでは、OpenAI Chat Completions APIをサポートする他のプロバイダーを使用することもできます。プロバイダーは設定ファイルで設定するか、`--provider`フラグを使用できます。`--provider`の可能なオプションは：
>
> - openai (デフォルト)
> - openrouter
> - azure
> - gemini
> - ollama
> - mistral
> - deepseek
> - xai
> - groq
> - arceeai
> - OpenAI APIと互換性のある他のプロバイダー
>
> OpenAI以外のプロバイダーを使用する場合、設定ファイルまたは環境変数でプロバイダーのAPIキーを設定する必要があります：
>
> ```shell
> export <provider>_API_KEY="your-api-key-here"
> ```
>
> 上記にリストされていないプロバイダーを使用する場合、プロバイダーのベースURLも設定する必要があります：
>
> ```shell
> export <provider>_BASE_URL="https://your-provider-api-base-url"
> ```

</details>
<br />

対話モードで実行：

```shell
codex
```

または、プロンプトを入力として実行（オプションで`Full Auto`モードで）：

```shell
codex "このコードベースを説明してください"
```

```shell
codex --approval-mode full-auto "最高にファンシーなtodo-listアプリを作成"
```

これだけです - Codexはファイルをスキャフォールドし、サンドボックス内で実行し、不足している依存関係をインストールし、ライブ結果を表示します。変更を承認すると、作業ディレクトリにコミットされます。

---

## なぜCodex？

Codex CLIは、すでに**ターミナルで生活している**開発者向けに構築されており、ChatGPTレベルの推論**と**実際にコードを実行し、ファイルを操作し、反復する力を求めています - すべてバージョン管理下で。簡単に言うと、リポジトリを理解し実行する*チャット駆動開発*です。

- **ゼロ設定** - OpenAI APIキーを持参するだけで動作します！
- **完全自動承認、安全でセキュア** - ネットワークを無効化し、ディレクトリをサンドボックス化して実行
- **マルチモーダル** - スクリーンショットや図を渡して機能を実装 ✨

そして**完全オープンソース**なので、どのように開発されているかを見て貢献できます！

---

## セキュリティモデルと権限

Codexでは、`--approval-mode`フラグ（または対話式オンボーディングプロンプト）を使用して、エージェントが受け取る*自律性の程度*と自動承認ポリシーを決定できます：

| モード                       | エージェントが許可なしに実行できること                                                                          | まだ承認が必要なもの                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Suggest** <br>(デフォルト) | <li>リポジトリ内の任意のファイルを読み取り                                                                      | <li>**すべての**ファイル書き込み/パッチ<li> **すべての**任意のシェルコマンド（ファイル読み取り以外） |
| **Auto Edit**                | <li>ファイルの読み取り**および**パッチ適用書き込み                                                              | <li>**すべての**シェルコマンド                                                                       |
| **Full Auto**                | <li>ファイルの読み取り/書き込み <li> シェルコマンドの実行（ネットワーク無効、書き込みは作業ディレクトリに制限） | -                                                                                                    |

**Full Auto**では、すべてのコマンドが**ネットワーク無効**で実行され、現在の作業ディレクトリ（および一時ファイル）に制限されて、多層防御が提供されます。また、Codexは、ディレクトリがGitで追跡されて*いない*間に**auto-edit**または**full-auto**で開始する場合、警告/確認を表示するため、常に安全網があります。

近日公開予定：追加の保護手段に自信を持った後、ネットワークを有効にして自動実行する特定のコマンドをホワイトリスト化できるようになります。

### プラットフォームサンドボックスの詳細

CodexがOS使用する強化メカニズムは以下に依存します：

- **macOS 12+** - コマンドは**Apple Seatbelt**（`sandbox-exec`）でラップされます。

  - 少数の書き込み可能ルート（`$PWD`、`$TMPDIR`、`~/.codex`など）を除いて、すべてが読み取り専用ジェイルに配置されます。
  - 送信ネットワークは*デフォルトで完全にブロック*されます - 子プロセスがどこかに`curl`しようとしても失敗します。

- **Linux** - デフォルトではサンドボックス化はありません。
  Dockerを使用したサンドボックス化をお勧めします。Codexが**最小限のコンテナイメージ**内で自分自身を起動し、リポジトリを同じパスで*読み取り/書き込み*マウントします。カスタム`iptables`/`ipset`ファイアウォールスクリプトがOpenAI API以外のすべての送信を拒否します。これにより、ホストでrootが不要で、決定論的で再現可能な実行が提供されます。[`run_in_container.sh`](./codex-cli/scripts/run_in_container.sh)スクリプトを使用してサンドボックスを設定できます。

---

## システム要件

| 要件                     | 詳細                                                                |
| ------------------------ | ------------------------------------------------------------------- |
| オペレーティングシステム | macOS 12+、Ubuntu 20.04+/Debian 10+、または**WSL2経由**のWindows 11 |
| Node.js                  | **22以降**（LTS推奨）                                               |
| Git（オプション、推奨）  | 2.23+（内蔵PRヘルパー用）                                           |
| RAM                      | 4GB最小（8GB推奨）                                                  |

> `sudo npm install -g`は実行しないでください；代わりにnpmの権限を修正してください。

---

## CLIリファレンス

| コマンド                             | 目的                       | 例                                 |
| ------------------------------------ | -------------------------- | ---------------------------------- |
| `codex`                              | 対話REPL                   | `codex`                            |
| `codex "..."`                        | 対話REPLの初期プロンプト   | `codex "lintエラーを修正"`         |
| `codex -q "..."`                     | 非対話「静音モード」       | `codex -q --json "utils.tsを説明"` |
| `codex completion <bash\|zsh\|fish>` | シェル補完スクリプトを印刷 | `codex completion bash`            |

主要フラグ：`--model/-m`、`--approval-mode/-a`、`--quiet/-q`、`--notify`。

---

## メモリとプロジェクトドキュメント

`AGENTS.md`ファイルを使用してCodexに追加の指示とガイダンスを提供できます。Codexは以下の場所で`AGENTS.md`ファイルを探し、上から下にマージします：

1. `~/.codex/AGENTS.md` - 個人的なグローバルガイダンス
2. リポジトリルートの`AGENTS.md` - 共有プロジェクトノート
3. 現在の作業ディレクトリの`AGENTS.md` - サブフォルダ/機能固有

`--no-project-doc`または環境変数`CODEX_DISABLE_PROJECT_DOC=1`でこれらのファイルの読み込みを無効にします。

---

## 非対話/CIモード

パイプラインでCodexをヘッドレスで実行します。GitHub Actionステップの例：

```yaml
- name: Codexを使用してchangelogを更新
  run: |
    npm install -g @openai/codex
    export OPENAI_API_KEY="${{ secrets.OPENAI_KEY }}"
    codex -a auto-edit --quiet "次のリリース用にCHANGELOGを更新"
```

`CODEX_QUIET_MODE=1`を設定して対話UIノイズを無音にします。

## トレース/詳細ログ

環境変数`DEBUG=true`を設定すると、完全なAPIリクエストとレスポンスの詳細が印刷されます：

```shell
DEBUG=true codex
```

---

## レシピ

以下は、コピーペーストできるいくつかの小さな例です。引用符内のテキストを独自のタスクに置き換えてください。詳細なヒントと使用パターンについては、[プロンプトガイド](https://github.com/openai/codex/blob/main/codex-cli/examples/prompting_guide.md)をご覧ください。

| ✨  | 入力内容                                                                                    | 動作内容                                                                |
| --- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | `codex "DashboardコンポーネントをReact Hooksにリファクタリング"`                            | Codexがクラスコンポーネントを書き直し、`npm test`を実行し、差分を表示。 |
| 2   | `codex "ユーザーテーブル追加用のSQLマイグレーションを生成"`                                 | ORMを推測し、マイグレーションファイルを作成し、サンドボックスDBで実行。 |
| 3   | `codex "utils/date.tsのユニットテストを作成"`                                               | テストを生成し、実行し、合格するまで反復。                              |
| 4   | `codex "git mvで*.jpegを*.jpgに一括リネーム"`                                               | ファイルを安全にリネームし、インポート/使用箇所を更新。                 |
| 5   | `codex "この正規表現の動作を説明：^(?=.*[A-Z]).{8,}$"`                                      | ステップバイステップの人間向け説明を出力。                              |
| 6   | `codex "このリポジトリを慎重にレビューし、3つの高インパクトで適切にスコープされたPRを提案"` | 現在のコードベースで影響力のあるPRを提案。                              |
| 7   | `codex "脆弱性を探し、セキュリティレビューレポートを作成"`                                  | セキュリティバグを発見し説明。                                          |

---

## インストール

<details open>
<summary><strong>npmから（推奨）</strong></summary>

```bash
npm install -g @openai/codex
# または
yarn global add @openai/codex
# または
bun install -g @openai/codex
# または
pnpm add -g @openai/codex
```

</details>

<details>
<summary><strong>ソースからビルド</strong></summary>

```bash
# リポジトリをクローンしてCLIパッケージに移動
git clone https://github.com/openai/codex.git
cd codex/codex-cli

# corepackを有効にする
corepack enable

# 依存関係をインストールしてビルド
pnpm install
pnpm build

# Linux専用：事前ビルドされたサンドボックスバイナリをダウンロード（ghとzstdが必要）。
./scripts/install_native_deps.sh

# 使用法とオプションを取得
node ./dist/cli.js --help

# ローカルビルドされたCLIを直接実行
node ./dist/cli.js

# または便利なようにコマンドをグローバルにリンク
pnpm link
```

</details>

---

## MCP（Model Control Protocol）統合

Codex CLIは**Model Control Protocol（MCP）**をサポートしており、外部サーバーに接続して専用ツールと機能を提供することで、エージェントの機能を拡張します。

### MCPとは？

MCP（Model Control Protocol）は、Codexが外部サーバーに接続してそのツールにアクセスできるようにする標準化されたプロトコルです。これにより以下との統合が可能になります：

- **データベース**（PostgreSQL、MongoDBなど）
- **APIとサービス**（GitHub、JIRA、Slackなど）
- **ファイルシステム**とストレージサービス
- 永続的コンテキストのための**メモリシステム**
- **カスタムビジネスロジック**とドメイン固有ツール

### MCPサーバー設定

`~/.codex/config.json`または`~/.codex/config.yaml`ファイルでMCPサーバーを設定します：

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "python",
      "args": ["-m", "mcp_server.filesystem"],
      "env": {
        "ROOT_PATH": "/path/to/allowed/directory"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

**設定パラメータ：**

| パラメータ | タイプ | 説明                               | 例                                              |
| ---------- | ------ | ---------------------------------- | ----------------------------------------------- |
| `command`  | string | サーバーを開始する実行可能コマンド | `"npx"`、`"python"`                             |
| `args`     | array  | コマンドライン引数                 | `["-y", "@modelcontextprotocol/server-memory"]` |
| `env`      | object | サーバー用の環境変数               | `{"API_KEY": "value"}`                          |
| `url`      | string | リモートサーバーURL（SSE接続用）   | `"https://api.example.com/mcp"`                 |

### 利用可能なMCPサーバー

統合できる人気のMCPサーバー：

- **[@modelcontextprotocol/server-memory](https://www.npmjs.com/package/@modelcontextprotocol/server-memory)** - 永続メモリとコンテキスト
- **[@modelcontextprotocol/server-filesystem](https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem)** - ファイルシステム操作
- **[@modelcontextprotocol/server-github](https://www.npmjs.com/package/@modelcontextprotocol/server-github)** - GitHub統合
- **[@modelcontextprotocol/server-postgres](https://www.npmjs.com/package/@modelcontextprotocol/server-postgres)** - PostgreSQLデータベースアクセス
- **[@modelcontextprotocol/server-sqlite](https://www.npmjs.com/package/@modelcontextprotocol/server-sqlite)** - SQLiteデータベース操作

完全なリストについては、[MCPサーバーディレクトリ](https://github.com/modelcontextprotocol/servers)をご覧ください。

### MCP状態監視

MCPサーバーが設定されると、Codexは接続状態を表示します：

- **接続されたサーバー**は✅で表示
- **切断されたサーバー**は❌で表示
- CLIで`Ctrl+M`を使用して詳細なMCPサーバー状態を表示

**状態表示の例：**

```
MCPサーバー状態:
✅ memory (3つのツールが利用可能)
✅ github (12のツールが利用可能)
❌ database (接続失敗)
```

AIアシスタントは、リクエストに関連する場合、接続されたMCPサーバーのツールを自動的に使用します。

---

## 設定ガイド

Codex設定ファイルは`~/.codex/`ディレクトリに配置でき、YAMLとJSON形式の両方をサポートします。

### 基本設定パラメータ

| パラメータ          | タイプ  | デフォルト | 説明                          | 利用可能オプション                                                          |
| ------------------- | ------- | ---------- | ----------------------------- | --------------------------------------------------------------------------- |
| `model`             | string  | `o4-mini`  | 使用するAIモデル              | OpenAI APIをサポートする任意のモデル名                                      |
| `approvalMode`      | string  | `suggest`  | AIアシスタントの権限モード    | `suggest`（提案のみ）<br>`auto-edit`（自動編集）<br>`full-auto`（完全自動） |
| `fullAutoErrorMode` | string  | `ask-user` | full-autoモードでのエラー処理 | `ask-user`（ユーザー入力を要求）<br>`ignore-and-continue`（無視して続行）   |
| `notify`            | boolean | `true`     | デスクトップ通知を有効にする  | `true`/`false`                                                              |

### カスタムAIプロバイダー設定

`providers`オブジェクトで、複数のAIサービスプロバイダーを設定できます。各プロバイダーには以下のパラメータが必要です：

| パラメータ | タイプ | 説明                    | 例                            |
| ---------- | ------ | ----------------------- | ----------------------------- |
| `name`     | string | プロバイダーの表示名    | `"OpenAI"`                    |
| `baseURL`  | string | APIサービスURL          | `"https://api.openai.com/v1"` |
| `envKey`   | string | 環境変数名（APIキー用） | `"OPENAI_API_KEY"`            |

### 履歴設定

`history`オブジェクトで、会話履歴設定を構成できます：

| パラメータ          | タイプ  | 説明                                     | 例の値 |
| ------------------- | ------- | ---------------------------------------- | ------ |
| `maxSize`           | number  | 保存する履歴エントリの最大数             | `1000` |
| `saveHistory`       | boolean | 履歴を保存するかどうか                   | `true` |
| `sensitivePatterns` | array   | 履歴でフィルタリングする機密情報パターン | `[]`   |

### 設定例

1. YAML形式（`~/.codex/config.yaml`として保存）：

```yaml
model: o4-mini
approvalMode: suggest
fullAutoErrorMode: ask-user
notify: true
```

2. JSON形式（`~/.codex/config.json`として保存）：

```json
{
  "model": "o4-mini",
  "approvalMode": "suggest",
  "fullAutoErrorMode": "ask-user",
  "notify": true
}
```

### 完全設定例

複数のカスタムプロバイダーを使用した`config.json`の包括的な例：

```json
{
  "model": "o4-mini",
  "provider": "openai",
  "providers": {
    "openai": {
      "name": "OpenAI",
      "baseURL": "https://api.openai.com/v1",
      "envKey": "OPENAI_API_KEY"
    },
    "azure": {
      "name": "AzureOpenAI",
      "baseURL": "https://YOUR_PROJECT_NAME.openai.azure.com/openai",
      "envKey": "AZURE_OPENAI_API_KEY"
    },
    "openrouter": {
      "name": "OpenRouter",
      "baseURL": "https://openrouter.ai/api/v1",
      "envKey": "OPENROUTER_API_KEY"
    },
    "gemini": {
      "name": "Gemini",
      "baseURL": "https://generativelanguage.googleapis.com/v1beta/openai",
      "envKey": "GEMINI_API_KEY"
    },
    "ollama": {
      "name": "Ollama",
      "baseURL": "http://localhost:11434/v1",
      "envKey": "OLLAMA_API_KEY"
    },
    "mistral": {
      "name": "Mistral",
      "baseURL": "https://api.mistral.ai/v1",
      "envKey": "MISTRAL_API_KEY"
    },
    "deepseek": {
      "name": "DeepSeek",
      "baseURL": "https://api.deepseek.com",
      "envKey": "DEEPSEEK_API_KEY"
    },
    "xai": {
      "name": "xAI",
      "baseURL": "https://api.x.ai/v1",
      "envKey": "XAI_API_KEY"
    },
    "groq": {
      "name": "Groq",
      "baseURL": "https://api.groq.com/openai/v1",
      "envKey": "GROQ_API_KEY"
    },
    "arceeai": {
      "name": "ArceeAI",
      "baseURL": "https://conductor.arcee.ai/v1",
      "envKey": "ARCEEAI_API_KEY"
    }
  },
  "history": {
    "maxSize": 1000,
    "saveHistory": true,
    "sensitivePatterns": []
  }
}
```

### カスタム指示

エージェント用のカスタムガイダンスを定義するために、`~/.codex/AGENTS.md`ファイルを作成できます：

```markdown
- 常に絵文字で応答する
- 明示的に要求された場合のみgitコマンドを使用する
```

### 環境変数の設定

各AIプロバイダーについて、環境変数で対応するAPIキーを設定する必要があります。例：

```bash
# OpenAI
export OPENAI_API_KEY="your-api-key-here"

# Azure OpenAI
export AZURE_OPENAI_API_KEY="your-azure-api-key-here"
export AZURE_OPENAI_API_VERSION="2025-03-01-preview" (オプション)

# OpenRouter
export OPENROUTER_API_KEY="your-openrouter-key-here"

# 他のプロバイダーも同様
```

---

## カスタムコマンド

Codex CLIでは、よく使用するプロンプトを再利用可能なカスタムコマンドとして保存できます。これにより、複雑な指示を簡単なスラッシュコマンドで実行できます。

### カスタムコマンドとは

カスタムコマンドは、`~/.codex/command/`ディレクトリに配置されたMarkdownファイルで定義される、ユーザー定義のスラッシュコマンドです。

**主な特徴：**

- **再利用可能**: よく使うプロンプトを保存してすぐに呼び出し
- **引数対応**: `$ARGUMENTS`プレースホルダーで動的な値を挿入
- **階層構造**: ディレクトリ構造で整理されたコマンド管理
- **オートコンプリート**: タブ補完でコマンドを素早く選択

### カスタムコマンドの作成

#### 1. ディレクトリ作成

```bash
mkdir -p ~/.codex/command
```

#### 2. 基本的なコマンド作成

```bash
# コードレビュー用コマンド
echo "このコードを詳細にレビューし、以下の観点から改善点を指摘してください：
1. パフォーマンス
2. セキュリティ
3. 可読性
4. ベストプラクティス" > ~/.codex/command/review.md
```

#### 3. 階層構造でのコマンド作成

```bash
# Gitコマンド用ディレクトリ
mkdir -p ~/.codex/command/git

# コミットメッセージ生成コマンド
echo "変更内容に基づいて適切なgitコミットメッセージを生成してください。
以下の形式で作成してください：

\`\`\`
<type>(<scope>): <subject>

<body>
\`\`\`

- type: feat, fix, docs, style, refactor, test, choreのいずれか
- scope: 変更の影響範囲
- subject: 変更の簡潔な説明（50文字以内）" > ~/.codex/command/git/commit-message.md
```

### 使用例

作成したカスタムコマンドは、Codex CLI内で以下のように使用できます：

```bash
# 基本的なコマンド使用
/user:review

# 階層構造のコマンド使用
/user:git:commit-message

# オートコンプリート
/user:<Tab>  # 利用可能なコマンド一覧を表示
```

### 引数対応コマンド

`$ARGUMENTS`プレースホルダーを使用して、動的な値を受け取るコマンドを作成できます：

#### コマンド作成例

```bash
# GitHub issue修正用コマンド
echo "GitHub issue #\$ARGUMENTS の問題を修正してください。以下の手順で対応してください：

1. 問題の原因を特定
2. 修正方法を提案
3. テストケースの追加
4. ドキュメントの更新（必要な場合）

修正内容と理由を詳しく説明してください。" > ~/.codex/command/fix-issue.md
```

#### 使用方法

```bash
# 引数を指定してコマンド実行
/user:fix-issue 123

# $ARGUMENTSが"123"に置換されて実行される
```

### 実用的なカスタムコマンド例

#### コードベース分析コマンド

```markdown
# ~/.codex/command/analyze-codebase.md

このコードベースを詳細に分析し、Codex.mdファイルを作成または更新してください。
以下の観点から分析を行ってください：

## 分析項目

1. プロジェクト概要と技術スタック
2. 開発ワークフローとコマンド
3. アーキテクチャとファイル構造
4. セキュリティとベストプラクティス

分析結果を基に、将来のCodex CLIインスタンスが即座に生産的になれる
Codex.mdファイルを作成してください。
```

**使用方法:** `/user:analyze-codebase`

#### パフォーマンス最適化コマンド

```markdown
# ~/.codex/command/optimize.md

このコードのパフォーマンスを最適化してください。以下の点を考慮してください：

1. 実行速度の改善
2. メモリ使用量の削減
3. コードの可読性の維持
4. 既存のテストケースとの互換性

最適化後のコードと、改善点の説明をお願いします。
```

**使用方法:** `/user:optimize`

### ヒントとベストプラクティス

- **明確な指示**: コマンドには具体的で明確な指示を記述
- **構造化**: 長い指示は番号付きリストや見出しで整理
- **再利用性**: 汎用的に使えるよう、プロジェクト固有の詳細は避ける
- **テスト**: 作成後は実際に使用してコマンドの動作を確認

---

## FAQ

<details>
<summary>OpenAIは2021年にCodexというモデルをリリースしました - これは関連していますか？</summary>

2021年、OpenAIは自然言語プロンプトからコードを生成するように設計されたAIシステムであるCodexをリリースしました。その元のCodexモデルは2023年3月に廃止され、このCLIツールとは別物です。

</details>

<details>
<summary>どのモデルがサポートされていますか？</summary>

[Responses API](https://platform.openai.com/docs/api-reference/responses)で利用可能なすべてのモデル。デフォルトは`o4-mini`ですが、`--model gpt-4.1`を渡すか、設定ファイルで`model: gpt-4.1`を設定してオーバーライドします。

</details>
<details>
<summary>なぜ<code>o3</code>や<code>o4-mini</code>が機能しないのですか？</summary>

APIからのレスポンスのストリーミングと思考の連鎖の概要の表示を開始するために、[APIアカウントの認証](https://help.openai.com/en/articles/10910291-api-organization-verification)が必要な可能性があります。問題が解決しない場合はお知らせください！

</details>

<details>
<summary>Codexがファイルを編集しないようにするにはどうすればよいですか？</summary>

Codexはモデル生成されたコマンドをサンドボックス内で実行します。提案されたコマンドやファイル変更が正しくない場合、単に**n**と入力してコマンドを拒否したり、モデルにフィードバックを与えることができます。

</details>
<details>
<summary>Windowsで動作しますか？</summary>

直接的にはありません。[Windows Subsystem for Linux（WSL2）](https://learn.microsoft.com/en-us/windows/wsl/install)が必要です - CodexはmacOSとLinuxでNode 22を使用してテストされています。

</details>

---

## ゼロデータ保持（ZDR）の使用

Codex CLIは[Zero Data Retention（ZDR）](https://platform.openai.com/docs/guides/your-data#zero-data-retention)が有効になっているOpenAI組織を**サポート**しています。OpenAI組織でZero Data Retentionが有効になっていて、次のようなエラーが発生する場合：

```
OpenAI rejected the request. Error details: Status: 400, Code: unsupported_parameter, Type: invalid_request_error, Message: 400 Previous response cannot be used for this organization due to Zero Data Retention.
```

次のコマンドでより新しいバージョンにアップグレードする必要がある場合があります：`npm i -g @openai/codex@latest`

---

## Codexオープンソースファンド

Codex CLIやその他のOpenAIモデルを使用するオープンソースプロジェクトをサポートする**100万ドルのイニシアチブ**を開始することを嬉しく思います。

- 助成金は**最大25,000ドル**のAPIクレジットで授与されます。
- 申請は**随時レビュー**されます。

**興味がありますか？[こちらから申請してください](https://openai.com/form/codex-open-source-fund/)。**

---

## 貢献

このプロジェクトは積極的に開発中で、コードは大幅に変更される可能性があります。それが完了したらこのメッセージを更新します！

より広く、私たちは貢献を歓迎します - 初回のプルリクエストを開く場合でも、経験豊富なメンテナーでも。同時に、信頼性と長期的な保守性を重視しているため、コードをマージする基準は意図的に**高く**設定されています。以下のガイドラインは、実際に「高品質」が何を意味するかを明確にし、プロセス全体を透明で友好的にするはずです。

### 開発ワークフロー

- `main`から*トピックブランチ*を作成 - 例：`feat/interactive-prompt`。
- 変更に焦点を当てる。複数の無関係な修正は別々のPRとして開く。
- 開発中は`pnpm test:watch`を使用して超高速フィードバックを得る。
- 単体テストには**Vitest**、スタイルには**ESLint** + **Prettier**、型チェックには**TypeScript**を使用。
- プッシュ前に、完全なテスト/型/リントスイートを実行：

### Huskyを使用したGitフック

このプロジェクトは[Husky](https://typicode.github.io/husky/)を使用してコード品質チェックを強制します：

- **プリコミットフック**：コミット前にlint-stagedを自動実行してファイルをフォーマットおよびリント
- **プリプッシュフック**：リモートにプッシュする前にテストと型チェックを実行

これらのフックはコード品質を維持し、失敗したテストでコードをプッシュすることを防ぎます。詳細については、[HUSKY.md](./codex-cli/HUSKY.md)をご覧ください。

```bash
pnpm test && pnpm run lint && pnpm run typecheck
```

- **まだ**貢献者ライセンス契約（CLA）に署名していない場合は、正確なテキストを含むPRコメントを追加してください

  ```text
  I have read the CLA Document and I hereby sign the CLA
  ```

  すべての著者が署名すると、CLA-Assistantボットが緑色のPRステータスにします。

```bash
# ウォッチモード（変更時にテストが再実行）
pnpm test:watch

# ファイルを出力せずに型チェック
pnpm typecheck

# lint + prettierの問題を自動修正
pnpm lint:fix
pnpm format:fix
```

### デバッグ

ビジュアルデバッガーでCLIをデバッグするには、`codex-cli`フォルダで以下を実行してください：

- `pnpm run build`を実行してCLIをビルドします。これにより、`dist`フォルダの`cli.js`と並んで`cli.js.map`が生成されます。
- `node --inspect-brk ./dist/cli.js`でCLIを実行します。プログラムはデバッガーがアタッチされるまで待機してから続行します。オプション：
  - VS Codeで、コマンドパレットから**Debug: Attach to Node Process**を選択し、デバッグポート`9229`を持つオプション（おそらく最初のオプション）をドロップダウンで選択
  - Chromeで<chrome://inspect>に移動し、**localhost:9229**を見つけて**trace**をクリック

### 高インパクトなコード変更の作成

1. **課題から始める。** 新しい課題を開くか、既存の議論にコメントして、コードが書かれる前に解決策に合意できるようにします。
2. **テストを追加または更新する。** すべての新機能やバグ修正には、変更前に失敗し、変更後に成功するテストカバレッジが必要です。100%のカバレッジは必要ありませんが、意味のあるアサーションを目指してください。
3. **動作を文書化する。** 変更がユーザー向けの動作に影響する場合、README、インラインヘルプ（`codex --help`）、または関連する例プロジェクトを更新してください。
4. **コミットをアトミックに保つ。** 各コミットはコンパイルされ、テストは成功する必要があります。これにより、レビューと潜在的なロールバックが容易になります。

### プルリクエストの作成

- PRテンプレートに記入する（または同様の情報を含める） - **何を？なぜ？どのように？**
- **すべての**チェックをローカルで実行（`npm test && npm run lint && npm run typecheck`）。ローカルで捕捉できたCI失敗はプロセスを遅くします。
- ブランチが`main`と最新であり、マージ競合を解決していることを確認してください。
- マージ可能な状態にあると信じる場合のみ、PRを**Ready for review**としてマークしてください。

### レビュープロセス

1. 1人のメンテナーが主要レビューアーとして割り当てられます。
2. 変更を求める場合があります - 個人的に受け取らないでください。私たちは作業を評価しますが、一貫性と長期的な保守性も重視します。
3. PRが基準を満たすというコンセンサスがある場合、メンテナーがスカッシュアンドマージします。

### コミュニティの価値観

- **親切で包括的であること。** 他者を尊重して扱う；私たちは[Contributor Covenant](https://www.contributor-covenant.org/)に従います。
- **良い意図を仮定する。** 書面でのコミュニケーションは困難です - 寛大さの側に立ってください。
- **教える＆学ぶ。** 混乱するものを見つけた場合、改善とともに課題やPRを開いてください。

### ヘルプの取得

プロジェクトの設定で問題が発生した場合、アイデアについてフィードバックが欲しい場合、または単に*こんにちは*と言いたい場合 - Discussionを開くか、関連する課題に参加してください。喜んでお手伝いします。

一緒にCodex CLIを素晴らしいツールにできます。**ハッピーハッキング！** :rocket:

### 貢献者ライセンス契約（CLA）

すべての貢献者はCLAを受け入れる**必要があります**。プロセスは軽量です：

1. プルリクエストを開く。
2. 以下のコメントを貼り付ける（または以前に署名した場合は`recheck`と返信）：

   ```text
   I have read the CLA Document and I hereby sign the CLA
   ```

3. CLA-Assistantボットがリポジトリに署名を記録し、ステータスチェックを合格としてマークします。

特別なGitコマンド、メール添付ファイル、またはコミットフッターは不要です。

#### クイックフィックス

| シナリオ             | コマンド                                         |
| -------------------- | ------------------------------------------------ |
| 最後のコミットを修正 | `git commit --amend -s --no-edit && git push -f` |

**DCOチェック**は、PRのすべてのコミットがフッターを持つまでマージをブロックします（スカッシュでは1つだけ）。

### Codexのリリース

CLIの新しいバージョンを公開するには、まずnpmパッケージをステージングする必要があります。`codex-cli/scripts/`のヘルパースクリプトがすべての重い作業を行います。`codex-cli`フォルダ内で実行：

```bash
# Linux サンドボックス用の小さなネイティブバイナリを含むクラシックなJS実装。
pnpm stage-release

# オプションで実行間で再利用するため一時ディレクトリを指定。
RELEASE_DIR=$(mktemp -d)
pnpm stage-release --tmp "$RELEASE_DIR"

# さらにLinux用のネイティブRust CLIバイナリをバンドルする「Fat」パッケージ。
# エンドユーザーはCODEX_RUST=1を設定することで実行時にオプトインできます。
pnpm stage-release --native
```

リリースがステージングされているフォルダに移動し、意図通りに動作することを確認してください。その場合、一時フォルダから以下を実行：

```
cd "$RELEASE_DIR"
npm publish
```

### 代替ビルドオプション

#### Nix flake開発

前提条件：Nix >= 2.4でflakesが有効（`~/.config/nix/nix.conf`で`experimental-features = nix-command flakes`）。

Nix開発シェルに入る：

```bash
# 作業したい実装に応じてコマンドのいずれかを使用
nix develop .#codex-cli # codex-cli固有のシェルに入る場合
nix develop .#codex-rs # codex-rs固有のシェルに入る場合
```

このシェルには、Node.js、依存関係のインストール、CLIのビルド、`codex`コマンドのエイリアスが含まれています。

CLIを直接ビルドして実行：

```bash
# 作業したい実装に応じてコマンドのいずれかを使用
nix build .#codex-cli # codex-cliをビルドする場合
nix build .#codex-rs # codex-rsをビルドする場合
./result/bin/codex --help
```

flakeアプリ経由でCLIを実行：

```bash
# 作業したい実装に応じてコマンドのいずれかを使用
nix run .#codex-cli # codex-cliを実行する場合
nix run .#codex-rs # codex-rsを実行する場合
```

flakesでdirenvを使用

direnvがインストールされている場合、以下の`.envrc`を使用してプロジェクトディレクトリに`cd`すると自動的にNixシェルに入ることができます：

```bash
cd codex-rs
echo "use flake ../flake.nix#codex-cli" >> .envrc && direnv allow
cd codex-cli
echo "use flake ../flake.nix#codex-rs" >> .envrc && direnv allow
```

---

## セキュリティと責任あるAI

脆弱性を発見したり、モデル出力について懸念がありますか？**security@openai.com**にメールをお送りください。迅速に対応いたします。

---

## ライセンス

このリポジトリは[Apache-2.0 License](LICENSE)の下でライセンスされています。
