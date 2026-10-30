import Section from './Section'
import { education } from '../data/cv'

export default function Education() {
  return (
    <Section id="education" title="Education">
      <div className="edu">
        {education.map((e) => (
          <div key={e.title}><h3>{e.title}</h3><p>{e.place}</p><span className="period">{e.period}</span></div>
        ))}
      </div>
    </Section>
  )
}
