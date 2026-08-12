import { createFileRoute, redirect } from '@tanstack/react-router'

import { SubAccounts } from '@/features/sub-accounts'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/sub-accounts/')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    const canManage = auth.user?.can_manage_sub_accounts === true
    const isAdmin = (auth.user?.role ?? 0) >= 10
    if (!canManage && !isAdmin) {
      throw redirect({ to: '/profile' })
    }
  },
  component: SubAccounts,
})
