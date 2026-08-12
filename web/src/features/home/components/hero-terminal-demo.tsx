import { useState, useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AccentTone = 'emerald' | 'amber' | 'blue' | 'violet'

interface ApiDemoConfig {
  id: string
  label: string
  method: 'POST' | 'GET'
  endpoint: string
  model: string
  requestSnippet: string
  responseSnippet: string
  tokens: number
  latency: number
  accent: AccentTone
}

const ACCENT_COLORS: Record<AccentTone, string> = {
  emerald: '#10b981',
  amber: '#f59e0b',
  blue: '#3b82f6',
  violet: '#8b5cf6',
}

const API_DEMOS: ApiDemoConfig[] = [
  {
    id: 'gpt-chat',
    label: 'Chat',
    method: 'POST',
    endpoint: '/v1/chat/completions',
    model: 'gpt-4o-mini',
    requestSnippet: `{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}`,
    responseSnippet: `{
  "choices": [
    { "message": { "content": "Hi!" } }
  ],
  "usage": { "total_tokens": 27 }
}`,
    tokens: 27,
    latency: 142,
    accent: 'emerald',
  },
  {
    id: 'responses',
    label: 'Responses',
    method: 'POST',
    endpoint: '/v1/responses',
    model: 'gpt-4o',
    requestSnippet: `{
  "model": "gpt-4o",
  "input": "Explain quantum"
}`,
    responseSnippet: `{
  "output": [
    { "type": "output_text", "text": "..." }
  ],
  "usage": { "total_tokens": 31 }
}`,
    tokens: 31,
    latency: 168,
    accent: 'amber',
  },
  {
    id: 'claude',
    label: 'Claude',
    method: 'POST',
    endpoint: '/v1/messages',
    model: 'claude-3.5-sonnet',
    requestSnippet: `{
  "model": "claude-3.5-sonnet",
  "max_tokens": 1024,
  "messages": [
    { "role": "user", "content": "..." }
  ]
}`,
    responseSnippet: `{
  "content": [
    { "type": "text", "text": "..." }
  ],
  "usage": { "input_tokens": 12, "output_tokens": 17 }
}`,
    tokens: 29,
    latency: 156,
    accent: 'blue',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    method: 'POST',
    endpoint: '/v1beta/models/...:generateContent',
    model: 'gemini-2.0-flash',
    requestSnippet: `{
  "contents": [{
    "role": "user",
    "parts": [{ "text": "..." }]
  }]
}`,
    responseSnippet: `{
  "candidates": [{
    "content": { "parts": [{ "text": "..." }] }
  }],
  "usageMetadata": { "totalTokenCount": 25 }
}`,
    tokens: 25,
    latency: 93,
    accent: 'violet',
  },
]

const CYCLE_INTERVAL = 5000
const TRANSITION_MS = 300

interface HeroTerminalDemoProps {
  className?: string
}

export function HeroTerminalDemo(props: HeroTerminalDemoProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    intervalRef.current = setInterval(() => {
      setTransitioning(true)
      timeoutRef.current = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % API_DEMOS.length)
        setTransitioning(false)
      }, TRANSITION_MS)
    }, CYCLE_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleSelect = (index: number) => {
    if (index === activeIndex) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setTransitioning(true)
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(index)
      setTransitioning(false)
    }, TRANSITION_MS)
  }

  const demo = API_DEMOS[activeIndex]
  const accentColor = ACCENT_COLORS[demo.accent]

  return (
    <div className={cn('mx-auto w-full', props.className)}>
      <div
        className='relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1117] to-[#0a0e14]'
        style={{
          boxShadow: `
            0 32px 64px -16px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.04) inset,
            0 1px 0 0 rgba(255, 255, 255, 0.05) inset
          `,
        }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-20 blur-3xl transition-colors duration-500"
          style={{ backgroundColor: accentColor }}
        />

        {/* Tab bar */}
        <div className="relative flex items-center justify-between border-b border-white/5 px-2 py-2">
          <div className="flex gap-0.5">
            {API_DEMOS.map((item, index) => {
              const isActive = index === activeIndex
              const color = ACCENT_COLORS[item.accent]
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    'relative px-3.5 py-2 text-[11px] font-medium tracking-wider uppercase transition-colors',
                    isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0.5 left-1/2 h-px w-6 -translate-x-1/2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2 pr-3">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">
              200 OK
            </span>
          </div>
        </div>

        {/* Endpoint bar */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5">
          <span
            className="rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider"
            style={{
              color: accentColor,
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}10`,
            }}
          >
            {demo.method}
          </span>
          <code
            className={cn(
              'truncate font-mono text-[12px] text-white/90 transition-opacity duration-200',
              transitioning ? 'opacity-0' : 'opacity-100'
            )}
          >
            {demo.endpoint}
          </code>
          <span className="ml-auto font-mono text-[10px] text-white/30">
            {demo.model}
          </span>
        </div>

        {/* Code blocks */}
        <div className="divide-y divide-white/5">
          <CodeBlock
            label="Request"
            accentColor={accentColor}
            code={demo.requestSnippet}
            transitioning={transitioning}
          />
          <CodeBlock
            label="Response"
            accentColor={accentColor}
            code={demo.responseSnippet}
            transitioning={transitioning}
            isResponse
          />
        </div>

        {/* Footer metrics */}
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5">
          <div className="flex items-center gap-4 font-mono text-[11px] tabular-nums text-white/50">
            <span className="flex items-center gap-1">
              <span className="text-white font-semibold">{demo.latency}</span>
              <span className="text-[10px] uppercase">ms</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1">
              <span className="text-white font-semibold">{demo.tokens}</span>
              <span className="text-[10px] uppercase">tokens</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="text-white/60">
              ${(demo.tokens * 0.00003).toFixed(5)}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-white/30">
            SSE
          </span>
        </div>
      </div>
    </div>
  )
}

function CodeBlock(props: {
  label: string
  accentColor: string
  code: string
  transitioning: boolean
  isResponse?: boolean
}) {
  const { label, accentColor, code, transitioning, isResponse } = props

  return (
    <div
      className={cn(
        'relative px-4 py-3 transition-opacity duration-200',
        transitioning ? 'opacity-0' : 'opacity-100',
        isResponse && 'bg-white/[0.02]'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40">
          {label}
        </span>
        <span className="h-px flex-1 bg-white/5" />
      </div>
      <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed">
        <code>
          {code.split('\n').map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-3 w-5 shrink-0 select-none text-right text-white/20">
                {i + 1}
              </span>
              <span className={cn(
                'whitespace-pre',
                isResponse ? accentColor : 'text-white/80'
              )}>
                {colorize(line, isResponse ? accentColor : 'text-white/80')}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

function colorize(line: string, _highlight: string): ReactNode {
  const segments: ReactNode[] = []
  let cursor = 0

  const stringRe = /"[^"]*"/g
  const numRe = /\b(\d+)\b/g

  const tokens: Array<{ start: number; end: number; type: 'string' | 'number' | 'key' }> = []

  let m: RegExpExecArray | null
  stringRe.lastIndex = 0
  while ((m = stringRe.exec(line)) !== null) {
    const after = line.slice(m.index + m[0].length).trimStart()
    tokens.push({
      start: m.index,
      end: m.index + m[0].length,
      type: after.startsWith(':') ? 'key' : 'string',
    })
  }

  numRe.lastIndex = 0
  while ((m = numRe.exec(line)) !== null) {
    const insideString = tokens.some(
      (t) => m!.index >= t.start && m!.index < t.end && t.type === 'string'
    )
    if (!insideString) {
      tokens.push({ start: m.index, end: m.index + m[0].length, type: 'number' })
    }
  }

  tokens.sort((a, b) => a.start - b.start)

  tokens.forEach((token, idx) => {
    if (token.start > cursor) {
      segments.push(
        <span key={`t-${idx}-pre`} className="text-white/60">
          {line.slice(cursor, token.start)}
        </span>
      )
    }
    let cls = 'text-white/90'
    if (token.type === 'string') cls = 'text-amber-400'
    else if (token.type === 'key') cls = 'text-sky-400'
    else if (token.type === 'number') cls = 'text-violet-400'

    segments.push(
      <span key={`t-${idx}`} className={cls}>
        {line.slice(token.start, token.end)}
      </span>
    )
    cursor = token.end
  })

  if (cursor < line.length) {
    segments.push(
      <span key="tail" className="text-white/60">
        {line.slice(cursor)}
      </span>
    )
  }

  return segments.length > 0 ? segments : <span>{line || '\u00A0'}</span>
}
