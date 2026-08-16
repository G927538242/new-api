import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'
import { Eye, Search, ShieldCheck, ShieldX } from 'lucide-react'

import { SectionPageLayout } from '@/components/layout'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

import { getCertificationDetail, getCertifications, forceCertification, getCertUsers, reviewCertification } from '../api'
import {
  ADMIN_STATUS_OPTIONS,
  CERT_RECORD_STATUS_BADGE_VARIANTS,
  CERT_RECORD_STATUS_LABELS,
  CERT_STATUS_LABELS,
  CERT_TYPE_LABELS,
} from '../constants'
import type { AdminCertItem, CertRecordStatus, CertType, UnverifiedUser } from '../types'
import { CertImage } from '../components/certification-upload'
import { searchUsers } from '@/features/users/api'
import type { User } from '@/features/users/types'

function formatTime(ts: number): string {
  if (!ts) return '-'
  return new Date(ts * 1000).toLocaleString()
}

// 不同审核状态使用不同背景色，便于快速识别
const CERT_STATUS_BADGE_BG: Record<CertRecordStatus, string> = {
  0: 'bg-warning/15 text-warning',
  1: 'bg-success/15 text-success',
  2: 'bg-destructive/15 text-destructive',
}

function CertStatusBadge({ status }: { status: CertRecordStatus }) {
  return (
    <StatusBadge
      variant={CERT_RECORD_STATUS_BADGE_VARIANTS[status]}
      label={CERT_RECORD_STATUS_LABELS[status]}
      className={CERT_STATUS_BADGE_BG[status]}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// 详情对话框
// ─────────────────────────────────────────────────────────────

interface DetailDialogProps {
  item: AdminCertItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CertificationDetailDialog({ item, open, onOpenChange }: DetailDialogProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [reason, setReason] = React.useState('')
  const isPersonal = item?.type === 'personal'

  // 拉取详情（含 parent_enterprise_name）
  const detailQuery = useQuery({
    queryKey: ['admin-certification-detail', item?.id],
    queryFn: () => {
      if (!item) return Promise.resolve(null)
      return getCertificationDetail(item.id)
    },
    enabled: open && !!item,
  })
  const detailData = detailQuery.data?.data ?? null
  const parentEnterpriseName =
    detailData?.parent_enterprise_name || item?.parent_enterprise_name

  const reviewMutation = useMutation({
    mutationFn: reviewCertification,
    onSuccess: (res) => {
      if (res.success) {
        toast.success('审核完成')
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: ['admin-certifications'] })
      } else {
        toast.error(res.message || t('Operation failed'))
      }
    },
    onError: () => toast.error(t('Operation failed')),
  })

  const handleReview = (action: 'approve' | 'reject') => {
    if (!item) return
    if (action === 'reject' && !reason.trim()) {
      toast.error('请填写驳回原因')
      return
    }
    reviewMutation.mutate({
      id: item.id,
      action,
      reason: action === 'reject' ? reason.trim() : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>认证审核</DialogTitle>
          <DialogDescription>
            用户信息与证件资料，请仔细核对后审核
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className='space-y-5'>
            <div className='flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3'>
              <div>
                <div className='text-sm font-medium'>用户：{item.username || '-'}</div>
                <div className='text-xs text-muted-foreground'>
                  邮箱：{item.email || '-'} · 提交时间：{formatTime(item.created_at)}
                </div>
              </div>
              <CertStatusBadge status={item.status} />
            </div>

            {parentEnterpriseName && (
              <div className='rounded-lg border bg-blue-50/50 px-4 py-3 dark:bg-blue-950/20'>
                <div className='text-xs text-muted-foreground'>所属企业</div>
                <div className='mt-0.5 font-medium text-blue-700 dark:text-blue-300'>
                  {parentEnterpriseName}
                </div>
              </div>
            )}

            <div className='grid gap-4 text-sm sm:grid-cols-2'>
              <div>
                <div className='text-muted-foreground'>认证类型</div>
                <div className='font-medium'>{CERT_TYPE_LABELS[item.type]}</div>
              </div>
              <div>
                <div className='text-muted-foreground'>
                  {isPersonal ? '真实姓名' : '企业名称'}
                </div>
                <div className='font-medium'>{item.real_name || '-'}</div>
              </div>
              <div>
                <div className='text-muted-foreground'>
                  {isPersonal ? '身份证号' : '统一社会信用代码'}
                </div>
                <div className='font-medium'>{item.id_card_no || '-'}</div>
              </div>
              {!isPersonal && (
                <div>
                  <div className='text-muted-foreground'>联系人</div>
                  <div className='font-medium'>
                    {item.contact_name || '-'}
                    {item.contact_phone ? ` · ${item.contact_phone}` : ''}
                  </div>
                </div>
              )}
              {item.contact_phone && isPersonal && (
                <div>
                  <div className='text-muted-foreground'>联系电话</div>
                  <div className='font-medium'>{item.contact_phone}</div>
                </div>
              )}
            </div>

            <div>
              <div className='mb-2 text-sm font-medium'>证件资料</div>
              <div className='grid gap-4 sm:grid-cols-2'>
                {isPersonal ? (
                  <>
                    {item.id_card_front && (
                      <div className='space-y-1.5'>
                        <div className='text-xs text-muted-foreground'>身份证正面</div>
                        <CertImage url={item.id_card_front} className='w-full' previewable />
                      </div>
                    )}
                    {item.id_card_back && (
                      <div className='space-y-1.5'>
                        <div className='text-xs text-muted-foreground'>身份证反面</div>
                        <CertImage url={item.id_card_back} className='w-full' previewable />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {item.business_license && (
                      <div className='space-y-1.5 sm:col-span-2'>
                        <div className='text-xs text-muted-foreground'>营业执照</div>
                        <CertImage url={item.business_license} className='w-full sm:max-w-[50%]' previewable />
                      </div>
                    )}
                    {item.contact_id_front && (
                      <div className='space-y-1.5'>
                        <div className='text-xs text-muted-foreground'>经办人身份证正面</div>
                        <CertImage url={item.contact_id_front} className='w-full' previewable />
                      </div>
                    )}
                    {item.contact_id_back && (
                      <div className='space-y-1.5'>
                        <div className='text-xs text-muted-foreground'>经办人身份证反面</div>
                        <CertImage url={item.contact_id_back} className='w-full' previewable />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {item.status === 2 && item.reject_reason && (
              <div className='rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm'>
                <div className='font-medium text-destructive'>驳回原因</div>
                <div className='mt-1 text-foreground'>{item.reject_reason}</div>
              </div>
            )}

            {item.status === 0 && (
              <div className='space-y-2'>
                <Label htmlFor='reject-reason'>驳回原因（驳回时必填）</Label>
                <Textarea
                  id='reject-reason'
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder='请输入驳回原因，将展示给用户'
                  rows={2}
                />
              </div>
            )}
          </div>
        )}

        {item?.status === 0 && (
          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              className='text-destructive hover:text-destructive'
              disabled={reviewMutation.isPending}
              onClick={() => handleReview('reject')}
            >
              <ShieldX className='size-4' />
              驳回
            </Button>
            <Button
              disabled={reviewMutation.isPending}
              onClick={() => handleReview('approve')}
            >
              <ShieldCheck className='size-4' />
              通过
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────────
// 强制认证对话框（管理员直接标记用户已认证，无需用户提交材料）
// ─────────────────────────────────────────────────────────────

function ForceCertificationDialog({
  open,
  onOpenChange,
  initialUser,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialUser?: UnverifiedUser | null
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = React.useState('')
  const [searchText, setSearchText] = React.useState('')
  const [selected, setSelected] = React.useState<User | null>(null)
  const [type, setType] = React.useState<CertType>('personal')
  const [realName, setRealName] = React.useState('')
  const [idCardNo, setIdCardNo] = React.useState('')

  // 从"未认证用户"列表直接发起强制认证时，预设已选用户
  React.useEffect(() => {
    if (open && initialUser) {
      setSelected({
        id: initialUser.id,
        username: initialUser.username,
        email: initialUser.email || '',
        display_name: initialUser.display_name || '',
        cert_status: initialUser.cert_status ?? 0,
      } as User)
      setRealName(initialUser.display_name || '')
    }
  }, [open, initialUser])

  // 按关键字搜索全量用户（含未提交认证的用户）
  const searchQuery = useQuery({
    queryKey: ['admin-certification-user-search', searchText],
    queryFn: () => searchUsers({ keyword: searchText, page_size: 10 }),
    enabled: open && searchText.trim().length > 0,
  })
  const searchItems = searchQuery.data?.data?.items ?? []

  const forceMutation = useMutation({
    mutationFn: forceCertification,
    onSuccess: (res) => {
      if (res.success) {
        toast.success('强制认证成功')
        onOpenChange(false)
        setSelected(null)
        setRealName('')
        setIdCardNo('')
        queryClient.invalidateQueries({ queryKey: ['admin-certifications'] })
      } else {
        toast.error(res.message || t('Operation failed'))
      }
    },
    onError: () => toast.error(t('Operation failed')),
  })

  const handleSubmit = () => {
    if (!selected) {
      toast.error('请先搜索并选择要认证的用户')
      return
    }
    if (!realName.trim()) {
      toast.error('请填写姓名/企业名称')
      return
    }
    forceMutation.mutate({
      user_id: selected.id,
      type,
      real_name: realName.trim(),
      id_card_no: idCardNo.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>强制认证</DialogTitle>
          <DialogDescription>
            先搜索目标用户（包括未提交认证的客户），确认后直接标记为已认证。请谨慎操作。
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* 用户搜索 */}
          <div className='space-y-2'>
            <Label htmlFor='force-user-search'>搜索用户（用户名/邮箱/昵称）</Label>
            <div className='flex gap-2'>
              <Input
                id='force-user-search'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSearchText(searchInput.trim())
                }}
                placeholder='输入关键字后回车搜索，如手机号或邮箱'
              />
              <Button
                variant='outline'
                type='button'
                onClick={() => setSearchText(searchInput.trim())}
                disabled={!searchInput.trim()}
              >
                <Search className='size-4' />
                搜索
              </Button>
            </div>

            {searchText.trim() && (
              <div className='max-h-48 overflow-y-auto rounded-lg border'>
                {searchQuery.isLoading ? (
                  <div className='p-3 text-sm text-muted-foreground'>搜索中...</div>
                ) : searchItems.length === 0 ? (
                  <div className='p-3 text-sm text-muted-foreground'>未找到匹配用户</div>
                ) : (
                  searchItems.map((user) => (
                    <button
                      key={user.id}
                      type='button'
                      className={`flex w-full items-center justify-between gap-3 border-b px-3 py-2 text-left text-sm transition-colors last:border-b-0 hover:bg-muted/50 ${
                        selected?.id === user.id ? 'bg-muted/70' : ''
                      }`}
                      onClick={() => {
                        setSelected(user)
                        // 若已有认证信息则预填姓名，方便快速操作
                        setRealName((prev) => prev || user.display_name || '')
                      }}
                    >
                      <span className='min-w-0'>
                        <span className='block truncate font-medium'>
                          {user.username}
                          {user.display_name ? `（${user.display_name}）` : ''}
                        </span>
                        <span className='block truncate text-xs text-muted-foreground'>
                          ID: {user.id} · {user.email || '无邮箱'}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.cert_status === 0
                            ? 'bg-muted text-muted-foreground'
                            : user.cert_status === 1
                              ? 'bg-warning/15 text-warning'
                              : user.cert_status === 2
                                ? 'bg-success/15 text-success'
                                : 'bg-destructive/15 text-destructive'
                        }`}
                      >
                        {CERT_STATUS_LABELS[(user.cert_status ?? 0) as keyof typeof CERT_STATUS_LABELS]}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {selected && (
            <div className='flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm'>
              <span className='truncate'>
                已选择：<span className='font-medium'>{selected.username}</span>
                <span className='text-muted-foreground'> (ID: {selected.id})</span>
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelected(null)}
              >
                取消选择
              </Button>
            </div>
          )}

          <div className='space-y-2'>
            <Label>认证类型</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as CertType)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='选择认证类型'>
                  {CERT_TYPE_LABELS[type]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CERT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='force-realname'>
              {type === 'personal' ? '真实姓名' : '企业名称'}
            </Label>
            <Input
              id='force-realname'
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              placeholder={type === 'personal' ? '请输入真实姓名' : '请输入企业名称'}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='force-idcard'>
              {type === 'personal' ? '身份证号（选填）' : '统一社会信用代码（选填）'}
            </Label>
            <Input
              id='force-idcard'
              value={idCardNo}
              onChange={(e) => setIdCardNo(e.target.value)}
              placeholder='选填'
            />
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            disabled={forceMutation.isPending}
            onClick={handleSubmit}
          >
            <ShieldCheck className='size-4' />
            确认认证
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────────────────────
// 认证审核页面
// ─────────────────────────────────────────────────────────────

const pageSize = 10

export function CertificationAdminPage() {
  const { t } = useTranslation()
  const [page, setPage] = React.useState(1)
  const [status, setStatus] = React.useState<number>(-1)
  const [keyword, setKeyword] = React.useState('')
  const [detail, setDetail] = React.useState<AdminCertItem | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [forceOpen, setForceOpen] = React.useState(false)
  const [forceTarget, setForceTarget] = React.useState<UnverifiedUser | null>(null)
  // 认证记录视图（默认"全部"展示所有认证记录，含待审核记录可直接审核）；
  // 仅"未认证用户"(-2) 为用户维度视图，用于强制认证
  const isUserView = status === -2

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-certifications', page, status, keyword],
    queryFn: () =>
      (isUserView
        ? getCertUsers({
            page,
            page_size: pageSize,
            keyword,
            cert_status: status === -2 ? 0 : -1,
          })
        : getCertifications({ page, page_size: pageSize, status, keyword })
      ).then(
        (res) => res.data
      ) as Promise<{ items: (AdminCertItem | UnverifiedUser)[]; total: number }>,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const openDetail = (item: AdminCertItem) => {
    setDetail(item)
    setDetailOpen(true)
  }

  const openForceFor = (user: UnverifiedUser) => {
    setForceTarget(user)
    setForceOpen(true)
  }

  return (
    <>
      <SectionPageLayout fixedContent>
        <SectionPageLayout.Title>{t('Certification Review')}</SectionPageLayout.Title>
        <SectionPageLayout.Content>
          <Card>
            <CardContent className='p-0'>
              {/* 筛选栏 */}
              <div className='flex flex-wrap items-center gap-3 border-b px-4 py-3'>
                <div className='relative w-64 max-w-full'>
                  <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value)
                      setPage(1)
                    }}
                    placeholder='搜索用户名/邮箱/企业名称'
                    className='pl-9'
                  />
                </div>
                <Select
                  value={String(status)}
                  onValueChange={(v) => {
                    setStatus(Number(v))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className='w-36'>
                    <SelectValue placeholder='状态'>
                      {ADMIN_STATUS_OPTIONS.find((opt) => opt.value === status)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className='ml-auto'
                  onClick={() => {
                    setForceTarget(null)
                    setForceOpen(true)
                  }}
                >
                  <ShieldCheck className='size-4' />
                  强制认证
                </Button>
              </div>

              <Table>
                <TableHeader>
                  {isUserView ? (
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>用户名</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>昵称</TableHead>
                      <TableHead>认证状态</TableHead>
                      <TableHead>注册时间</TableHead>
                      <TableHead className='text-right'>操作</TableHead>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>用户</TableHead>
                      <TableHead>认证类型</TableHead>
                      <TableHead>姓名/企业名</TableHead>
                      <TableHead>所属企业</TableHead>
                      <TableHead>证件号</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead className='text-right'>操作</TableHead>
                    </TableRow>
                  )}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className='h-24 text-center text-muted-foreground'>
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className='h-24 text-center text-muted-foreground'>
                        {isUserView ? '暂无用户' : '暂无认证记录'}
                      </TableCell>
                    </TableRow>
                  ) : isUserView ? (
                    (items as UnverifiedUser[]).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className='font-mono text-xs'>{user.id}</TableCell>
                        <TableCell>
                          <span className='font-medium'>{user.username || '-'}</span>
                        </TableCell>
                        <TableCell className='text-xs'>{user.email || '-'}</TableCell>
                        <TableCell className='max-w-40 truncate text-xs'>
                          {user.display_name || '-'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              user.cert_status === 0
                                ? 'bg-muted text-muted-foreground'
                                : user.cert_status === 1
                                  ? 'bg-warning/15 text-warning'
                                  : user.cert_status === 2
                                    ? 'bg-success/15 text-success'
                                    : 'bg-destructive/15 text-destructive'
                            }`}
                          >
                            {CERT_STATUS_LABELS[
                              (user.cert_status ?? 0) as keyof typeof CERT_STATUS_LABELS
                            ]}
                          </span>
                        </TableCell>
                        <TableCell className='text-xs whitespace-nowrap'>
                          {formatTime(user.created_at)}
                        </TableCell>
                        <TableCell className='text-right'>
                          {user.cert_status === 0 ? (
                            <Button variant='outline' size='sm' onClick={() => openForceFor(user)}>
                              <ShieldCheck className='size-4' />
                              强制认证
                            </Button>
                          ) : (
                            <span className='text-xs text-muted-foreground'>-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    (items as AdminCertItem[]).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className='font-mono text-xs'>{item.id}</TableCell>
                        <TableCell>
                          <div className='font-medium'>{item.username || '-'}</div>
                          <div className='text-xs text-muted-foreground'>
                            {item.email || ''}
                          </div>
                        </TableCell>
                        <TableCell>{CERT_TYPE_LABELS[item.type]}</TableCell>
                        <TableCell className='max-w-40 truncate'>{item.real_name || '-'}</TableCell>
                        <TableCell>
                          {item.parent_enterprise_name ? (
                            <span className='inline-flex items-center rounded-full bg-blue-100/70 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
                              {item.parent_enterprise_name}
                            </span>
                          ) : (
                            <span className='text-muted-foreground'>-</span>
                          )}
                        </TableCell>
                        <TableCell className='font-mono text-xs'>
                          {item.id_card_no || '-'}
                        </TableCell>
                        <TableCell>
                          <CertStatusBadge status={item.status} />
                        </TableCell>
                        <TableCell className='text-xs whitespace-nowrap'>
                          {formatTime(item.created_at)}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant={item.status === 0 ? 'outline' : 'ghost'}
                            size='sm'
                            onClick={() => openDetail(item)}
                          >
                            <Eye className='size-4' />
                            {item.status === 0 ? '审核' : '查看'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* 分页 */}
              <div className='flex items-center justify-between border-t px-4 py-3'>
                <div className='text-xs text-muted-foreground'>
                  共 {total} 条 · 第 {page} / {totalPages} 页
                  {isFetching && ' · 加载中...'}
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    上一页
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </SectionPageLayout.Content>
      </SectionPageLayout>

      <CertificationDetailDialog
        item={detail}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <ForceCertificationDialog
        open={forceOpen}
        onOpenChange={(open) => {
          if (!open) setForceTarget(null)
          setForceOpen(open)
        }}
        initialUser={forceTarget}
      />
    </>
  )
}
