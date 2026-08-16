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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@/components/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ImageDialogProps {
  /** 单图模式（MJ 绘图日志等） */
  imageUrl?: string
  /** 多图模式（任务日志中生成的多张图片） */
  imageUrls?: string[]
  taskId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageDialog({
  imageUrl,
  imageUrls,
  taskId,
  open,
  onOpenChange,
}: ImageDialogProps) {
  const { t } = useTranslation()
  const urls = imageUrls?.length
    ? imageUrls
    : imageUrl
      ? [imageUrl]
      : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const currentUrl = urls[currentIndex] || ''

  // Reset loading state when dialog opens or image URL changes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setIsLoading(true)
      setHasError(false)
      setCurrentIndex(0)
    }
    onOpenChange(newOpen)
  }

  const handleSwitch = (index: number) => {
    if (index < 0 || index >= urls.length) return
    setCurrentIndex(index)
    setIsLoading(true)
    setHasError(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t('Image Preview')}
      description={
        taskId ? `${t('Task ID:')} ${taskId}` : t('View the generated image')
      }
      contentClassName='sm:max-w-3xl'
      contentHeight='auto'
      bodyClassName='space-y-4'
    >
      {urls.length === 0 ? (
        <p className='text-muted-foreground py-6 text-center text-sm'>
          {t('None')}
        </p>
      ) : (
        <ScrollArea className='max-h-[600px]'>
          <div className='py-4'>
            <div className='bg-muted/50 relative flex min-h-[300px] items-center justify-center rounded-lg border'>
              {/* Skeleton - show when loading or error */}
              {(isLoading || hasError) && (
                <Skeleton className='absolute inset-0 h-full w-full rounded-lg' />
              )}

              {/* Actual Image */}
              <img
                key={currentUrl}
                src={currentUrl}
                alt={t('Generated image')}
                className={cn(
                  'max-h-[550px] w-full rounded-lg object-contain',
                  (isLoading || hasError) && 'opacity-0'
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading='lazy'
              />

              {/* Prev / Next controls (multi-image only) */}
              {urls.length > 1 && (
                <>
                  <button
                    type='button'
                    aria-label={t('Previous image')}
                    className='bg-background/70 hover:bg-background/90 absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition-colors'
                    onClick={() => handleSwitch(currentIndex - 1)}
                  >
                    <ChevronLeft className='size-4' />
                  </button>
                  <button
                    type='button'
                    aria-label={t('Next image')}
                    className='bg-background/70 hover:bg-background/90 absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition-colors'
                    onClick={() => handleSwitch(currentIndex + 1)}
                  >
                    <ChevronRight className='size-4' />
                  </button>
                </>
              )}

              {/* Error text overlay (shown on skeleton) */}
              {hasError && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <p className='text-muted-foreground text-sm'>
                    {t('Failed to load image')}
                  </p>
                </div>
              )}
            </div>

            {/* Thumbnails (multi-image only) */}
            {urls.length > 1 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {urls.map((url, idx) => (
                  <button
                    key={`${idx}-${url}`}
                    type='button'
                    className={cn(
                      'size-14 shrink-0 overflow-hidden rounded-md border transition-all',
                      idx === currentIndex
                        ? 'ring-primary ring-2'
                        : 'border-border/60 opacity-60 hover:opacity-100'
                    )}
                    onClick={() => handleSwitch(idx)}
                  >
                    <img
                      src={url}
                      alt=''
                      loading='lazy'
                      className='h-full w-full object-cover'
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Current Image URL */}
            <div className='bg-muted mt-4 rounded-md p-3'>
              <p className='text-muted-foreground font-mono text-xs break-all'>
                {currentUrl}
              </p>
            </div>
          </div>
        </ScrollArea>
      )}
    </Dialog>
  )
}
