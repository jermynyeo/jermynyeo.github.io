import Reveal from "@/components/reveal"

export default function ContactSection() {
  return (
    <Reveal
      as="section"
      id="contact"
      className="section section--contact"
    >
      <h2 className="section__title">
        <span className="ul-draw">Let&apos;s talk</span>
      </h2>
      <p className="contact__lead">
        Open to interesting problems and good conversations.
      </p>
      <div className="contact__links">
        <a className="btn btn--primary" href="mailto:jermyn1999@gmail.com">
          jermyn1999@gmail.com
        </a>
        <a
          className="btn btn--ghost"
          href="https://www.linkedin.com/in/jywh/"
          target="_blank"
          rel="noopener"
        >
          LinkedIn
        </a>
        <a
          className="btn btn--ghost"
          href="https://github.com/jermynyeo"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </a>
      </div>
    </Reveal>
  )
}
