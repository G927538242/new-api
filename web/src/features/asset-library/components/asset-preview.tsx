import { useEffect, useState } from 'react'
import { Film, Loader2, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { Asset } from '../types'

/**
 * 通过 API 获取素材的 blob URL（携带 Authorization header）。
 * 对于公网可访问的 URL（http 开头），直接返回原 URL。
 */
function useAssetBlobUrl(url: string | undefined) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let revoked: string | null = null
    let cancelled = false

    if (!url) {
      setBlobUrl(null)
      return
    }

    // 公网 URL 直接使用
    if (url.startsWith('http')) {
      setBlobUrl(url)
      return
    }

    // 本地存储 URL 需要通过 API 携带认证获取
    setLoading(true)
    setError(false)

    api
      .get(url, { responseType: 'blob' })
      .then((res) => {
        if (cancelled) return
        revoked = URL.createObjectURL(res.data as Blob)
        setBlobUrl(revoked)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      if (revoked) URL.revokeObjectURL(revoked)
    }
  }, [url])

  return { blobUrl, loading, error }
}

/** 素材缩略图（表格中展示） */
export function AssetThumbnail({
  asset,
  className,
  onClick,
}: {
  asset: Asset
  className?: string
  onClick?: () => void
}) {
  const { blobUrl, loading, error } = useAssetBlobUrl(asset.url)

  const baseClass = cn(
    'flex h-10 w-10 items-center justify-center rounded',
    onClick && 'cursor-pointer hover:ring-2 hover:ring-primary/40',
    className
  )

  if (loading) {
    return (
      <div className={baseClass}>
        <Loader2 className='size-4 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn(baseClass, 'bg-muted/40')}>
        <Film className='size-4 text-muted-foreground' />
      </div>
    )
  }

  if (asset.type === 'image' && blobUrl) {
    return (
      <img
        src={blobUrl}
        alt={asset.name}
        loading='lazy'
        className={cn(baseClass, 'object-cover')}
        onClick={onClick}
      />
    )
  }

  if (asset.type === 'video' && blobUrl) {
    return (
      <div className={cn(baseClass, 'relative bg-muted/40')} onClick={onClick}>
        <video
          src={blobUrl}
          className='h-10 w-10 rounded object-cover'
          preload='metadata'
          muted
        />
        <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
          <Film className='size-4 text-white' />
        </div>
      </div>
    )
  }

  if (asset.type === 'audio' && blobUrl) {
    return (
      <div className={cn(baseClass, 'bg-muted/40')} onClick={onClick}>
        <Music className='size-4 text-muted-foreground' />
      </div>
    )
  }

  // Fallback icon
  const Icon = asset.type === 'video' ? Film : Music
  return (
    <div className={cn(baseClass, 'bg-muted/40')} onClick={onClick}>
      <Icon className='size-4 text-muted-foreground' />
    </div>
  )
}

/** 素材预览对话框（点击查看大图/播放） */
export function AssetPreviewDialog({
  asset,
  open,
  onOpenChange,
}: {
  asset: Asset | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const { blobUrl, loading, error } = useAssetBlobUrl(asset?.url)

  if (!asset) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl border-none bg-transparent p-0 shadow-none'>
        <DialogTitle className='sr-only'>{asset.name}</DialogTitle>
        <div className='flex items-center justify-center'>
          {loading && (
            <div className='flex h-64 items-center justify-center'>
              <Loader2 className='size-8 animate-spin text-muted-foreground' />
            </div>
          )}
          {error && (
            <div className='text-sm text-muted-foreground'>
              {t('Failed to load asset')}
            </div>
          )}
          {!loading && !error && blobUrl && asset.type === 'image' && (
            <img
              src={blobUrl}
              alt={asset.name}
              className='max-h-[85vh] max-w-full rounded-lg object-contain'
            />
          )}
          {!loading && !error && blobUrl && asset.type === 'video' && (
            <video
              src={blobUrl}
              controls
              autoPlay
              className='max-h-[85vh] max-w-full rounded-lg'
            />
          )}
          {!loading && !error && blobUrl && asset.type === 'audio' && (
            <div className='flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-background p-8'>
              <Music className='size-16 text-muted-foreground' />
              <div className='text-sm font-medium'>{asset.name}</div>
              <audio src={blobUrl} controls autoPlay className='w-full' />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
