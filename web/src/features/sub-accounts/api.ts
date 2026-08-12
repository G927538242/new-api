import { api } from '@/lib/api'

import type {
  ApiResponse,
  CreateSubAccountPayload,
  ManageSubAccountPayload,
  SubAccount,
  SubAccountListResponse,
  UpdateSubAccountPayload,
} from './types'

/** 获取子账户列表（分页/搜索） */
export async function getSubAccounts(params: {
  page?: number
  page_size?: number
  keyword?: string
}): Promise<ApiResponse<SubAccountListResponse>> {
  const { page = 1, page_size = 10, keyword = '' } = params
  const queryParams = new URLSearchParams()
  queryParams.set('page', String(page))
  queryParams.set('page_size', String(page_size))
  if (keyword) queryParams.set('keyword', keyword)
  const res = await api.get('/api/user/sub-accounts', {
    params: queryParams,
    skipBusinessError: true,
  })
  return res.data
}

/** 创建子账户 */
export async function createSubAccount(
  data: CreateSubAccountPayload
): Promise<ApiResponse<number>> {
  const res = await api.post('/api/user/sub-accounts', data, {
    skipBusinessError: true,
  })
  return res.data
}

/** 获取子账户详情 */
export async function getSubAccount(id: number): Promise<ApiResponse<SubAccount>> {
  const res = await api.get(`/api/user/sub-accounts/${id}`, {
    skipBusinessError: true,
  })
  return res.data
}

/** 更新子账户信息 */
export async function updateSubAccount(
  id: number,
  data: UpdateSubAccountPayload
): Promise<ApiResponse<unknown>> {
  const res = await api.put(`/api/user/sub-accounts/${id}`, data, {
    skipBusinessError: true,
  })
  return res.data
}

/** 管理子账户（启用/禁用/删除/额度/重置密码） */
export async function manageSubAccount(
  id: number,
  data: ManageSubAccountPayload
): Promise<ApiResponse<unknown>> {
  const res = await api.post(`/api/user/sub-accounts/${id}/manage`, data, {
    skipBusinessError: true,
  })
  return res.data
}
