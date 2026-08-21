/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import DOMPurify from 'dompurify'
import * as katex from 'katex'

import 'katex/dist/katex.min.css'
import { Marked, Renderer, type MarkedExtension, type Token, type Tokens } from 'marked'
import { useEffect, useMemo, useRef } from 'react'
import { codeToHtml } from 'shiki'

import { cn } from '@/lib/utils'

interface MarkdownProps {
  breaks?: boolean
  children: string
  className?: string
}

const markdownOptions = {
  async: false,
  breaks: false,
  gfm: true,
} as const

const emojiShortcodes: Record<string, string> = {
  ':fa-gear:': '\u2699\ufe0f',
  ':fa-star:': '\u2b50',
  ':smiley:': '\ud83d\ude03',
  ':star:': '\u2b50',
}

const allowedAttributes = [
  'checked',
  'class',
  'd',
  'data-diagram',
  'disabled',
  'fill',
  'height',
  'id',
  'marker-end',
  'markerheight',
  'markerHeight',
  'markerUnits',
  'markerunits',
  'markerWidth',
  'markerwidth',
  'offset',
  'orient',
  'points',
  'preserveAspectRatio',
  'preserveaspectratio',
  'r',
  'refX',
  'refx',
  'refY',
  'refy',
  'rx',
  'ry',
  'stroke',
  'stroke-dasharray',
  'stroke-width',
  'style',
  'target',
  'text-anchor',
  'dominant-baseline',
  'dy',
  'viewBox',
  'viewbox',
  'width',
  'x',
  'x1',
  'x2',
  'y',
  'y1',
  'y2',
]

const allowedTags = [
  'annotation',
  'circle',
  'defs',
  'ellipse',
  'line',
  'math',
  'marker',
  'mfrac',
  'mi',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mrow',
  'mspace',
  'msqrt',
  'mstyle',
  'msub',
  'msubsup',
  'msup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'path',
  'polygon',
  'rect',
  'semantics',
  'stop',
  'svg',
  'text',
  'tspan',
]

const sanitizeOptions = {
  ADD_ATTR: allowedAttributes,
  ADD_TAGS: allowedTags,
} as const

type FlowNode = {
  id: string
  label: string
  type: string
}

type FlowEdge = {
  from: string
  label?: string
  to: string
}

type FlowNodeLayout = {
  height: number
  labelLines: string[]
  node: FlowNode
  width: number
  x: number
  y: number
}

type SequenceMessage = {
  from?: string
  isNote?: boolean
  label: string
  lineStyle?: 'solid' | 'dashed'
  noteSide?: 'left' | 'right'
  target: string
  to?: string
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeMathSource(source: string): string {
  return source
    .trim()
    .replace(/^\\\(/, '')
    .replace(/\\\)$/, '')
    .replace(/^\\\[/, '')
    .replace(/\\\]$/, '')
}

function renderMath(source: string, displayMode: boolean): string {
  return katex.renderToString(normalizeMathSource(source), {
    displayMode,
    output: 'htmlAndMathml',
    throwOnError: false,
  })
}

function replaceEmojiShortcodes(value: string): string {
  return value.replaceAll(/:(?:smiley|star|fa-star|fa-gear):/g, (shortcode) => {
    return emojiShortcodes[shortcode] ?? shortcode
  })
}

function getTextUnits(value: string): number {
  return [...value].reduce((total, character) => {
    if (/\s/.test(character)) {
      return total + 0.5
    }

    if (/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/.test(character)) {
      return total + 2
    }

    return total + 1
  }, 0)
}

function splitFlowLabel(label: string, maxUnits: number): string[] {
  const words = label.trim().split(/(\s+)/).filter(Boolean)
  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    const candidate = `${currentLine}${word}`

    if (currentLine && getTextUnits(candidate) > maxUnits) {
      lines.push(currentLine.trim())
      currentLine = word.trimStart()
      return
    }

    currentLine = candidate
  })

  if (currentLine.trim()) {
    lines.push(currentLine.trim())
  }

  return lines.length > 0 ? lines : [label]
}

function renderFlowText(layout: FlowNodeLayout): string {
  const lineHeight = 18
  const firstLineY =
    layout.y - ((layout.labelLines.length - 1) * lineHeight) / 2 + 5

  return layout.labelLines
    .map((line, index) => {
      return `<text x="${layout.x}" y="${firstLineY + index * lineHeight}" text-anchor="middle" class="markdown-diagram-text">${escapeHtml(line)}</text>`
    })
    .join('')
}

