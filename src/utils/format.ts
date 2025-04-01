/**
 * Formats an error message with a consistent, visually appealing style
 */
export function formatErrorMessage(message: string): string {
  return `
╭─────────────── YouTube Transcript Error ───────────────╮
│                                                        │
  ${message}
│                                                        │
╰────────────────────────────────────────────────────────╯
`.trim();
}
