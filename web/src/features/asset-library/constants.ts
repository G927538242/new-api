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

import type { AssetType } from './types'

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
} as const

// ============================================================================
// Success Messages (i18n keys; use t(SUCCESS_MESSAGES.xxx) when displaying)
// ============================================================================

export const SUCCESS_MESSAGES = {
  ASSET_UPLOADED: 'Asset uploaded successfully',
  ASSET_DELETED: 'Asset deleted successfully',
  COPY_SUCCESS: 'Copied to clipboard',
} as const
