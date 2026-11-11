import * as React from "react";
import { codeBlock, type CodeBlockVariantProps } from "@styled/recipes";
import { Button } from "lib/main";
import { ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { Theme } from "lib/providers/theme/themeEnum";

/**
 * A function that takes code, a language identifier, and a theme name and
 * returns a Promise resolving to an HTML string with syntax highlighting
 * applied. Consumers can wire this up with shiki's `codeToHtml` or any
 * other compatible highlighter.
 *
 * @example
 * ```tsx
 * import { codeToHtml } from "shiki";
 *
 * <CodeBlock
 *   code="const x = 1;"
 *   lang="typescript"
 *   highlighter={(code, lang, theme) => codeToHtml(code, { lang, theme })}
 * />
 * ```
 */
export type CodeBlockHighlighter = (
  code: string,
  lang: string,
  theme: string,
) => Promise<string>;

export type CodeBlockProps = CodeBlockVariantProps & {
  /** The code to be highlighted. */
  code: string;

  /**
   * A function that performs syntax highlighting and returns an HTML string.
   * Consumers typically pass shiki's `codeToHtml` here, but any compatible
   * async highlighter function works.
   *
   * @example
   * ```tsx
   * import { codeToHtml } from "shiki";
   * highlighter={(code, lang, theme) => codeToHtml(code, { lang, theme })}
   * ```
   */
  highlighter: CodeBlockHighlighter;

  /** *(optional)*
   * Whether to show line numbers.
   * @default false
   */
  showLineNumbers?: boolean;

  /** *(optional)*
   * The programming language for syntax highlighting.
   * @default "plaintext"
   */
  lang?: string;

  /** *(optional)*
   * Color theme name passed to the highlighter function.
   */
  theme?: string;

  /** *(optional)*
   * Copy button content.
   * @default <ClipboardCopyIcon />
   */
  copyButtonContent?: React.ReactNode;

  /** *(optional)*
   * Icon to show when code is copied.
   * @default <CheckIcon />
   */
  copiedIcon?: React.ReactNode;

  /** *(optional)*
   * Timeout for copy feedback.
   * @default 1000
   */
  timeoutCopyFeedback?: number;
};

/**
 * A code block with syntax highlighting.
 *
 * Syntax highlighting is provided via the required `highlighter` prop, a
 * simple async function `(code, lang, theme) => Promise<string>` that returns
 * an HTML string. This keeps shiki (or any other highlighter) out of the
 * library bundle; install it separately and wire it up:
 *
 * ```tsx
 * import { codeToHtml } from "shiki";
 *
 * <CodeBlock
 *   code={myCode}
 *   lang="typescript"
 *   highlighter={(code, lang, theme) => codeToHtml(code, { lang, theme })}
 * />
 * ```
 *
 * If the highlighter throws (e.g. shiki is not installed), the raw code is
 * rendered as plain text as a fallback.
 *
 * @param code - The code to be highlighted.
 * @param highlighter - Async function that returns highlighted HTML.
 * @param showLineNumbers - *(optional)* Whether to show line numbers.
 * @param lang - *(optional)* The programming language for syntax highlighting.
 * @param theme - *(optional)* Color theme name passed to the highlighter.
 * @param copyButtonContent - *(optional)* Copy button content.
 * @param copiedIcon - *(optional)* Icon to show when code is copied.
 * @param timeoutCopyFeedback - *(optional)* Timeout for copy feedback.
 * @param size - *(optional)* The size of the code block. Options: 'sm', 'md', 'lg'.
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  highlighter,
  lang = "plaintext",
  theme,
  showLineNumbers,
  copyButtonContent = <ClipboardCopyIcon />,
  copiedIcon = <CheckIcon />,
  timeoutCopyFeedback = 1000,
  size,
  ...props
}) => {
  const [html, setHtml] = React.useState<string>("");
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | undefined>(undefined);
  const globalTheme =
    typeof document === "undefined"
      ? undefined
      : (document.documentElement.dataset.pandaTheme as Theme | undefined);
  const classes = codeBlock({ size, theme: globalTheme });

  React.useEffect(() => {
    const highlightCode = async () => {
      const currentTheme =
        theme ?? (globalTheme === Theme.DARK ? "dark-plus" : "light-plus");

      const highlighted = await highlighter(code, lang, currentTheme);
      setHtml(highlighted);
    };
    highlightCode().catch((error: unknown) => {
      // Fall back to plain text if the highlighter fails (e.g. shiki not installed).
      setHtml(code);
      console.error(error);
    });
  }, [code, globalTheme, highlighter, lang, theme]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    await navigator.clipboard.writeText(code);
    setIsCopied(true);

    timeoutRef.current = window.setTimeout(() => {
      setIsCopied(false);
      timeoutRef.current = undefined;
    }, timeoutCopyFeedback);
  };

  const lines = code.split("\n").length;
  const lineNumbers = showLineNumbers
    ? Array.from({ length: lines }, (_, i) => i + 1)
    : null;

  return (
    <div className={classes.root} data-testid="code-block" {...props}>
      <div
        className={classes.captionContainer}
        data-testid="code-block-caption"
      >
        <div className={classes.caption} data-testid="code-block-caption">
          <span data-testid="code-block-caption-text">{lang}</span>
        </div>
        <div className={classes.copyButton}>
          <Button
            size="xxs"
            onClick={handleCopy}
            data-testid="code-block-copy-button"
            variant="neutral"
          >
            {isCopied ? copiedIcon : copyButtonContent}
          </Button>
        </div>
      </div>
      <div className={classes.container} data-testid="code-block-container">
        {lineNumbers && (
          <div
            className={classes.lineNumbers}
            data-testid="code-block-line-numbers"
          >
            {lineNumbers.map((num) => (
              <span
                key={`${lang}-${num}`}
                data-testid={`code-block-line-number-${num}`}
              >
                {num}
              </span>
            ))}
          </div>
        )}
        <div
          className={classes.pre}
          data-testid="code-block-content"
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            minWidth: "fit-content",
          }}
        />
      </div>
    </div>
  );
};

CodeBlock.displayName = "CodeBlock";
