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
} as const
