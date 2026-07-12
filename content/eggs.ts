/**
 * Easter-egg copy: the Konami-code toast, the devtools console banner, and
 * the hints printed under it. The third egg (`sudo hire-jermyn`) lives in
 * `content/terminal.ts`.
 */
export const eggs = {
  /** Window event that makes the raining-letters background surge. */
  surgeEvent: "rain-surge",
  konamiToast: "cheat code accepted · rain intensity 200%",
  consoleBanner: `
     ██╗███████╗██████╗ ███╗   ███╗██╗   ██╗███╗   ██╗
     ██║██╔════╝██╔══██╗████╗ ████║╚██╗ ██╔╝████╗  ██║
     ██║█████╗  ██████╔╝██╔████╔██║ ╚████╔╝ ██╔██╗ ██║
██   ██║██╔══╝  ██╔══██╗██║╚██╔╝██║  ╚██╔╝  ██║╚██╗██║
╚█████╔╝███████╗██║  ██║██║ ╚═╝ ██║   ██║   ██║ ╚████║
 ╚════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═══╝`,
  consoleHints: [
    "curious one, aren't you? two more secrets:",
    "  1. the konami code works here (↑ ↑ ↓ ↓ ← → ← → b a)",
    "  2. the hero terminal accepts `sudo hire-jermyn`",
  ],
} as const
