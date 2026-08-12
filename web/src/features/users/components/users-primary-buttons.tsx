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
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'

import { cleanupDeletedUsers } from '../api'
import { useUsers } from './users-provider'

export function UsersPrimaryButtons() {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow, triggerRefresh } = useUsers()
  const [cleanupOpen, setCleanupOpen] = useState(false)
  const [isCleaning, setIsCleaning] = useState(false)

  const handleCreate = () => {
    setCurrentRow(null)
    setOpen('create')
  }

  const handleCleanup = async () => {
    setIsCleaning(true)
    try {
      const result = await cleanupDeletedUsers()
      if (result.success) {
        toast.success(
          result.data
            ? t('Cleaned up {{count}} deleted users', { count: result.data })
            : t('No deleted users to clean up')
        )
        setCleanupOpen(false)
        triggerRefresh()
      } else {
        toast.error(result.message || t('Operation failed'))
      }
    } catch {
      toast.error(t('Operation failed'))
    } finally {
      setIsCleaning(false)
    }
  }

  return (
    <>
      <div className='flex gap-2'>
        <Button size='sm' onClick={handleCreate}>
          <Plus className='h-4 w-4' />
          {t('Add User')}
        </Button>
        <Button
          size='sm'
          variant='outline'
          className='text-destructive hover:text-destructive'
          onClick={() => setCleanupOpen(true)}
        >
          <Trash2 className='h-4 w-4' />
          {t('Clean Up Deleted Users')}
        </Button>
      </div>

      <ConfirmDialog
        open={cleanupOpen}
        onOpenChange={setCleanupOpen}
        title={t('Are you sure?')}
        desc={t(
          'This will permanently delete all deactivated users and their related data. This action cannot be undone.'
        )}
        confirmText={isCleaning ? t('Deleting...') : t('Delete')}
        destructive
        isLoading={isCleaning}
        handleConfirm={handleCleanup}
      />
    </>
  )
}
