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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { SectionPageLayout } from '@/components/layout'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  createAssetGroup,
  deleteAssetGroup,
  getAssetChannels,
  getAssetGroups,
} from '../../../../features/asset-library/api'
import {
  ASSET_MODEL_CONFIG,
} from '../../../../features/asset-library/constants'
import { useAssets } from '../../../../features/asset-library/components/assets-provider'
import type { AssetChannel, AssetGroup } from '../../../../features/asset-library/types'

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

function GroupsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { channels } = useAssets()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<AssetGroup | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<AssetGroup | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formModel, setFormModel] = useState('')

  const { data: channelsData } = useQuery({
    queryKey: ['asset-channels-for-groups'],
    queryFn: async () => {
      const result = await getAssetChannels()
      if (!result.success) {
        toast.error(t('加载素材渠道失败'))
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

  const { data: groupsData, isLoading } = useQuery<AssetGroup[]>({
    queryKey: ['asset-groups'],
    queryFn: async () => {
      const result = await getAssetGroups()
      return result.data?.items ?? []
    },
  })

  const groups = groupsData ?? []

  useEffect(() => {
    if (!formModel && modelOptions.length > 0) {
      setFormModel(modelOptions[0])
    }
  }, [modelOptions, formModel])

  const resetForm = () => {
    setFormName('')
    setFormDescription('')
    setFormModel(modelOptions[0] ?? '')
    setEditingGroup(null)
  }

  const openCreate = () => {
    resetForm()
    setCreateDialogOpen(true)
  }

  const openEdit = (group: AssetGroup) => {
    setEditingGroup(group)
    setFormName(group.name)
    setFormDescription(group.description ?? '')
    setFormModel(group.model ?? '')
    setCreateDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formName.trim()) {
      toast.error('分组名称不能为空')
      return
    }
    if (!formModel) {
      toast.error('请选择模型')
      return
    }

    const channel = findChannelForModel(effectiveChannels, formModel)
    if (!channel) {
      toast.error('当前模型没有可用的渠道配置')
      return
    }

    setIsSaving(true)
    try {
      if (editingGroup) {
        toast.info('编辑分组功能开发中')
      } else {
        const result = await createAssetGroup(
          {
            name: formName.trim(),
            description: formDescription.trim(),
          },
          channel.id,
          formModel
        )
        if (result.success) {
          toast.success('分组创建成功')
          queryClient.invalidateQueries({ queryKey: ['asset-groups'] })
          setCreateDialogOpen(false)
          resetForm()
        } else {
          toast.error(result.message || '分组创建失败')
        }
      }
    } catch {
      toast.error('分组创建失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingGroup) return
    setIsDeleting(true)
    try {
      const result = await deleteAssetGroup(deletingGroup.id)
      if (result.success) {
        toast.success('分组删除成功')
        queryClient.invalidateQueries({ queryKey: ['asset-groups'] })
        setDeletingGroup(null)
      } else {
        toast.error(result.message || '分组删除失败')
      }
    } catch {
      toast.error('分组删除失败')
    } finally {
      setIsDeleting(false)
    }
  }

  const hasModels = modelOptions.length > 0

  return (
    <>
      <SectionPageLayout fixedContent>
        <SectionPageLayout.Title>
          <div className='flex flex-col gap-1'>
            <span>{t('我的素材组')}</span>
            <p className='text-muted-foreground text-sm'>
              管理素材分组，按渠道和模型隔离
            </p>
          </div>
        </SectionPageLayout.Title>
        <SectionPageLayout.Actions>
          <Button
            size='sm'
            onClick={openCreate}
            disabled={!hasModels}
            title={
              !hasModels ? '暂无可用模型，请先配置素材渠道' : ''
            }
          >
            <Plus className='h-4 w-4' />
            新建分组
          </Button>
        </SectionPageLayout.Actions>
        <SectionPageLayout.Content>
          {!hasModels ? (
            <div className='rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center'>
              <p className='text-sm font-medium'>暂无可用的素材模型</p>
              <p className='mt-1 text-xs text-muted-foreground'>
                请联系管理员配置素材渠道和模型
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>分组名称</TableHead>
                  <TableHead>模型</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead className='text-right'>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-muted-foreground h-24 text-center'
                    >
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : groups.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-muted-foreground h-24 text-center'
                    >
                      暂无分组，点击右上角新建分组
                    </TableCell>
                  </TableRow>
                ) : (
                  groups.map((group) => {
                    const channel = effectiveChannels.find(
                      (ch) => ch.id === group.channel_id
                    )
                    const modelConfig = group.model
                      ? ASSET_MODEL_CONFIG[group.model]
                      : null
                    return (
                      <TableRow key={group.id}>
                        <TableCell className='font-mono text-xs'>
                          {group.id}
                        </TableCell>
                        <TableCell className='font-medium'>
                          {group.name}
                        </TableCell>
                        <TableCell>
                          <div className='flex flex-col gap-1'>
                            {modelConfig ? (
                              <StatusBadge
                                label={modelConfig.labelKey}
                                variant={modelConfig.variant}
                                copyable={false}
                              />
                            ) : (
                              <span className='text-muted-foreground text-xs'>
                                {group.model ?? '-'}
                              </span>
                            )}
                            {channel && (
                              <span className='text-muted-foreground text-xs'>
                                {channel.name}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {group.description ?? '-'}
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='icon-sm'
                              onClick={() => openEdit(group)}
                              aria-label='编辑分组'
                            >
                              <Pencil className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon-sm'
                              onClick={() => setDeletingGroup(group)}
                              aria-label='删除分组'
                            >
                              <Trash2 className='text-destructive h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </SectionPageLayout.Content>
      </SectionPageLayout>

      <Dialog
        open={createDialogOpen}
        onOpenChange={(v) => {
          if (!v) {
            setCreateDialogOpen(false)
            resetForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? '编辑分组' : '新建分组'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            {editingGroup && editingGroup.channel_id && (
              <div className='rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground'>
                当前绑定渠道：
                {effectiveChannels.find(
                  (ch) => ch.id === editingGroup.channel_id
                )?.name ?? '-'}
                {' · '}
                {editingGroup.model ?? '-'}
              </div>
            )}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>分组名称 *</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder='输入分组名称'
                disabled={isSaving}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>模型 *</label>
              <Select
                value={formModel}
                onValueChange={(value) => setFormModel(value ?? '')}
                disabled={isSaving || !!editingGroup}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => {
                    const config = ASSET_MODEL_CONFIG[model]
                    return (
                      <SelectItem key={model} value={model}>
                        {config ? config.labelKey : model}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {formModel && (
                <p className='text-muted-foreground text-xs'>
                  绑定渠道：
                  {findChannelForModel(effectiveChannels, formModel)?.name ??
                    '-'}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>描述</label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder='分组描述（可选）'
                disabled={isSaving}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setCreateDialogOpen(false)
                resetForm()
              }}
              disabled={isSaving}
            >
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? '保存中...' : editingGroup ? '更新' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingGroup}
        onOpenChange={(v) => !v && setDeletingGroup(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除分组「{deletingGroup?.name}」，该操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              variant='destructive'
            >
              {isDeleting ? '删除中...' : '删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/asset-library/groups/')({
  component: GroupsPage,
})