function getFlowNodeLayout(
  node: FlowNode,
  index: number,
  centerX: number
): FlowNodeLayout {
  const isCondition = node.type === 'condition'
  const labelLines = splitFlowLabel(node.label, isCondition ? 14 : 18)
  const labelWidth = Math.max(
    ...labelLines.map((line) => getTextUnits(line) * 7.2)
  )
  const textHeight = labelLines.length * 18

  if (isCondition) {
    return {
      height: Math.max(112, textHeight + 76),
      labelLines,
      node,
      width: Math.max(190, labelWidth + 92),
      x: centerX,
      y: 64 + index * 132,
    }
  }

  if (node.type === 'start' || node.type === 'end') {
    return {
      height: 38,
      labelLines,
      node,
      width: Math.max(124, labelWidth + 44),
      x: centerX,
      y: 64 + index * 132,
    }
  }

  return {
    height: Math.max(54, textHeight + 28),
    labelLines,
    node,
    width: Math.max(166, labelWidth + 52),
    x: centerX,
    y: 64 + index * 132,
  }
}

function getFlowAnchor(
  layout: FlowNodeLayout,
  side: 'bottom' | 'left' | 'right' | 'top'
): {
  x: number
  y: number
} {
  if (side === 'top') {
    return { x: layout.x, y: layout.y - layout.height / 2 }
  }

  if (side === 'bottom') {
    return { x: layout.x, y: layout.y + layout.height / 2 }
  }

  if (side === 'left') {
    return { x: layout.x - layout.width / 2, y: layout.y }
  }

  return { x: layout.x + layout.width / 2, y: layout.y }
}

function renderFlowShape(layout: FlowNodeLayout): string {
  const halfWidth = layout.width / 2
  const halfHeight = layout.height / 2
  const label = renderFlowText(layout)

  if (layout.node.type === 'condition') {
    return `
      <polygon points="${layout.x},${layout.y - halfHeight} ${layout.x + halfWidth},${layout.y} ${layout.x},${layout.y + halfHeight} ${layout.x - halfWidth},${layout.y}" class="markdown-diagram-node markdown-flow-condition" />
      ${label}
    `
  }

  if (layout.node.type === 'start' || layout.node.type === 'end') {
    return `
      <rect x="${layout.x - halfWidth}" y="${layout.y - halfHeight}" width="${layout.width}" height="${layout.height}" rx="${halfHeight}" ry="${halfHeight}" class="markdown-diagram-node markdown-flow-terminal" />
      ${label}
    `
  }

  return `
    <rect x="${layout.x - halfWidth}" y="${layout.y - halfHeight}" width="${layout.width}" height="${layout.height}" rx="6" ry="6" class="markdown-diagram-node markdown-flow-operation" />
    ${label}
  `
}

function parseFlowDiagram(source: string): {
  edges: FlowEdge[]
  nodes: FlowNode[]
} {
  const lines = source
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const nodes: FlowNode[] = []
  const edges: FlowEdge[] = []

  lines.forEach((line) => {
    const nodeMatch = /^([A-Za-z][\w-]*)=>([A-Za-z]+):\s*(.+)$/.exec(line)

    if (nodeMatch) {
      const [, id, type, label] = nodeMatch
      nodes.push({ id, label, type: type.toLowerCase() })
      return
    }

    const edgeParts = line.split('->')

    if (edgeParts.length < 2) {
      return
    }

    for (let index = 0; index < edgeParts.length - 1; index += 1) {
      const fromMatch = /^([A-Za-z][\w-]*)(?:\(([^)]+)\))?$/.exec(
        edgeParts[index]
      )
      const toMatch = /^([A-Za-z][\w-]*)(?:\(([^)]+)\))?$/.exec(
        edgeParts[index + 1]
      )

      if (!fromMatch || !toMatch) {
        continue
      }

      const from = fromMatch[1]
      const to = toMatch[1]
      const edgeLabel = fromMatch[2]
      edges.push({ from, label: edgeLabel, to })
    }
  })

  return { edges, nodes }
}

