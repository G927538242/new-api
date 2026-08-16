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
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Boxes,
  FileImage,
  FolderArchive,
  Layers,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SectionPageLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatFileSize } from '@/lib/format'

import {
  getAssetChannels,
  getAssetGroups,
  getAssets,
} from '../../../../features/asset-library/api'
import {
  AssetPreviewDialog,
  AssetThumbnail,
} from '../../../../features/asset-library/components/asset-preview'
import { useAssets } from '../../../../features/asset-library/components/assets-provider'
import type {
  Asset,
  AssetChannel,
  AssetGroup,
} from '../../../../features/asset-library/types'

function OverviewStats() {
  const { t } = useTranslation()
  const { channels } = useAssets()

  const { data: channelsData } = useQuery({
    queryKey: ['asset-channels-for-overview'],
    queryFn: async () => {
      const result = await getAssetChannels()
      if (!result.success) {
        return []
      }
      return result.data ?? []
    },
  })

  const effectiveChannels = channelsData ?? channels

  const { data: assetsData } = useQuery({
    queryKey: ['assets-overview'],
    queryFn: async () => {
      const result = await getAssets({ page_size: 1 })
      return result.data
    },
  })

  const { data: groupsData } = useQuery({
    queryKey: ['asset-groups-overview'],
    queryFn: async () => {
      const result = await getAssetGroups()
      return result.data
    },
  })

  const totalAssets = assetsData?.total ?? 0
  const totalGroups = groupsData?.total ?? 0
  const totalChannels = effectiveChannels.filter(
    (c: AssetChannel) => c.enabled
  ).length

  const totalModels = effectiveChannels
    .filter((c: AssetChannel) => c.enabled)
    .reduce((acc: string[], ch: AssetChannel) => {
      for (const m of ch.models.split(',').map((s: string) => s.trim()).filter(Boolean)) {
        if (!acc.includes(m)) acc.push(m)
      }
      return acc
    }, [] as string[]).length

  const stats = [
    {
      title: t('Total Assets'),
      value: totalAssets,
      icon: FileImage,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: t('Asset Groups'),
      value: totalGroups,
      icon: FolderArchive,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: t('Available Models'),
      value: totalModels,
      icon: Layers,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      title: t('Upstream Channels'),
      value: totalChannels,
      icon: Boxes,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
            <div className={`${stat.bg} rounded-md p-2`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RecentAssets() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const { data: assetsData, isLoading } = useQuery<Asset[]>({
    queryKey: ['assets-recent'],
    queryFn: async () => {
      const result = await getAssets({ page_size: 5 })
      return result.data?.items ?? []
    },
  })

  const recentAssets = assetsData ?? []

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            {t('Recent Assets')}
          </CardTitle>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate({ to: '/asset-library/assets' })}
          >
            {t('View All')} →
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className='text-muted-foreground text-sm'>{t('Loading...')}</p>
          ) : recentAssets.length === 0 ? (
            <div className='py-8 text-center'>
              <FileImage className='text-muted-foreground mx-auto mb-2 h-8 w-8 opacity-50' />
              <p className='text-muted-foreground text-sm'>
                {t('No assets yet')}
              </p>
              <Button
                className='mt-3'
                size='sm'
                onClick={() => navigate({ to: '/asset-library/assets' })}
              >
                <Plus className='mr-1 h-4 w-4' />
                {t('Upload Assets')}
              </Button>
            </div>
          ) : (
            <div className='space-y-2'>
              {recentAssets.map((asset) => (
                <div
                  key={asset.id}
                  className='flex items-center gap-3 rounded-md border px-3 py-2'
                >
                  <AssetThumbnail
                    asset={asset}
                    onClick={() => {
                      setPreviewAsset(asset)
                      setPreviewOpen(true)
                    }}
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>{asset.name}</p>
                    <p className='text-muted-foreground text-xs'>
                      {asset.model ?? '-'} · {formatFileSize(asset.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <AssetPreviewDialog
        asset={previewAsset}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </>
  )
}

function GroupsPreview() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: channelsData } = useQuery({
    queryKey: ['asset-channels-for-overview'],
    queryFn: async () => {
      const result = await getAssetChannels()
      return result.data ?? []
    },
  })

  const { data: groupsData, isLoading } = useQuery<AssetGroup[]>({
    queryKey: ['asset-groups-recent'],
    queryFn: async () => {
      const result = await getAssetGroups()
      return result.data?.items?.slice(0, 5) ?? []
    },
  })

  const groups = groupsData ?? []
  const channels = channelsData ?? []

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          {t('Recent Groups')}
        </CardTitle>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigate({ to: '/asset-library/groups' })}
        >
          {t('View All')} →
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className='text-muted-foreground text-sm'>{t('Loading...')}</p>
        ) : groups.length === 0 ? (
          <div className='py-8 text-center'>
            <FolderArchive className='text-muted-foreground mx-auto mb-2 h-8 w-8 opacity-50' />
            <p className='text-muted-foreground text-sm'>{t('No groups yet')}</p>
            <Button
              className='mt-3'
              size='sm'
              onClick={() => navigate({ to: '/asset-library/groups' })}
            >
              <Plus className='mr-1 h-4 w-4' />
              {t('Create Group')}
            </Button>
          </div>
        ) : (
          <div className='space-y-2'>
            {groups.map((group) => {
              const channel = channels.find(
                (ch) => ch.id === group.channel_id
              )
              return (
                <div
                  key={group.id}
                  className='flex items-center gap-3 rounded-md border px-3 py-2'
                >
                  <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded'>
                    <FolderArchive className='text-muted-foreground h-5 w-5' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>{group.name}</p>
                    <p className='text-muted-foreground text-xs'>
                      {group.model ?? t('No model specified')}
                      {channel ? ` · ${channel.name}` : ''}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AssetLibraryOverview() {
  const { t } = useTranslation()
  return (
    <SectionPageLayout fixedContent>
      <SectionPageLayout.Title>
        <div className='flex flex-col gap-1'>
          <span>{t('Asset Overview')}</span>
          <p className='text-muted-foreground text-sm'>
            {t('asset overview description')}
          </p>
        </div>
      </SectionPageLayout.Title>
      <SectionPageLayout.Content>
        <div className='space-y-6'>
          <OverviewStats />
          <div className='grid gap-6 lg:grid-cols-2'>
            <RecentAssets />
            <GroupsPreview />
          </div>
        </div>
      </SectionPageLayout.Content>
    </SectionPageLayout>
  )
}

export const Route = createFileRoute('/_authenticated/asset-library/overview/')({
  component: AssetLibraryOverview,
})
