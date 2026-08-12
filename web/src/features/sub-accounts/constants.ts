import type { StatusVariant } from '@/components/status-badge'

/** 子账户启用状态 */
export const SUB_ACCOUNT_STATUS = {
  ENABLED: 1,
  DISABLED: 2,
} as const

/** 状态徽章配置 */
export const SUB_ACCOUNT_STATUS_BADGE: Record<number, { variant: StatusVariant; label: string }> = {
  [SUB_ACCOUNT_STATUS.ENABLED]: { variant: 'success', label: '已启用' },
  [SUB_ACCOUNT_STATUS.DISABLED]: { variant: 'danger', label: '已禁用' },
}

export const ERROR_MESSAGES = {
  CREATE_FAILED: 'Failed to create sub-account',
  UPDATE_FAILED: 'Failed to update sub-account',
  MANAGE_FAILED: 'Operation failed',
  QUOTA_INVALID: 'Enter a valid quota',
  PASSWORD_INVALID: 'Password must be 8-20 characters',
  USERNAME_REQUIRED: 'Username is required',
} as const

export const SUCCESS_MESSAGES = {
  CREATED: 'Sub-account created',
  UPDATED: 'Sub-account updated',
  ENABLED: 'Sub-account enabled',
  DISABLED: 'Sub-account disabled',
  DELETED: 'Sub-account deleted',
  QUOTA_ADDED: 'Quota allocated',
  QUOTA_SUBTRACTED: 'Quota deducted',
  QUOTA_OVERRIDDEN: 'Quota adjusted',
  PASSWORD_RESET: 'Password reset',
} as const
