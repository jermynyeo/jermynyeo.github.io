import { RainingLettersBg } from "@/components/ui/modern-animated-hero-section"
import { WireWorld } from "@/components/ui/wire-world"
import { BitHud } from "@/components/ui/bit-hud"
import { PaletteTrigger } from "@/components/ui/palette-trigger"
import { TerminalIntro } from "@/components/ui/terminal-intro"
import AboutSection from "@/components/sections/about"
import ExperienceSection from "@/components/sections/experience"
import ProjectsSection from "@/components/sections/projects"
import SkillsSection from "@/components/sections/skills"
import EducationSection from "@/components/sections/education"
import LearningsSection from "@/components/sections/learnings"
import { nav } from "@/content/nav"
import { hero } from "@/content/hero"
import { site } from "@/content/site"
import { theme } from "@/content/theme"
import { getReflections } from "@/lib/reflections"

export default function Page() {
  const reflections = getReflections()
  return (
    <>
      <nav aria-label="Primary" className="hero-nav">
        {nav.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className={s.kind === "cta" ? "hero-nav__cta" : undefined}
          >
            {s.label}
          </a>
        ))}
        <PaletteTrigger />
      </nav>

      <RainingLettersBg />
      {theme.wireWorld.enabled && <WireWorld />}
      {theme.wireWorld.enabled && theme.wireWorld.hudEnabled && <BitHud />}

      <section className="hero-scene">
        <div className="hero-intro">
          <p className="hero-intro__eyebrow">{hero.intro.eyebrow}</p>
          <h1 className="hero-intro__name">{hero.intro.name}</h1>
          <p className="hero-intro__pov">{hero.intro.pov}</p>
          <div className="hero-intro__cta">
            {hero.intro.ctas.map((c) => (
              <a
                key={c.href}
                href={c.href}
                className={`btn btn--${c.kind}`}
                {...("external" in c && c.external
                  ? { target: "_blank", rel: "noopener" }
                  : {})}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hero-scene__title">
          <TerminalIntro />
        </div>
        <a
          href={hero.scrollHintHref}
          className="scroll-hint"
          aria-label={hero.scrollHintAriaLabel}
        >
          {hero.scrollHintLabel}
        </a>
      </section>

      <main>
        <AboutSection />
        <ExperienceSection />
        <LearningsSection reflections={reflections} />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
      </main>

      <footer className="footer">
        <p>
          {site.footerByline} · {new Date().getFullYear()}
          <span className="footer__cursor" aria-hidden>
            ▌
          </span>
        </p>
      </footer>
    </>
  )
}
