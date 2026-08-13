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
import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { SectionPageLayout } from '@/components/layout'
import { StatusBadge } from '@/components/status-badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

import { getAssetChannels } from './api'
import { getAssetChannelTypeConfig } from './constants'
import { AssetsDialogs } from './components/assets-dialogs'
import { AssetsPrimaryButtons } from './components/assets-primary-buttons'
import { AssetsProvider } from './components/assets-provider'
import { AssetsTable } from './components/assets-table'
import { useAssets } from './components/assets-provider'
import { ASSET_MODEL_CONFIG } from './constants'
import type { AssetChannel } from './types'

const route = getRouteApi('/_authenticated/asset-library/')

// 从已启用渠道聚合出模型列表（去重），保持配置顺序
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

// 根据模型找到归属渠道
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
          .map((m) => m.trim())
          .includes(model)
    ) ?? null
  )
}

function AssetModelTabs() {
  const { t } = useTranslation()
  const {
    currentModel,
    setCurrentModel,
    channels,
    setChannels,
    setCurrentChannel,
  } = useAssets()
  const navigate = route.useNavigate()
  const search = route.useSearch()

  // 加载素材渠道配置
  const { data: channelsData } = useQuery({
    queryKey: ['asset-channels'],
    queryFn: async () => {
      const result = await getAssetChannels()
      if (!result.success) {
        toast.error(t('加载素材渠道失败'))
        return []
      }
      return result.data ?? []
    },
  })

  useEffect(() => {
    if (channelsData && channelsData.length > 0) {
      setChannels(channelsData)
    }
  }, [channelsData, setChannels])

  const modelOptions = useMemo(
    () => collectModelsFromChannels(channelsData ?? channels),
    [channelsData, channels]
  )

  // 从 URL 同步当前模型（首次加载/刷新时）
  useEffect(() => {
    if (search.model && search.model !== currentModel) {
      setCurrentModel(search.model)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.model])

  // 当前模型为空时默认选中第一个可用模型
  const effectiveModel =
    currentModel && modelOptions.includes(currentModel)
      ? currentModel
      : modelOptions[0] ?? ''

  useEffect(() => {
    if (effectiveModel && effectiveModel !== currentModel) {
      setCurrentModel(effectiveModel)
      navigate({
        search: (prev) => ({ ...prev, model: effectiveModel }),
        replace: true,
      })
    }
  }, [effectiveModel]) // eslint-disable-line react-hooks/exhaustive-deps

  // 模型自动归属渠道
  const currentChannel = findChannelForModel(
    channelsData ?? channels,
    effectiveModel
  )

  useEffect(() => {
    setCurrentChannel(currentChannel)
  }, [currentChannel, setCurrentChannel])

  const handleModelChange = (model: string) => {
    setCurrentModel(model)
    navigate({
      search: (prev) => ({ ...prev, model }),
      replace: true,
    })
  }

  // 未配置任何渠道
  if (modelOptions.length === 0) {
    return (
      <div className='rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-center'>
        <p className='text-sm font-medium'>尚未配置素材上游渠道</p>
        <p className='mt-1 text-xs text-muted-foreground'>
          请先前往「系统设置 → 运营 → 素材渠道」配置渠道（如字节官方、移动MOMA平台）及其支持的模型。
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
      {currentChannel && (
        <div className='flex items-center gap-1.5'>
          <span className='text-xs text-muted-foreground'>上游渠道：</span>
          <StatusBadge
            label={currentChannel.name}
            variant={getAssetChannelTypeConfig(currentChannel.type)?.variant}
            copyable={false}
          />
          {!currentChannel.has_credentials && (
            <span className='text-xs text-warning'>
              （未配置 AK/SK，素材仅本地保存）
            </span>
          )}
        </div>
      )}
    </div>
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
