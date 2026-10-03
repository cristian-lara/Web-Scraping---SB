/**
 * Matches tokens that contain only non-alphanumeric characters (ASCII).
 * Intake §2.2 examples are ASCII-only.
 *
 * ponytail:debt unicode-word-tokens — If HN titles need Unicode letters
 * (e.g. accented or CJK-only tokens) to count as words, revisit with
 * `\p{L}\p{N}` (`u` flag) + fixture cases; out of F1-2 scope until then.
 */
export const SYMBOL_ONLY_TOKEN = /^[^a-zA-Z0-9]+$/;

/**
 * Counts space-separated words in a title, excluding symbol-only tokens.
 * Compound tokens without spaces (e.g. "self-explained", "Node.js") count as one.
 */
export function countWords(title: string): number {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return 0;
  }

  return trimmed
    .split(/\s+/)
    .filter((token) => !SYMBOL_ONLY_TOKEN.test(token)).length;
}
