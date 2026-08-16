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
export type MessageRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  status?: 'loading' | 'streaming' | 'complete' | 'error'
  error?: string
}

export interface PublicPlaygroundConfig {
  baseUrl: string
  apiKey: string
  model: string
  temperature: number
  top_p: number
  max_tokens: number
  stream: boolean
}

export const DEFAULT_PUBLIC_CONFIG: PublicPlaygroundConfig = {
  baseUrl: window.location.origin + '/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  top_p: 1,
  max_tokens: 4096,
  stream: true,
}

export const STORAGE_KEYS = {
  CONFIG: 'public_playground_config',
  MESSAGES: 'public_playground_messages',
  VIDEO_CONFIG: 'public_playground_video_config',
  VIDEO_TASKS: 'public_playground_video_tasks',
} as const

// ===== Video Generation Types =====

export type VideoMode = 'text-to-video' | 'image-to-video' | 'video-extension'

export type VideoResolutions = '480p' | '720p' | '1080p' | '4k'
export type VideoRatio = '16:9' | '9:16' | '1:1'

export interface VideoContentItem {
  type: 'text' | 'image_url' | 'video_url' | 'audio_url'
  text?: string
  url?: string
  role?: 'first_frame' | 'last_frame' | 'reference_image'
}

export interface VideoGenerationTask {
  id: string
  model: string
  prompt: string
  mode: VideoMode
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  thumbnailUrl?: string
  error?: string
  createdAt: number
  resolution?: string
  ratio?: string
  duration?: number
}

export interface VideoPlaygroundConfig {
  model: string
  prompt: string
  mode: VideoMode
  resolution: VideoResolutions
  ratio: VideoRatio
  duration: number
  imageUrls: string[]
  videoUrl: string
  audioUrl: string
  seed: number
  baseUrl: string
  apiKey: string
}

export const DEFAULT_VIDEO_CONFIG: VideoPlaygroundConfig = {
  model: 'doubao-seedance-2-0-260128',
  prompt: '',
  mode: 'text-to-video',
  resolution: '1080p',
  ratio: '16:9',
  duration: 5,
  imageUrls: [],
  videoUrl: '',
  audioUrl: '',
  seed: -1,
  baseUrl: window.location.origin + '/v1',
  apiKey: '',
}

export interface VideoModelGroup {
  id: string
  name: string
  description: string
  models: VideoModelItem[]
}

export interface VideoModelItem {
  id: string
  name: string
  description: string
  capabilities: string[]
  resolutions: string[]
  ratios: string[]
}

export const VIDEO_MODEL_GROUPS: VideoModelGroup[] = [
  {
    id: 'seedance',
    name: 'Seedance 系列',
    description: '火山引擎豆包视频生成模型，支持文生视频、图生视频和多模态续写',
    models: [
      {
        id: 'doubao-seedance-2-5-260628',
        name: 'Seedance 2.5',
        description: '最新版本，综合能力最强',
        capabilities: ['t2v', 'i2v', 'video-extension'],
        resolutions: ['480p', '720p', '1080p', '4k'],
        ratios: ['16:9', '9:16', '1:1'],
      },
      {
        id: 'doubao-seedance-2-0-260128',
        name: 'Seedance 2.0 标准版',
        description: '平衡质量与速度，适合通用场景',
        capabilities: ['t2v', 'i2v', 'video-extension'],
        resolutions: ['480p', '720p', '1080p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
      {
        id: 'doubao-seedance-2-0-fast-260128',
        name: 'Seedance 2.0 快速版',
        description: '低延迟，快速生成',
        capabilities: ['t2v', 'i2v'],
        resolutions: ['480p', '720p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
      {
        id: 'doubao-seedance-2-0-mini-260615',
        name: 'Seedance 2.0 Mini',
        description: '轻量低成本，批量生成',
        capabilities: ['t2v', 'i2v'],
        resolutions: ['480p', '720p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
      {
        id: 'doubao-seedance-1-5-pro-251215',
        name: 'Seedance 1.5 Pro',
        description: '1.5 增强版，稳定可靠',
        capabilities: ['t2v', 'i2v'],
        resolutions: ['480p', '720p', '1080p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
      {
        id: 'doubao-seedance-1-0-pro-250528',
        name: 'Seedance 1.0 Pro',
        description: '高质量视频生成',
        capabilities: ['t2v', 'i2v'],
        resolutions: ['480p', '720p', '1080p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
      {
        id: 'doubao-seedance-1-0-lite-t2v',
        name: 'Seedance 1.0 Lite (文生)',
        description: '轻量版文生视频',
        capabilities: ['t2v'],
        resolutions: ['480p', '720p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
      {
        id: 'doubao-seedance-1-0-lite-i2v',
        name: 'Seedance 1.0 Lite (图生)',
        description: '轻量版图生视频',
        capabilities: ['i2v'],
        resolutions: ['480p', '720p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
    ],
  },
  {
    id: 'kling',
    name: 'Kling 可灵',
    description: '快手可灵，文生/图生视频',
    models: [
      {
        id: 'kling-v2',
        name: 'Kling V2',
        description: '可灵最新版，质量与速度均衡',
        capabilities: ['t2v', 'i2v'],
        resolutions: ['720p', '1080p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
      {
        id: 'kling-v1',
        name: 'Kling V1',
        description: '可灵初代版本',
        capabilities: ['t2v', 'i2v'],
        resolutions: ['720p'],
        ratios: ['16:9', '9:16'],
      },
    ],
  },
  {
    id: 'cogvideox',
    name: 'CogVideoX',
    description: '智谱视频生成模型',
    models: [
      {
        id: 'cogvideox-2',
        name: 'CogVideoX 2',
        description: '智谱最新视频生成模型',
        capabilities: ['t2v', 'i2v'],
        resolutions: ['720p', '1080p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
    ],
  },
  {
    id: 'vidu',
    name: 'Vidu',
    description: '生数科技视频生成',
    models: [
      {
        id: 'vidu-1',
        name: 'Vidu 1',
        description: '生数科技视频生成模型',
        capabilities: ['t2v'],
        resolutions: ['720p'],
        ratios: ['16:9'],
      },
    ],
  },
  {
    id: 'jimeng',
    name: '即梦 Jimeng',
    description: '字节跳动视频生成',
    models: [
      {
        id: 'jimeng',
        name: 'Jimeng',
        description: '字节跳动即梦视频生成模型',
        capabilities: ['t2v', 'i2v'],
        resolutions: ['720p', '1080p'],
        ratios: ['16:9', '9:16', '1:1'],
      },
    ],
  },
  {
    id: 'sora',
    name: 'Sora',
    description: 'OpenAI 视频生成模型',
    models: [
      {
        id: 'sora',
        name: 'Sora',
        description: 'OpenAI Sora 文生视频模型',
        capabilities: ['t2v'],
        resolutions: ['720p', '1080p'],
        ratios: ['16:9'],
      },
    ],
  },
]
