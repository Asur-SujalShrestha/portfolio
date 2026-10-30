import Section from './Section'
import { profile, certifications } from '../data/cv'

export default function About() {
  return (
    <Section id="about" title="About me">
      <div className="about">
        <p className="lead">{profile.summary}</p>
        <div className="certs">
          <h3>Certifications</h3>
          <br />
          <ul>{certifications.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </div>
    </Section>
  )
}
