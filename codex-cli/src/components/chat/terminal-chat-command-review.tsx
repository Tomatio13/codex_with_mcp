import { ReviewDecision } from "../../utils/agent/review";
// TODO: figure out why `cli-spinners` fails on Node v20.9.0
// which is why we have to do this in the first place
//
// @ts-expect-error select.js is JavaScript and has no types
import { Select } from "../vendor/ink-select/select";
import TextInput from "../vendor/ink-text-input";
import { Box, Text, useInput } from "ink";
import React from "react";

// default deny‑reason:
const DEFAULT_DENY_MESSAGE =
  "それは実行しないでください、しかし問題の解決を続けてください";

export function TerminalChatCommandReview({
  confirmationPrompt,
  onReviewCommand,
  // callback to switch approval mode overlay
  onSwitchApprovalMode,
  explanation: propExplanation,
  // whether this review Select is active (listening for keys)
  isActive = true,
}: {
  confirmationPrompt: React.ReactNode;
  onReviewCommand: (decision: ReviewDecision, customMessage?: string) => void;
  onSwitchApprovalMode: () => void;
  explanation?: string;
  // when false, disable the underlying Select so it won't capture input
  isActive?: boolean;
}): React.ReactElement {
  const [mode, setMode] = React.useState<"select" | "input" | "explanation">(
    "select",
  );
  const [explanation, setExplanation] = React.useState<string>("");

  // If the component receives an explanation prop, update the state
  React.useEffect(() => {
    if (propExplanation) {
      setExplanation(propExplanation);
      setMode("explanation");
    }
  }, [propExplanation]);
  const [msg, setMsg] = React.useState<string>("");

  // -------------------------------------------------------------------------
  // Determine whether the "always approve" option should be displayed.  We
  // only hide it for the special `apply_patch` command since approving those
  // permanently would bypass the user's review of future file modifications.
  // The information is embedded in the `confirmationPrompt` React element –
  // we inspect the `commandForDisplay` prop exposed by
  // <TerminalChatToolCallCommand/> to extract the base command.
  // -------------------------------------------------------------------------

  const showAlwaysApprove = React.useMemo(() => {
    if (
      React.isValidElement(confirmationPrompt) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (confirmationPrompt as any).props?.commandForDisplay === "string"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const command: string = (confirmationPrompt as any).props
        .commandForDisplay;
      // Grab the first token of the first line – that corresponds to the base
      // command even when the string contains embedded newlines (e.g. diffs).
      const baseCmd = command.split("\n")[0]?.trim().split(/\s+/)[0] ?? "";
      return baseCmd !== "apply_patch";
    }
    // Default to showing the option when we cannot reliably detect the base
    // command.
    return true;
  }, [confirmationPrompt]);

  // Memoize the list of selectable options to avoid recreating the array on
  // every render.  This keeps <Select/> stable and prevents unnecessary work
  // inside Ink.
  const approvalOptions = React.useMemo(() => {
    const opts: Array<
      | { label: string; value: ReviewDecision }
      | { label: string; value: "edit" }
      | { label: string; value: "switch" }
    > = [
      {
        label: "はい (y)",
        value: ReviewDecision.YES,
      },
    ];

    if (showAlwaysApprove) {
      opts.push({
        label: "はい、このセッション中はこのコマンドを常に承認します (a)",
        value: ReviewDecision.ALWAYS,
      });
    }

    opts.push(
      {
        label: "このコマンドを説明します (x)",
        value: ReviewDecision.EXPLAIN,
      },
      {
        label: "編集またはフィードバックを与える (e)",
        value: "edit",
      },
      // allow switching approval mode
      {
        label: "承認モードを切り替える (s)",
        value: "switch",
      },
      {
        label: "いいえ、続行します (n)",
        value: ReviewDecision.NO_CONTINUE,
      },
      {
        label: "いいえ、一旦停止します (esc)",
        value: ReviewDecision.NO_EXIT,
      },
    );

    return opts;
  }, [showAlwaysApprove]);

  useInput(
    (input, key) => {
      if (mode === "select") {
        if (input === "y") {
          onReviewCommand(ReviewDecision.YES);
        } else if (input === "x") {
          onReviewCommand(ReviewDecision.EXPLAIN);
        } else if (input === "e") {
          setMode("input");
        } else if (input === "n") {
          onReviewCommand(
            ReviewDecision.NO_CONTINUE,
            "それは実行しないでください、しかし続行しましょう",
          );
        } else if (input === "a" && showAlwaysApprove) {
          onReviewCommand(ReviewDecision.ALWAYS);
        } else if (input === "s") {
          // switch approval mode
          onSwitchApprovalMode();
        } else if (key.escape) {
          onReviewCommand(ReviewDecision.NO_EXIT);
        }
      } else if (mode === "explanation") {
        // When in explanation mode, any key returns to select mode
        if (key.return || key.escape || input === "x") {
          setMode("select");
        }
      } else {
        // text entry mode
        if (key.return) {
          // if user hit enter on empty msg, fall back to DEFAULT_DENY_MESSAGE
          const custom = msg.trim() === "" ? DEFAULT_DENY_MESSAGE : msg;
          onReviewCommand(ReviewDecision.NO_CONTINUE, custom);
        } else if (key.escape) {
          // treat escape as denial with default message as well
          onReviewCommand(
            ReviewDecision.NO_CONTINUE,
            msg.trim() === "" ? DEFAULT_DENY_MESSAGE : msg,
          );
        }
      }
    },
    { isActive },
  );

  return (
    <Box flexDirection="column" gap={1} borderStyle="round" marginTop={1}>
      {confirmationPrompt}
      <Box flexDirection="column" gap={1}>
        {mode === "explanation" ? (
          <>
            <Text bold color="yellow">
              コマンドの説明:
            </Text>
            <Box paddingX={2} flexDirection="column" gap={1}>
              {explanation ? (
                <>
                  {explanation.split("\n").map((line, i) => {
                    // Check if it's an error message
                    if (
                      explanation.startsWith("Unable to generate explanation")
                    ) {
                      return (
                        <Text key={i} bold color="red">
                          {line}
                        </Text>
                      );
                    }
                    // Apply different styling to headings (numbered items)
                    else if (line.match(/^\d+\.\s+/)) {
                      return (
                        <Text key={i} bold color="cyan">
                          {line}
                        </Text>
                      );
                    } else {
                      return <Text key={i}>{line}</Text>;
                    }
                  })}
                </>
              ) : (
                <Text dimColor>説明を読み込み中...</Text>
              )}
              <Text dimColor>任意のキーを押してオプションに戻る</Text>
            </Box>
          </>
        ) : mode === "select" ? (
          <>
            <Text>コマンドを実行しますか？</Text>
            <Box paddingX={2} flexDirection="column" gap={1}>
              <Select
                isDisabled={!isActive}
                visibleOptionCount={approvalOptions.length}
                onChange={(value: ReviewDecision | "edit" | "switch") => {
                  if (value === "edit") {
                    setMode("input");
                  } else if (value === "switch") {
                    onSwitchApprovalMode();
                  } else {
                    onReviewCommand(value);
                  }
                }}
                options={approvalOptions}
              />
            </Box>
          </>
        ) : mode === "input" ? (
          <>
            <Text>モデルにフィードバックを与える (↵で送信):</Text>
            <Box borderStyle="round">
              <Box paddingX={1}>
                <TextInput
                  value={msg}
                  onChange={setMsg}
                  placeholder="理由を入力してください"
                  showCursor
                  focus
                />
              </Box>
            </Box>

            {msg.trim() === "" && (
              <Box paddingX={2} marginBottom={1}>
                <Text dimColor>
                  デフォルト:&nbsp;
                  <Text>{DEFAULT_DENY_MESSAGE}</Text>
                </Text>
              </Box>
            )}
          </>
        ) : null}
      </Box>
    </Box>
  );
}
