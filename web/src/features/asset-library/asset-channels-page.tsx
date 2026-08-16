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
import { SectionPageLayout } from '@/components/layout'

import {
  createAssetChannel,
  deleteAssetChannel,
  getAssetChannels,
  updateAssetChannel,
} from './api'
import {
  ASSET_CHANNEL_TYPE_CONFIG,
  getAssetChannelTypeOptions,
} from './constants'
import {
  assetChannelFormSchema,
  type AssetChannel,
  type AssetChannelFormValues,
} from './types'

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
        toast.success(
          isEdit
            ? t('Asset channel updated successfully')
            : t('Asset channel created successfully')
        )
        queryClient.invalidateQueries({ queryKey: ['asset-channels'] })
        onOpenChange(false)
      } else {
        toast.error(
          result.message ||
            t(
              isEdit
                ? 'Failed to update asset channel'
                : 'Failed to create asset channel'
            )
        )
      }
    } catch {
      toast.error(
        t(isEdit ? 'Failed to update asset channel' : 'Failed to create asset channel')
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('Edit Asset Channel') : t('New Asset Channel')}
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
                  <FormLabel>{t('Channel Name')} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('e.g. Volcengine Ark, MOMA Platform')}
                      {...field}
                    />
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
                  <FormLabel>{t('Channel Type')} *</FormLabel>
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
                            {t(option.label)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('channel type description')}
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
                  <FormLabel>{t('Supported Models')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('e.g. sendance-2.0, sendance-2.5 (comma separated)')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('models description')}
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
                        placeholder={channel ? t('Leave blank to keep unchanged') : t('Enter AK')}
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
                        placeholder={channel ? t('Leave blank to keep unchanged') : t('Enter SK')}
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
                  <FormLabel>{t('Description')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Channel purpose (optional)')} {...field} />
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
                    <FormLabel>{t('Enable channel')}</FormLabel>
                    <FormDescription>{t('disable channel hint')}</FormDescription>
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

export function AssetChannelsPage() {
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
        toast.error(t('Failed to load asset channels'))
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
        toast.success(t('Asset channel deleted successfully'))
        queryClient.invalidateQueries({ queryKey: ['asset-channels'] })
        setDeletingChannel(null)
      } else {
        toast.error(result.message || t('Failed to delete asset channel'))
      }
    } catch {
      toast.error(t('Failed to delete asset channel'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <SectionPageLayout fixedContent>
        <SectionPageLayout.Title>
          <div className='flex flex-col gap-1'>
            <span>{t('Asset Channels')}</span>
            <p className='text-muted-foreground text-sm'>
              {t('channels page description')}
            </p>
          </div>
        </SectionPageLayout.Title>
        <SectionPageLayout.Actions>
          <Button size='sm' onClick={handleCreate}>
            <Plus className='h-4 w-4' />
            {t('New Channel')}
          </Button>
        </SectionPageLayout.Actions>
        <SectionPageLayout.Content>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t('Channel Name')}</TableHead>
                <TableHead>{t('Channel Type')}</TableHead>
                <TableHead>{t('Supported Models')}</TableHead>
                <TableHead>{t('Credentials')}</TableHead>
                <TableHead>{t('Status')}</TableHead>
                <TableHead className='text-right'>{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-muted-foreground h-24 text-center'
                  >
                    {t('Loading...')}
                  </TableCell>
                </TableRow>
              ) : channels.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-muted-foreground h-24 text-center'
                  >
                    {t('No asset channels yet. Create one first.')}
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
                          label={
                            typeConfig ? t(typeConfig.labelKey) : channel.type
                          }
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
                            label={t('Configured')}
                            variant='success'
                            copyable={false}
                          />
                        ) : (
                          <StatusBadge
                            label={t('Not configured')}
                            variant='warning'
                            copyable={false}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          label={channel.enabled ? t('Enabled') : t('Disabled')}
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
                            aria-label={t('Edit Channel')}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon-sm'
                            onClick={() => setDeletingChannel(channel)}
                            aria-label={t('Delete Channel')}
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
        </SectionPageLayout.Content>
      </SectionPageLayout>

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
              {t('delete channel confirm', {
                name: deletingChannel?.name,
              })}
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
