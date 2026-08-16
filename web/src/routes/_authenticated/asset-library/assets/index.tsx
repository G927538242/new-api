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
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { SectionPageLayout } from '@/components/layout'
import { StatusBadge } from '@/components/status-badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROLE } from '@/lib/roles'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

import { getAssetChannels } from '../../../../features/asset-library/api'
import {
  ASSET_MODEL_CONFIG,
  ASSET_TYPE_VALUES,
  getAssetChannelTypeConfig,
} from '../../../../features/asset-library/constants'
import { AssetsDialogs } from '../../../../features/asset-library/components/assets-dialogs'
import { AssetsPrimaryButtons } from '../../../../features/asset-library/components/assets-primary-buttons'
import { AssetsTable } from '../../../../features/asset-library/components/assets-table'
import { useAssets } from '../../../../features/asset-library/components/assets-provider'
import type { AssetChannel } from '../../../../features/asset-library/types'

const route = getRouteApi('/_authenticated/asset-library/assets/')

function collectModelsFromChannels(channels: AssetChannel[]): string[] {
  const models: string[] = []
  for (const channel of channels) {
    if (!channel.enabled) continue
    for (const model of channel.models.split(',')) {
      const trimmed = model.trim()
      if (trimmed && !models.includes(trimmed)) {
        models.push(trimmed)
      }
    }
  }
  return models
}

function findChannelForModel(
  channels: AssetChannel[],
  model: string
): AssetChannel | null {
  return (
    channels.find(
      (ch) =>
        ch.enabled &&
        ch.models
          .split(',')
          .map((m: string) => m.trim())
          .includes(model)
    ) ?? null
  )
}

function AssetModelTabs() {
  const { t } = useTranslation()
  const isAdmin =
    (useAuthStore((s) => s.auth.user?.role) ?? 0) >= ROLE.ADMIN
  const { currentModel, setCurrentModel, channels, setCurrentChannel } =
    useAssets()
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const { data: channelsData } = useQuery({
    queryKey: ['asset-channels-assets'],
    queryFn: async () => {
      const result = await getAssetChannels()
      if (!result.success) {
        toast.error(t('Failed to load asset channels'))
        return []
      }
      return result.data ?? []
    },
  })

  const effectiveChannels = channelsData ?? channels

  const modelOptions = useMemo(
    () => collectModelsFromChannels(effectiveChannels),
    [effectiveChannels]
  )

  const effectiveModel =
    (search.model && modelOptions.includes(search.model)
      ? search.model
      : currentModel && modelOptions.includes(currentModel)
        ? currentModel
        : modelOptions[0] ?? '')

  const currentChannel = findChannelForModel(effectiveChannels, effectiveModel)

  const handleModelChange = (model: string) => {
    setCurrentModel(model)
    const channel = findChannelForModel(effectiveChannels, model)
    setCurrentChannel(channel)
    navigate({
      search: (prev) => ({ ...prev, model }),
      replace: true,
    })
  }

  if (modelOptions.length === 0) {
    return (
      <div className='rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-center'>
        <p className='text-sm font-medium'>
          {isAdmin
            ? t('No asset channels configured')
            : t('No asset models available')}
        </p>
        <p className='mt-1 text-xs text-muted-foreground'>
          {isAdmin
            ? t('asset channels empty hint')
            : t('Please contact admin to configure asset channels and models')}
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <Tabs value={effectiveModel} onValueChange={handleModelChange}>
        <TabsList variant='line'>
          {modelOptions.map((model) => {
            const config = ASSET_MODEL_CONFIG[model]
            return (
              <TabsTrigger key={model} value={model}>
                {config ? t(config.labelKey) : model}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
      {isAdmin && currentChannel && (
        <div className='flex items-center gap-1.5'>
          <span className='text-xs text-muted-foreground'>
            {t('Upstream channel:')}
          </span>
          <StatusBadge
            label={currentChannel.name}
            variant={getAssetChannelTypeConfig(currentChannel.type)?.variant}
            copyable={false}
          />
          {!currentChannel.has_credentials && (
            <span className='text-xs text-warning'>
              {t('asset channel no credentials hint')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function AssetsPage() {
  const { t } = useTranslation()
  return (
    <>
      <SectionPageLayout fixedContent>
        <SectionPageLayout.Title>
          <div className='flex flex-col gap-2'>
            <span>{t('My Assets')}</span>
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
    </>
  )
}

const assetsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
  type: z.array(z.enum(ASSET_TYPE_VALUES)).optional().catch([]),
  model: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/asset-library/assets/')({
  validateSearch: assetsSearchSchema,
  component: AssetsPage,
})
