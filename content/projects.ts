/**
 * Projects section — pulls live from GitHub on page load.
 *
 * To feature a repo: tag it with the GitHub topic listed in `github.featureTopic`.
 * If no repo carries the tag, the section shows the top `fallbackCount` repos
 * (by stars, then most recently updated), with `github.exclude` filtered out.
 *
 * `langColors` colors the language dot on each card. Add new languages here.
 */
export const projects = {
  id: "projects",
  heading: "Projects",
  note: "Pulled live from GitHub. Tag a repo with the topic `portfolio` to feature it here.",
  tip: "**tip:** grab a card and shake it — see what happens.",
  moreLink: {
    label: "See all repositories on GitHub →",
    href: "https://github.com/jermynyeo?tab=repositories",
  },
  github: {
    username: "jermynyeo",
    featureTopic: "portfolio",
    fallbackCount: 6,
    /** Repos to never show, even if untagged (e.g. the portfolio repo itself). */
    exclude: ["jermynyeo"] as string[],
  },
  langColors: {
    Python: "#3572A5",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    "Jupyter Notebook": "#DA5B0B",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    Shell: "#89e051",
    Java: "#b07219",
  } as Record<string, string>,
  /** Fallback when GitHub API can't be reached (rate-limited etc.) */
  errorFallback: {
    text: "Couldn't reach GitHub right now (the public API allows ~60 requests/hour). Meanwhile, you can browse everything on",
    linkLabel: "my GitHub →",
    linkHref: "https://github.com/jermynyeo?tab=repositories",
  },
  emptyText: "No public projects to show yet — check back soon.",
  loadingText: "Fetching projects from GitHub…",
}