function renderFlowDiagram(source: string): string {
  const { edges, nodes } = parseFlowDiagram(source)
  const width = 660
  const centerX = 300
  const loopX = 520
  const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]))
  const nodePositions = new Map(
    nodes.map((node, index) => [
      node.id,
      getFlowNodeLayout(node, index, centerX),
    ])
  )
  const lastNode =
    nodes.length > 0 ? nodePositions.get(nodes.at(-1)?.id ?? '') : undefined
  const height = Math.max(
    180,
    (lastNode?.y ?? 64) + (lastNode?.height ?? 40) / 2 + 54
  )
  const renderedEdges = edges
    .map((edge) => {
      const from = nodePositions.get(edge.from)
      const to = nodePositions.get(edge.to)

      if (!from || !to) {
        return ''
      }

      const isBackward =
        (nodeIndex.get(edge.to) ?? 0) <= (nodeIndex.get(edge.from) ?? 0)

      if (isBackward) {
        const fromAnchor = getFlowAnchor(from, 'right')
        const toAnchor = getFlowAnchor(to, 'right')
        const d = `M ${fromAnchor.x} ${fromAnchor.y} C ${loopX} ${fromAnchor.y}, ${loopX} ${toAnchor.y}, ${toAnchor.x} ${toAnchor.y}`
        const label = edge.label
          ? `<text x="${loopX - 38}" y="${(fromAnchor.y + toAnchor.y) / 2 - 8}" class="markdown-diagram-edge-label">${escapeHtml(edge.label)}</text>`
          : ''

        return `<path d="${d}" class="markdown-diagram-edge" marker-end="url(#markdown-diagram-arrow)" />${label}`
      }

      const fromAnchor = getFlowAnchor(from, 'bottom')
      const toAnchor = getFlowAnchor(to, 'top')
      const label = edge.label
        ? `<text x="${fromAnchor.x + 38}" y="${(fromAnchor.y + toAnchor.y) / 2 - 8}" class="markdown-diagram-edge-label">${escapeHtml(edge.label)}</text>`
        : ''

      return `
        <line x1="${fromAnchor.x}" y1="${fromAnchor.y}" x2="${toAnchor.x}" y2="${toAnchor.y}" class="markdown-diagram-edge" marker-end="url(#markdown-diagram-arrow)" />
        ${label}
      `
    })
    .join('')
  const renderedNodes = nodes
    .map((node) => {
      const position = nodePositions.get(node.id)

      if (!position) {
        return ''
      }

      return renderFlowShape(position)
    })
    .join('')

  return `
    <div class="not-prose markdown-diagram">
      <svg data-diagram="flow" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="xMidYMin meet">
        <defs>
          <marker id="markdown-diagram-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 8 4 L 0 8 z" class="markdown-diagram-arrow" />
          </marker>
        </defs>
        ${renderedEdges}
        ${renderedNodes}
      </svg>
    </div>
  `
}

function parseSequenceDiagram(source: string): {
  messages: SequenceMessage[]
  participants: string[]
} {
  const lines = source
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const participants: string[] = []
  const messages: SequenceMessage[] = []

  function addParticipant(name: string): void {
    if (!participants.includes(name)) {
      participants.push(name)
    }
  }

  lines.forEach((line) => {
    const noteMatch = /^Note\s+(left|right)\s+of\s+([^:]+):\s*(.+)$/.exec(line)

    if (noteMatch) {
      const [, side, target, label] = noteMatch
      const participant = target.trim()
      addParticipant(participant)
      messages.push({
        isNote: true,
        label: label.replaceAll('\\n', '\n'),
        noteSide: side as 'left' | 'right',
        target: participant,
      })
      return
    }

    const messageMatch = /^([^-\s]+)\s*(-{1,2}>>?|-->)\s*([^:]+):\s*(.+)$/.exec(
      line
    )

    if (!messageMatch) {
      return
    }

    const [, from, arrow, to, label] = messageMatch
    const fromName = from.trim()
    const toName = to.trim()
    addParticipant(fromName)
    addParticipant(toName)
    messages.push({
      from: fromName,
      label,
      lineStyle: arrow.startsWith('--') ? 'dashed' : 'solid',
      target: toName,
      to: toName,
    })
  })

  return { messages, participants }
}

