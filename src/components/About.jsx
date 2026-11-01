import { lazy, Suspense } from 'react'
import Section from './Section'
import { profile, certifications } from '../data/cv'

const Avatar3D = lazy(() => import('./Avatar3D'))

export default function About() {
  return (
    <Section id="about" title="About me">
      <div className="about-top">
        <div className="avatar-card">
          <Suspense fallback={null}><Avatar3D /></Suspense>
        </div>
        <div className="about-text">
          <p className="lead">{profile.summary}</p>
          <div className="certs">
            <h3>Certifications</h3>
            <ul>{certifications.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        </div>
      </div>
    </Section>
  )
}