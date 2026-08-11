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
  AssetGroup,
  AssetGroupFormValues,
  ApiResponse,
  GetAssetGroupsParams,
  GetAssetGroupsResponse,
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
  const {
    p = 1,
    page_size = 10,
    type,
    model,
    user_id,
    tenant_id,
    group_id,
    status,
  } = params
  const queryParams = new URLSearchParams()
  queryParams.set('p', String(p))
  queryParams.set('page_size', String(page_size))
  if (type) queryParams.set('type', type)
  if (model) queryParams.set('model', model)
  if (user_id) queryParams.set('user_id', String(user_id))
  if (tenant_id) queryParams.set('tenant_id', String(tenant_id))
  if (group_id !== undefined && group_id !== null)
    queryParams.set('group_id', String(group_id))
  if (status) queryParams.set('status', status)
  const res = await api.get(`/api/asset/?${queryParams.toString()}`)
  return res.data
}

// Search assets by keyword
export async function searchAssets(
  params: SearchAssetsParams
): Promise<GetAssetsResponse> {
  const {
    keyword = '',
    type,
    model,
    user_id,
    tenant_id,
    group_id,
    status,
    p = 1,
    page_size = 10,
  } = params
  const queryParams = new URLSearchParams()
  queryParams.set('keyword', keyword)
  if (type) queryParams.set('type', type)
  if (model) queryParams.set('model', model)
  if (user_id) queryParams.set('user_id', String(user_id))
  if (tenant_id) queryParams.set('tenant_id', String(tenant_id))
  if (group_id !== undefined && group_id !== null)
    queryParams.set('group_id', String(group_id))
  if (status) queryParams.set('status', status)
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
export async function uploadAsset(
  file: File,
  groupId?: number
): Promise<ApiResponse<Asset>> {
  const formData = new FormData()
  formData.append('file', file)
  if (groupId !== undefined && groupId !== null) {
    formData.append('group_id', String(groupId))
  }
  const res = await api.post('/api/asset/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    skipBusinessError: true,
  })
  return res.data
}

// Delete an asset
export async function deleteAsset(id: number): Promise<ApiResponse> {
  const res = await api.delete(`/api/asset/${id}/`, {
    skipBusinessError: true,
  })
  return res.data
}

// Sync asset status (pull latest status from upstream)
export async function syncAssetStatus(
  id: number
): Promise<ApiResponse<Asset>> {
  const res = await api.post(`/api/asset/${id}/sync`, undefined, {
    skipBusinessError: true,
  })
  return res.data
}

// ============================================================================
// Asset Group Management
// ============================================================================

// Get asset groups list (supports keyword search)
export async function getAssetGroups(
  params: GetAssetGroupsParams = {}
): Promise<GetAssetGroupsResponse> {
  const queryParams = new URLSearchParams()
  if (params.keyword) queryParams.set('keyword', params.keyword)
  const res = await api.get(`/api/asset-group/?${queryParams.toString()}`)
  return res.data
}

// Get single asset group by ID
export async function getAssetGroup(
  id: number
): Promise<ApiResponse<AssetGroup>> {
  const res = await api.get(`/api/asset-group/${id}`)
  return res.data
}

// Create an asset group
export async function createAssetGroup(
  data: AssetGroupFormValues
): Promise<ApiResponse<AssetGroup>> {
  const res = await api.post('/api/asset-group/', data, {
    skipBusinessError: true,
  })
  return res.data
}

// Update an asset group
export async function updateAssetGroup(
  id: number,
  data: AssetGroupFormValues
): Promise<ApiResponse<AssetGroup>> {
  const res = await api.put(`/api/asset-group/${id}`, data, {
    skipBusinessError: true,
  })
  return res.data
}

// Delete an asset group
export async function deleteAssetGroup(id: number): Promise<ApiResponse> {
  const res = await api.delete(`/api/asset-group/${id}`, {
    skipBusinessError: true,
  })
  return res.data
}