function renderSequenceDiagram(source: string): string {
  const { messages, participants } = parseSequenceDiagram(source)
  const laneGap = 190
  const marginX = 80
  const top = 42
  const rowGap = 72
  const width = Math.max(
    360,
    marginX * 2 + Math.max(0, participants.length - 1) * laneGap
  )
  const height = Math.max(180, 126 + messages.length * rowGap)
  const positions = new Map(
    participants.map((participant, index) => [
      participant,
      marginX + index * laneGap,
    ])
  )
  const participantBoxes = participants
    .map((participant) => {
      const x = positions.get(participant) ?? marginX
      const label = escapeHtml(participant)

      return `
        <rect x="${x - 64}" y="${top}" width="128" height="44" rx="4" ry="4" class="markdown-diagram-node" />
        <text x="${x}" y="${top + 27}" text-anchor="middle" class="markdown-diagram-text">${label}</text>
        <line x1="${x}" y1="${top + 44}" x2="${x}" y2="${height - 46}" class="markdown-sequence-lifeline" />
        <rect x="${x - 64}" y="${height - 46}" width="128" height="44" rx="4" ry="4" class="markdown-diagram-node" />
        <text x="${x}" y="${height - 19}" text-anchor="middle" class="markdown-diagram-text">${label}</text>
      `
    })
    .join('')
  const renderedMessages = messages
    .map((message, index) => {
      const y = top + 78 + index * rowGap

      if (message.isNote) {
        const targetX = positions.get(message.target) ?? marginX
        const noteX = message.noteSide === 'left' ? targetX - 154 : targetX + 24
        const lines = message.label.split('\n')
        const noteHeight = 28 + Math.max(0, lines.length - 1) * 16
        const textLines = lines
          .map((line, lineIndex) => {
            return `<text x="${noteX + 8}" y="${y + 18 + lineIndex * 16}" class="markdown-sequence-note-text">${escapeHtml(line)}</text>`
          })
          .join('')

        return `
          <rect x="${noteX}" y="${y}" width="132" height="${noteHeight}" rx="3" ry="3" class="markdown-sequence-note" />
          ${textLines}
        `
      }

      const fromX = positions.get(message.from ?? '') ?? marginX
      const toX = positions.get(message.to ?? '') ?? marginX
      const labelX = (fromX + toX) / 2
      const label = escapeHtml(message.label)
      const dash =
        message.lineStyle === 'dashed' ? ' stroke-dasharray="4 4"' : ''

      return `
        <line x1="${fromX}" y1="${y}" x2="${toX}" y2="${y}" class="markdown-diagram-edge"${dash} marker-end="url(#markdown-diagram-arrow)" />
        <text x="${labelX}" y="${y - 8}" text-anchor="middle" class="markdown-diagram-edge-label">${label}</text>
      `
    })
    .join('')

  return `
    <div class="not-prose markdown-diagram">
      <svg data-diagram="sequence" viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="xMidYMin meet">
        <defs>
          <marker id="markdown-diagram-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 8 4 L 0 8 z" class="markdown-diagram-arrow" />
          </marker>
        </defs>
        ${participantBoxes}
        ${renderedMessages}
      </svg>
    </div>
  `
}

export function slugifyHeading(text: string): string {
  const plainText = text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_#]/g, '')
    .trim()
  const slug = plainText
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'section'
}

const headingIdCounts = new Map<string, number>()

function nextHeadingId(slug: string): string {
  const count = headingIdCounts.get(slug) ?? 0
  headingIdCounts.set(slug, count + 1)

  return count === 0 ? slug : `${slug}-${count}`
}

export interface HeadingAnchor {
  id: string
  level: number
  text: string
}

function headingText(tokens: Token[]): string {
  return tokens
    .map((token) => ('text' in token ? String(token.text) : token.raw ?? ''))
    .join('')
    .trim()
}

const COPY_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'

const CODE_LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  shell: 'bash',
  sh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  golang: 'go',
  py: 'python',
}

function normalizeCodeLanguage(language?: string): string {
  const lang = (language ?? '').trim().toLowerCase()
  return CODE_LANGUAGE_ALIASES[lang] ?? (lang || 'text')
}

const markdownRenderer = new Renderer()

markdownRenderer.code = (token: Tokens.Code): string => {
  const language = token.lang?.toLowerCase()

  if (language === 'math' || language === 'katex' || language === 'latex') {
    return renderMath(token.text, true)
  }

  if (language === 'flow') {
    return renderFlowDiagram(token.text)
  }

  if (language === 'seq') {
    return renderSequenceDiagram(token.text)
  }

  const lang = normalizeCodeLanguage(token.lang)
  const escaped = escapeHtml(token.text)

  return (
    '<div class="doc-code" data-lang="' +
    lang +
    '">' +
    '<div class="doc-code-head">' +
    '<span class="doc-code-lang">' +
    lang +
    '</span>' +
    '<button class="doc-code-copy" type="button" aria-label="复制代码">' +
    COPY_ICON +
    '</button>' +
    '</div>' +
    '<div class="doc-code-body"><pre><code>' +
    escaped +
    '</code></pre></div>' +
    '</div>'
  )
}

