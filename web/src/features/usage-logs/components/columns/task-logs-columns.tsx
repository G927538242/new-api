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
import type { ColumnDef } from '@tanstack/react-table'
import { ImageIcon, Music, Video } from 'lucide-react'
/* eslint-disable react-refresh/only-export-components */
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { StatusBadge } from '@/components/status-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getUserAvatarFallback, getUserAvatarStyle } from '@/lib/avatar'
import { formatTimestampToDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import { TASK_ACTIONS, TASK_STATUS } from '../../constants'
import { taskActionMapper, taskStatusMapper } from '../../lib/mappers'
import type { TaskLog } from '../../types'
import {
  AudioPreviewDialog,
  type AudioClip,
} from '../dialogs/audio-preview-dialog'
import { FailReasonDialog } from '../dialogs/fail-reason-dialog'
import { ImageDialog } from '../dialogs/image-dialog'
import { TaskDetailsDialog } from '../dialogs/task-details-dialog'
import { VideoPreviewDialog } from '../dialogs/video-preview-dialog'
import { useUsageLogsContext } from '../usage-logs-provider'
import {
  createDurationColumn,
  createChannelColumn,
  createProgressColumn,
} from './column-helpers'

function parseTaskData(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

// ============================================================================
// Task media extraction
// 任务成功后的结果媒体（视频/图片）可从任务 data 的多种字段中提取：
// - 明确的键名提示（image_url / images / video_url / videos 等）
// - 通用字符串 URL 按扩展名 / data: 前缀判定类型
// 说明：部分视频平台（如豆包）结果 URL 存于任务私有数据，data 中解析
// 不到，此时由 isVideoTask 兜底走代理播放。
// ============================================================================

const IMAGE_HINT_KEYS = new Set([
  'image_url',
  'image_urls',
  'images',
  'image',
  'cover',
  'cover_url',
  'poster_url',
  'thumbnail',
  'thumbnail_url',
  'watermark_url',
])
const VIDEO_HINT_KEYS = new Set(['video_url', 'video_urls', 'videos', 'video'])
const SKIP_HINT_KEYS = new Set([
  'audio_url',
  'audio',
  'avatar',
  'avatar_url',
  'logo',
  'icon',
  'favicon',
])

function isVideoMedia(value: string): boolean {
  const s = value.trim().toLowerCase()
  if (s.startsWith('data:video')) return true
  return /\.(mp4|webm|mov|m4v|avi|mkv)(\?|#|$)/.test(s)
}

function isImageMedia(value: string): boolean {
  const s = value.trim().toLowerCase()
  if (s.startsWith('data:image')) return true
  return /\.(png|jpe?g|webp|gif|bmp|svg|avif|heic)(\?|#|$)/.test(s)
}

function extractTaskMedia(data: unknown): {
  videos: string[]
  images: string[]
} {
  const videos: string[] = []
  const images: string[] = []
  const visited = new Set<unknown>()

  const visit = (node: unknown) => {
    if (node === null || node === undefined || visited.has(node)) return
    visited.add(node)

    if (typeof node === 'string') {
      const value = node.trim()
      if (!value || (!value.startsWith('http') && !value.startsWith('data:')))
        return
      if (isVideoMedia(value)) videos.push(value)
      else if (isImageMedia(value)) images.push(value)
      return
    }

    if (Array.isArray(node)) {
      for (const item of node) visit(item)
      return
    }

    if (typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        if (typeof value === 'string' && value.trim()) {
          const hintKey = key.toLowerCase()
          const raw = value.trim()
          if (!SKIP_HINT_KEYS.has(hintKey)) {
            if (VIDEO_HINT_KEYS.has(hintKey)) {
              if (raw.startsWith('http') || raw.startsWith('data:'))
                videos.push(raw)
              continue
            }
            if (IMAGE_HINT_KEYS.has(hintKey)) {
              if (raw.startsWith('http') || raw.startsWith('data:'))
                images.push(raw)
              continue
            }
          }
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

function AudioPreviewCell({ log }: { log: TaskLog }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const clips = useMemo(() => {
    const data = parseTaskData(log.data)
    return data.filter(
      (c) =>
        c && typeof c === 'object' && (c as Record<string, unknown>).audio_url
    )
  }, [log.data])

  if (clips.length === 0) return null

  return (
    <>
      <button
        type='button'
        className='group flex items-center gap-1 text-left text-xs'
        onClick={() => setOpen(true)}
      >
        <Music className='text-muted-foreground size-3' />
        <span className='text-foreground leading-snug group-hover:underline'>
          {t('Click to preview audio')}
        </span>
      </button>
      <AudioPreviewDialog
        open={open}
        onOpenChange={setOpen}
        clips={clips as AudioClip[]}
      />
    </>
  )
}

// 成功视频任务预览：视频文件经 /v1/videos/:task_id/content 代理接口读取并播放
function VideoPreviewCell({ log }: { log: TaskLog }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type='button'
        className='group flex items-center gap-1 text-left text-xs'
        onClick={() => setOpen(true)}
      >
        <Video className='text-muted-foreground size-3' />
        <span className='text-foreground leading-snug group-hover:underline'>
          {t('Click to preview video')}
        </span>
      </button>
      <VideoPreviewDialog
        open={open}
        onOpenChange={setOpen}
        taskId={log.task_id}
      />
    </>
  )
}

// 成功任务图片预览：从任务 data 提取的图片 URL 直接展示
function TaskImagePreviewCell({
  images,
  taskId,
}: {
  images: string[]
  taskId: string
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type='button'
        className='group flex items-center gap-1 text-left text-xs'
        onClick={() => setOpen(true)}
      >
        <ImageIcon className='text-muted-foreground size-3' />
        <span className='text-foreground leading-snug group-hover:underline'>
          {t('Click to preview image')}
        </span>
      </button>
      <ImageDialog
        imageUrls={images}
        taskId={taskId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

export function useTaskLogsColumns(isAdmin: boolean): ColumnDef<TaskLog>[] {
  const { t } = useTranslation()
  const columns: ColumnDef<TaskLog>[] = [
    {
      accessorKey: 'submit_time',
      header: t('Submit Time'),
      cell: ({ row }) => {
        const log = row.original
        const submitTime = row.getValue('submit_time') as number

        return (
          <div className='flex min-w-0 flex-col gap-0.5'>
            <span className='truncate font-mono text-xs tabular-nums'>
              {formatTimestampToDate(submitTime, 'seconds')}
            </span>
            {log.finish_time ? (
              <span className='text-muted-foreground/60 truncate font-mono text-[11px] tabular-nums'>
                {formatTimestampToDate(log.finish_time, 'seconds')}
              </span>
            ) : (
              <span className='text-muted-foreground/50 text-[11px]'>-</span>
            )}
          </div>
        )
      },
      size: 180,
    },
  ]

  if (isAdmin) {
    columns.push(createChannelColumn<TaskLog>({ headerLabel: t('Channel') }), {
      id: 'user',
      header: t('User'),
      accessorFn: (row) => row.username || row.user_id,
      cell: function UserCell({ row }) {
        const { sensitiveVisible, setSelectedUserId, setUserInfoDialogOpen } =
          useUsageLogsContext()
        const log = row.original
        const displayName = log.username || String(log.user_id || '?')

        return (
          <button
            type='button'
            className='flex items-center gap-1.5 text-left'
            onClick={(e) => {
              e.stopPropagation()
              setSelectedUserId(log.user_id)
              setUserInfoDialogOpen(true)
            }}
          >
            <Avatar className='ring-border/60 size-6 ring-1 max-sm:hidden'>
              <AvatarFallback
                className={cn(
                  'text-[11px] font-semibold',
                  !sensitiveVisible && 'bg-muted text-muted-foreground'
                )}
                style={
                  sensitiveVisible ? getUserAvatarStyle(displayName) : undefined
                }
              >
                {sensitiveVisible ? getUserAvatarFallback(displayName) : '•'}
              </AvatarFallback>
            </Avatar>
            <span className='text-muted-foreground truncate text-sm hover:underline'>
              {sensitiveVisible ? displayName : '••••'}
            </span>
          </button>
        )
      },
    })
  }

  columns.push(
    {
      accessorKey: 'task_id',
      header: t('Task ID'),
      cell: ({ row }) => {
        const log = row.original
        const taskId = row.getValue('task_id') as string
        if (!taskId) {
          return <span className='text-muted-foreground/60 text-xs'>-</span>
        }
        return (
          <div className='flex max-w-[170px] flex-col gap-0.5'>
            <StatusBadge
              label={taskId}
              copyText={taskId}
              variant='neutral'
              size='sm'
              className='border-border/60 bg-muted/30 !text-foreground max-w-full truncate rounded-md border px-1.5 py-0.5 font-mono'
            />
            <span className='text-muted-foreground/60 truncate text-[11px]'>
              {t(log.platform)} · {t(taskActionMapper.getLabel(log.action))}
            </span>
          </div>
        )
      },
      meta: { mobileTitle: true },
    },
    createDurationColumn<TaskLog>({
      submitTimeKey: 'submit_time',
      finishTimeKey: 'finish_time',
      unit: 'seconds',
      headerLabel: t('Duration'),
      warningThresholdSec: 300,
    }),
    {
      accessorKey: 'status',
      header: t('Status'),
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <StatusBadge
            label={t(taskStatusMapper.getLabel(status, status || 'Submitting'))}
            variant={taskStatusMapper.getVariant(status)}
            size='sm'
            copyable={false}
            className='-ml-1.5'
          />
        )
      },
    },
    createProgressColumn<TaskLog>({ headerLabel: t('Progress') }),
    {
      accessorKey: 'fail_reason',
      header: t('Details'),
      cell: function DetailsCell({ row }) {
        const log = row.original
        const failReason = row.getValue('fail_reason') as string
        const status = log.status
        const [dialogOpen, setDialogOpen] = useState(false)
        const [taskDetailsOpen, setTaskDetailsOpen] = useState(false)

        const isSunoSuccess =
          log.platform === 'suno' && status === TASK_STATUS.SUCCESS
        if (isSunoSuccess) {
          const data = parseTaskData(log.data)
          if (
            data.some(
              (c) =>
                c &&
                typeof c === 'object' &&
                (c as Record<string, unknown>).audio_url
            )
          ) {
            return (
              <div className='flex items-center gap-2'>
                <AudioPreviewCell log={log} />
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-6 px-2 text-xs text-muted-foreground hover:text-foreground'
                  onClick={() => setTaskDetailsOpen(true)}
                >
                  {t('Details')}
                </Button>
                <TaskDetailsDialog
                  log={log}
                  isAdmin={isAdmin}
                  open={taskDetailsOpen}
                  onOpenChange={setTaskDetailsOpen}
                />
              </div>
            )
          }
        }

        const isVideoTask =
          log.action === TASK_ACTIONS.GENERATE ||
          log.action === TASK_ACTIONS.TEXT_GENERATE ||
          log.action === TASK_ACTIONS.FIRST_TAIL_GENERATE ||
          log.action === TASK_ACTIONS.REFERENCE_GENERATE ||
          log.action === TASK_ACTIONS.REMIX_GENERATE
        const isSuccess = status === TASK_STATUS.SUCCESS

        const previewCell = (() => {
          if (isSuccess) {
            const media = extractTaskMedia(log.data)
            if (media.videos.length > 0) {
              return <VideoPreviewCell log={log} />
            }
            if (media.images.length > 0) {
              return (
                <TaskImagePreviewCell
                  images={media.images}
                  taskId={log.task_id}
                />
              )
            }
            if (isVideoTask) {
              return <VideoPreviewCell log={log} />
            }
          }
          return null
        })()

        const hasFailReason = !!failReason

        return (
          <div className='flex max-w-[260px] flex-wrap items-center gap-1'>
            {previewCell}
            {previewCell && (
              <span className='text-muted-foreground/30 text-[10px]'>·</span>
            )}
            <Button
              variant='ghost'
              size='sm'
              className='h-6 px-2 text-xs text-muted-foreground hover:text-foreground'
              onClick={() => setTaskDetailsOpen(true)}
              title={t('Click to view task details')}
            >
              {t('Details')}
            </Button>
            {hasFailReason && (
              <>
                <span className='text-muted-foreground/30 text-[10px]'>·</span>
                <button
                  type='button'
                  className='group flex max-w-[140px] items-center gap-1 text-left text-xs'
                  onClick={() => setDialogOpen(true)}
                  title={t('Click to view full error message')}
                >
                  <span className='truncate leading-snug text-red-600 group-hover:underline dark:text-red-400'>
                    {failReason}
                  </span>
                </button>
                <FailReasonDialog
                  failReason={failReason}
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                />
              </>
            )}
            <TaskDetailsDialog
              log={log}
              isAdmin={isAdmin}
              open={taskDetailsOpen}
              onOpenChange={setTaskDetailsOpen}
            />
          </div>
        )
      },
      size: 220,
      maxSize: 260,
    }
  )

  return columns
}
