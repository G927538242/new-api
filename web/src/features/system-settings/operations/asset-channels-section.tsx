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
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as z from 'zod'

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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/status-badge'

import {
  createAssetChannel,
  deleteAssetChannel,
  getAssetChannels,
  updateAssetChannel,
} from '@/features/asset-library/api'
import {
  ASSET_CHANNEL_TYPE_CONFIG,
  getAssetChannelTypeOptions,
} from '@/features/asset-library/constants'
import {
  assetChannelFormSchema,
  type AssetChannel,
  type AssetChannelFormValues,
} from '@/features/asset-library/types'
import { SettingsSection } from '../components/settings-section'

const CHANNEL_FORM_ID = 'asset-channel-form'

type FormInput = z.input<typeof assetChannelFormSchema>
type FormValues = z.output<typeof assetChannelFormSchema>

function ChannelFormDialog({
  open,
  onOpenChange,
  channel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  channel: AssetChannel | null
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = !!channel
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(assetChannelFormSchema),
    defaultValues: {
      name: '',
      type: 'volcark',
      access_key: '',
      secret_key: '',
      models: '',
      enabled: true,
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (channel) {
        form.reset({
          name: channel.name,
          type: channel.type,
          access_key: '',
          secret_key: '',
          models: channel.models,
          enabled: channel.enabled,
          description: channel.description || '',
        })
      } else {
        form.reset({
          name: '',
          type: 'volcark',
          access_key: '',
          secret_key: '',
          models: '',
          enabled: true,
          description: '',
        })
      }
    }
  }, [open, channel, form])

  const onSubmit = async (values: AssetChannelFormValues) => {
    setIsSaving(true)
    try {
      const result = isEdit
        ? await updateAssetChannel(channel!.id, values)
        : await createAssetChannel(values)
      if (result.success) {
        toast.success(isEdit ? '渠道更新成功' : '渠道创建成功')
        queryClient.invalidateQueries({ queryKey: ['asset-channels'] })
        onOpenChange(false)
      } else {
        toast.error(result.message || (isEdit ? '渠道更新失败' : '渠道创建失败'))
      }
    } catch {
      toast.error(isEdit ? '渠道更新失败' : '渠道创建失败')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? '编辑素材渠道' : '新建素材渠道'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id={CHANNEL_FORM_ID}
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>渠道名称 *</FormLabel>
                  <FormControl>
                    <Input placeholder='如 字节官方、移动MOMA平台' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>渠道类型 *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        {getAssetChannelTypeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    字节官方对应火山引擎方舟素材库（AK/SK 鉴权）；移动MOMA平台为预留渠道类型。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='models'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>支持的模型</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='如 sendance-2.0, sendance-2.5（逗号分隔）'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    素材库页面将按这些模型展示切换页签，模型归属该渠道。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='access_key'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Key</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder={channel ? '留空保持不变' : '输入 AK'}
                        autoComplete='new-password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='secret_key'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Key</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder={channel ? '留空保持不变' : '输入 SK'}
                        autoComplete='new-password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>说明</FormLabel>
                  <FormControl>
                    <Input placeholder='渠道用途说明（可选）' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='enabled'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-lg border px-3 py-2'>
                  <div>
                    <FormLabel>启用渠道</FormLabel>
                    <FormDescription>停用后素材库不再展示该渠道及其模型。</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            {t('Cancel')}
          </Button>
          <Button type='submit' form={CHANNEL_FORM_ID} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : null}
            {isSaving ? t('Saving...') : isEdit ? t('Update') : t('Create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AssetChannelsSection() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<AssetChannel | null>(null)
  const [deletingChannel, setDeletingChannel] = useState<AssetChannel | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['asset-channels'],
    queryFn: async () => {
      const result = await getAssetChannels()
      if (!result.success) {
        toast.error('加载素材渠道失败')
        return []
      }
      return result.data ?? []
    },
  })

  const handleCreate = () => {
    setEditingChannel(null)
    setDialogOpen(true)
  }

  const handleEdit = (channel: AssetChannel) => {
    setEditingChannel(channel)
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingChannel) return
    setIsDeleting(true)
    try {
      const result = await deleteAssetChannel(deletingChannel.id)
      if (result.success) {
        toast.success('渠道删除成功')
        queryClient.invalidateQueries({ queryKey: ['asset-channels'] })
        setDeletingChannel(null)
      } else {
        toast.error(result.message || '渠道删除失败')
      }
    } catch {
      toast.error('渠道删除失败')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <SettingsSection title='素材渠道'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>
            素材库按上游渠道隔离管理（如字节官方、移动MOMA平台）。每个渠道配置独立的
            AK/SK 凭证与支持的模型，素材分组与素材均归属到「渠道 + 模型」下。
          </p>
          <Button size='sm' onClick={handleCreate}>
            <Plus className='h-4 w-4' />
            新建渠道
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>渠道名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>支持的模型</TableHead>
              <TableHead>凭证</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className='text-right'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='text-muted-foreground h-24 text-center'
                >
                  加载中...
                </TableCell>
              </TableRow>
            ) : channels.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='text-muted-foreground h-24 text-center'
                >
                  暂无素材渠道，请先新建渠道（如「字节官方」）。
                </TableCell>
              </TableRow>
            ) : (
              channels.map((channel) => {
                const typeConfig = ASSET_CHANNEL_TYPE_CONFIG[channel.type]
                return (
                  <TableRow key={channel.id}>
                    <TableCell className='font-mono text-xs'>
                      {channel.id}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {channel.name}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={typeConfig?.label ?? channel.type}
                        variant={typeConfig?.variant}
                        copyable={false}
                      />
                    </TableCell>
                    <TableCell className='text-xs'>
                      {channel.models || '-'}
                    </TableCell>
                    <TableCell>
                      {channel.has_credentials ? (
                        <StatusBadge
                          label='已配置'
                          variant='success'
                          copyable={false}
                        />
                      ) : (
                        <StatusBadge
                          label='未配置'
                          variant='warning'
                          copyable={false}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={channel.enabled ? '已启用' : '已停用'}
                        variant={channel.enabled ? 'success' : 'neutral'}
                        copyable={false}
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='icon-sm'
                          onClick={() => handleEdit(channel)}
                          aria-label='编辑渠道'
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon-sm'
                          onClick={() => setDeletingChannel(channel)}
                          aria-label='删除渠道'
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
      </div>

      <ChannelFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        channel={editingChannel}
      />

      <AlertDialog
        open={!!deletingChannel}
        onOpenChange={(v) => !v && setDeletingChannel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
            <AlertDialogDescription>
              确定删除素材渠道「{deletingChannel?.name}」吗？删除后该渠道下的分组与素材将不再归属任何渠道。
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
    </SettingsSection>
  )
}
