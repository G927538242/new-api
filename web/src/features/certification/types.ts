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
}

export interface AdminCertListResponse {
  items: AdminCertItem[]
  total: number
}

export interface AdminCertDetailResponse {
  record: CertificationRecord
  username: string
  email: string
}
