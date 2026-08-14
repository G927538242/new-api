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
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from '@tanstack/react-router'
import { toast } from 'sonner'

import { getAssetChannels } from './api'
import { AssetsProvider, useAssets } from './components/assets-provider'
import type { AssetChannel } from './types'

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

function AssetLibraryContent() {
  const { t } = useTranslation()
  const { setChannels, setCurrentModel, setCurrentChannel, channels } =
    useAssets()

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

  useEffect(() => {
    if (channels.length === 0) return

    const modelOptions = collectModelsFromChannels(channels)
    if (modelOptions.length === 0) return

    const currentChannel = findChannelForModel(channels, modelOptions[0])

    setCurrentModel(modelOptions[0])
    setCurrentChannel(currentChannel)
  }, [channels])

  return <Outlet />
}

export function AssetLibraryLayout() {
  return (
    <AssetsProvider>
      <AssetLibraryContent />
    </AssetsProvider>
  )
}
