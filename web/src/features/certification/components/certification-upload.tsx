import * as React from 'react'

import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

import { uploadCertificationFile } from '../api'
import { Loader2, Maximize2, Upload, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface CertImageProps {
  url: string
  alt?: string
  className?: string
  /** 是否可点击放大预览 */
  previewable?: boolean
}

/** 认证证件图片：携带 Authorization 获取 blob 后展示 */
export function CertImage({ url, alt, className, previewable = false }: CertImageProps) {
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null)
  const [error, setError] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)

  React.useEffect(() => {
    let revoked: string | null = null
    let cancelled = false
    setError(false)

    if (!url) {
      setObjectUrl(null)
      return
    }

    api
      .get(url, { responseType: 'blob' })
      .then((res) => {
        if (cancelled) return
        revoked = URL.createObjectURL(res.data as Blob)
        setObjectUrl(revoked)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
      if (revoked) URL.revokeObjectURL(revoked)
    }
  }, [url])

  if (error) {
    return (
      <div className='flex aspect-[3/2] items-center justify-center rounded-lg border bg-muted/40 text-xs text-muted-foreground'>
        图片加载失败
      </div>
    )
  }

  if (!objectUrl) {
    return (
      <div className='flex aspect-[3/2] items-center justify-center rounded-lg border bg-muted/40'>
        <Loader2 className='size-4 animate-spin text-muted-foreground' />
      </div>
    )
  }

  const imgElement = (
    <img
      src={objectUrl}
      alt={alt ?? 'certification image'}
      className={cn('rounded-lg border object-cover', className)}
    />
  )

  return (
    <>
      {previewable ? (
        <div
          className='group relative cursor-zoom-in overflow-hidden rounded-lg'
          onClick={() => setPreviewOpen(true)}
        >
          {imgElement}
          <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20'>
            <Maximize2 className='size-6 text-white opacity-0 transition-opacity group-hover:opacity-100' />
          </div>
        </div>
      ) : (
        imgElement
      )}

      {previewable && objectUrl && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className='max-h-[90vh] max-w-4xl border-none bg-transparent p-0 shadow-none'>
            <div className='flex items-center justify-center'>
              <img
                src={objectUrl}
                alt={alt ?? 'certification image preview'}
                className='max-h-[85vh] max-w-full rounded-lg object-contain'
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

interface CertificationUploadProps {
  label: string
  description?: string
  value?: string
  onChange: (url: string) => void
}

/** 认证证件上传组件：上传图片并展示预览 */
export function CertificationUpload({
  label,
  description,
  value,
  onChange,
}: CertificationUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const res = await uploadCertificationFile(file)
      if (res.success && res.data?.url) {
        onChange(res.data.url)
      } else {
        setError(res.message || '上传失败')
      }
    } catch {
      setError('上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='space-y-1.5'>
      <div className='text-sm font-medium'>{label}</div>
      <div
        className={cn(
          'group relative flex aspect-[3/2] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground',
          value && 'border-solid'
        )}
        onClick={() => !uploading && inputRef.current?.click()}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !uploading) inputRef.current?.click()
        }}
      >
        {value ? (
          <>
            <CertImage url={value} className='absolute inset-0 size-full' />
            <div className='absolute right-1.5 bottom-1.5 flex items-center gap-1.5'>
              <span className='rounded-md bg-background/90 px-2 py-1 text-xs shadow-sm'>
                点击更换
              </span>
              <button
                type='button'
                className='rounded-md bg-background/90 p-1 text-muted-foreground shadow-sm hover:text-destructive'
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                }}
                aria-label='移除图片'
              >
                <X className='size-3.5' />
              </button>
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center gap-1.5 px-4 text-center'>
            {uploading ? (
              <Loader2 className='size-5 animate-spin' />
            ) : (
              <Upload className='size-5' />
            )}
            <span className='text-xs'>
              {uploading ? '上传中...' : '点击上传'}
            </span>
            {description && (
              <span className='text-xs text-muted-foreground'>
                {description}
              </span>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type='file'
          accept='image/jpeg,image/png,image/webp,image/gif'
          className='hidden'
          onChange={(e) => {
            handleFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>
      {error && <div className='text-xs text-destructive'>{error}</div>}
    </div>
  )
}
