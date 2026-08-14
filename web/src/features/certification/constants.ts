import type { StatusVariant } from '@/components/status-badge'

import type { CertRecordStatus, CertStatus, CertType } from './types'

export const CERT_STATUS_LABELS: Record<CertStatus, string> = {
  0: '未认证',
  1: '待审核',
  2: '已认证',
  3: '已驳回',
}

export const CERT_STATUS_BADGE_VARIANTS: Record<CertStatus, StatusVariant> = {
  0: 'neutral',
  1: 'warning',
  2: 'success',
  3: 'danger',
}

export const CERT_RECORD_STATUS_LABELS: Record<CertRecordStatus, string> = {
  0: '待审核',
  1: '已通过',
  2: '已驳回',
}

export const CERT_RECORD_STATUS_BADGE_VARIANTS: Record<
  CertRecordStatus,
  StatusVariant
> = {
  0: 'warning',
  1: 'success',
  2: 'danger',
}

export const CERT_TYPE_LABELS: Record<CertType, string> = {
  personal: '个人认证',
  enterprise: '企业认证',
}

/** 管理端筛选状态选项（-2 为未认证用户视图） */
export const ADMIN_STATUS_OPTIONS = [
  { value: -1, label: '全部' },
  { value: -2, label: '未认证用户' },
  { value: 0, label: '待审核' },
  { value: 1, label: '已通过' },
  { value: 2, label: '已驳回' },
]
