import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SKIN = '#CC9168'
const SKIN_LIGHT = '#D09770'
const HAIR = '#15100E'
const SHIRT = '#8C1D55'
const METAL = '#C9CFDA'
const GOLD = '#F2B84B'
const HEAD_SCALE = [1, 1.04, 0.96]

/* ---------- geometry built once ---------- */

// Geometric glasses frame: flat top, angled bottom corners
const OUTER = [[-0.34, 0.21], [0.35, 0.21], [0.37, 0.05], [0.27, -0.2], [-0.2, -0.22], [-0.37, -0.03]]
const INNER = OUTER.map(([x, y]) => [x * 0.9, y * 0.86])
const V2 = (a) => a.map(([x, y]) => new THREE.Vector2(x, y))
const frameShape = new THREE.Shape(V2(OUTER))
frameShape.holes.push(new THREE.Path(V2(INNER)))
const FRAME = new THREE.ExtrudeGeometry(frameShape, { depth: 0.03, bevelEnabled: false })
const GLASS = new THREE.ShapeGeometry(new THREE.Shape(V2(INNER)))

// Head: round face, fuller cheeks and jaw, soft chin. surf(x, y) returns the face surface depth.
function buildFace() {
  const geo = new THREE.SphereGeometry(1, 64, 48)
  const p = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    let { x, y, z } = v
    const cheek = Math.exp(-(((y + 0.35) / 0.45) ** 2))
    x *= 1 + 0.09 * cheek // cheek / jaw fullness
    z *= 1 + 0.04 * cheek
    if (y > 0.3) x *= 1 - 0.07 * ((y - 0.3) / 0.7) // narrower temples
    if (y < -0.55) {
      const t = (-0.55 - y) / 0.45
      x *= 1 - 0.2 * t // soft rounded chin
      if (z > 0) z *= 1 + 0.05 * t
    }
    p.setXYZ(i, x, y, z)
  }
  geo.computeVertexNormals()
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial())
  mesh.scale.set(...HEAD_SCALE)
  mesh.updateMatrixWorld(true)
  const rc = new THREE.Raycaster()
  const dir = new THREE.Vector3(0, 0, -1)
  const surf = (x, y) => {
    rc.set(new THREE.Vector3(x, y, 4), dir)
    const hit = rc.intersectObject(mesh)
    return hit.length ? hit[0].point.z : 0
  }
  return { geo, surf }
}

/* ---------- small parts ---------- */

const Hair = ({ p, s, r = [0, 0, 0] }) => (
  <mesh position={p} scale={s} rotation={r}>
    <sphereGeometry args={[1, 28, 20]} />
    <meshStandardMaterial color={HAIR} roughness={0.5} />
  </mesh>
)

function Eye({ x, z, irisRef }) {
  return (
    <group position={[x, 0, z]}>
      <mesh scale={[1.4, 0.55, 0.55]}>
        <sphereGeometry args={[0.1, 20, 14]} />
        <meshStandardMaterial color="#F4EEE6" roughness={0.4} />
      </mesh>
      <group ref={irisRef}>
        <mesh position={[0, 0, 0.045]} scale={[1, 1, 0.5]}>
          <sphereGeometry args={[0.062, 16, 12]} />
          <meshStandardMaterial color="#1B0F0B" roughness={0.2} />
        </mesh>
      </group>
      <mesh position={[0, 0.03, 0.04]} scale={[1.4, 0.55, 1]}>
        <torusGeometry args={[0.1, 0.012, 6, 18, Math.PI]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
    </group>
  )
}

function Lens({ side, surf }) {
  const x = side * 0.43
  const y = 0.06
  const z = surf(x, y) + 0.06
  const rotY = side * 0.3
  const mat = <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.35} side={THREE.DoubleSide} />
  const start = new THREE.Vector3(x + side * 0.37 * Math.cos(0.3), y + 0.12, z - 0.109)
  const end = new THREE.Vector3(side * 1.03, 0.1, -0.02)
  const mid = start.clone().add(end).multiplyScalar(0.5)
  const len = start.distanceTo(end)
  const ry = Math.atan2(end.x - start.x, end.z - start.z)
  return (
    <>
      <group position={[x, y, z]} rotation={[0, rotY, 0]} scale={[side, 1, 1]}>
        <mesh geometry={FRAME}>{mat}</mesh>
        <mesh geometry={GLASS} position={[0, 0, 0.015]}>
          <meshStandardMaterial color="#9CC2FF" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={mid} rotation={[0, ry, 0]}>
        <boxGeometry args={[0.028, 0.028, len]} />
        {mat}
      </mesh>
    </>
  )
}

