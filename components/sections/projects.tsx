import Reveal from "@/components/reveal"
import ProjectsGrid from "@/components/sections/projects-grid"
import { SectionTitle } from "@/components/section-title"
import { richText } from "@/components/rich-text"
import { projects } from "@/content/projects"
import { getRepos } from "@/lib/github"

export default async function ProjectsSection() {
  const { repos } = await getRepos()

  return (
    <Reveal as="section" x={-24} id={projects.id} className="section">
      <SectionTitle>{projects.heading}</SectionTitle>
      <p className="section__note">{richText(projects.note)}</p>
      <ProjectsGrid repos={repos} />
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
