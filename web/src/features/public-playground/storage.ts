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
import {
  DEFAULT_PUBLIC_CONFIG,
  DEFAULT_VIDEO_CONFIG,
  STORAGE_KEYS,
} from './types'

export function saveConfig(config: PublicPlaygroundConfig) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config))
  } catch {
    // ignore
  }
}

export function getInitialConfig(): PublicPlaygroundConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG)
    if (!raw) return { ...DEFAULT_PUBLIC_CONFIG, baseUrl: window.location.origin + '/v1' }
    const parsed = JSON.parse(raw) as Partial<PublicPlaygroundConfig>
    return {
      baseUrl: parsed.baseUrl || window.location.origin + '/v1',
      apiKey: parsed.apiKey || '',
      model: parsed.model || DEFAULT_PUBLIC_CONFIG.model,
      temperature: parsed.temperature ?? DEFAULT_PUBLIC_CONFIG.temperature,
      top_p: parsed.top_p ?? DEFAULT_PUBLIC_CONFIG.top_p,
      max_tokens: parsed.max_tokens ?? DEFAULT_PUBLIC_CONFIG.max_tokens,
      stream: parsed.stream ?? DEFAULT_PUBLIC_CONFIG.stream,
    }
  } catch {
    return { ...DEFAULT_PUBLIC_CONFIG, baseUrl: window.location.origin + '/v1' }
  }
}

export function saveMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages))
  } catch {
    // ignore
  }
}

export function loadMessages(): ChatMessage[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES)
    if (!raw) return null
    return JSON.parse(raw) as ChatMessage[]
  } catch {
    return null
  }
}

export function saveVideoConfig(config: VideoPlaygroundConfig) {
  try {
    localStorage.setItem(STORAGE_KEYS.VIDEO_CONFIG, JSON.stringify(config))
  } catch {
    // ignore
  }
}

export function getInitialVideoConfig(): VideoPlaygroundConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIDEO_CONFIG)
    if (!raw) return { ...DEFAULT_VIDEO_CONFIG, baseUrl: window.location.origin + '/v1' }
    const parsed = JSON.parse(raw) as Partial<VideoPlaygroundConfig> & {
      videoUrl?: string
      audioUrl?: string
    }
    // 兼容旧版本：单视频/音频 URL 字段迁移为数组
    const legacyVideoUrls = parsed.videoUrl ? [parsed.videoUrl] : []
    const legacyAudioUrls = parsed.audioUrl ? [parsed.audioUrl] : []
    return {
      model: parsed.model || DEFAULT_VIDEO_CONFIG.model,
      prompt: parsed.prompt || '',
      mode: parsed.mode || DEFAULT_VIDEO_CONFIG.mode,
      resolution: parsed.resolution || DEFAULT_VIDEO_CONFIG.resolution,
      ratio: parsed.ratio || DEFAULT_VIDEO_CONFIG.ratio,
      duration: parsed.duration ?? DEFAULT_VIDEO_CONFIG.duration,
      imageUrls: parsed.imageUrls || [],
      videoUrls: parsed.videoUrls?.length ? parsed.videoUrls : legacyVideoUrls,
      audioUrls: parsed.audioUrls?.length ? parsed.audioUrls : legacyAudioUrls,
      seed: parsed.seed ?? DEFAULT_VIDEO_CONFIG.seed,
      baseUrl: parsed.baseUrl || window.location.origin + '/v1',
      apiKey: parsed.apiKey || '',
    }
  } catch {
    return { ...DEFAULT_VIDEO_CONFIG, baseUrl: window.location.origin + '/v1' }
  }
}

export function saveVideoTasks(tasks: VideoGenerationTask[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.VIDEO_TASKS, JSON.stringify(tasks))
  } catch {
    // ignore
  }
}

export function loadVideoTasks(): VideoGenerationTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIDEO_TASKS)
    if (!raw) return []
    return JSON.parse(raw) as VideoGenerationTask[]
  } catch {
    return []
  }
}

export function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
