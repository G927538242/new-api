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
import { FolderPlus, Loader2, Pencil, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

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

import { getAssetGroups, uploadAsset } from '../api'
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  getAssetModelOptions,
} from '../constants'
import { useAssets } from './assets-provider'

export function AssetsPrimaryButtons() {
  const { t } = useTranslation()
  const {
    triggerRefresh,
    currentGroupId,
    setCurrentGroupId,
    currentGroup,
    setCurrentGroup,
    setOpen,
    groupsRefreshTrigger,
  } = useAssets()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('')

  const modelOptions = getAssetModelOptions(t)

  const { data: groupsData } = useQuery({
    queryKey: ['asset-groups', groupsRefreshTrigger],
    queryFn: async () => {
      const result = await getAssetGroups()
      if (!result.success) {
        toast.error(t(ERROR_MESSAGES.LOAD_GROUPS_FAILED))
        return []
      }
      return result.data?.items || []
    },
  })
  const groups = groupsData || []

  const handleGroupChange = (value: string | null) => {
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

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const results = await Promise.allSettled(
        [...files].map((file) => uploadAsset(file, currentGroupId ?? undefined, selectedModel || undefined))
      )
      const fulfilled = results.filter(
        (r) => r.status === 'fulfilled' && r.value.success
      )
      const rejected = results.length - fulfilled.length

      if (fulfilled.length > 0) {
        toast.success(
          t(SUCCESS_MESSAGES.ASSET_UPLOADED, { count: fulfilled.length })
        )
        triggerRefresh()
      }
      if (rejected > 0) {
        toast.error(t(ERROR_MESSAGES.UPLOAD_FAILED))
      }
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleEditGroup = () => {
    if (!currentGroup) return
    setOpen('edit-group')
  }

  const handleDeleteGroup = () => {
    if (!currentGroup) return
    setOpen('delete-group')
  }

  return (
    <div className='flex items-center gap-2'>
      <input
        ref={inputRef}
        type='file'
        multiple
        className='hidden'
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* 新建分组 */}
      <Button
        size='sm'
        variant='outline'
        onClick={() => setOpen('create-group')}
      >
        <FolderPlus className='h-4 w-4' />
        {t('新建分组')}
      </Button>

      {/* 分组选择下拉（上传时选择目标分组 + 筛选） */}
      <Select
        value={currentGroupId !== null ? String(currentGroupId) : 'all'}
        onValueChange={handleGroupChange}
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

      {/* 编辑 / 删除当前分组 */}
      {currentGroup && (
        <>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant='ghost'
                  size='icon-sm'
                  onClick={handleEditGroup}
                  aria-label={t('编辑分组')}
                />
              }
            >
              <Pencil className='h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>{t('编辑分组')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant='ghost'
                  size='icon-sm'
                  onClick={handleDeleteGroup}
                  aria-label={t('删除分组')}
                />
              }
            >
              <Trash2 className='text-destructive h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>{t('删除分组')}</TooltipContent>
          </Tooltip>
        </>
      )}

      {/* 模型选择（上传时关联模型） */}
      <Select
        value={selectedModel}
        onValueChange={(value) => setSelectedModel(value || '')}
      >
        <SelectTrigger size='sm' className='w-[140px]'>
          <SelectValue placeholder={t('Choose Model')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value=''>{t('No model association')}</SelectItem>
            {modelOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* 上传素材 */}
      <Button
        size='sm'
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <Upload className='h-4 w-4' />
        )}
        {isUploading ? t('Uploading...') : t('Upload Asset')}
      </Button>
    </div>
  )
}
