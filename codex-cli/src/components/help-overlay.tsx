import { Box, Text, useInput } from "ink";
import React from "react";

/**
 * An overlay that lists the available slash–commands and their description.
 * The overlay is purely informational and can be dismissed with the Escape
 * key. Keeping the implementation extremely small avoids adding any new
 * dependencies or complex state handling.
 */
export default function HelpOverlay({
  onExit,
}: {
  onExit: () => void;
}): JSX.Element {
  useInput((input, key) => {
    if (key.escape || input === "q") {
      onExit();
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="gray"
      width={80}
    >
      <Box paddingX={1}>
        <Text bold>利用可能なコマンド</Text>
      </Box>

      <Box flexDirection="column" paddingX={1} paddingTop={1}>
        <Text bold dimColor>
          スラッシュコマンド
        </Text>
        <Text>
          <Text color="cyan">/help</Text> – このヘルプを表示
        </Text>
        <Text>
          <Text color="cyan">/model</Text> – セッション内でLLMモデルを切り替え
        </Text>
        <Text>
          <Text color="cyan">/approval</Text> – 自動承認モードを切り替え
        </Text>
        <Text>
          <Text color="cyan">/history</Text> – このセッションの
          コマンド・ファイル履歴を表示
        </Text>
        <Text>
          <Text color="cyan">/clear</Text> – 画面とコンテキストをクリア
        </Text>
        <Text>
          <Text color="cyan">/clearhistory</Text> – コマンド履歴をクリア
        </Text>
        <Text>
          <Text color="cyan">/bug</Text> – セッションログ付きの
          GitHub issue URLを生成
        </Text>
        <Text>
          <Text color="cyan">/diff</Text> – ワーキングツリーのgit diffを表示
        </Text>
        <Text>
          <Text color="cyan">/compact</Text> – コンテキストを要約に圧縮
        </Text>
        <Text>
          <Text color="cyan">/mcp</Text> – MCPサーバーのステータスを表示
        </Text>

        <Box marginTop={1}>
          <Text bold dimColor>
            キーボードショートカット
          </Text>
        </Box>
        <Text>
          <Text color="yellow">Enter</Text> – メッセージを送信
        </Text>
        <Text>
          <Text color="yellow">Ctrl+J</Text> – 改行を挿入
        </Text>
        {/* Re–enable once we re–enable new input */}
        {/*
        <Text>
          <Text color="yellow">Ctrl+X</Text>/<Text color="yellow">Ctrl+E</Text>
          &nbsp;– open external editor ($EDITOR)
        </Text>
        */}
        <Text>
          <Text color="yellow">Up/Down</Text> – プロンプト履歴をスクロール
        </Text>
        <Text>
          <Text color="yellow">
            Esc<Text dimColor>(✕2)</Text>
          </Text>{" "}
          – 現在のアクションを中断
        </Text>
        <Text>
          <Text color="yellow">Ctrl+C</Text> – Codexを終了
        </Text>

        <Box marginTop={1}>
          <Text bold dimColor>
            承認モード
          </Text>
        </Box>
        <Text>
          <Text color="green">suggest</Text> – コマンド実行前に確認
        </Text>
        <Text>
          <Text color="green">auto–edit</Text> – ファイル編集を自動承認；
          コマンドは確認
        </Text>
        <Text>
          <Text color="green">full–auto</Text> – 安全な場合は
          すべての操作を自動承認
        </Text>
      </Box>

      <Box paddingX={1}>
        <Text dimColor>escまたはqで閉じる</Text>
      </Box>
    </Box>
  );
}
