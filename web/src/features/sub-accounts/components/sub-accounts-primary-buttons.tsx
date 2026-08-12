import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

import { useSubAccounts } from './sub-accounts-provider'

export function SubAccountsPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen } = useSubAccounts()

  return (
    <Button size='sm' onClick={() => setOpen('create')}>
      <Plus className='size-4' />
      {t('Create Sub-account')}
    </Button>
  )
}
