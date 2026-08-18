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
import type {
  ChatMessage,
  PublicPlaygroundConfig,
  VideoPlaygroundConfig,
  VideoGenerationTask,
} from './types'

export interface ChatCallbacks {
  onUpdate: (chunk: string) => void
  onComplete: () => void
  onError: (error: string) => void
}

export interface VideoCallbacks {
  onSubmitted: (taskId: string) => void
  onCompleted: (task: VideoGenerationTask) => void
  onError: (error: string) => void
  onProgress?: (status: string) => void
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

// ===== Video Generation API =====

function buildVideoPayload(config: VideoPlaygroundConfig): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    model: config.model,
    prompt: config.prompt,
  }

  if (config.resolution) {
    payload.resolution = config.resolution
  }
  if (config.ratio) {
    payload.ratio = config.ratio
  }
  if (config.duration && config.duration > 0) {
    payload.duration = config.duration
  }
  if (config.seed >= 0) {
    payload.seed = config.seed
  }

  const content: Array<Record<string, unknown>> = []

  if (config.mode === 'text-to-video') {
    // only prompt, no additional content
  } else if (config.mode === 'image-to-video') {
    if (config.imageUrls.length > 0) {
      const images = config.imageUrls.map((url, index) => ({
        type: 'image_url',
        image_url: { url },
        role: index === 0 ? 'first_frame' : index === 1 ? 'last_frame' : 'reference_image',
      }))
      content.push(...images)
      payload.images = config.imageUrls
    }
  } else if (config.mode === 'video-extension') {
    config.videoUrls.filter(Boolean).forEach((videoUrl) => {
      content.push({
        type: 'video_url',
        video_url: { url: videoUrl },
      })
    })
    config.audioUrls.filter(Boolean).forEach((audioUrl) => {
      content.push({
        type: 'audio_url',
        audio_url: { url: audioUrl },
      })
    })
  }

  if (content.length > 0) {
    payload.metadata = { content }
  }

  return payload
}

export async function sendVideoGeneration(
  config: VideoPlaygroundConfig,
  callbacks: VideoCallbacks,
  signal?: AbortSignal
) {
  const base = normalizeBaseUrl(config.baseUrl)
  const url = `${base}/video/generations`
  const payload = buildVideoPayload(config)
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

    const data = (await resp.json()) as {
      id?: string
      data?: Array<{ url?: string; status?: string }>
      model?: string
    }

    const taskId = data.id || `task-${Date.now()}`
    const videoUrl = data.data?.[0]?.url

    if (videoUrl) {
      callbacks.onCompleted({
        id: taskId,
        model: config.model,
        prompt: config.prompt,
        mode: config.mode,
        status: 'completed',
        videoUrl,
        createdAt: Date.now(),
        resolution: config.resolution,
        ratio: config.ratio,
        duration: config.duration,
      })
      return
    }

    callbacks.onSubmitted(taskId)
    callbacks.onProgress?.('任务已提交，正在处理中...')

    void pollVideoTask(taskId, config, callbacks, signal)
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'AbortError') {
      return
    }
    const msg = err instanceof Error ? err.message : String(err)
    callbacks.onError(msg)
  }
}

async function pollVideoTask(
  taskId: string,
  config: VideoPlaygroundConfig,
  callbacks: VideoCallbacks,
  signal?: AbortSignal
) {
  const base = normalizeBaseUrl(config.baseUrl)
  const url = `${base}/video/generations/${taskId}`
  const headers: Record<string, string> = {}
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`
  }

  const maxAttempts = 60
  const interval = 5000

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (signal?.aborted) return

    await new Promise((resolve) => setTimeout(resolve, interval))

    try {
      const resp = await fetch(url, { method: 'GET', headers, signal })
      if (!resp.ok) continue

      const data = (await resp.json()) as {
        code?: string
        data?: {
          status?: string
          progress?: string
          result_url?: string
          data?: { content?: { video_url?: string }; status?: string }
        }
      }

      // 后端 GET /v1/video/generations/:task_id 返回 { code, message, data: { status, result_url, data: { content: { video_url } } } }
      const taskData = data?.data
      const status = taskData?.status
      const videoUrl = taskData?.result_url || taskData?.data?.content?.video_url

      if (status === 'SUCCESS' && videoUrl) {
        callbacks.onCompleted({
          id: taskId,
          model: config.model,
          prompt: config.prompt,
          mode: config.mode,
          status: 'completed',
          videoUrl,
          createdAt: Date.now(),
          resolution: config.resolution,
          ratio: config.ratio,
          duration: config.duration,
        })
        return
      }

      if (status === 'FAILURE' || status === 'FAILED') {
        callbacks.onError('视频生成失败，请重试')
        return
      }

      callbacks.onProgress?.(`正在生成中... (${attempt + 1}/${maxAttempts})`)
    } catch {
      // continue polling
    }
  }

  callbacks.onError('视频生成超时，请稍后查询任务状态')
}
