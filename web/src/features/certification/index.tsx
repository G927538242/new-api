import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

import { SectionPageLayout } from '@/components/layout'
import { StatusBadge } from '@/components/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROLE } from '@/lib/roles'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

import { getMyCertification } from './api'
import { CertificationForm } from './components/certification-form'
import { CertImage } from './components/certification-upload'
import {
  CERT_STATUS_BADGE_VARIANTS,
  CERT_STATUS_LABELS,
  CERT_TYPE_LABELS,
} from './constants'
import type { CertificationRecord } from './types'
import { Clock3, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react'

function StatusHeader({
  certStatus,
  record,
}: {
  certStatus: number
  record?: CertificationRecord | null
}) {
  const configs: Record<number, { icon: React.ReactNode; title: string; desc: string }> = {
    0: {
      icon: <ShieldAlert className='size-5 text-muted-foreground' />,
      title: '尚未完成实名认证',
      desc: '根据平台要求，所有用户必须先完成实名认证后才能使用系统调用 API。',
    },
    1: {
      icon: <Clock3 className='size-5 text-warning' />,
      title: '认证审核中',
      desc: '您的认证申请已提交，管理员审核通过后即可正常使用系统。',
    },
    2: {
      icon: <ShieldCheck className='size-5 text-success' />,
      title: '认证已通过',
      desc: '您已完成实名认证，可以正常使用系统调用 API。',
    },
    3: {
      icon: <ShieldAlert className='size-5 text-destructive' />,
      title: '认证未通过',
      desc: record?.reject_reason
        ? `驳回原因：${record.reject_reason}`
        : '您的认证申请未通过，请修改资料后重新提交。',
    },
  }

  const config = configs[certStatus] ?? configs[0]

  return (
    <Card className={cn('border-l-2', certStatus === 1 && 'border-l-warning', certStatus === 2 && 'border-l-success', certStatus === 3 && 'border-l-destructive')}>
      <CardHeader className='flex flex-row items-start gap-3'>
        <div className='mt-0.5'>{config.icon}</div>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-base'>{config.title}</CardTitle>
            <StatusBadge
              variant={CERT_STATUS_BADGE_VARIANTS[certStatus as 0 | 1 | 2 | 3]}
              label={CERT_STATUS_LABELS[certStatus as 0 | 1 | 2 | 3]}
            />
          </div>
          <CardDescription>{config.desc}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

function ApprovedInfo({ record }: { record: CertificationRecord }) {
  const isPersonal = record.type === 'personal'
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <CheckCircle2 className='size-4 text-success' />
          <CardTitle className='text-base'>认证信息</CardTitle>
        </div>
        <CardDescription>
          {CERT_TYPE_LABELS[record.type]} · {new Date(record.updated_at * 1000).toLocaleDateString()} 通过
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid gap-3 text-sm sm:grid-cols-2'>
          <div>
            <div className='text-muted-foreground'>{isPersonal ? '真实姓名' : '企业名称'}</div>
            <div className='font-medium'>{record.real_name}</div>
          </div>
          <div>
            <div className='text-muted-foreground'>{isPersonal ? '身份证号' : '统一社会信用代码'}</div>
            <div className='font-medium'>{record.id_card_no}</div>
          </div>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          {isPersonal ? (
            <>
              {record.id_card_front && (
                <div className='space-y-1.5'>
                  <div className='text-xs text-muted-foreground'>身份证正面</div>
                  <CertImage url={record.id_card_front} className='aspect-[3/2] w-full' />
                </div>
              )}
              {record.id_card_back && (
                <div className='space-y-1.5'>
                  <div className='text-xs text-muted-foreground'>身份证反面</div>
                  <CertImage url={record.id_card_back} className='aspect-[3/2] w-full' />
                </div>
              )}
            </>
          ) : (
            record.business_license && (
              <div className='space-y-1.5'>
                <div className='text-xs text-muted-foreground'>营业执照</div>
                <CertImage url={record.business_license} className='aspect-[3/2] w-full' />
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function CertificationPage() {
  const { t } = useTranslation()
  const { auth } = useAuthStore()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-certification'],
    queryFn: getMyCertification,
  })

  const certStatus = data?.data?.cert_status ?? 0
  const record = data?.data?.record ?? null
  const isAdmin = (auth.user?.role ?? 0) >= ROLE.ADMIN
  const isSubAccount = auth.user?.is_sub_account === true

  const handleSubmitted = () => {
    // 同步当前用户认证状态为待审核
    const currentUser = auth.user
    if (currentUser) {
      auth.setUser({ ...currentUser, cert_status: 1 })
    }
    refetch()
  }

  const showForm = (certStatus === 0 || certStatus === 3) && !isAdmin

  return (
    <SectionPageLayout>
      <SectionPageLayout.Title>{t('Certification')}</SectionPageLayout.Title>
      <SectionPageLayout.Content>
        <div className='mx-auto max-w-2xl space-y-6'>
          {isLoading ? (
            <div className='py-12 text-center text-sm text-muted-foreground'>
              加载中...
            </div>
          ) : isAdmin ? (
            <Card>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <ShieldCheck className='size-4 text-success' />
                  <CardTitle className='text-base'>管理员账号</CardTitle>
                </div>
                <CardDescription>
                  管理员账号无需实名认证，可直接使用系统全部功能。
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              <StatusHeader certStatus={certStatus} record={record} />

              {certStatus === 2 && record && <ApprovedInfo record={record} />}

              {showForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>提交认证资料</CardTitle>
                    <CardDescription>
                      {certStatus === 3
                        ? '您的申请被驳回，请根据驳回原因修改后重新提交。'
                        : '请如实填写以下信息并上传证件照片，资料提交后由管理员审核。'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CertificationForm
                      initialRecord={certStatus === 3 ? record : null}
                      onSubmitted={handleSubmitted}
                      subAccountOnly={isSubAccount}
                    />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </SectionPageLayout.Content>
    </SectionPageLayout>
  )
}
