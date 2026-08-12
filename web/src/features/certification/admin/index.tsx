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

import { getCertifications, reviewCertification } from '../api'
import {
  ADMIN_STATUS_OPTIONS,
  CERT_RECORD_STATUS_BADGE_VARIANTS,
  CERT_RECORD_STATUS_LABELS,
  CERT_TYPE_LABELS,
} from '../constants'
import type { AdminCertItem } from '../types'
import { CertImage } from '../components/certification-upload'

/** 证件号脱敏：保留前 3 后 4 */
function maskIdCard(no: string): string {
  if (!no || no.length <= 7) return no || '-'
  return `${no.slice(0, 3)}${'*'.repeat(no.length - 7)}${no.slice(-4)}`
}

function formatTime(ts: number): string {
  if (!ts) return '-'
  return new Date(ts * 1000).toLocaleString()
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
              <StatusBadge
                variant={CERT_RECORD_STATUS_BADGE_VARIANTS[item.status]}
                label={CERT_RECORD_STATUS_LABELS[item.status]}
              />
            </div>

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
                <div className='font-medium'>{maskIdCard(item.id_card_no)}</div>
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
                      <div className='space-y-1.5'>
                        <div className='text-xs text-muted-foreground'>营业执照</div>
                        <CertImage url={item.business_license} className='w-full' previewable />
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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-certifications', page, status, keyword],
    queryFn: () => getCertifications({ page, page_size: pageSize, status, keyword }),
  })

  const items = data?.data?.items ?? []
  const total = data?.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const openDetail = (item: AdminCertItem) => {
    setDetail(item)
    setDetailOpen(true)
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
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>用户</TableHead>
                    <TableHead>认证类型</TableHead>
                    <TableHead>姓名/企业名</TableHead>
                    <TableHead>证件号</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead className='text-right'>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                        暂无认证记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
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
                        <TableCell className='font-mono text-xs'>
                          {maskIdCard(item.id_card_no)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            variant={CERT_RECORD_STATUS_BADGE_VARIANTS[item.status]}
                            label={CERT_RECORD_STATUS_LABELS[item.status]}
                          />
                        </TableCell>
                        <TableCell className='text-xs whitespace-nowrap'>
                          {formatTime(item.created_at)}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button variant='ghost' size='sm' onClick={() => openDetail(item)}>
                            <Eye className='size-4' />
                            查看
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
    </>
  )
}