markdownRenderer.heading = function (token: Tokens.Heading): string {
  const text = headingText(token.tokens)
  const id = nextHeadingId(slugifyHeading(text))
  const innerHtml = this.parser.parseInline(token.tokens)

  return `<h${token.depth} id="${id}">${innerHtml}</h${token.depth}>`
}

const markdownExtensions: MarkedExtension[] = [
  {
    walkTokens(token) {
      if (token.type !== 'text') {
        return
      }

      token.text = replaceEmojiShortcodes(token.text)
    },
    extensions: [
      {
        level: 'block',
        name: 'pageBreak',
        renderer() {
          return '<hr class="markdown-page-break">'
        },
        start(source: string) {
          return source.match(/^\[========\]/m)?.index
        },
        tokenizer(source: string) {
          const match = /^\[========\](?:\n|$)/.exec(source)

          if (!match) {
            return undefined
          }

          return {
            raw: match[0],
            type: 'pageBreak',
          }
        },
      },
      {
        level: 'block',
        name: 'blockMath',
        renderer(token) {
          return renderMath(String(token.text), true)
        },
        start(source: string) {
          return source.match(/^\$\$/m)?.index
        },
        tokenizer(source: string) {
          const match = /^\$\$\n?([\s\S]+?)\n?\$\$(?:\n|$)/.exec(source)

          if (!match) {
            return undefined
          }

          return {
            raw: match[0],
            text: match[1],
            type: 'blockMath',
          }
        },
      },
      {
        level: 'inline',
        name: 'inlineMath',
        renderer(token) {
          return renderMath(String(token.text), false)
        },
        start(source: string) {
          const index = source.indexOf('$$')

          if (index === -1) {
            return undefined
          }

          return index
        },
        tokenizer(source: string) {
          const match = /^\$\$([^\n$]+?)\$\$/.exec(source)

          if (!match) {
            return undefined
          }

          return {
            raw: match[0],
            text: match[1],
            type: 'inlineMath',
          }
        },
      },
    ],
  },
]

const markdownParser = new Marked({
  ...markdownOptions,
  renderer: markdownRenderer,
})

markdownParser.use(...markdownExtensions)

function addExternalLinkAttributes(html: string): string {
  if (typeof window === 'undefined') {
    return html
  }

  const template = document.createElement('template')
  template.innerHTML = html

  template.content.querySelectorAll('a[href]').forEach((link) => {
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
  })

  return template.innerHTML
}

/**
 * 提取文档中的 ::endpoint / :::callout 结构化块，替换为占位元素，
 * 避免 marked 把块内容当作普通 markdown 解析。渲染后再还原为 HTML。
 */
function extractDocBlocks(markdown: string): {
  blocks: string[]
  text: string
} {
  const blocks: string[] = []

  const text = markdown.replace(
    /^:::+(info|warning|tip|note|danger)(?:\s+([^\n]+))?\n([\s\S]*?)\n:::+(?:\n|$)|^:::endpoint\s+([A-Z]+)\s+(\S+)\s*$/gm,
    (
      _match,
      kind: string,
      title: string,
      body: string,
      method: string,
      path: string
    ) => {
      const index = blocks.length
      let html: string

      if (kind) {
        const kindLabel = title?.trim() || kind
        const bodyHtml = markdownParser.parse(body.trim(), markdownOptions)
        html =
          '<div class="doc-callout doc-callout-' +
          kind +
          '">' +
          '<div class="doc-callout-title">' +
          escapeHtml(kindLabel) +
          '</div>' +
          '<div class="doc-callout-body">' +
          bodyHtml +
          '</div>' +
          '</div>'
      } else {
        const lower = method.toLowerCase()
        html =
          '<div class="doc-endpoint">' +
          '<span class="doc-endpoint-method doc-endpoint-method-' +
          lower +
          '">' +
          escapeHtml(method) +
          '</span>' +
          '<code class="doc-endpoint-path">' +
          escapeHtml(path) +
          '</code>' +
          '</div>'
      }

      blocks.push(html)
      return '<div class="doc-ph" data-i="' + index + '"></div>'
    }
  )

  return { blocks, text }
}

