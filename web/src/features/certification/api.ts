import { api } from '@/lib/api'

import type {
  AdminCertDetailResponse,
  AdminCertItem,
  AdminCertListResponse,
  ApiResponse,
  CertificationRecord,
  ForceCertificationPayload,
  MyCertificationResponse,
  SubmitCertificationPayload,
  UnverifiedUserListResponse,
  UploadCertificationFileResponse,
} from './types'

// ============================================================================
// 实名认证（用户端）
// ============================================================================

/** 查询当前用户认证状态与最新记录 */
export async function getMyCertification(): Promise<ApiResponse<MyCertificationResponse>> {
  const res = await api.get('/api/user/certification', {
    skipBusinessError: true,
  })
  return res.data
}

/** 提交认证申请 */
export async function submitCertification(
  data: SubmitCertificationPayload
): Promise<ApiResponse<CertificationRecord>> {
  const res = await api.post('/api/user/certification', data)
  return res.data
}

/** 上传认证证件图片 */
export async function uploadCertificationFile(
  file: File
): Promise<ApiResponse<UploadCertificationFileResponse>> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/api/user/certification/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    skipBusinessError: true,
  })
  return res.data
}

// ============================================================================
// 认证审核（管理员端）
// ============================================================================

export interface GetCertificationsParams {
  page?: number
  page_size?: number
  status?: number
  keyword?: string
}

export async function getCertifications(
  params: GetCertificationsParams = {}
): Promise<ApiResponse<AdminCertListResponse>> {
  const { page = 1, page_size = 10, status = -1, keyword = '' } = params
  const queryParams = new URLSearchParams()
  queryParams.set('page', String(page))
  queryParams.set('page_size', String(page_size))
  queryParams.set('status', String(status))
  if (keyword) queryParams.set('keyword', keyword)
  const res = await api.get('/api/certification/list', {
    params: queryParams,
    skipBusinessError: true,
  })
  return res.data
}

export async function getCertificationDetail(
  id: number
): Promise<ApiResponse<AdminCertDetailResponse>> {
  const res = await api.get(`/api/certification/${id}`, {
    skipBusinessError: true,
  })
  return res.data
}

export interface ReviewCertificationPayload {
  id: number
  action: 'approve' | 'reject'
  reason?: string
}

export async function reviewCertification(
  data: ReviewCertificationPayload
): Promise<ApiResponse<AdminCertItem>> {
  const res = await api.post('/api/certification/review', data, {
    skipBusinessError: true,
  })
  return res.data
}

/** 管理员强制认证用户（直接标记为已认证，无需用户提交材料） */
export async function forceCertification(
  data: ForceCertificationPayload
): Promise<ApiResponse<CertificationRecord>> {
  const res = await api.post('/api/certification/force', data, {
    skipBusinessError: true,
  })
  return res.data
}

/** 管理员分页查询用户（认证管理视角）。cert_status=-1 全部，0-3 按状态筛选 */
export async function getCertUsers(params: {
  page?: number
  page_size?: number
  keyword?: string
  cert_status?: number
} = {}): Promise<ApiResponse<UnverifiedUserListResponse>> {
  const { page = 1, page_size = 10, keyword = '', cert_status = -1 } = params
  const queryParams = new URLSearchParams()
  queryParams.set('page', String(page))
  queryParams.set('page_size', String(page_size))
  queryParams.set('cert_status', String(cert_status))
  if (keyword) queryParams.set('keyword', keyword)
  const res = await api.get('/api/certification/users', {
    params: queryParams,
    skipBusinessError: true,
  })
  return res.data
}
