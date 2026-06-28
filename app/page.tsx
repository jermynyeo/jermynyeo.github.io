import RainingLetters from "@/components/ui/modern-animated-hero-section"
import AboutSection from "@/components/sections/about"
import ExperienceSection from "@/components/sections/experience"
import ProjectsSection from "@/components/sections/projects"
import SkillsSection from "@/components/sections/skills"
import EducationSection from "@/components/sections/education"
import LearningsSection from "@/components/sections/learnings"
import ContactSection from "@/components/sections/contact"

const SECTIONS = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#projects", label: "projects" },
  { href: "#skills", label: "skills" },
  { href: "#education", label: "education" },
  { href: "#learnings", label: "learnings" },
  { href: "#contact", label: "contact" },
]

export default function Page() {
  return (
    <>
      <nav aria-label="Primary" className="hero-nav">
        {SECTIONS.map((s) => (
          <a key={s.href} href={s.href}>
            {s.label}
          </a>
        ))}
      </nav>

      <section className="relative">
        <RainingLetters />
        <a href="#about" className="scroll-hint" aria-label="Scroll to content">
          scroll
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
        <p>Handmade by Jermyn Yeo · {new Date().getFullYear()}</p>
      </footer>
    </>
  )
}
