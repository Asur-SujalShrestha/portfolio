import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Section from './Section'
import { skills } from '../data/cv'

const COLORS = ['#F2A900', '#FF5D73', '#5B9BFF', '#3DDC84', '#A78BFA', '#FF8A5C', '#2ED3C6', '#FF6FB5', '#8FB8FF', '#C3CBE8']

function Cloud({ tags, activeRef }) {
  const box = useRef()
  const els = useRef([])

  // evenly spread points on a unit sphere
  const pts = useMemo(
    () =>
      tags.map((_, i) => {
        const n = tags.length
        const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
        const th = Math.PI * (1 + Math.sqrt(5)) * i
        return [Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)]
      }),
    [tags]
  )

  useEffect(() => {
    const el = box.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ax = 0, ay = 0, sx = 0.002, sy = 0.004, tx = 0.002, ty = 0.004, raf

    const move = (e) => {
      const r = el.getBoundingClientRect()
      tx = ((e.clientY - r.top) / r.height - 0.5) * -0.03
      ty = ((e.clientX - r.left) / r.width - 0.5) * 0.04
    }
    const leave = () => { tx = 0.002; ty = 0.004 }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)

    const draw = () => {
      const R = el.clientWidth * 0.4
      const cx = Math.cos(ax), sxn = Math.sin(ax), cy = Math.cos(ay), syn = Math.sin(ay)
      pts.forEach(([x, y, z], i) => {
        const y1 = y * cx - z * sxn
        const z1 = y * sxn + z * cx
        const x2 = x * cy + z1 * syn
        const z2 = -x * syn + z1 * cy
        const depth = (z2 + 1) / 2
        const a = activeRef.current
        const dim = a && a !== tags[i].group ? 0.18 : 1
        const t = els.current[i]
        if (!t) return
        t.style.transform = `translate(-50%,-50%) translate(${x2 * R}px,${y1 * R}px) scale(${0.6 + depth * 0.6})`
        t.style.opacity = (0.3 + depth * 0.7) * dim
        t.style.zIndex = Math.round(depth * 100)
      })
    }

    const loop = () => {
      sx += (tx - sx) * 0.05
      sy += (ty - sy) * 0.05
      ax += sx
      ay += sy
      draw()
      raf = requestAnimationFrame(loop)
    }
    if (reduce) draw()
    else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [pts, tags, activeRef])

  return (
    <div className="cloud" ref={box} aria-label="Rotating cloud of skills">
      <div className="cloud-ring" />
      {tags.map((t, i) => (
        <span key={t.name} ref={(n) => (els.current[i] = n)} className="cloud-tag" style={{ '--c': t.color }}>
          {t.name}
        </span>
      ))}
    </div>
  )
}

function Card({ g, i, active, select }) {
  const ref = useRef()
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(6px)`
  }
  const leave = () => { ref.current.style.transform = ''; select(null) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: i * 0.06, duration: 0.5 }}
    >
      <div
        ref={ref}
        tabIndex={0}
        className={`sk-card${active === g.group ? ' on' : ''}`}
        style={{ '--c': g.color }}
        onMouseMove={move}
        onMouseEnter={() => select(g.group)}
        onMouseLeave={leave}
        onFocus={() => select(g.group)}
        onBlur={() => select(null)}
      >
        <h3>{g.group}</h3>
        <div>{g.items.map((s) => <span key={s} className="chip">{s}</span>)}</div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [active, setActive] = useState(null)
  const activeRef = useRef(null)
  const select = (g) => { activeRef.current = g; setActive(g) }

  const groups = useMemo(() => skills.map((s, i) => ({ ...s, color: COLORS[i % COLORS.length] })), [])
  const tags = useMemo(() => groups.flatMap((g) => g.items.map((name) => ({ name, group: g.group, color: g.color }))), [groups])

  return (
    <Section id="skills" title="Skills">
      <div className="sk3d">
        <Cloud tags={tags} activeRef={activeRef} />
        <div className="sk-cards">
          {groups.map((g, i) => <Card key={g.group} g={g} i={i} active={active} select={select} />)}
        </div>
      </div>
    </Section>
  )
}