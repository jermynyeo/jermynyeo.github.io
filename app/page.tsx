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
import ContactSection from "@/components/sections/contact"
import { nav } from "@/content/nav"
import { hero } from "@/content/hero"
import { site } from "@/content/site"
import { theme } from "@/content/theme"

export default function Page() {
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
        <LearningsSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <ContactSection />
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
