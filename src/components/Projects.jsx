import { useRef } from 'react'
import Section from './Section'
import { projects } from '../data/cv'

function Card({ p }) {
  const ref = useRef()
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(8px)`
  }
  const reset = () => (ref.current.style.transform = '')
  return (
    <a ref={ref} className="card" href={p.link} target="_blank" rel="noreferrer" onMouseMove={move} onMouseLeave={reset}>
      <h3>{p.name}</h3>
      <p className="stack">{p.stack}</p>
      <p>{p.text}</p>
      <span className="view">View project</span>
    </a>
  )
}

export default function Projects() {
  return (
    <Section id="projects" title="Personal projects">
      <div className="cards">{projects.map((p) => <Card key={p.name} p={p} />)}</div>
    </Section>
  )
}
