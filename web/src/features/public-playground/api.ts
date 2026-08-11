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
import type { ChatMessage, PublicPlaygroundConfig } from './types'

export interface ChatCallbacks {
  onUpdate: (chunk: string) => void
  onComplete: () => void
  onError: (error: string) => void
}

export function buildPayload(
  messages: ChatMessage[],
  config: PublicPlaygroundConfig
): Record<string, unknown> {
  return {
    model: config.model,
    messages: messages
      .filter((m) => m.content?.trim())
      .map((m) => ({ role: m.role, content: m.content })),
    temperature: config.temperature,
    top_p: config.top_p,
    max_tokens: config.max_tokens,
    stream: config.stream,
  }
}

export function normalizeBaseUrl(url: string): string {
  let u = url.trim().replace(/\/+$/, '')
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    u = 'https://' + u
  }
  return u
}

export async function sendStreamingChat(
  messages: ChatMessage[],
  config: PublicPlaygroundConfig,
  callbacks: ChatCallbacks,
  signal?: AbortSignal
) {
  const base = normalizeBaseUrl(config.baseUrl)
  const url = `${base}/chat/completions`
  const payload = buildPayload(messages, config)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`
  }

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal,
    })

    if (!resp.ok) {
      let text = ''
      try {
        text = await resp.text()
      } catch {
        // ignore
      }
      let msg = `HTTP ${resp.status}`
      try {
        const parsed = JSON.parse(text) as { error?: { message?: string; code?: string } }
        if (parsed.error?.message) msg = parsed.error.message
      } catch {
        if (text) msg += ' ' + text.slice(0, 200)
      }
      callbacks.onError(msg)
      return
    }

    if (!config.stream) {
      const data = (await resp.json()) as {
        choices?: Array<{ message?: { content?: string } }>
      }
      const content = data.choices?.[0]?.message?.content ?? ''
      if (content) callbacks.onUpdate(content)
      callbacks.onComplete()
      return
    }

    const reader = resp.body?.getReader()
    if (!reader) {
      callbacks.onError('No response body')
      return
    }
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const s = line.trim()
        if (!s || !s.startsWith('data:')) continue
        const data = s.slice(5).trim()
        if (!data || data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data) as {
            choices?: Array<{ delta?: { content?: string; reasoning_content?: string } }>
          }
          const delta = parsed.choices?.[0]?.delta
          const content = delta?.content ?? ''
          const reasoning = delta?.reasoning_content ?? ''
          if (content) callbacks.onUpdate(content)
          if (reasoning) callbacks.onUpdate(reasoning)
        } catch {
          // ignore malformed line
        }
      }
    }
    callbacks.onComplete()
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'AbortError') {
      callbacks.onComplete()
      return
    }
    const msg = err instanceof Error ? err.message : String(err)
    callbacks.onError(msg)
  }
}
