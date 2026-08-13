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
import type { TFunction } from 'i18next'

import type { StatusBadgeProps } from '@/components/status-badge'

import type { AssetStatus, AssetType } from './types'

// ============================================================================
// Asset Type Configuration
// ============================================================================

export const ASSET_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
} as const

export const ASSET_TYPE_VALUES = [
  ASSET_TYPES.IMAGE,
  ASSET_TYPES.VIDEO,
  ASSET_TYPES.AUDIO,
] as const

// labelKey values are i18n keys; use t(config.labelKey) in components
export const ASSET_TYPE_CONFIG: Record<
  AssetType,
  Pick<StatusBadgeProps, 'variant'> & {
    labelKey: string
    value: AssetType
  }
> = {
  [ASSET_TYPES.IMAGE]: {
    labelKey: 'Image',
    variant: 'success',
    value: ASSET_TYPES.IMAGE,
  },
  [ASSET_TYPES.VIDEO]: {
    labelKey: 'Video',
    variant: 'info',
    value: ASSET_TYPES.VIDEO,
  },
  [ASSET_TYPES.AUDIO]: {
    labelKey: 'Audio',
    variant: 'warning',
    value: ASSET_TYPES.AUDIO,
  },
}

export function getAssetTypeOptions(t: TFunction) {
  return Object.values(ASSET_TYPE_CONFIG).map((config) => ({
    label: t(config.labelKey),
    value: config.value,
  }))
}

export function getAssetTypeConfig(type: string) {
  return ASSET_TYPE_CONFIG[type as AssetType]
}

// ============================================================================
// Model Configuration (Sendance models)
// ============================================================================

export const ASSET_MODELS = {
  SENDANCE_2_0: 'sendance-2.0',
  SENDANCE_2_5: 'sendance-2.5',
} as const

export const ASSET_MODEL_VALUES = [
  ASSET_MODELS.SENDANCE_2_0,
  ASSET_MODELS.SENDANCE_2_5,
] as const

export const ASSET_MODEL_CONFIG: Record<
  string,
  { labelKey: string; value: string; variant: StatusBadgeProps['variant'] }
> = {
  [ASSET_MODELS.SENDANCE_2_0]: {
    labelKey: 'Sendance 2.0',
    value: ASSET_MODELS.SENDANCE_2_0,
    variant: 'info',
  },
  [ASSET_MODELS.SENDANCE_2_5]: {
    labelKey: 'Sendance 2.5',
    value: ASSET_MODELS.SENDANCE_2_5,
    variant: 'success',
  },
}

export function getAssetModelOptions(t: TFunction) {
  return Object.values(ASSET_MODEL_CONFIG).map((config) => ({
    label: t(config.labelKey),
    value: config.value,
  }))
}

export function getAssetModelConfig(model: string) {
  return ASSET_MODEL_CONFIG[model]
}

// ============================================================================
// Channel Configuration (upstream asset channels)
// ============================================================================

export const ASSET_CHANNEL_TYPES = {
  VOLCARK: 'volcark', // 字节官方（火山引擎方舟）
  MOMA: 'moma', // 移动 MOMA 平台
} as const

export const ASSET_CHANNEL_TYPE_VALUES = [
  ASSET_CHANNEL_TYPES.VOLCARK,
  ASSET_CHANNEL_TYPES.MOMA,
] as const

export const ASSET_CHANNEL_TYPE_CONFIG: Record<
  string,
  { label: string; value: string; variant: StatusBadgeProps['variant'] }
> = {
  [ASSET_CHANNEL_TYPES.VOLCARK]: {
    label: '字节官方',
    value: ASSET_CHANNEL_TYPES.VOLCARK,
    variant: 'info',
  },
  [ASSET_CHANNEL_TYPES.MOMA]: {
    label: '移动MOMA平台',
    value: ASSET_CHANNEL_TYPES.MOMA,
    variant: 'purple',
  },
}

