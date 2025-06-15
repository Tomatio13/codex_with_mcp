import type { SlashCommand } from "./slash-commands.js";

import { readdir, readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

export interface CustomCommand extends SlashCommand {
  content: string;
  filePath: string;
  hasArguments: boolean;
}

const CUSTOM_COMMANDS_DIR = join(homedir(), ".codex", "command");

/**
 * カスタムコマンドディレクトリ内のマークダウンファイルを再帰的に検索
 */
async function findMarkdownFiles(
  dir: string,
  prefix = "",
): Promise<Array<{ path: string; name: string }>> {
  const files: Array<{ path: string; name: string }> = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    const processEntry = async (entry: {
      isDirectory: () => boolean;
      isFile: () => boolean;
      name: string;
    }) => {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await findMarkdownFiles(
          fullPath,
          prefix ? `${prefix}:${entry.name}` : entry.name,
        );
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const commandName = entry.name.slice(0, -3); // .mdを除去
        const fullCommandName = prefix
          ? `${prefix}:${commandName}`
          : commandName;
        files.push({
          path: fullPath,
          name: fullCommandName,
        });
      }
    };

    await Promise.all(entries.map(processEntry));
  } catch (error) {
    // ディレクトリが存在しない場合は空配列を返す
    return [];
  }

  return files;
}

/**
 * カスタムコマンドを読み込んで返す
 */
export async function loadCustomCommands(): Promise<Array<CustomCommand>> {
  const commands: Array<CustomCommand> = [];

  try {
    // ディレクトリの存在確認
    await stat(CUSTOM_COMMANDS_DIR);
  } catch {
    // ディレクトリが存在しない場合は空配列を返す
    return commands;
  }

  const markdownFiles = await findMarkdownFiles(CUSTOM_COMMANDS_DIR);

  const processFile = async (file: { path: string; name: string }) => {
    try {
      const content = await readFile(file.path, "utf-8");
      const hasArguments = content.includes("$ARGUMENTS");

      commands.push({
        command: `/user:${file.name}`,
        description: `カスタムコマンド: ${file.name}${hasArguments ? " (引数対応)" : ""}`,
        content,
        filePath: file.path,
        hasArguments,
      });
    } catch (error) {
      // エラーログを削除してサイレントに処理
    }
  };

  await Promise.all(markdownFiles.map(processFile));

  return commands;
}

/**
 * カスタムコマンドのコンテンツを引数で置換
 */
export function substituteArguments(content: string, args: string): string {
  return content.replace(/\$ARGUMENTS/g, args);
}

/**
 * カスタムコマンドを名前で検索
 */
export async function findCustomCommand(
  commandName: string,
): Promise<CustomCommand | null> {
  const commands = await loadCustomCommands();
  return commands.find((cmd) => cmd.command === commandName) || null;
}

/**
 * カスタムコマンドが存在するかチェック
 */
export function isCustomCommand(input: string): boolean {
  return input.startsWith("/user:");
}

/**
 * カスタムコマンドの入力をパース
 */
export function parseCustomCommand(input: string): {
  command: string;
  args: string;
} {
  const parts = input.split(" ");
  const command = parts[0] || "";
  const args = parts.slice(1).join(" ");
  return { command, args };
}