function restoreDocBlocks(html: string, blocks: string[]): string {
  return html.replace(
    /<div class="doc-ph" data-i="(\d+)"><\/div>/g,
    (_match, index: string) => {
      return blocks[Number(index)] ?? ''
    }
  )
}

function renderMarkdown(markdown: string, breaks = false): string {
  headingIdCounts.clear()
  const { blocks, text } = extractDocBlocks(markdown)
  const parsedHtml = markdownParser.parse(text, {
    ...markdownOptions,
    breaks,
  })
  const restored = restoreDocBlocks(parsedHtml, blocks)
  const html = DOMPurify.sanitize(restored, sanitizeOptions)

  return addExternalLinkAttributes(html)
}

const docStyles = `
.doc-code {
  margin: 1rem 0;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  overflow: hidden;
  background: #282c34;
}
.doc-code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.6rem 0.3rem 0.85rem;
  background: #21252b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.doc-code-lang {
  font-family: var(--font-mono);
  font-size: 11px;
  color: #9da5b4;
  letter-spacing: 0.02em;
}
.doc-code-copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #9da5b4;
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
}
.doc-code-copy:hover {
  color: #e6e6e6;
  background: rgba(255, 255, 255, 0.08);
}
.doc-code-copied {
  color: #98c379 !important;
}
.doc-code-body {
  overflow-x: auto;
}
.doc-code-body pre {
  margin: 0 !important;
  padding: 0.875rem 1rem !important;
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
}
.doc-code-body pre code {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  font-size: 13px !important;
  line-height: 1.65 !important;
  font-family: var(--font-mono) !important;
}
.doc-code-body .shiki {
  background: transparent !important;
  color: #abb2bf !important;
}
.doc-code-body .line {
  display: inline;
}
.doc-callout {
  margin: 1rem 0;
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
  font-size: 0.875rem;
}
.doc-callout-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.2rem;
}
.doc-callout-body {
  line-height: 1.65;
  color: var(--foreground);
}
.doc-callout-info {
  background: color-mix(in oklch, var(--primary) 6%, var(--background));
  border-color: color-mix(in oklch, var(--primary) 28%, transparent);
}
.doc-callout-info .doc-callout-title {
  color: var(--primary);
}
.doc-callout-warning {
  background: color-mix(in oklch, #f59e0b 8%, var(--background));
  border-color: color-mix(in oklch, #f59e0b 35%, transparent);
}
.doc-callout-warning .doc-callout-title {
  color: #d97706;
}
.doc-callout-tip {
  background: color-mix(in oklch, #10b981 7%, var(--background));
  border-color: color-mix(in oklch, #10b981 30%, transparent);
}
.doc-callout-tip .doc-callout-title {
  color: #059669;
}
.doc-callout-danger {
  background: color-mix(in oklch, #ef4444 6%, var(--background));
  border-color: color-mix(in oklch, #ef4444 30%, transparent);
}
.doc-callout-danger .doc-callout-title {
  color: #dc2626;
}
.doc-callout-note {
  background: color-mix(in oklch, var(--muted) 45%, var(--background));
  border-color: var(--border);
}
.doc-callout-note .doc-callout-title {
  color: var(--muted-foreground);
}
.doc-endpoint {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin: 1rem 0;
  padding: 0.35rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: color-mix(in oklch, var(--muted) 35%, var(--background));
  font-family: var(--font-mono);
}
.doc-endpoint-method {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  padding: 0.14rem 0.45rem;
  border-radius: 4px;
  color: #fff;
}
.doc-endpoint-method-get {
  background: #10b981;
}
.doc-endpoint-method-post {
  background: #3b82f6;
}
.doc-endpoint-method-put {
  background: #f59e0b;
}
.doc-endpoint-method-delete {
  background: #ef4444;
}
.doc-endpoint-method-patch {
  background: #8b5cf6;
}
.doc-endpoint-path {
  font-size: 12.5px;
  color: var(--foreground);
  background: transparent !important;
  padding: 0 !important;
}
`

