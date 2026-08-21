import { useEffect, useRef } from 'react'
import { useTheme } from '@/context/theme-provider'

interface ParticleStreamProps {
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  opacity: number
}

interface StreamLine {
  points: { x: number; y: number }[]
  progress: number
  speed: number
  length: number
}

export function ParticleStream({ className }: ParticleStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const particlesRef = useRef<Particle[]>([])
  const streamsRef = useRef<StreamLine[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = resolvedTheme === 'dark'

    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1

    function resize() {
      if (!canvas) return
      dpr = window.devicePixelRatio || 1
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }
    const onMouseLeave = () => {
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // Create flowing stream paths (curves that particles follow)
    function createStreams() {
      const streams: StreamLine[] = []
      const streamCount = 8

      for (let i = 0; i < streamCount; i++) {
        const yOffset = (height / (streamCount + 1)) * (i + 1)
        const amplitude = 40 + Math.random() * 80
        const frequency = 0.002 + Math.random() * 0.003
        const points: { x: number; y: number }[] = []

        for (let x = 0; x <= width; x += 4) {
          const y = yOffset + Math.sin(x * frequency + i * 0.7) * amplitude
          points.push({ x, y })
        }

        streams.push({
          points,
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.004,
          length: 0.2 + Math.random() * 0.35,
        })
      }
      streamsRef.current = streams
    }

    createStreams()

    // Initialize particles
    function spawnParticle(): Particle {
      const streamIdx = Math.floor(Math.random() * streamsRef.current.length)
      const stream = streamsRef.current[streamIdx]
      const startPos = Math.random()
      const pointIdx = Math.min(
        Math.floor(startPos * stream.points.length),
        stream.points.length - 1
      )
      const pt = stream.points[pointIdx]

      return {
        x: pt.x + (Math.random() - 0.5) * 8,
        y: pt.y + (Math.random() - 0.5) * 8,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 40 + Math.random() * 80,
        size: 1 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.7,
      }
    }

    // Colors based on theme
    const activeColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.55)'
    const glowColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'
    const lineColor = isDark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.02)'

    function drawStreamLines() {
      if (!ctx) return
      // Draw faint stream paths
      for (const stream of streamsRef.current) {
        ctx.beginPath()
        ctx.moveTo(stream.points[0].x, stream.points[0].y)
        for (let i = 1; i < stream.points.length; i++) {
          ctx.lineTo(stream.points[i].x, stream.points[i].y)
        }
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    function updateParticles() {
      const particles = particlesRef.current

      // Spawn new particles
      const spawnRate = 4
      for (let i = 0; i < spawnRate; i++) {
        if (particles.length < 300) {
          particles.push(spawnParticle())
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        // Follow nearest stream
        let nearestPoint: { x: number; y: number } | null = null
        let minDist = Infinity

        for (const stream of streamsRef.current) {
          for (let j = 0; j < stream.points.length; j += 8) {
            const pt = stream.points[j]
            const dx = pt.x - p.x
            const dy = pt.y - p.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < minDist) {
              minDist = dist
              nearestPoint = pt
            }
          }
        }

        if (nearestPoint && minDist < 250) {
          // Flow towards nearest point on stream
          const dx = nearestPoint.x - p.x
          const dy = nearestPoint.y - p.y
          p.vx += dx * 0.004
          p.vy += dy * 0.004
        } else {
          // Random drift
          p.vx += (Math.random() - 0.5) * 0.3
          p.vy += (Math.random() - 0.5) * 0.3
        }

        // Mouse repulsion
        const mdx = p.x - mouseRef.current.x
        const mdy = p.y - mouseRef.current.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 120 && mdist > 0) {
          const force = (120 - mdist) / 120 * 2
          p.vx += (mdx / mdist) * force
          p.vy += (mdy / mdist) * force
        }

        // Damping
        p.vx *= 0.96
        p.vy *= 0.96

        p.x += p.vx
        p.y += p.vy

        p.life++

        // Fade in/out
        const fadeIn = Math.min(p.life / 15, 1)
        const fadeOut = Math.max(1 - (p.life - p.maxLife + 20) / 20, 0)
        const alpha = p.opacity * fadeIn * (p.life > p.maxLife - 20 ? fadeOut : 1)

        if (alpha <= 0 || p.life > p.maxLife) {
          particles.splice(i, 1)
          continue
        }

        if (!ctx) continue

        // Draw glow
        const glowSize = p.size * 3
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
        gradient.addColorStop(0, glowColor)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(p.x - glowSize, p.y - glowSize, glowSize * 2, glowSize * 2)

        // Draw core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = activeColor.replace('0.7', String(alpha * 0.8))
        ctx.fill()
      }
    }

    function drawDataPulses() {
      if (!ctx) return
      // Traveling pulses along streams
      for (const stream of streamsRef.current) {
        stream.progress += stream.speed
        if (stream.progress > 1) {
          stream.progress -= 1
        }

        const pulsePos = stream.progress * stream.points.length
        const pulseIdx = Math.floor(pulsePos)
        const trailLen = Math.floor(stream.length * stream.points.length)

        if (pulseIdx >= 0 && pulseIdx < stream.points.length) {
          // Draw trailing glow
          for (let t = 0; t < trailLen && (pulseIdx - t) >= 0; t++) {
            const idx = pulseIdx - t
            if (idx < 0) break
            const pt = stream.points[idx]
            const alpha = (1 - t / trailLen) * 0.15
            const size = (1 - t / trailLen) * 4 + 1

            ctx.beginPath()
            ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2)
            ctx.fillStyle = isDark
              ? `rgba(255, 255, 255, ${alpha})`
              : `rgba(0, 0, 0, ${alpha})`
            ctx.fill()
          }

          // Draw leading bright dot
          const pt = stream.points[pulseIdx]
          const pulseGlow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 12)
          pulseGlow.addColorStop(0, isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.25)')
          pulseGlow.addColorStop(1, 'transparent')
          ctx.fillStyle = pulseGlow
          ctx.fillRect(pt.x - 12, pt.y - 12, 24, 24)

          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)'
          ctx.fill()
        }
      }
    }

    // Connection lines between nearby particles
    function drawConnections() {
      if (!ctx) return
      const particles = particlesRef.current
      const maxDist = 80

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.2
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${alpha})`
              : `rgba(0, 0, 0, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    let running = true

    function animate() {
      if (!running || !ctx) return

      // Clear with slight trail for motion blur
      ctx.fillStyle = isDark ? 'rgba(10, 10, 11, 0.15)' : 'rgba(255, 255, 255, 0.2)'
      ctx.fillRect(0, 0, width, height)

      drawStreamLines()
      drawConnections()
      updateParticles()
      drawDataPulses()

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      running = false
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
      }}
    />
  )
}
