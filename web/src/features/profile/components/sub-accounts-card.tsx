import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Building2, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'

/**
 * 子账户卡片（个人中心右侧栏）
 * - 企业管理员：展示子账户数量与快捷入口
 * - 普通用户：提示完成企业认证后开通
 * - 子账户：提示当前为企业子账户
 */
export function SubAccountsCard() {
  const { t } = useTranslation()
  const auth = useAuthStore((s) => s.auth)

  const user = auth.user
  const isSubAccount = user?.is_sub_account === true
  const canManage = user?.can_manage_sub_accounts === true
  const subAccountCount = user?.sub_account_count ?? 0

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Users className='size-4 text-muted-foreground' />
          <CardTitle className='text-base'>{t('Sub-accounts')}</CardTitle>
        </div>
        <CardDescription>
          {isSubAccount
            ? t('Your account is a sub-account of an enterprise.')
            : canManage
              ? t('Manage sub-accounts under your enterprise certification.')
              : t('Enterprise-certified customers can create and manage sub-accounts.')}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {isSubAccount ? (
          <div className='flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground'>
            <Building2 className='size-4 shrink-0' />
            <span>{t('Sub-account quota is allocated by the enterprise administrator.')}</span>
          </div>
        ) : canManage ? (
          <>
            <div className='grid grid-cols-2 gap-3'>
              <div className='rounded-md border px-3 py-2'>
                <div className='text-muted-foreground text-xs'>{t('Total')}</div>
                <div className='text-lg font-medium tabular-nums'>{subAccountCount}</div>
              </div>
              <div className='rounded-md border px-3 py-2'>
                <div className='text-muted-foreground text-xs'>{t('Certified')}</div>
                <div className='text-lg font-medium tabular-nums'>
                  <Building2 className='text-success inline size-4' />
                </div>
              </div>
            </div>
            <Button className='w-full' render={<Link to='/sub-accounts' />}>
              {t('Manage Sub-accounts')}
            </Button>
          </>
        ) : (
          <p className='text-muted-foreground text-sm'>
            {t('Complete enterprise certification to unlock sub-account management.')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
