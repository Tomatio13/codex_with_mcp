// Defines the available slash commands and their descriptions.
// Used for autocompletion in the chat input.
export interface SlashCommand {
  command: string;
  description: string;
}

export interface ExtendedSlashCommand extends SlashCommand {
  isCustom?: boolean;
}

export const SLASH_COMMANDS: Array<SlashCommand> = [
  {
    command: "/clear",
    description: "会話履歴をクリアしてコンテキストを解放",
  },
  {
    command: "/clearhistory",
    description: "コマンド履歴をクリア",
  },
  {
    command: "/compact",
    description:
      "会話履歴をクリアしつつ要約をコンテキストに保持。オプション: /compact [要約の指示]",
  },
  { command: "/history", description: "コマンド履歴を開く" },
  { command: "/sessions", description: "過去のセッションを参照" },
  { command: "/help", description: "コマンド一覧を表示" },
  { command: "/model", description: "モデル選択パネルを開く" },
  { command: "/approval", description: "承認モード選択パネルを開く" },
  {
    command: "/bug",
    description: "セッションログ付きのGitHub issue URLを生成",
  },
  {
    command: "/diff",
    description:
      "ワーキングディレクトリのgit diffを表示（gitでない場合は適用されたパッチ）",
  },
  {
    command: "/mcp",
    description: "MCPサーバーを一覧表示",
  },
];

/**
 * カスタムコマンドを含む全スラッシュコマンドを取得
 */
export async function getAllSlashCommands(): Promise<
  Array<ExtendedSlashCommand>
> {
  const { loadCustomCommands } = await import("./custom-commands.js");
  const customCommands = await loadCustomCommands();

  const allCommands: Array<ExtendedSlashCommand> = [
    ...SLASH_COMMANDS.map((cmd) => ({ ...cmd, isCustom: false })),
    ...customCommands.map((cmd) => ({
      command: cmd.command,
      description: cmd.description,
      isCustom: true,
    })),
  ];

  return allCommands;
}
