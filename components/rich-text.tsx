import type { ReactNode } from "react"

/**
 * Tiny inline-markdown renderer. Lets content strings carry emphasis without
 * forcing the editor to write JSX. Supports:
 *
 *   **bold**     →  <strong>bold</strong>
 *   *italic*     →  <em>italic</em>
 *   `code`       →  <code>code</code>
 *
 * Nesting is not supported — keep tokens flat.
 */
const TOKEN_RE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g

export function richText(input: string): ReactNode {
  const parts = input.split(TOKEN_RE).filter((p) => p !== "")
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>
    }
    return part
  })
}

/** Drop-in for places that want a component instead of a function call. */
export function RichText({ text }: { text: string }) {
  return <>{richText(text)}</>
}