export function Markdown(props: MarkdownProps) {
  const { breaks = false, children, className } = props
  const html = useMemo(() => renderMarkdown(children, breaks), [breaks, children])
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = hostRef.current

    if (!root) {
      return
    }

    // 用 shiki 异步高亮代码块
    root
      .querySelectorAll<HTMLElement>('.doc-code code')
      .forEach((codeEl) => {
        const block = codeEl.closest<HTMLElement>('.doc-code')
        const lang = block?.getAttribute('data-lang') ?? 'text'
        const raw = codeEl.textContent ?? ''
        const body = codeEl.closest<HTMLElement>('.doc-code-body')

        if (!body || !raw.trim()) {
          return
        }

        void codeToHtml(raw, { lang, theme: 'one-dark-pro' })
          .then((highlighted) => {
            body.innerHTML = highlighted
          })
          .catch(() => {})
      })

    // 复制按钮（事件委托）
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement
      const button = target.closest<HTMLElement>('.doc-code-copy')

      if (!button) {
        return
      }

      const block = button.closest<HTMLElement>('.doc-code')
      const codeEl = block?.querySelector('code')
      const text = codeEl?.textContent ?? ''

      if (!navigator.clipboard) {
        return
      }

      void navigator.clipboard.writeText(text).then(() => {
        button.classList.add('doc-code-copied')
        button.setAttribute('aria-label', '已复制')
        window.setTimeout(() => {
          button.classList.remove('doc-code-copied')
          button.setAttribute('aria-label', '复制代码')
        }, 1600)
      })
    }

    root.addEventListener('click', handleClick)

    return () => root.removeEventListener('click', handleClick)
  }, [html])

  return (
    <>
      <style>{docStyles}</style>
      <div
        ref={hostRef}
        className={cn(
          'prose prose-sm dark:prose-invert max-w-none',
          '[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:scroll-mt-24',
          '[&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:scroll-mt-24',
          '[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:scroll-mt-24',
          '[&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:font-semibold',
          '[&_p]:my-2 [&_p]:leading-relaxed [&_strong]:font-semibold [&_em]:italic',
          '[&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80',
          '[&_ol]:my-2 [&_ul]:my-2 [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:pl-5 [&_ul]:pl-5 [&_li]:my-1 [&_li]:pl-1',
          '[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:bg-muted/50 [&_blockquote]:py-1 [&_blockquote]:pl-4',
          '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]',
          '[&_table]:my-4 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse',
          '[&_thead]:bg-muted/60 [&_th]:border [&_td]:border [&_th]:px-3.5 [&_td]:px-3.5 [&_th]:py-2.5 [&_td]:py-2.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_td]:text-sm [&_td]:leading-relaxed',
          '[&_tbody_tr]:transition-colors hover:[&_tbody_tr]:bg-muted/30',
          '[&_hr]:my-6 [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg',
          '[&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden',
          '[&_.markdown-page-break]:my-6 [&_.markdown-page-break]:border-dashed',
          '[&_.markdown-diagram]:my-4 [&_.markdown-diagram]:overflow-x-auto [&_.markdown-diagram]:rounded-md [&_.markdown-diagram]:border [&_.markdown-diagram]:bg-background [&_.markdown-diagram]:p-4',
          '[&_.markdown-diagram_svg]:mx-auto [&_.markdown-diagram_svg]:max-w-full',
          '[&_.markdown-diagram-node]:fill-[color-mix(in_oklch,var(--primary)_8%,var(--background))] [&_.markdown-diagram-node]:stroke-primary [&_.markdown-diagram-node]:stroke-[1.5]',
          '[&_.markdown-diagram-text]:fill-foreground [&_.markdown-diagram-text]:text-sm [&_.markdown-diagram-text]:font-medium',
          '[&_.markdown-diagram-edge]:stroke-muted-foreground [&_.markdown-diagram-edge]:stroke-[1.5] [&_.markdown-diagram-edge]:fill-none',
          '[&_.markdown-diagram-arrow]:fill-muted-foreground',
          '[&_.markdown-diagram-edge-label]:fill-muted-foreground [&_.markdown-diagram-edge-label]:text-xs',
          '[&_.markdown-sequence-lifeline]:stroke-primary [&_.markdown-sequence-lifeline]:stroke-[1.5]',
          '[&_.markdown-sequence-note]:fill-warning/20 [&_.markdown-sequence-note]:stroke-warning',
          '[&_.markdown-sequence-note-text]:fill-foreground [&_.markdown-sequence-note-text]:text-xs',
          '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
          '[overflow-wrap:anywhere]',
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
