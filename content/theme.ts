/**
 * Animation knobs. Tune the look-and-feel of every dynamic effect here.
 *
 * Most colors use the refined-terminal mint palette. To switch the accent
 * globally, also update `--accent-mx` / `--accent-rgb` in `app/globals.css`.
 */
export const theme = {
  /**
   * Raining-letters background that lives behind everything and fades on scroll.
   * `opacityCurve` maps page scroll progress (0 = top, 1 = bottom) to opacity.
   */
  rain: {
    charCount: 110,
    opacityCurve: {
      progress: [0, 0.05, 0.22, 1],
      opacity: [0.65, 0.4, 0.14, 0.05],
    },
    activeColor: "#4ade80",
    idleColor: "rgba(148, 163, 184, 0.45)",
    activeGlow: "0 0 10px rgba(74, 222, 128, 0.5)",
  },

  /**
   * Faint pixel-cell grid behind Experience + Stack. Lower `maxOpacity` for
   * less visible cells; lower `flickerChance` for slower flicker.
   */
  flickerGrid: {
    color: "rgb(74, 222, 128)",
    maxOpacity: 0.05,
    flickerChance: 0.08,
    squareSize: 3,
    gridGap: 6,
  },

  /**
   * Beams between nodes in the Stack data-flow diagram.
   * `pathColor` is the always-on line; gradient colors are the traveling bead.
   */
  beam: {
    pathColor: "rgba(74, 222, 128, 0.25)",
    pathWidth: 2.2,
    pathOpacity: 1,
    gradientStartColor: "#4ade80",
    gradientStopColor: "#d1fae5",
    duration: 3.4,
  },

  /**
   * Mouse-following spotlight inside MagicCard (About / Learnings cards).
   */
  magicCard: {
    gradientSize: 240,
    gradientColor: "rgba(74, 222, 128, 0.14)",
  },

  /**
   * Traveling bead around contact buttons.
   */
  borderBeam: {
    duration: 5,
    size: 40,
    pathRadius: 4,
    primaryColorFrom: "#d1fae5",
    primaryColorTo: "rgba(209, 250, 229, 0)",
    ghostColorFrom: "#4ade80",
    ghostColorTo: "rgba(74, 222, 128, 0)",
  },

  /**
   * HyperText scramble animation (section titles).
   */
  hyperText: {
    duration: 650,
  },

  /**
   * Top-of-page scroll progress bar.
   */
  scrollProgress: {
    enabled: true,
  },
} as const
