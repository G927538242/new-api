/** 子账户信息（来自后端 /api/user/sub-accounts） */
export interface SubAccount {
  id: number
  username: string
  display_name: string
  role: number
  status: number
  email: string
  quota: number
  used_quota: number
  request_count: number
  group: string
  cert_status: number
  remark: string
  created_at: number
  last_login_at: number
  parent_user_id: number
}

export interface SubAccountListResponse {
  items: SubAccount[]
  total: number
  page: number
  page_size: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface CreateSubAccountPayload {
  username: string
  password: string
  display_name?: string
  quota?: number
  remark?: string
}

export interface UpdateSubAccountPayload {
  display_name?: string
  remark?: string
  group?: string
}

export type SubAccountManageAction =
  | 'enable'
  | 'disable'
  | 'delete'
  | 'add_quota'
  | 'subtract_quota'
  | 'override_quota'
  | 'reset_password'

export interface ManageSubAccountPayload {
  action: SubAccountManageAction
  quota?: number
  value?: string
}
