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
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Activity,
  Copy,
  Check,
  User,
  Tv,
  FileJson,
  AlertTriangle,
  Link as LinkIcon,
  Database,
} from 'lucide-react'

import { Dialog } from '@/components/dialog'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { IconBadge, type IconBadgeTone } from '@/components/ui/icon-badge'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { formatTimestampToDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import type { TaskLog } from '../../types'
import { taskActionMapper, taskStatusMapper } from '../../lib/mappers'

interface TaskDetailsDialogProps {
  log: TaskLog
  isAdmin: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DetailRow(props: {
  label: React.ReactNode
  value: React.ReactNode
  mono?: boolean
  muted?: boolean
  copyable?: string
}) {
  const { t } = useTranslation()
  const { copiedText, copyToClipboard } = useCopyToClipboard({
    notify: false,
  })

  return (
    <div className='grid min-w-0 grid-cols-[6.5rem_minmax(0,1fr)] gap-2 text-xs sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3'>
      <span className='text-muted-foreground text-xs'>{props.label}</span>
      <div className='relative min-w-0'>
        <span
          className={cn(
            'min-w-0 break-all',
            props.mono && 'font-mono',
            props.muted && 'text-muted-foreground'
          )}
        >
          {props.value}
        </span>
        {props.copyable && (
          <Button
            variant='ghost'
            size='sm'
            className='absolute -top-1 right-0 h-5 w-5 p-0'
            onClick={() => copyToClipboard(props.copyable!)}
            title={t('Copy to clipboard')}
            aria-label={t('Copy to clipboard')}
          >
            {copiedText === props.copyable ? (
              <Check className='size-3 text-green-600' />
            ) : (
              <Copy className='size-3' />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

function DetailSection(props: {
  icon?: React.ReactNode
  iconTone?: IconBadgeTone
  label: string
  variant?: 'default' | 'danger'
  children: React.ReactNode
}) {
  const isDanger = props.variant === 'danger'
  const iconTone = isDanger ? 'destructive' : props.iconTone
  return (
    <div className='min-w-0 space-y-1.5'>
      <Label
        className={cn(
          'flex items-center gap-1.5 text-xs font-semibold',
          isDanger && 'text-red-500'
        )}
      >
        {props.icon && (
          <IconBadge tone={iconTone} size='xs'>
            {props.icon}
          </IconBadge>
        )}
        {props.label}
      </Label>
      <div
        className={cn(
          'min-w-0 space-y-1 overflow-hidden rounded-md border p-2.5 max-sm:p-2',
          isDanger
            ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'
            : 'bg-muted/30'
        )}
      >
        {props.children}
      </div>
    </div>
  )
}

function tryParseJSON(raw?: unknown): unknown {
  if (raw === null || raw === undefined) return null
  // Backend may return an already-parsed object/array — pass it through as-is.
  if (typeof raw !== 'string') return raw
  const trimmed = raw.trim()
  if (!trimmed) return null
  // Only attempt JSON parse for objects/arrays that look JSON-ish
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed)
    } catch {
      return null
    }
  }
  return null
}

function findPrompt(data: unknown): string | undefined {
  if (!data) return undefined
  const visit = (node: unknown): string | undefined => {
    if (!node || typeof node !== 'object') return undefined
    const obj = node as Record<string, unknown>
    for (const key of ['prompt', 'user_prompt', 'input', 'text']) {
      const val = obj[key]
      if (typeof val === 'string' && val.trim()) return val
    }
    for (const val of Object.values(obj)) {
      if (val && typeof val === 'object') {
        const found = visit(val)
        if (found) return found
      }
    }
    return undefined
  }
  return visit(data)
}

function findURLs(data: unknown): { videos: string[]; images: string[] } {
  const videos: string[] = []
  const images: string[] = []
  if (!data) return { videos, images }
  const seen = new Set<unknown>()
  const isVideo = (s: string) =>
    /\.(mp4|webm|mov|m4v|avi|mkv)(\?|#|$)/i.test(s) || s.startsWith('data:video')
  const isImage = (s: string) =>
    /\.(png|jpe?g|webp|gif|bmp|svg|avif|heic)(\?|#|$)/i.test(s) ||
    s.startsWith('data:image')
  const videoKeys = new Set([
    'video_url',
    'video_urls',
    'videos',
    'video',
    'url',
  ])
  const imageKeys = new Set([
    'image_url',
    'image_urls',
    'images',
    'image',
    'cover',
    'cover_url',
    'poster_url',
    'thumbnail',
    'thumbnail_url',
  ])
  const visit = (node: unknown) => {
    if (!node || seen.has(node)) return
    seen.add(node)
    if (typeof node === 'string') {
      const v = node.trim()
      if (!v || (!v.startsWith('http') && !v.startsWith('data:'))) return
      if (isVideo(v)) videos.push(v)
      else if (isImage(v)) images.push(v)
      return
    }
    if (Array.isArray(node)) {
      node.forEach(visit)
      return
    }
    if (typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        const k = key.toLowerCase()
        if (typeof value === 'string' && value.trim()) {
          const raw = value.trim()
          if (!raw.startsWith('http') && !raw.startsWith('data:')) continue
          if (videoKeys.has(k)) videos.push(raw)
          else if (imageKeys.has(k)) images.push(raw)
        }
        visit(value)
      }
    }
  }
  visit(data)
  return {
    videos: [...new Set(videos)],
    images: [...new Set(images)],
  }
}

export function TaskDetailsDialog({
  log,
  isAdmin,
  open,
  onOpenChange,
}: TaskDetailsDialogProps) {
  const { t } = useTranslation()

  const parsedData = useMemo(() => {
    const v = tryParseJSON(log.data)
    return v
  }, [log.data])

  const properties = useMemo(() => {
    const v = tryParseJSON(
      typeof log.properties === 'string'
        ? (log.properties as string)
        : log.properties !== null && log.properties !== undefined
          ? JSON.stringify(log.properties)
          : undefined
    )
    return v as Record<string, unknown> | null
  }, [log.properties])

  const prompt = useMemo(() => findPrompt(parsedData) ?? findPrompt(properties), [parsedData, properties])
  const { videos, images } = useMemo(
    () => findURLs(parsedData),
    [parsedData]
  )

  const statusLabel = t(taskStatusMapper.getLabel(log.status, log.status))
  const statusVariant = taskStatusMapper.getVariant(log.status)
  const actionLabel = t(taskActionMapper.getLabel(log.action))
  const duration = log.submit_time && log.finish_time
    ? Math.max(0, Math.round((log.finish_time - log.submit_time) * 10) / 10)
    : null

  const hasAnyResult =
    !!log.result_url || videos.length > 0 || images.length > 0

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <>
          <IconBadge tone='chart-4' size='sm'>
            <Tv />
          </IconBadge>
          {t('Task Details')}
          <StatusBadge
            label={statusLabel}
            variant={statusVariant}
            size='sm'
            copyable={false}
          />
        </>
      }
      description={t('View complete upstream details for this task')}
      contentClassName='sm:max-w-2xl'
      titleClassName='flex items-center gap-2 text-base'
      contentHeight='min(80dvh, 720px)'
      bodyClassName='pr-2 sm:pr-4'
    >
      <ScrollArea className='h-full w-full pr-3'>
        <div className='w-full max-w-full min-w-0 space-y-3 overflow-x-hidden py-1'>
          {/* Identity */}
          <DetailSection icon={<Activity />} label={t('Task Identity')}>
            <DetailRow label={t('Task ID')} value={log.task_id} mono copyable={log.task_id} />
            <DetailRow
              label={t('Platform')}
              value={log.platform || '-'}
              mono
            />
            <DetailRow label={t('Action')} value={actionLabel || log.action} />
            <DetailRow
              label={t('Channel')}
              value={
                log.channel_id
                  ? `${log.channel_id}${log.channel_name ? ` · ${log.channel_name}` : ''}`
                  : '-'
              }
            />
            {log.group && (
              <DetailRow label={t('Group')} value={log.group} />
            )}
            {log.quota != null && (
              <DetailRow label={t('Quota')} value={String(log.quota)} />
            )}
          </DetailSection>

          {/* User / Timing */}
          <DetailSection icon={<User />} label={t('User & Timing')}>
            {isAdmin && (
              <DetailRow
                label={t('User')}
                value={
                  log.username
                    ? `${log.username} (ID: ${log.user_id})`
                    : `ID: ${log.user_id}`
                }
                copyable={log.username || undefined}
              />
            )}
            <DetailRow
              label={t('Submit Time')}
              value={
                log.submit_time
                  ? formatTimestampToDate(log.submit_time, 'seconds')
                  : '-'
              }
              mono
            />
            {log.start_time != null && (
              <DetailRow
                label={t('Start Time')}
                value={formatTimestampToDate(log.start_time, 'seconds')}
                mono
              />
            )}
            {log.finish_time != null && (
              <DetailRow
                label={t('Finish Time')}
                value={formatTimestampToDate(log.finish_time, 'seconds')}
                mono
              />
            )}
            {duration != null && (
              <DetailRow
                label={t('Duration')}
                value={`${duration.toFixed(1)}s`}
              />
            )}
            {log.progress && (
              <DetailRow label={t('Progress')} value={log.progress} />
            )}
          </DetailSection>

          {/* Upstream prompt (if any) */}
          {prompt && (
            <DetailSection
              icon={<FileJson />}
              iconTone='chart-3'
              label={t('Upstream Prompt')}
            >
              <p className='text-xs leading-relaxed break-all whitespace-pre-wrap'>
                {prompt}
              </p>
            </DetailSection>
          )}

          {/* Result URLs (if any) */}
          {hasAnyResult && (
            <DetailSection
              icon={<LinkIcon />}
              iconTone='chart-4'
              label={t('Result')}
            >
              {log.result_url && (
                <DetailRow
                  label={t('Direct URL')}
                  value={
                    <a
                      href={log.result_url}
                      target='_blank'
                      rel='noreferrer noopener'
                      className='text-blue-600 hover:underline'
                    >
                      {log.result_url}
                    </a>
                  }
                  copyable={log.result_url}
                />
              )}
              {videos.length > 0 && (
                <div className='space-y-1'>
                  <div className='text-muted-foreground text-xs'>
                    {t('Videos')} ({videos.length})
                  </div>
                  {videos.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target='_blank'
                      rel='noreferrer noopener'
                      className='block truncate text-xs text-blue-600 hover:underline'
                      title={url}
                    >
                      {url}
                    </a>
                  ))}
                </div>
              )}
              {images.length > 0 && (
                <div className='space-y-1'>
                  <div className='text-muted-foreground text-xs'>
                    {t('Images')} ({images.length})
                  </div>
                  {images.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target='_blank'
                      rel='noreferrer noopener'
                      className='block truncate text-xs text-blue-600 hover:underline'
                      title={url}
                    >
                      {url}
                    </a>
                  ))}
                </div>
              )}
            </DetailSection>
          )}

          {/* Fail reason */}
          {log.fail_reason && (
            <DetailSection
              icon={<AlertTriangle />}
              label={t('Fail Reason')}
              variant='danger'
            >
              <p className='text-xs leading-relaxed break-all whitespace-pre-wrap text-red-600'>
                {log.fail_reason}
              </p>
            </DetailSection>
          )}

          {/* Upstream raw data */}
          {parsedData !== null && (
            <DetailSection
              icon={<Database />}
              iconTone='chart-2'
              label={t('Upstream Raw Data')}
            >
              <pre className='bg-background/60 max-h-72 overflow-auto rounded border p-2 font-mono text-[11px] leading-relaxed wrap-break-word whitespace-pre-wrap break-all'>
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </DetailSection>
          )}

          {/* Properties */}
          {properties && Object.keys(properties).length > 0 && (
            <DetailSection
              icon={<FileJson />}
              iconTone='chart-1'
              label={t('Request Properties')}
            >
              <pre className='bg-background/60 max-h-48 overflow-auto rounded border p-2 font-mono text-[11px] leading-relaxed wrap-break-word whitespace-pre-wrap break-all'>
                {JSON.stringify(properties, null, 2)}
              </pre>
            </DetailSection>
          )}

          {/* Raw data fallback (non-JSON) */}
          {parsedData === null && log.data && (
            <DetailSection
              icon={<FileJson />}
              iconTone='chart-2'
              label={t('Upstream Raw Data')}
            >
              <pre className='bg-background/60 max-h-72 overflow-auto rounded border p-2 font-mono text-[11px] leading-relaxed wrap-break-word whitespace-pre-wrap break-all'>
                {log.data}
              </pre>
            </DetailSection>
          )}
        </div>
      </ScrollArea>
    </Dialog>
  )
}
