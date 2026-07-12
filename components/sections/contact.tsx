import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"
import { BorderBeam } from "@/components/ui/border-beam"
import { Magnetic } from "@/components/ui/magnetic"
import { contact } from "@/content/contact"
import { theme } from "@/content/theme"

export default function ContactSection() {
  const beam = theme.borderBeam
  return (
    <Reveal
      as="section"
      id={contact.id}
      className="section section--contact"
    >
      <SectionTitle>{contact.heading}</SectionTitle>
      <p className="contact__lead">{contact.lead}</p>
      <div className="contact__links">
        {contact.links.map((link, i) => {
          const isPrimary = link.kind === "primary"
          return (
            <Magnetic key={i}>
              <a
                className={`btn ${isPrimary ? "btn--primary" : "btn--ghost"}`}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener" }
                  : {})}
              >
                {link.label}
                <BorderBeam
                  duration={beam.duration + i}
                  size={beam.size}
                  pathRadius={beam.pathRadius}
                  delay={i * 2}
                  colorFrom={
                    isPrimary ? beam.primaryColorFrom : beam.ghostColorFrom
                  }
                  colorTo={isPrimary ? beam.primaryColorTo : beam.ghostColorTo}
                />
              </a>
            </Magnetic>
          )
        })}
      </div>
    </Reveal>
  )
}
