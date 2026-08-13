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
import type { ColumnDef, Row } from '@tanstack/react-table'
import { Copy, Eye, RefreshCw, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  DataTablePage,
  useDataTable,
} from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useMediaQuery } from '@/hooks'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { formatFileSize, formatTimestampToDate } from '@/lib/format'
import { ROLE } from '@/lib/roles'
import { useAuthStore } from '@/stores/auth-store'

import { getAssetGroups, getAssets, searchAssets, syncAssetStatus } from '../api'
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  getAssetModelConfig,
  getAssetStatusConfig,
  getAssetStatusOptions,
  getAssetTypeConfig,
  getAssetTypeOptions,
} from '../constants'
import type { Asset, AssetStatus, AssetType } from '../types'
import { AssetPreviewDialog, AssetThumbnail } from './asset-preview'
import { useAssets } from './assets-provider'

const route = getRouteApi('/_authenticated/asset-library/')

function useAssetsColumns(
  onPreview: (asset: Asset) => void,
  channelNames: Map<number, string>,
  isAdmin: boolean
): ColumnDef<Asset>[] {
  const { t } = useTranslation()
  // 上游渠道列仅管理员可见，普通用户不暴露渠道信息
  const channelColumn: ColumnDef<Asset> = {
    accessorKey: 'channel_id',
    header: t('上游渠道'),
    meta: { mobileHidden: true },
    cell: ({ row }) => {
      const channelId = row.original.channel_id
      const channelName = channelId ? channelNames.get(channelId) : undefined
      return channelName ? (
        <span className='text-sm'>{channelName}</span>
      ) : (
        <span className='text-muted-foreground text-sm'>-</span>
      )
    },
    size: 120,
  }

  return [
    {
      id: 'preview',
      header: t('Preview'),
      cell: ({ row }) => {
        const asset = row.original
        return (
          <AssetThumbnail
            asset={asset}
            onClick={() => onPreview(asset)}
          />
        )
      },
      enableSorting: false,
      size: 80,
    },
    {
      accessorKey: 'name',
      header: t('Name'),
      meta: { mobileTitle: true },
      cell: ({ row }) => (
        <span className='font-medium'>{row.getValue('name')}</span>
      ),
      size: 220,
    },
    ...(isAdmin ? [channelColumn] : []),
    {
      accessorKey: 'type',
      header: t('Type'),
      meta: { mobileBadge: true },
      cell: ({ row }) => {
        const typeValue = row.getValue('type') as string
        const config = getAssetTypeConfig(typeValue)
        if (!config) {
          return (
            <span className='text-muted-foreground text-sm'>{typeValue}</span>
          )
        }
        return (
          <StatusBadge
            label={t(config.labelKey)}
            variant={config.variant}
            copyable={false}
            className='-ml-1.5'
          />
        )
      },
      filterFn: (row, id, value: string[]) => {
        const typeValue = row.getValue(id) as string
        return value.includes(typeValue)
      },
      size: 120,
    },
    {
      accessorKey: 'model',
      header: t('Model'),
      meta: { mobileHidden: true },
      cell: ({ row }) => {
        const model = row.original.model
        if (!model) {
          return (
            <span className='text-muted-foreground text-sm'>-</span>
          )
        }
        const config = getAssetModelConfig(model)
        if (!config) {
          return (
            <span className='text-sm'>{model}</span>
          )
        }
        return (
          <StatusBadge
            label={t(config.labelKey)}
            variant={config.variant}
            copyable={false}
            className='-ml-1.5'
          />
        )
      },
      filterFn: (row, _id, value: string[]) => {
        const model = row.original.model as string
        if (!model) return false
        return value.includes(model)
      },
      size: 140,
    },
    {
      accessorKey: 'status',
      header: t('状态'),
      meta: { mobileHidden: true },
      cell: ({ row }) => {
        const status = row.original.status
        if (!status) {
          return (
            <span className='text-muted-foreground text-sm'>-</span>
          )
        }
        const config = getAssetStatusConfig(status)
        if (!config) {
          return (
            <span className='text-muted-foreground text-sm'>{status}</span>
          )
        }
        return (
          <StatusBadge
            label={t(config.labelKey)}
            variant={config.variant}
            copyable={false}
            className='-ml-1.5'
          />
        )
      },
      filterFn: (row, _id, value: string[]) => {
        const status = row.original.status
        if (!status) return false
        return value.includes(status)
      },
      size: 120,
    },
    {
      accessorKey: 'user_name',
      header: t('User'),
      meta: { mobileHidden: true },
      cell: ({ row }) => (
        <span className='text-sm'>
          {row.original.user_name || `#${row.original.user_id}`}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'size',
      header: t('Size'),
      meta: { mobileHidden: true },
      cell: ({ row }) => (
        <span className='tabular-nums text-sm'>
          {formatFileSize(row.getValue('size') as number)}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'created_time',
      header: t('Created'),
      meta: { mobileHidden: true },
      cell: ({ row }) => (
        <div className='min-w-[160px] font-mono text-sm'>
          {formatTimestampToDate(row.getValue('created_time'))}
        </div>
      ),
      size: 180,
    },
    {
      id: 'actions',
      header: () => t('Actions'),
      cell: ({ row }) => <AssetsRowActions row={row} onPreview={onPreview} />,
      meta: { pinned: 'right' as const },
    },
  ]
}

function AssetsRowActions<TData>({
  row,
  onPreview,
}: {
  row: Row<TData>
  onPreview: (asset: Asset) => void
}) {
  const { t } = useTranslation()
  const { setCurrentRow, setOpen, triggerRefresh } = useAssets()
  const asset = row.original as Asset
  const [isSyncing, setIsSyncing] = useState(false)

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(asset.url)
      toast.success(t(SUCCESS_MESSAGES.COPY_SUCCESS))
    } catch {
      toast.error(t('Copy failed'))
    }
  }

  const handleSyncStatus = async () => {
    setIsSyncing(true)
    try {
      const result = await syncAssetStatus(asset.id)
      if (result.success) {
        toast.success(t(SUCCESS_MESSAGES.SYNC_SUCCESS))
        triggerRefresh()
      } else {
        toast.error(t(ERROR_MESSAGES.SYNC_FAILED))
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.SYNC_FAILED))
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className='-ml-1.5 flex items-center gap-1'>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant='ghost'
              size='icon-sm'
              onClick={() => onPreview(asset)}
              aria-label={t('Preview')}
            />
          }
        >
          <Eye className='h-4 w-4' />
        </TooltipTrigger>
        <TooltipContent>{t('Preview')}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant='ghost'
              size='icon-sm'
              onClick={handleCopyUrl}
              aria-label={t('Copy URL')}
            />
          }
        >
          <Copy />
        </TooltipTrigger>
        <TooltipContent>{t('Copy URL')}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant='ghost'
              size='icon-sm'
              onClick={handleSyncStatus}
              disabled={isSyncing}
              aria-label={t('同步状态')}
            />
          }
        >
          <RefreshCw
            className={isSyncing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'}
          />
        </TooltipTrigger>
        <TooltipContent>{t('同步状态')}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant='ghost'
              size='icon-sm'
              onClick={() => {
                setCurrentRow(asset)
                setOpen('delete')
              }}
              aria-label={t('Delete')}
            />
          }
        >
          <Trash2 className='text-destructive h-4 w-4' />
        </TooltipTrigger>
        <TooltipContent>{t('Delete')}</TooltipContent>
      </Tooltip>
    </div>
  )
}

