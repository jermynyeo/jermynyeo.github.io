import Reveal from "@/components/reveal"
import { SectionTitle } from "@/components/section-title"

export default function EducationSection() {
  return (
    <Reveal as="section" id="education" className="section">
      <SectionTitle>Education</SectionTitle>
      <ol className="timeline">
        <li className="timeline__item">
          <div className="timeline__dot" />
          <div className="timeline__body">
            <div className="timeline__head">
              <h3>Bachelor of Science, Information Systems</h3>
              <span className="timeline__date">Aug 2018 — Jul 2022</span>
            </div>
            <p className="timeline__org">
              Singapore Management University ·{" "}
              <strong>Summa Cum Laude</strong>
            </p>

            <div className="edu">
              <div className="edu__block">
                <h4>Honors &amp; Awards</h4>
                <ul>
                  <li>🏆 SIS Aspirations Scholarship</li>
                  <li>🏆 Dean&apos;s List (AY 2019, 2022)</li>
                </ul>
              </div>
              <div className="edu__block">
                <h4>Final-Year Project</h4>
                <p>
                  Research on online discussion forums — Natural Language
                  Processing &amp; learning analytics, with Dr. Swapna
                  Gottipati.
                </p>
              </div>
              <div className="edu__block">
                <h4>Focus Modules</h4>
                <ul>
                  <li>Machine Learning · Artificial Intelligence</li>
                  <li>Text Mining &amp; Analytics</li>
                  <li>Social Analytics · Visual Analytics for BI</li>
                </ul>
              </div>
              <div className="edu__block">
                <h4>Teaching Assistant</h4>
                <p>
                  Web Application Development · Enterprise Solution Development
                  · Business Process Analytics · Computational Thinking ·
                  Social Analytics · Text Mining.
                </p>
              </div>
            </div>

            <p className="edu__cca">
              <strong>CCAs:</strong> SMUX Trekking · SMU Strategica · SCIS
              Ellipsis
            </p>
          </div>
        </li>
      </ol>
    </Reveal>
  )
}
