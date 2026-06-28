import Reveal from "@/components/reveal"
import ProjectsGrid from "@/components/sections/projects-grid"

export default function ProjectsSection() {
  return (
    <Reveal as="section" id="projects" className="section">
      <h2 className="section__title">
        <span className="ul-draw">Projects</span>
      </h2>
      <p className="section__note">
        Pulled live from GitHub. Tag a repo with the topic{" "}
        <code>portfolio</code> to feature it here.
      </p>
      <ProjectsGrid />
      <p className="projects__more">
        <a
          href="https://github.com/jermynyeo?tab=repositories"
          target="_blank"
          rel="noopener"
        >
          See all repositories on GitHub →
        </a>
      </p>
    </Reveal>
  )
}