export function getAssetChannelTypeOptions() {
  return ASSET_CHANNEL_TYPE_VALUES.map((type) => ({
    label: ASSET_CHANNEL_TYPE_CONFIG[type].label,
    value: type,
  }))
}

export function getAssetChannelTypeConfig(type: string) {
  return ASSET_CHANNEL_TYPE_CONFIG[type]
}

// ============================================================================
// Asset Status Configuration
// ============================================================================

export const ASSET_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  ACTIVE: 'active',
  FAILED: 'failed',
  LOCAL: 'local',
} as const

export const ASSET_STATUS_VALUES = [
  ASSET_STATUS.PENDING,
  ASSET_STATUS.PROCESSING,
  ASSET_STATUS.ACTIVE,
  ASSET_STATUS.FAILED,
  ASSET_STATUS.LOCAL,
] as const

export const ASSET_STATUS_CONFIG: Record<
  AssetStatus,
  Pick<StatusBadgeProps, 'variant'> & {
    labelKey: string
    value: AssetStatus
  }
> = {
  [ASSET_STATUS.PENDING]: {
    labelKey: '待处理',
    variant: 'warning',
    value: ASSET_STATUS.PENDING,
  },
  [ASSET_STATUS.PROCESSING]: {
    labelKey: '处理中',
    variant: 'info',
    value: ASSET_STATUS.PROCESSING,
  },
  [ASSET_STATUS.ACTIVE]: {
    labelKey: '已生效',
    variant: 'success',
    value: ASSET_STATUS.ACTIVE,
  },
  [ASSET_STATUS.FAILED]: {
    labelKey: '失败',
    variant: 'danger',
    value: ASSET_STATUS.FAILED,
  },
  [ASSET_STATUS.LOCAL]: {
    labelKey: '本地',
    variant: 'neutral',
    value: ASSET_STATUS.LOCAL,
  },
}

export function getAssetStatusOptions(t: TFunction) {
  return Object.values(ASSET_STATUS_CONFIG).map((config) => ({
    label: t(config.labelKey),
    value: config.value,
  }))
}

export function getAssetStatusConfig(status: string) {
  return ASSET_STATUS_CONFIG[status as AssetStatus]
}

// ============================================================================
// Filter Defaults
// ============================================================================

export const DEFAULT_TYPE_FILTER = ''
export const DEFAULT_MODEL_FILTER = ''
export const DEFAULT_USER_FILTER = ''
export const DEFAULT_TENANT_FILTER = ''

// ============================================================================
// Error Messages (i18n keys; use t(ERROR_MESSAGES.xxx) when displaying)
// ============================================================================

export const ERROR_MESSAGES = {
  UNEXPECTED: 'An unexpected error occurred',
  LOAD_FAILED: 'Failed to load assets',
  SEARCH_FAILED: 'Failed to search assets',
  UPLOAD_FAILED: 'Failed to upload asset',
  DELETE_FAILED: 'Failed to delete asset',
  LOAD_GROUPS_FAILED: '加载分组列表失败',
  CREATE_GROUP_FAILED: '创建分组失败',
  UPDATE_GROUP_FAILED: '更新分组失败',
  DELETE_GROUP_FAILED: '删除分组失败',
  SYNC_FAILED: '同步状态失败',
} as const

// ============================================================================
// Success Messages (i18n keys; use t(SUCCESS_MESSAGES.xxx) when displaying)
// ============================================================================

export const SUCCESS_MESSAGES = {
  ASSET_UPLOADED: 'Asset uploaded successfully',
  ASSET_DELETED: 'Asset deleted successfully',
  COPY_SUCCESS: 'Copied to clipboard',
  GROUP_CREATED: '分组创建成功',
  GROUP_UPDATED: '分组更新成功',
  GROUP_DELETED: '分组删除成功',
  SYNC_SUCCESS: '同步状态成功',
} as const
