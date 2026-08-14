export type CertType = 'personal' | 'enterprise'

/** 用户认证状态：0 未认证 / 1 待审核 / 2 已认证 / 3 已驳回 */
export type CertStatus = 0 | 1 | 2 | 3

/** 认证记录审核状态：0 待审核 / 1 已通过 / 2 已驳回 */
export type CertRecordStatus = 0 | 1 | 2

export interface CertificationRecord {
  id: number
  user_id: number
  type: CertType
  status: CertRecordStatus
  real_name: string
  id_card_no: string
  id_card_front: string
  id_card_back: string
  business_license: string
  contact_name: string
  contact_phone: string
  contact_id_front: string
  contact_id_back: string
  reject_reason: string
  created_at: number
  updated_at: number
  // 计算字段（仅后端返回）
  parent_user_id?: number
  parent_enterprise_name?: string
  username?: string
}

export interface MyCertificationResponse {
  cert_status: CertStatus
  record: CertificationRecord | null
}

export interface SubmitCertificationPayload {
  type: CertType
  real_name: string
  id_card_no: string
  id_card_front?: string
  id_card_back?: string
  business_license?: string
  contact_name?: string
  contact_phone?: string
  contact_id_front?: string
  contact_id_back?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface UploadCertificationFileResponse {
  url: string
  key: string
}

export interface AdminCertItem extends CertificationRecord {
  username: string
  email: string
  parent_enterprise_name?: string
}

export interface AdminCertListResponse {
  items: AdminCertItem[]
  total: number
}

export interface AdminCertDetailResponse {
  record: CertificationRecord
  username: string
  email: string
  parent_user_id?: number
  parent_enterprise_name?: string
}

/** 管理员强制认证请求体 */
export interface ForceCertificationPayload {
  user_id?: number
  account?: string
  type: CertType
  real_name: string
  id_card_no?: string
}

/** 未认证用户（用于认证审核页"未认证用户"视图） */
export interface UnverifiedUser {
  id: number
  username: string
  email: string
  display_name: string
  created_at: number
  cert_status: number
}

export interface UnverifiedUserListResponse {
  items: UnverifiedUser[]
  total: number
}
