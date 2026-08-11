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
import { Loader2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { uploadAsset } from '../api'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants'
import { useAssets } from './assets-provider'

export function AssetsPrimaryButtons() {
  const { t } = useTranslation()
  const { triggerRefresh } = useAssets()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const results = await Promise.allSettled(
        [...files].map((file) => uploadAsset(file))
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

  return (
    <>
      <input
        ref={inputRef}
        type='file'
        multiple
        className='hidden'
        onChange={(e) => handleFiles(e.target.files)}
      />
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
    </>
  )
}
