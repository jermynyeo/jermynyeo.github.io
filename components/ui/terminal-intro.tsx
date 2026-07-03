import { hero } from "@/content/hero"

/**
 * Typed terminal session for the hero. Server-rendered — all text ships in
 * the static HTML; the typing effect is pure CSS (steps() width animation),
 * so crawlers and reduced-motion users get the full text immediately.
 */
export function TerminalIntro() {
  let t = 0.4
  const lines = hero.terminal.lines.map((line) => {
    const delay = t
    t += line.kind === "command" ? 1.15 : 0.25
    return { ...line, delay }
  })

  return (
    <div className="term">
      <div className="term__bar" aria-hidden>
        <span className="term__dot term__dot--r" />
        <span className="term__dot term__dot--y" />
        <span className="term__dot term__dot--g" />
        <span className="term__title">jermyn@portfolio ~ zsh</span>
      </div>
      <div className="term__body">
        {lines.map((line, i) => {
          const style = {
            "--d": `${line.delay}s`,
            "--ch": line.text.length,
          } as React.CSSProperties

          if (line.kind === "heading") {
            return (
              <h1 key={i} className="term-line term-line--heading" style={style}>
                {line.text}
              </h1>
            )
          }
          if (line.kind === "command") {
            return (
              <p key={i} className="term-line term-line--cmd" style={style}>
                <span className="term-line__prompt">$</span>
                <span className="term-line__text">{line.text}</span>
                {"caret" in line && line.caret && (
                  <span className="term-caret" aria-hidden />
                )}
              </p>
            )
          }
          return (
            <p key={i} className="term-line" style={style}>
              {line.text}
            </p>
          )
        })}
      </div>
    </div>
  )
}