export function AssetsTable() {
  const { t } = useTranslation()
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handlePreview = (asset: Asset) => {
    setPreviewAsset(asset)
    setPreviewOpen(true)
  }

  const {
    refreshTrigger,
    currentGroupId,
    setCurrentGroupId,
    setCurrentGroup,
    currentModel,
    currentChannel,
    channels,
    groupsRefreshTrigger,
  } = useAssets()
  const isMobile = useMediaQuery('(max-width: 640px)')

  // 渠道 ID → 名称映射（用于列表渠道列）
  const channelNames = useMemo(() => {
    const map = new Map<number, string>()
    for (const channel of channels) {
      map.set(channel.id, channel.name)
    }
    return map
  }, [channels])

  const isAdmin =
    (useAuthStore((s) => s.auth.user?.role) ?? 0) >= ROLE.ADMIN

  const columns = useAssetsColumns(handlePreview, channelNames, isAdmin)

  // 切换模型/渠道时，重置分组筛选
  useEffect(() => {
    setCurrentGroupId(null)
    setCurrentGroup(null)
  }, [currentModel, currentChannel?.id, setCurrentGroupId, setCurrentGroup])

  // Fetch groups for the group filter dropdown (当前渠道 + 模型下)
  const { data: groupsData } = useQuery({
    queryKey: [
      'asset-groups',
      groupsRefreshTrigger,
      currentChannel?.id ?? 0,
      currentModel,
    ],
    queryFn: async () => {
      const result = await getAssetGroups({
        channel_id: currentChannel?.id,
        model: currentModel || undefined,
      })
      if (!result.success) {
        return []
      }
      return result.data?.items || []
    },
    enabled: !!currentChannel && !!currentModel,
  })
  const groups = groupsData || []

  const handleGroupFilterChange = (value: string | null) => {
    if (value === null || value === 'all') {
      setCurrentGroupId(null)
      setCurrentGroup(null)
    } else {
      const id = Number(value)
      setCurrentGroupId(id)
      const group = groups.find((g) => g.id === id) || null
      setCurrentGroup(group)
    }
  }

  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: isMobile ? 10 : 20 },
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: [
      { columnId: 'type', searchKey: 'type', type: 'array' },
      { columnId: 'model', searchKey: 'model', type: 'array' },
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'user_name', searchKey: 'user', type: 'array' },
    ],
  })

  const typeFilter =
    (columnFilters.find((filter) => filter.id === 'type')?.value as
      | string[]
      | undefined) ?? []
  const typeFilterValue = typeFilter[0] ?? ''

  const statusFilter =
    (columnFilters.find((filter) => filter.id === 'status')?.value as
      | string[]
      | undefined) ?? []
  const statusFilterValue = statusFilter[0] ?? ''

  const userFilter =
    (columnFilters.find((filter) => filter.id === 'user_name')?.value as
      | string[]
      | undefined) ?? []
  const userFilterValue = userFilter[0] ?? ''

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'assets',
      pagination.pageIndex + 1,
      pagination.pageSize,
      globalFilter,
      typeFilterValue,
      currentModel,
      currentChannel?.id,
      statusFilterValue,
      userFilterValue,
      currentGroupId,
      refreshTrigger,
    ],
    queryFn: async () => {
      const hasFilter = globalFilter?.trim()
      const params = {
        p: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
      }
      const typeParam = typeFilterValue
        ? { type: typeFilterValue as AssetType }
        : {}
      const modelParam = currentModel ? { model: currentModel } : {}
      const channelParam = currentChannel?.id
        ? { channel_id: currentChannel.id }
        : {}
      const statusParam = statusFilterValue
        ? { status: statusFilterValue as AssetStatus }
        : {}
      const userParam = userFilterValue
        ? { user_id: Number(userFilterValue) }
        : {}
      const groupParam =
        currentGroupId !== null ? { group_id: currentGroupId } : {}

      const result = hasFilter
        ? await searchAssets({
            ...params,
            ...typeParam,
            ...modelParam,
            ...channelParam,
            ...statusParam,
            ...userParam,
            ...groupParam,
            keyword: globalFilter,
          })
        : await getAssets({
            ...params,
            ...typeParam,
            ...modelParam,
            ...channelParam,
            ...statusParam,
            ...userParam,
            ...groupParam,
          })

      if (!result.success) {
        toast.error(
          result.message ||
            t(hasFilter ? ERROR_MESSAGES.SEARCH_FAILED : ERROR_MESSAGES.LOAD_FAILED)
        )
        return { items: [], total: 0 }
      }

      return {
        items: result.data?.items || [],
        total: result.data?.total || 0,
      }
    },
    placeholderData: (previousData) => previousData,
  })

  const assets = data?.items || []

  const { table } = useDataTable({
    data: assets,
    columns,
    columnFilters,
    globalFilter,
    pagination,
    globalFilterFn: (row, _columnId, filterValue) => {
      const name = String(row.getValue('name')).toLowerCase()
      const id = String(row.original.id)
      const searchValue = String(filterValue).toLowerCase()

      return name.includes(searchValue) || id.includes(searchValue)
    },
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
    manualPagination: true,
    manualFiltering: true,
    totalCount: data?.total || 0,
    ensurePageInRange,
  })

  const assetTypeOptions = useMemo(() => getAssetTypeOptions(t), [t])
  const assetStatusOptions = useMemo(() => getAssetStatusOptions(t), [t])

  return (
    <>
    <DataTablePage
      table={table}
      columns={columns}
      isLoading={isLoading}
      isFetching={isFetching}
      emptyTitle={t('No Assets Found')}
      emptyDescription={t(
        'No assets available. Upload your first asset to get started.'
      )}
      skeletonKeyPrefix='assets-skeleton'
      applyHeaderSize
      toolbarProps={{
        searchPlaceholder: t('Filter by name...'),
        additionalSearch: (
          <Select
            value={currentGroupId !== null ? String(currentGroupId) : 'all'}
            onValueChange={handleGroupFilterChange}
          >
            <SelectTrigger size='sm' className='w-[160px]'>
              <SelectValue placeholder={t('选择分组')} />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectItem value='all'>{t('全部分组')}</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={String(group.id)}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ),
        filters: [
          {
            columnId: 'type',
            title: t('Type'),
            options: assetTypeOptions,
            singleSelect: true,
          },
          {
            columnId: 'status',
            title: t('状态'),
            options: assetStatusOptions,
            singleSelect: true,
          },
          {
            columnId: 'user_name',
            title: t('User'),
            options: [],
            singleSelect: true,
          },
        ],
      }}
    />
      <AssetPreviewDialog
        asset={previewAsset}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </>
  )
}
