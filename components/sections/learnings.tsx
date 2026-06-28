import Reveal from "@/components/reveal"

export default function LearningsSection() {
  return (
    <Reveal as="section" id="learnings" className="section">
      <h2 className="section__title">
        <span className="ul-draw">Learnings</span>
      </h2>
      <p className="section__note">
        Reflections (感想) on the projects I&apos;ve built and the
        certifications I&apos;ve studied for.{" "}
        <em>Drafts — to be replaced with my own thoughts.</em>
      </p>
      <div className="learnings">
        <article className="learn-card">
          <span className="learn-card__kind">Certificate · 2024</span>
          <h3>CKAD — Kubernetes</h3>
          <p>
            DRAFT — your thoughts after CKAD: what finally clicked about
            Kubernetes, what surprised you, and how it changed the way you
            think about shipping services.
          </p>
        </article>
        <article className="learn-card">
          <span className="learn-card__kind">Project · 2026</span>
          <h3>This Portfolio</h3>
          <p>
            DRAFT — building my own site as an explorable craft world taught
            me… (scoping a playful idea, design vs. engineering trade-offs,
            what you&apos;d reuse next time).
          </p>
        </article>
        <article className="learn-card">
          <span className="learn-card__kind">Project · University</span>
          <h3>Fake News Detection</h3>
          <p>
            DRAFT — reflecting on the NLP project: what worked, what was hard
            about the data, and what you&apos;d do differently now with more
            experience.
          </p>
        </article>
      </div>
    </Reveal>
  )
}
