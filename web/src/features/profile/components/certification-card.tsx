import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

import { Building2, CheckCircle2, Clock3, ShieldAlert, ShieldCheck, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROLE } from '@/lib/roles'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

import { getMyCertification } from '../../certification/api'
import { CertificationForm } from '../../certification/components/certification-form'
import {
  CERT_STATUS_BADGE_VARIANTS,
  CERT_STATUS_LABELS,
  CERT_TYPE_LABELS,
} from '../../certification/constants'
import type { CertificationRecord, CertStatus, CertType } from '../../certification/types'

function StatusHeader({
  certStatus,
  record,
}: {
  certStatus: number
  record?: CertificationRecord | null
}) {
  const { t } = useTranslation()
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
              label={t(CERT_STATUS_LABELS[certStatus as CertStatus])}
              className={
                [
                  'bg-neutral/15 text-muted-foreground',
                  'bg-warning/15 text-warning',
                  'bg-success/15 text-success',
                  'bg-destructive/15 text-destructive',
                ][certStatus as 0 | 1 | 2 | 3]
              }
            />
          </div>
          <CardDescription>{config.desc}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

function ApprovedInfo({
  record,
  onSwitch,
  subAccountOnly,
}: {
  record: CertificationRecord
  onSwitch: () => void
  subAccountOnly?: boolean
}) {
  const { t } = useTranslation()
  const isPersonal = record.type === 'personal'
  const otherType: CertType = isPersonal ? 'enterprise' : 'personal'

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='size-4 text-success' />
            <CardTitle className='text-base'>{t('Certification Information')}</CardTitle>
          </div>
          {!subAccountOnly && (
            <Button variant='outline' size='sm' onClick={onSwitch}>
              {otherType === 'enterprise' ? (
                <>
                  <Building2 className='mr-1 size-4' />
                  {t('Switch to Enterprise')}
                </>
              ) : (
                <>
                  <UserRound className='mr-1 size-4' />
                  {t('Switch to Personal')}
                </>
              )}
            </Button>
          )}
        </div>
        <CardDescription>
          {CERT_TYPE_LABELS[record.type]} · {new Date(record.updated_at * 1000).toLocaleDateString()} {t('approved')}
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
      </CardContent>
    </Card>
  )
}

export function CertificationCard() {
  const { t } = useTranslation()
  const { auth } = useAuthStore()
  const isAdmin = (auth.user?.role ?? 0) >= ROLE.ADMIN
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-certification'],
    queryFn: getMyCertification,
    enabled: !isAdmin,
  })

  const certStatus = data?.data?.cert_status ?? 0
  const record = data?.data?.record ?? null
  const isSubAccount = auth.user?.is_sub_account === true
  const [showForm, setShowForm] = React.useState(false)
  const [switchType, setSwitchType] = React.useState<CertType | null>(null)

  const handleSubmit = () => {
    setShowForm(false)
    setSwitchType(null)
    refetch()
  }

  const handleSwitchTo = (type: CertType) => {
    // 企业子账户仅支持个人认证，禁止切换为企业认证
    if (isSubAccount && type === 'enterprise') return
    setSwitchType(type)
    setShowForm(true)
  }

  if (isAdmin) {
    return (
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='size-4 text-success' />
            <CardTitle className='text-base'>{t('Certification')}</CardTitle>
          </div>
          <CardDescription>
            管理员账号无需实名认证，可直接使用系统全部功能。
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='size-4 text-success' />
            <CardTitle className='text-base'>{t('Certification')}</CardTitle>
          </div>
          {certStatus === 0 && (
            <Button size='sm' onClick={() => setShowForm(true)}>
              {t('Start Certification')}
            </Button>
          )}
        </div>
        <CardDescription>
          {certStatus === 2
            ? t('Your account has been certified and you can use the system normally.')
            : certStatus === 1
              ? t('Your certification application is under review.')
              : certStatus === 3
                ? t('Your certification was rejected. Please resubmit.')
                : t('Complete real-name certification to use the system.')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoading ? (
          <div className='py-6 text-center text-sm text-muted-foreground'>加载中...</div>
        ) : showForm ? (
          <div className='space-y-3'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              {switchType && (
                <span>
                  {t('Certification Type')}: {CERT_TYPE_LABELS[switchType]}
                </span>
              )}
              <Button
                variant='ghost'
                size='sm'
                className='ml-auto h-7 px-2 text-xs'
                onClick={() => {
                  setShowForm(false)
                  setSwitchType(null)
                }}
              >
                {t('Cancel')}
              </Button>
            </div>
            <CertificationForm
              initialRecord={
                certStatus === 3 && record && !switchType ? record : null
              }
              defaultType={switchType ?? record?.type ?? 'personal'}
              subAccountOnly={isSubAccount}
              onSubmitted={handleSubmit}
            />
          </div>
        ) : (
          <>
            <StatusHeader certStatus={certStatus} record={record} />

            {certStatus === 2 && record && (
              <ApprovedInfo
                record={record}
                subAccountOnly={isSubAccount}
                onSwitch={() =>
                  handleSwitchTo(record.type === 'personal' ? 'enterprise' : 'personal')
                }
              />
            )}

            {certStatus === 0 && (
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => handleSwitchTo('personal')}
                >
                  <UserRound className='mr-2 size-4' />
                  {t('Personal Certification')}
                </Button>
                {!isSubAccount && (
                  <Button
                    variant='outline'
                    className='flex-1'
                    onClick={() => handleSwitchTo('enterprise')}
                  >
                    <Building2 className='mr-2 size-4' />
                    {t('Enterprise Certification')}
                  </Button>
                )}
              </div>
            )}

            {certStatus === 3 && (
              <Button
                className='w-full'
                onClick={() => {
                  setSwitchType(null)
                  setShowForm(true)
                }}
              >
                {t('Resubmit Certification')}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
