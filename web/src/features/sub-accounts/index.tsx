import { useTranslation } from 'react-i18next'

import { SectionPageLayout } from '@/components/layout'

import { SubAccountsDialogs } from './components/sub-accounts-dialogs'
import { SubAccountsPrimaryButtons } from './components/sub-accounts-primary-buttons'
import { SubAccountsProvider } from './components/sub-accounts-provider'
import { SubAccountsTable } from './components/sub-accounts-table'

export function SubAccounts() {
  const { t } = useTranslation()

  return (
    <SubAccountsProvider>
      <SectionPageLayout fixedContent>
        <SectionPageLayout.Title>{t('Sub-accounts')}</SectionPageLayout.Title>
        <SectionPageLayout.Actions>
          <SubAccountsPrimaryButtons />
        </SectionPageLayout.Actions>
        <SectionPageLayout.Content>
          <SubAccountsTable />
        </SectionPageLayout.Content>
      </SectionPageLayout>

      <SubAccountsDialogs />
    </SubAccountsProvider>
  )
}
