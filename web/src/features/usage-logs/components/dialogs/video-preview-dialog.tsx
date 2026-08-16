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
import { Copy, Loader2, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Dialog } from '@/components/dialog'
import { Button } from '@/components/ui/button'
import { IconBadge } from '@/components/ui/icon-badge'
import { getFreshAuthHeaders } from '@/lib/api'

interface VideoPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
}

type LoadState = 'loading' | 'ready' | 'error'

export function VideoPreviewDialog({
  open,
  onOpenChange,
  taskId,
}: VideoPreviewDialogProps) {
  const { t } = useTranslation()
  const [state, setState] = useState<LoadState>('loading')
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  // /v1/videos 接口需要 Bearer 鉴权，<video> 原生请求无法携带
  // Authorization 头，因此先用 fetch 带 token 拉取视频二进制，
  // 再通过 blob URL 交给播放器。
  useEffect(() => {
    if (!open) return
    let cancelled = false
    setState('loading')
    setObjectUrl(null)

    ;(async () => {
      try {
        const headers = await getFreshAuthHeaders()
        const response = await fetch(`/v1/videos/${taskId}/content`, {
          headers,
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const blob = await response.blob()
        if (cancelled) return
        setObjectUrl(URL.createObjectURL(blob))
        setState('ready')
      } catch {
        if (!cancelled) setState('error')
      }
    })()

    return () => {
      cancelled = true
      setObjectUrl((url) => {
        if (url) URL.revokeObjectURL(url)
        return null
      })
    }
  }, [open, taskId])

  const videoSrc = `/v1/videos/${taskId}/content`

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <>
          <IconBadge tone='chart-4' size='sm'>
            <Video />
          </IconBadge>
          {t('Video Preview')}
        </>
      }
      contentClassName='sm:max-w-2xl'
      titleClassName='flex items-center gap-2'
      contentHeight='auto'
      bodyClassName='space-y-4'
    >
      {state === 'loading' && (
        <div className='bg-muted/40 flex aspect-video w-full items-center justify-center rounded-lg'>
          <Loader2 className='text-muted-foreground animate-spin' />
        </div>
      )}
      {state === 'ready' && objectUrl && (
        <video
          key={taskId}
          src={objectUrl}
          controls
          autoPlay
          className='aspect-video w-full rounded-lg bg-black'
          onError={() => setState('error')}
        />
      )}
      {state === 'error' && (
        <div className='flex flex-col items-center gap-3 py-6'>
          <p className='text-destructive text-sm'>{t('Video playback failed')}</p>
          <Button
            variant='outline'
            size='sm'
            className='h-8 gap-1.5 text-xs'
            onClick={() => {
              navigator.clipboard.writeText(videoSrc)
              toast.success(t('Copied'))
            }}
          >
            <Copy className='h-3 w-3' />
            {t('Copy Link')}
          </Button>
        </div>
      )}
    </Dialog>
  )
}
