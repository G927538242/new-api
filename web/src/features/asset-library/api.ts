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
import { api } from '@/lib/api'

import type {
  Asset,
  ApiResponse,
  GetAssetsParams,
  GetAssetsResponse,
  SearchAssetsParams,
} from './types'

// ============================================================================
// Asset Library Management
// ============================================================================

// Get paginated assets list
export async function getAssets(
  params: GetAssetsParams = {}
): Promise<GetAssetsResponse> {
  const { p = 1, page_size = 10, type, model, user_id, tenant_id } = params
  const queryParams = new URLSearchParams()
  queryParams.set('p', String(p))
  queryParams.set('page_size', String(page_size))
  if (type) queryParams.set('type', type)
  if (model) queryParams.set('model', model)
  if (user_id) queryParams.set('user_id', String(user_id))
  if (tenant_id) queryParams.set('tenant_id', String(tenant_id))
  const res = await api.get(`/api/asset/?${queryParams.toString()}`)
  return res.data
}

// Search assets by keyword
export async function searchAssets(
  params: SearchAssetsParams
): Promise<GetAssetsResponse> {
  const { keyword = '', type, model, user_id, tenant_id, p = 1, page_size = 10 } = params
  const queryParams = new URLSearchParams()
  queryParams.set('keyword', keyword)
  if (type) queryParams.set('type', type)
  if (model) queryParams.set('model', model)
  if (user_id) queryParams.set('user_id', String(user_id))
  if (tenant_id) queryParams.set('tenant_id', String(tenant_id))
  queryParams.set('p', String(p))
  queryParams.set('page_size', String(page_size))
  const res = await api.get(`/api/asset/search?${queryParams.toString()}`)
  return res.data
}

// Get single asset by ID
export async function getAsset(id: number): Promise<ApiResponse<Asset>> {
  const res = await api.get(`/api/asset/${id}`)
  return res.data
}

// Upload an asset (multipart/form-data, field name "file")
export async function uploadAsset(file: File): Promise<ApiResponse<Asset>> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/api/asset/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

// Delete an asset
export async function deleteAsset(id: number): Promise<ApiResponse> {
  const res = await api.delete(`/api/asset/${id}/`)
  return res.data
}
