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
  updateAssetGroup,
} from '../../../../features/asset-library/api'
import {
  ASSET_MODEL_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
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
      toast.error(t('Group name is required'))
      return
    }
    if (!formModel) {
      toast.error(t('Please select a model'))
      return
    }

    setIsSaving(true)
    try {
      if (editingGroup) {
        // 编辑仅更新名称与描述，分组绑定的渠道 + 模型不可变更
        const result = await updateAssetGroup(editingGroup.id, {
          name: formName.trim(),
          description: formDescription.trim(),
        })
        if (result.success) {
          toast.success(t(SUCCESS_MESSAGES.GROUP_UPDATED))
          queryClient.invalidateQueries({ queryKey: ['asset-groups'] })
          setCreateDialogOpen(false)
          resetForm()
        } else {
          toast.error(result.message || t(ERROR_MESSAGES.UPDATE_GROUP_FAILED))
        }
        return
      }

      const channel = findChannelForModel(effectiveChannels, formModel)
      if (!channel) {
        toast.error(t('No available channel for this model'))
        return
      }

      const result = await createAssetGroup(
        {
          name: formName.trim(),
          description: formDescription.trim(),
        },
        channel.id,
        formModel
      )
      if (result.success) {
        toast.success(t(SUCCESS_MESSAGES.GROUP_CREATED))
        queryClient.invalidateQueries({ queryKey: ['asset-groups'] })
        setCreateDialogOpen(false)
        resetForm()
      } else {
        toast.error(result.message || t(ERROR_MESSAGES.CREATE_GROUP_FAILED))
      }
    } catch {
      toast.error(
        editingGroup
          ? t(ERROR_MESSAGES.UPDATE_GROUP_FAILED)
          : t(ERROR_MESSAGES.CREATE_GROUP_FAILED)
      )
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
        toast.success(t(SUCCESS_MESSAGES.GROUP_DELETED))
        queryClient.invalidateQueries({ queryKey: ['asset-groups'] })
        setDeletingGroup(null)
      } else {
        toast.error(result.message || t(ERROR_MESSAGES.DELETE_GROUP_FAILED))
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.DELETE_GROUP_FAILED))
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
            <span>{t('My Asset Groups')}</span>
            <p className='text-muted-foreground text-sm'>
              {t('Manage asset groups, isolated by channel and model')}
            </p>
          </div>
        </SectionPageLayout.Title>
        <SectionPageLayout.Actions>
          <Button
            size='sm'
            onClick={openCreate}
            disabled={!hasModels}
            title={
              !hasModels
                ? t('No models available, please configure asset channels first')
                : ''
            }
          >
            <Plus className='h-4 w-4' />
            {t('New Group')}
          </Button>
        </SectionPageLayout.Actions>
        <SectionPageLayout.Content>
          {!hasModels ? (
            <div className='rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center'>
              <p className='text-sm font-medium'>
                {t('No asset models available')}
              </p>
              <p className='mt-1 text-xs text-muted-foreground'>
                {t('Please contact admin to configure asset channels and models')}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t('Group Name')}</TableHead>
                  <TableHead>{t('Model')}</TableHead>
                  <TableHead>{t('Description')}</TableHead>
                  <TableHead className='text-right'>{t('Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-muted-foreground h-24 text-center'
                    >
                      {t('Loading...')}
                    </TableCell>
                  </TableRow>
                ) : groups.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-muted-foreground h-24 text-center'
                    >
                      {t('No groups yet. Click "New Group" to create one.')}
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
                                label={t(modelConfig.labelKey)}
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
                              aria-label={t('Edit Group')}
                            >
                              <Pencil className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon-sm'
                              onClick={() => setDeletingGroup(group)}
                              aria-label={t('Delete Group')}
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
              {editingGroup ? t('Edit Group') : t('New Group')}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            {editingGroup && (
              <div className='rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground'>
                {t('Bound channel:')}{' '}
                {effectiveChannels.find(
                  (ch) => ch.id === editingGroup.channel_id
                )?.name ?? '-'}
                {' · '}
                {editingGroup.model ?? '-'}
              </div>
            )}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>
                {t('Group Name')} *
              </label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={t('Enter group name')}
                disabled={isSaving}
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>{t('Model')} *</label>
              <Select
                value={formModel}
                onValueChange={(value) => setFormModel(value ?? '')}
                disabled={isSaving || !!editingGroup}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select model')} />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => {
                    const config = ASSET_MODEL_CONFIG[model]
                    return (
                      <SelectItem key={model} value={model}>
                        {config ? t(config.labelKey) : model}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {formModel && (
                <p className='text-muted-foreground text-xs'>
                  {t('Bound channel:')}{' '}
                  {findChannelForModel(effectiveChannels, formModel)?.name ??
                    '-'}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>
                {t('Description')}
              </label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder={t('Description (optional)')}
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
              {t('Cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving
                ? t('Saving...')
                : editingGroup
                  ? t('Update')
                  : t('Create')}
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
            <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('This will permanently delete group')}{' '}
              <span className='font-semibold'>{deletingGroup?.name}</span>
              {t('. This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              variant='destructive'
            >
              {isDeleting ? t('Deleting...') : t('Delete')}
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
