import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const LABELS = ['Spring Boot', 'Keycloak', 'Kubernetes', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'WebSocket', 'Vault', 'Elasticsearch']

function buildNetwork() {
  const count = 46
  const nodes = []
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const r = 4.2 + (i % 3) * 0.5
    nodes.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)))
  }
  const edges = []
  nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j > i && a.distanceTo(b) < 2.9) edges.push([i, j]) }))
  return { nodes, edges }
}

function Packets({ nodes, edges }) {
  const N = 36
  const ref = useRef()
  const pos = useMemo(() => new Float32Array(N * 3), [])
  const state = useMemo(() => Array.from({ length: N }, () => ({ e: Math.floor(Math.random() * edges.length), t: Math.random(), s: 0.3 + Math.random() * 0.5 })), [edges])
  useFrame((_, d) => {
    state.forEach((p, i) => {
      p.t += d * p.s
      if (p.t > 1) { p.t = 0; p.e = Math.floor(Math.random() * edges.length) }
      const [a, b] = edges[p.e]
      const v = nodes[a].clone().lerp(nodes[b], p.t)
      pos.set([v.x, v.y, v.z], i * 3)
    })
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" array={pos} count={N} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.24} color="#F2A900" sizeAttenuation />
    </points>
  )
}

function Network() {
  const group = useRef()
  const core = useRef()
  const { size, viewport } = useThree()
  const { nodes, edges } = useMemo(buildNetwork, [])
  const nodePos = useMemo(() => new Float32Array(nodes.flatMap((v) => [v.x, v.y, v.z])), [nodes])
  const linePos = useMemo(() => new Float32Array(edges.flatMap(([a, b]) => [...nodes[a].toArray(), ...nodes[b].toArray()])), [nodes, edges])

  useFrame(({ pointer }, d) => {
    const g = group.current
    g.rotation.y += d * 0.12
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.y * 0.35, 2, d)
    g.position.x = THREE.MathUtils.damp(g.position.x, size.width > 900 ? viewport.width * 0.22 : 0, 3, d)
    core.current.rotation.x += d * 0.6
    core.current.rotation.y += d * 0.4
  })

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial color="#D7263D" wireframe />
      </mesh>
      <mesh><octahedronGeometry args={[0.6]} /><meshBasicMaterial color="#D7263D" /></mesh>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" array={linePos} count={linePos.length / 3} itemSize={3} /></bufferGeometry>
        <lineBasicMaterial color="#3B7BE0" transparent opacity={0.35} />
      </lineSegments>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" array={nodePos} count={nodes.length} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.2} color="#9CC2FF" sizeAttenuation />
      </points>
      {LABELS.map((label, i) => (
        <Html key={label} position={nodes[i * 4].toArray()} distanceFactor={10} zIndexRange={[1, 0]}>
          <div className="tag">{label}</div>
        </Html>
      ))}
      <Packets nodes={nodes} edges={edges} />
    </group>
  )
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 50 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#070A1C']} />
      <fog attach="fog" args={['#070A1C', 14, 40]} />
      <gridHelper args={[80, 60, '#3B7BE0', '#1A2252']} position={[0, -7, 0]} />
      <Network />
    </Canvas>
  )
}