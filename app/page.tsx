import {
  RainingLettersBg,
  ScrambledTitle,
} from "@/components/ui/modern-animated-hero-section"
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

export default function Page() {
  return (
    <>
      <nav aria-label="Primary" className="hero-nav">
        {nav.map((s) => (
          <a key={s.href} href={s.href}>
            {s.label}
          </a>
        ))}
      </nav>

      <RainingLettersBg />

      <section className="hero-scene">
        <div className="hero-scene__title">
          <ScrambledTitle />
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
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <LearningsSection />
        <ContactSection />
      </main>

      <footer className="footer">
        <p>
          {site.footerByline} · {new Date().getFullYear()}
        </p>
      </footer>
    </>
  )
}
