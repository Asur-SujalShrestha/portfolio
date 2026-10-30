import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Scene3D from './Scene3D'
import { profile } from '../data/cv'

const LINES = [
  '$ whoami',
  'sujal-shrestha // backend engineer',
  '$ stack --core',
  'java, spring-boot, keycloak, kubernetes',
  '$ status',
  'building secure multi-tenant systems',
]

const rise = (i) => ({ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 + i * 0.15, duration: 0.8, ease: 'easeOut' } })

function Terminal() {
  const [text, setText] = useState('')
  useEffect(() => {
    const full = LINES.join('\n')
    let i = 0
    const id = setInterval(() => { i++; setText(full.slice(0, i)); if (i >= full.length) clearInterval(id) }, 35)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="terminal">
      <div className="terminal-bar"><i /><i /><i /></div>
      <div className="terminal-body">
        {text.split('\n').map((l, i) => <div key={i} className={l.startsWith('$') ? 'cmd' : ''}>{l}</div>)}
        <span className="caret" />
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-canvas"><Suspense fallback={null}><Scene3D /></Suspense></div>
      <div className="hero-text">
        <motion.p {...rise(0)} className="hero-kicker">Kathmandu, Nepal</motion.p>
        <motion.h1 {...rise(1)} className="glitch" data-text={profile.name}>{profile.name}</motion.h1>
        <motion.p {...rise(2)} className="hero-role">{profile.role}</motion.p>
        <motion.div {...rise(3)} className="hero-cta">
          <a className="btn primary" href="#experience">See my work</a>
          <a className="btn" href="#contact">Get in touch</a>
        </motion.div>
        <motion.div {...rise(4)}><Terminal /></motion.div>
      </div>
    </section>
  )
}