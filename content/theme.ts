/**
 * Animation knobs. Tune the look-and-feel of every dynamic effect here.
 *
 * Most colors use the matrix-green palette. To switch the accent globally,
 * also update `--accent-mx` in `app/globals.css`.
 */
export const theme = {
  /**
   * Raining-letters background that lives behind everything and fades on scroll.
   * `opacityCurve` maps page scroll progress (0 = top, 1 = bottom) to opacity.
   */
  rain: {
    charCount: 300,
    opacityCurve: {
      progress: [0, 0.05, 0.22, 1],
      opacity: [1, 0.55, 0.18, 0.06],
    },
  },

  /**
   * Faint pixel-cell grid behind Experience + Stack. Lower `maxOpacity` for
   * less visible cells; lower `flickerChance` for slower flicker.
   */
  flickerGrid: {
    color: "rgb(0, 255, 0)",
    maxOpacity: 0.08,
    flickerChance: 0.12,
    squareSize: 3,
    gridGap: 6,
  },

  /**
   * Beams between nodes in the Stack data-flow diagram.
   * `pathColor` is the always-on line; gradient colors are the traveling bead.
   */
  beam: {
    pathColor: "rgba(0, 255, 0, 0.32)",
    pathWidth: 2.2,
    pathOpacity: 1,
    gradientStartColor: "#00ff5a",
    gradientStopColor: "#ffffff",
    duration: 3.4,
  },

  /**
   * Mouse-following spotlight inside MagicCard (About / Learnings cards).
   */
  magicCard: {
    gradientSize: 240,
    gradientColor: "rgba(0, 255, 0, 0.18)",
  },

  /**
   * Traveling bead around contact buttons.
   */
  borderBeam: {
    duration: 5,
    size: 40,
    pathRadius: 4,
    primaryColorFrom: "#ffffff",
    primaryColorTo: "rgba(255,255,255,0)",
    ghostColorFrom: "#00ff00",
    ghostColorTo: "rgba(0, 255, 0, 0)",
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
