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
import { z } from 'zod'

// ============================================================================
// Asset Schema & Types
// ============================================================================

export const assetSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  user_name: z.string().optional(),
  tenant_id: z.number().optional(),
  tenant_name: z.string().optional(),
  model: z.string().optional(),
  type: z.string(), // "image" | "video" | "audio"
  name: z.string(),
  storage_key: z.string(),
  url: z.string(),
  size: z.number(), // bytes
  mime_type: z.string(),
  duration: z.number(), // seconds (video/audio)
  width: z.number(),
  height: z.number(),
  created_time: z.number(), // Unix timestamp
})

export type Asset = z.infer<typeof assetSchema>

export type AssetType = 'image' | 'video' | 'audio'

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

export interface GetAssetsParams {
  p?: number
  page_size?: number
  type?: AssetType
  model?: string
  user_id?: number
  tenant_id?: number
}

export interface GetAssetsResponse {
  success: boolean
  message?: string
  data?: {
    items: Asset[]
    total: number
    page: number
    page_size: number
  }
}

export interface SearchAssetsParams {
  keyword?: string
  type?: AssetType
  model?: string
  user_id?: number
  tenant_id?: number
  p?: number
  page_size?: number
}

// ============================================================================
// Dialog Types
// ============================================================================

export type AssetsDialogType = 'delete'
