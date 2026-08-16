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
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Dialog } from '@/components/dialog'
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { createAssetGroup, deleteAssetGroup, updateAssetGroup } from '../api'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants'
import { assetGroupFormSchema, type AssetGroupFormValues } from '../types'
import { AssetsDeleteDialog } from './assets-delete-dialog'
import { useAssets } from './assets-provider'

// ============================================================================
// Create / Edit Group Dialog
// ============================================================================

const GROUP_MUTATE_FORM_ID = 'asset-group-mutate-form'

function GroupMutateDialog({
  mode,
}: {
  mode: 'create' | 'edit'
}) {
  const { t } = useTranslation()
  const {
    open,
    setOpen,
    currentGroup,
    currentModel,
    currentChannel,
    triggerGroupsRefresh,
  } = useAssets()
  const isEdit = mode === 'edit'
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<AssetGroupFormValues>({
    resolver: zodResolver(assetGroupFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (open === (isEdit ? 'edit-group' : 'create-group')) {
      if (isEdit && currentGroup) {
        form.reset({
          name: currentGroup.name,
          description: currentGroup.description || '',
        })
      } else {
        form.reset({
          name: '',
          description: '',
        })
      }
    }
  }, [open, isEdit, currentGroup, form])

  const isOpen = open === (isEdit ? 'edit-group' : 'create-group')

  const onSubmit = async (values: AssetGroupFormValues) => {
    setIsSaving(true)
    try {
      const response = isEdit
        ? await updateAssetGroup(currentGroup!.id, values)
        : await createAssetGroup(values, currentChannel?.id ?? 0, currentModel)

      if (response.success) {
        toast.success(
          isEdit
            ? t(SUCCESS_MESSAGES.GROUP_UPDATED)
            : t(SUCCESS_MESSAGES.GROUP_CREATED)
        )
        triggerGroupsRefresh()
        setOpen(null)
      } else {
        toast.error(
          t(
            isEdit
              ? ERROR_MESSAGES.UPDATE_GROUP_FAILED
              : ERROR_MESSAGES.CREATE_GROUP_FAILED
          )
        )
      }
    } catch {
      toast.error(
        t(
          isEdit
            ? ERROR_MESSAGES.UPDATE_GROUP_FAILED
            : ERROR_MESSAGES.CREATE_GROUP_FAILED
        )
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => !v && setOpen(null)}
      title={isEdit ? t('Edit Group') : t('New Group')}
      description={
        isEdit
          ? t('Update group info')
          : t('Create a new asset group')
      }
      contentHeight='auto'
      bodyClassName='space-y-4'
      footer={
        <>
          <Button
            type='button'
            variant='outline'
            onClick={() => setOpen(null)}
            disabled={isSaving}
          >
            {t('Cancel')}
          </Button>
          <Button
            type='submit'
            form={GROUP_MUTATE_FORM_ID}
            disabled={isSaving || (!isEdit && !currentChannel)}
          >
            {isSaving ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : null}
            {isSaving ? t('Saving...') : isEdit ? t('Update') : t('Create')}
          </Button>
        </>
      }
    >
      {!isEdit && currentChannel && (
        <div className='rounded-lg border bg-muted/30 px-3 py-2 text-sm'>
          <div className='flex items-center gap-1.5'>
            <span className='text-muted-foreground'>
              {t('Bound channel:')}
            </span>
            <span className='font-medium'>{currentChannel.name}</span>
            <span className='text-muted-foreground'>
              {t('Model:')}
            </span>
            <span className='font-medium'>{currentModel}</span>
          </div>
        </div>
      )}
      {!isEdit && !currentChannel && (
        <div className='rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive'>
          {t('configure asset channel first hint')}
        </div>
      )}
      <Form {...form}>
        <form
          id={GROUP_MUTATE_FORM_ID}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Group Name')} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('Enter group name')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Description')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('Enter group description')}
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Dialog>
  )
}

// ============================================================================
// Delete Group Dialog
// ============================================================================

function DeleteGroupDialog() {
  const { t } = useTranslation()
  const {
    open,
    setOpen,
    currentGroup,
    setCurrentGroup,
    setCurrentGroupId,
    triggerGroupsRefresh,
  } = useAssets()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!currentGroup) return

    setIsDeleting(true)
    try {
      const result = await deleteAssetGroup(currentGroup.id)
      if (result.success) {
        toast.success(t(SUCCESS_MESSAGES.GROUP_DELETED))
        // If the deleted group was the active filter, reset it
        setCurrentGroupId((prev) =>
          prev === currentGroup.id ? null : prev
        )
        setCurrentGroup(null)
        triggerGroupsRefresh()
        setOpen(null)
      } else {
        toast.error(t(ERROR_MESSAGES.DELETE_GROUP_FAILED))
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.DELETE_GROUP_FAILED))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog
      open={open === 'delete-group'}
      onOpenChange={(v) => !v && setOpen(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('This will permanently delete group')}{' '}
            <span className='font-semibold'>{currentGroup?.name}</span>
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
  )
}

// ============================================================================
// Composed Dialogs
// ============================================================================

export function AssetsDialogs() {
  return (
    <>
      <AssetsDeleteDialog />
      <GroupMutateDialog mode='create' />
      <GroupMutateDialog mode='edit' />
      <DeleteGroupDialog />
    </>
  )
}
