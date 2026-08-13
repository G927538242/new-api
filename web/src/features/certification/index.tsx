import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

import { SectionPageLayout } from '@/components/layout'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
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
import type { CertificationRecord, CertType } from './types'
import { Building2, CheckCircle2, Clock3, ShieldAlert, ShieldCheck, UserRound } from 'lucide-react'

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
  onSwitch: (type: CertType) => void
  subAccountOnly?: boolean
}) {
  const { t } = useTranslation()
  const isPersonal = record.type === 'personal'
  const otherType: CertType = isPersonal ? 'enterprise' : 'personal'

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='size-4 text-success' />
            <CardTitle className='text-base'>{t('Certification Information')}</CardTitle>
          </div>
          {!subAccountOnly && (
            <Button variant='outline' size='sm' onClick={() => onSwitch(otherType)}>
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
          {!isPersonal && (
            <div>
              <div className='text-muted-foreground'>联系人</div>
              <div className='font-medium'>
                {record.contact_name || '-'}
                {record.contact_phone ? ` · ${record.contact_phone}` : ''}
              </div>
            </div>
          )}
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
            <>
              {record.business_license && (
                <div className='space-y-1.5 sm:col-span-2'>
                  <div className='text-xs text-muted-foreground'>营业执照</div>
                  <CertImage url={record.business_license} className='aspect-[3/2] w-full sm:max-w-[50%]' />
                </div>
              )}
              {record.contact_id_front && (
                <div className='space-y-1.5'>
                  <div className='text-xs text-muted-foreground'>经办人身份证正面</div>
                  <CertImage url={record.contact_id_front} className='aspect-[3/2] w-full' />
                </div>
              )}
              {record.contact_id_back && (
                <div className='space-y-1.5'>
                  <div className='text-xs text-muted-foreground'>经办人身份证反面</div>
                  <CertImage url={record.contact_id_back} className='aspect-[3/2] w-full' />
                </div>
              )}
            </>
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

  const [showForm, setShowForm] = React.useState(false)
  const [switchType, setSwitchType] = React.useState<CertType | null>(null)

  const handleSubmitted = () => {
    // 同步当前用户认证状态为待审核
    const currentUser = auth.user
    if (currentUser) {
      auth.setUser({ ...currentUser, cert_status: 1 })
    }
    setShowForm(false)
    setSwitchType(null)
    refetch()
  }

  const handleSwitchTo = (type: CertType) => {
    if (isSubAccount && type === 'enterprise') return
    setSwitchType(type)
    setShowForm(true)
  }

  // 表单显示条件：
  //   - 未认证（0）或被驳回（3）：普通首次/重新提交
  //   - 已通过（2）且用户主动切换为另一类型：变更认证
  const showFormCondition =
    !isAdmin && (showForm || ((certStatus === 0 || certStatus === 3) && !showForm))

  const isFormMode =
    showForm || certStatus === 0 || certStatus === 3

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
              {!showForm && <StatusHeader certStatus={certStatus} record={record} />}

              {certStatus === 2 && record && !showForm && (
                <ApprovedInfo
                  record={record}
                  subAccountOnly={isSubAccount}
                  onSwitch={handleSwitchTo}
                />
              )}

              {showForm ? (
                <Card>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='text-base'>
                          {switchType
                            ? `${CERT_TYPE_LABELS[switchType]} · 变更认证`
                            : certStatus === 3
                              ? '重新提交认证'
                              : '提交认证资料'}
                        </CardTitle>
                        <CardDescription>
                          {switchType
                            ? '提交后将进入审核流程，审核通过后认证类型自动变更。'
                            : certStatus === 3
                              ? '您的申请被驳回，请根据驳回原因修改后重新提交。'
                              : '请如实填写以下信息并上传证件照片，资料提交后由管理员审核。'}
                        </CardDescription>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          setShowForm(false)
                          setSwitchType(null)
                        }}
                      >
                        {t('Cancel')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CertificationForm
                      initialRecord={certStatus === 3 && record && !switchType ? record : null}
                      defaultType={switchType ?? record?.type ?? 'personal'}
                      onSubmitted={handleSubmitted}
                      subAccountOnly={isSubAccount}
                    />
                  </CardContent>
                </Card>
              ) : (
                certStatus === 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>提交认证资料</CardTitle>
                      <CardDescription>
                        请如实填写以下信息并上传证件照片，资料提交后由管理员审核。
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                )
              )}
            </>
          )}
        </div>
      </SectionPageLayout.Content>
    </SectionPageLayout>
  )
}
