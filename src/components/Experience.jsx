import { useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Section from './Section'
import { jobs } from '../data/cv'

const base = import.meta.env.BASE_URL

function Mockup({ project }) {
  const ref = useRef()
  const [failed, setFailed] = useState({})
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 18 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => { mx.set(0); my.set(0) }
  const src = project.image && !failed[project.image] ? base + encodeURI(project.image) : null
  return (
    <div className="mock-wrap" ref={ref} onMouseMove={onMove} onMouseLeave={reset}>
      <AnimatePresence mode="wait">
        <motion.div
          key={project.name}
          className="mock"
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mock-bar">
            <i /><i /><i />
            <span>{project.name.toLowerCase().replace(/\s+/g, '-')}.app</span>
          </div>
          <div className="mock-screen">
            {src ? (
              <img src={src} alt={`${project.image} screenshot`} onError={() => setFailed((f) => ({ ...f, [project.name]: true }))} />
            ) : (
              <div className="mock-empty">
                <b>{project.name}</b>
                <small>Add a screenshot at public/{project.image || 'projects/your-image.png'}</small>
              </div>
            )}
            <span className="scan" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Job({ job }) {
  const [active, setActive] = useState(0)
  const project = job.projects[active]

  return (
    <article className="job">
      <header>
        <div><h3>{job.title}</h3><p>{job.company}</p></div>
        <span className="period">{job.period}</span>
      </header>

      <div className="showcase">
        <div className="picker" role="tablist">
          {job.projects.map((p, i) => (
            <button key={p.name} role="tab" aria-selected={i === active} className={i === active ? 'on' : ''} onClick={() => setActive(i)}>
              {i === active && (
                <motion.span layoutId={`pill-${job.company}`} className="pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="pname">{p.name}</span>
              <span className="pmeta">{p.points.length} highlights</span>
            </button>
          ))}
        </div>

        <div className="stage">
          <Mockup project={project} />
          {project.stack && (
            <motion.div key={project.name} className="techs" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
              {project.stack.map((t) => (
                <motion.span key={t} className="chip" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>{t}</motion.span>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={project.name}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0 }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {project.points.map((pt) => (
            <motion.li key={pt} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>{pt}</motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </article>
  )
}

export default function Experience() {
  return <Section id="experience" title="Experience">{jobs.map((j) => <Job key={j.company} job={j} />)}</Section>
}