/* ---------- the avatar ---------- */

function Avatar() {
  const root = useRef()
  const head = useRef()
  const eyes = useRef()
  const irises = useRef([])
  const { geo, surf } = useMemo(buildFace, [])

  const mouth = useMemo(() => {
    const z1 = surf(0.27, -0.46) + 0.015
    const z2 = surf(0, -0.58) + 0.025
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.27, -0.46, z1),
      new THREE.Vector3(0, -0.62, z2),
      new THREE.Vector3(0.27, -0.46, z1)
    )
    return new THREE.TubeGeometry(curve, 24, 0.026, 8, false)
  }, [surf])

  useFrame(({ clock, pointer }, d) => {
    const t = clock.elapsedTime
    const px = THREE.MathUtils.clamp(pointer.x, -1, 1)
    const py = THREE.MathUtils.clamp(pointer.y, -1, 1)
    root.current.position.y = Math.sin(t * 1.2) * 0.05
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, px * 0.12, 3, d)
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, px * 0.5, 4, d)
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, -py * 0.28, 4, d)
    irises.current.forEach((n) => {
      if (!n) return
      n.position.x = THREE.MathUtils.damp(n.position.x, px * 0.03, 8, d)
      n.position.y = THREE.MathUtils.damp(n.position.y, py * 0.015, 8, d)
    })
    const ph = t % 3.8
    eyes.current.scale.y = ph > 3.6 ? 1 - Math.sin(((ph - 3.6) / 0.2) * Math.PI) * 0.92 : 1
  })

  const ez = (x) => surf(x, 0.08) - 0.02

  return (
    <group ref={root}>
      {/* shirt */}
      <mesh position={[0, -2.5, 0]} scale={[1.65, 1, 0.85]}>
        <sphereGeometry args={[1.2, 40, 28]} />
        <meshStandardMaterial color={SHIRT} roughness={0.55} />
      </mesh>
      <mesh position={[0, -1.3, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.075, 12, 36]} />
        <meshStandardMaterial color={SHIRT} roughness={0.5} />
      </mesh>
      <mesh position={[0, -2.05, 0.94]}>
        <boxGeometry args={[0.05, 1.5, 0.02]} />
        <meshStandardMaterial color="#6E1442" roughness={0.6} />
      </mesh>
      {[[-1.75, 0.81], [-2.15, 0.985], [-2.55, 1.03]].map(([y, z]) => (
        <mesh key={y} position={[0, y, z]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial color="#3A0B24" roughness={0.3} />
        </mesh>
      ))}
      {/* neck */}
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.4, 0.44, 0.7, 28]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>

      <group ref={head}>
        <mesh geometry={geo} scale={HEAD_SCALE}>
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>

        {/* ears and earrings */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 1.05, -0.05, -0.02]} scale={[0.5, 1, 0.7]}>
              <sphereGeometry args={[0.2, 16, 12]} />
              <meshStandardMaterial color={SKIN} roughness={0.6} />
            </mesh>
            <mesh position={[s * 1.1, -0.3, 0.02]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[s * 1.0, 0.12, 0.08]}>
              <boxGeometry args={[0.06, 0.32, 0.16]} />
              <meshStandardMaterial color={HAIR} roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* hair */}
        <Hair p={[0, 0.78, 0.04]} s={[1.02, 0.42, 0.98]} />
        <Hair p={[0.1, 1.08, 0.42]} s={[0.62, 0.3, 0.55]} r={[-0.35, 0, -0.12]} />
        <Hair p={[-0.4, 0.58, 0.7]} s={[0.36, 0.17, 0.3]} r={[0.3, 0.2, 0.35]} />
        <Hair p={[0.9, 0.42, 0.12]} s={[0.2, 0.46, 0.62]} />
        <Hair p={[-0.9, 0.42, 0.12]} s={[0.2, 0.46, 0.62]} />
        <Hair p={[0, 0.25, -0.38]} s={[0.98, 0.92, 0.72]} />

        {/* brows */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.38, 0.34, surf(s * 0.38, 0.34) + 0.012]} rotation={[0, 0, s * 0.06]}>
            <boxGeometry args={[0.36, 0.075, 0.05]} />
            <meshStandardMaterial color={HAIR} roughness={0.7} />
          </mesh>
        ))}

        {/* eyes model */}
        <group ref={eyes} position={[0, 0.08, 0]}>
          <Eye x={-0.36} z={ez(-0.36)} irisRef={(n) => (irises.current[0] = n)} />
          <Eye x={0.36} z={ez(0.36)} irisRef={(n) => (irises.current[1] = n)} />
        </group>

        {/* nose */}
        <mesh position={[0, -0.06, surf(0, -0.06)]}>
          <capsuleGeometry args={[0.05, 0.18, 4, 8]} />
          <meshStandardMaterial color={SKIN_LIGHT} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.17, surf(0, -0.17) + 0.05]} scale={[1, 0.85, 1.05]}>
          <sphereGeometry args={[0.115, 20, 16]} />
          <meshStandardMaterial color={SKIN_LIGHT} roughness={0.55} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.1, -0.2, surf(s * 0.1, -0.2) + 0.015]}>
            <sphereGeometry args={[0.065, 14, 12]} />
            <meshStandardMaterial color={SKIN_LIGHT} roughness={0.55} />
          </mesh>
        ))}

        {/* thin moustache */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.14, -0.34, surf(s * 0.14, -0.34) + 0.015]} rotation={[0, 0, Math.PI / 2 - s * 0.15]}>
            <capsuleGeometry args={[0.022, 0.2, 4, 8]} />
            <meshStandardMaterial color="#3B2B24" roughness={0.8} />
          </mesh>
        ))}

        {/* smile */}
        <mesh position={[0, -0.55, surf(0, -0.55) + 0.005]} scale={[1.5, 0.28, 0.25]}>
          <sphereGeometry args={[0.1, 16, 12]} />
          <meshStandardMaterial color="#F4EFE8" roughness={0.3} />
        </mesh>
        <mesh geometry={mouth}>
          <meshStandardMaterial color="#8E4545" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.625, surf(0, -0.625) + 0.02]} scale={[1.5, 0.3, 0.4]}>
          <sphereGeometry args={[0.1, 16, 12]} />
          <meshStandardMaterial color="#A8605A" roughness={0.4} />
        </mesh>

        {/* glasses */}
        <Lens side={-1} surf={surf} />
        <Lens side={1} surf={surf} />
        <mesh position={[0, 0.17, surf(0, 0.17) + 0.08]}>
          <boxGeometry args={[0.12, 0.028, 0.03]} />
          <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.35} />
        </mesh>
      </group>
    </group>
  )
}

export default function Avatar3D() {
  return (
    <Canvas
      camera={{ position: [0, -0.5, 7.2], fov: 34 }}
      dpr={[1, 2]}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 5]} intensity={1.7} color="#FFF1DD" />
      <pointLight position={[-4, 2, -2]} intensity={30} color="#3B7BE0" />
      <pointLight position={[4, -1, 2]} intensity={12} color="#D7263D" />
      <Avatar />
    </Canvas>
  )
}