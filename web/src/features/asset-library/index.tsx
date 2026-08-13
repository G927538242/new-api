/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { getRouteApi } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { SectionPageLayout } from '@/components/layout'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ASSET_MODEL_CONFIG, ASSET_MODEL_VALUES } from './constants'
import { AssetsDialogs } from './components/assets-dialogs'
import { AssetsPrimaryButtons } from './components/assets-primary-buttons'
import { AssetsProvider } from './components/assets-provider'
import { AssetsTable } from './components/assets-table'
import { useAssets } from './components/assets-provider'

const route = getRouteApi('/_authenticated/asset-library/')

function AssetModelTabs() {
  const { t } = useTranslation()
  const { currentModel, setCurrentModel } = useAssets()
  const navigate = route.useNavigate()
  const search = route.useSearch()

  useEffect(() => {
    if (search.model && search.model !== currentModel) {
      setCurrentModel(search.model)
    }
  }, [search.model])

  const handleModelChange = (model: string) => {
    setCurrentModel(model)
    navigate({
      search: (prev) => ({ ...prev, model }),
      replace: true,
    })
  }

  return (
    <Tabs value={currentModel} onValueChange={handleModelChange}>
      <TabsList variant='line'>
        {ASSET_MODEL_VALUES.map((model) => {
          const config = ASSET_MODEL_CONFIG[model]
          return (
            <TabsTrigger key={model} value={model}>
              {config ? t(config.labelKey) : model}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

export function AssetLibrary() {
  const { t } = useTranslation()
  return (
    <AssetsProvider>
      <SectionPageLayout fixedContent>
        <SectionPageLayout.Title>
          <div className='flex flex-col gap-2'>
            <span>{t('素材库')}</span>
            <AssetModelTabs />
          </div>
        </SectionPageLayout.Title>
        <SectionPageLayout.Actions>
          <AssetsPrimaryButtons />
        </SectionPageLayout.Actions>
        <SectionPageLayout.Content>
          <AssetsTable />
        </SectionPageLayout.Content>
      </SectionPageLayout>

      <AssetsDialogs />
    </AssetsProvider>
  )
}
