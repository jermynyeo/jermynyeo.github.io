import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { BorderBeam } from "@/components/ui/border-beam"

export default function ContactSection() {
  return (
    <Reveal
      as="section"
      id="contact"
      className="section section--contact"
    >
      <SectionTitle>Let&apos;s talk</SectionTitle>
      <p className="contact__lead">
        Open to interesting problems and good conversations.
      </p>
      <div className="contact__links">
        <a className="btn btn--primary" href="mailto:jermyn1999@gmail.com">
          Email
          <BorderBeam
            duration={5}
            size={40}
            pathRadius={4}
            colorFrom="#ffffff"
            colorTo="rgba(255,255,255,0)"
          />
        </a>
        <a
          className="btn btn--ghost"
          href="https://www.linkedin.com/in/jywh/"
          target="_blank"
          rel="noopener"
        >
          LinkedIn
          <BorderBeam duration={6} size={40} pathRadius={4} delay={2} />
        </a>
        <a
          className="btn btn--ghost"
          href="https://github.com/jermynyeo"
          target="_blank"
          rel="noopener"
        >
          GitHub
          <BorderBeam duration={6} size={40} pathRadius={4} delay={4} />
        </a>
      </div>
    </Reveal>
  )
}
