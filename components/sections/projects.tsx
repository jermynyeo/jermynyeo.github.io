import Reveal from "@/components/reveal"
import ProjectsGrid from "@/components/sections/projects-grid"
import { SectionTitle } from "@/components/section-title"
import { richText } from "@/components/rich-text"
import { projects } from "@/content/projects"

export default function ProjectsSection() {
  return (
    <Reveal as="section" id={projects.id} className="section">
      <SectionTitle>{projects.heading}</SectionTitle>
      <p className="section__note">{richText(projects.note)}</p>
      <ProjectsGrid />
      <p className="projects__more">
        <a
          href={projects.moreLink.href}
          target="_blank"
          rel="noopener"
        >
          {projects.moreLink.label}
        </a>
      </p>
    </Reveal>
  )
}
