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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Image as ImageIcon,
  Play,
  Sparkles,
  Video,
  X,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { sendVideoGeneration } from './api'
import {
  getInitialVideoConfig,
  loadVideoTasks,
  saveVideoConfig,
  saveVideoTasks,
} from './storage'
import type {
  VideoGenerationTask,
  VideoModelItem,
  VideoPlaygroundConfig,
  VideoResolutions,
  VideoRatio,
} from './types'
import { VIDEO_MODEL_GROUPS } from './types'

const VIDEO_PRESET_PROMPTS = [
  '宇航员在月球上漫步，电影级画质',
  '城市夜景，霓虹灯光，慢镜头',
  '自然风景，日出时间，航拍视角',
  '水下珊瑚礁，热带鱼群游动',
]

const MODE_LABELS: Record<string, string> = {
  'text-to-video': 'Text to Video',
  'image-to-video': 'Image to Video',
  'video-extension': 'Video Extension',
}

const STATUS_LABELS: Record<string, string> = {
  processing: 'Generating',
  completed: 'Completed',
  failed: 'Failed',
  pending: 'Pending',
}

export function VideoPlayground() {
  const { t } = useTranslation()
  const [config, setConfig] = useState<VideoPlaygroundConfig>(getInitialVideoConfig)
  const [tasks, setTasks] = useState<VideoGenerationTask[]>(loadVideoTasks)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [activeGroup, setActiveGroup] = useState<string>('seedance')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    saveVideoConfig(config)
  }, [config])

  useEffect(() => {
    saveVideoTasks(tasks)
  }, [tasks])

  const currentModel = useMemo(() => {
    for (const group of VIDEO_MODEL_GROUPS) {
      const found = group.models.find((m) => m.id === config.model)
      if (found) return found
    }
    return null
  }, [config.model])

  const updateConfig = useCallback(
    <K extends keyof VideoPlaygroundConfig>(key: K, value: VideoPlaygroundConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const handleModelSelect = useCallback((model: VideoModelItem) => {
    setConfig((prev) => {
      const capabilities = model.capabilities
      let newMode = prev.mode
      if (newMode === 'text-to-video' && !capabilities.includes('t2v')) {
        newMode = capabilities.includes('i2v') ? 'image-to-video' : 'video-extension'
      }
      if (newMode === 'image-to-video' && !capabilities.includes('i2v')) {
        newMode = capabilities.includes('t2v') ? 'text-to-video' : 'video-extension'
      }
      if (newMode === 'video-extension' && !capabilities.includes('video-extension')) {
        newMode = capabilities.includes('t2v') ? 'text-to-video' : 'image-to-video'
      }

      const resolution = (model.resolutions.includes(prev.resolution)
        ? prev.resolution
        : model.resolutions[model.resolutions.length - 1]) as VideoResolutions
      const ratio = (model.ratios.includes(prev.ratio) ? prev.ratio : model.ratios[0]) as VideoRatio
      const [minDur, maxDur] = model.durationRange ?? [4, 30]
      const duration = Math.min(Math.max(prev.duration, minDur), maxDur)

      return {
        ...prev,
        model: model.id,
        mode: newMode,
        resolution,
        ratio,
        duration,
      }
    })
  }, [])

  const handleGenerate = useCallback(() => {
    if (!config.prompt.trim()) {
      toast.error(t('Please enter video description'))
      return
    }
    if (config.mode === 'image-to-video' && config.imageUrls.length === 0) {
      toast.error(t('Image-to-video mode requires at least one image'))
      return
    }
    if (config.mode === 'video-extension' && !config.videoUrls.some(Boolean)) {
      toast.error(t('Video extension mode requires a video'))
      return
    }
    if (!config.model.trim()) {
      toast.error(t('Please select a video model'))
      return
    }

    const controller = new AbortController()
    abortRef.current = controller
    setIsGenerating(true)
    setProgressText('')

    void sendVideoGeneration(
      config,
      {
        onSubmitted: (taskId) => {
          setTasks((prev) => [
            {
              id: taskId,
              model: config.model,
              prompt: config.prompt,
              mode: config.mode,
              status: 'processing',
              createdAt: Date.now(),
              resolution: config.resolution,
              ratio: config.ratio,
              duration: config.duration,
            },
            ...prev,
          ])
        },
        onCompleted: (task) => {
          setTasks((prev) => prev.map((taskItem) => (taskItem.id === task.id ? { ...taskItem, ...task } : taskItem)))
          setIsGenerating(false)
          setProgressText('')
          abortRef.current = null
          toast.success(t('Video generation complete'))
        },
        onError: (error) => {
          setTasks((prev) =>
            prev.map((taskItem) =>
              taskItem.status === 'processing' ? { ...taskItem, status: 'failed', error } : taskItem
            )
          )
          setIsGenerating(false)
          setProgressText('')
          abortRef.current = null
          toast.error(error)
        },
        onProgress: (status) => {
          setProgressText(status)
        },
      },
      controller.signal
    )
  }, [config, t])

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsGenerating(false)
    setProgressText('')
  }, [])

  const handleClear = useCallback(() => {
    setTasks([])
  }, [])

  const canGenerate = useMemo(() => {
    if (isGenerating) return false
    if (!config.prompt.trim() || !config.model.trim()) return false
    if (config.mode === 'image-to-video' && config.imageUrls.length === 0) return false
    if (config.mode === 'video-extension' && !config.videoUrls.some(Boolean)) return false
    return true
  }, [isGenerating, config])

  const durationRange = useMemo(() => {
    return currentModel?.durationRange ?? [4, 30]
  }, [currentModel])

  const getModeLabel = (mode: string) => {
    return MODE_LABELS[mode] || mode
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      processing: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      failed: 'bg-red-500/10 text-red-600 border-red-500/20',
      pending: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    }
    return (
      <Badge variant="outline" className={`text-[10px] ${styles[status] || ''}`}>
        {STATUS_LABELS[status] || status}
      </Badge>
    )
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex min-h-0 flex-1 gap-3 p-3">
        <Card className="flex w-64 shrink-0 flex-col overflow-hidden border-sky-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('Video Models')}</CardTitle>
            <CardDescription className="text-[11px]">{t('Select video model by group')}</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden pb-3">
            <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {VIDEO_MODEL_GROUPS.map((group) => (
                <Collapsible
                  key={group.id}
                  open={activeGroup === group.id}
                  onOpenChange={(open) => open && setActiveGroup(group.id)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-sky-200/60 bg-sky-50/50 px-2.5 py-1.5 text-left hover:bg-sky-100/60 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                    <div>
                      <div className="text-xs font-medium">{t(group.name)}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {group.models.length} {t('models')}
                      </div>
                    </div>
                    <ChevronDown
                      className={`size-3 text-muted-foreground transition-transform ${
                        activeGroup === group.id ? 'rotate-180' : ''
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-1">
                    {group.models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelSelect(model)}
                        className={`w-full rounded-md border px-2.5 py-1.5 text-left text-xs transition-all ${
                          config.model === model.id
                            ? 'border-sky-300 bg-gradient-to-br from-sky-50 to-blue-50 shadow-sm dark:border-sky-600/50 dark:from-sky-950/40 dark:to-blue-950/40'
                            : 'border-transparent hover:border-sky-200 hover:bg-sky-50/50 dark:hover:border-slate-700 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{model.name}</span>
                          {config.model === model.id && (
                            <Sparkles className="size-3 text-foreground/60" />
                          )}
                        </div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">
                          {model.description}
                        </div>
                        <div className="mt-1 flex gap-1">
                          {model.capabilities.includes('t2v') && (
                            <Badge variant="outline" className="h-4 text-[9px]">T2V</Badge>
                          )}
                          {model.capabilities.includes('i2v') && (
                            <Badge variant="outline" className="h-4 text-[9px]">I2V</Badge>
                          )}
                          {model.capabilities.includes('video-extension') && (
                            <Badge variant="outline" className="h-4 text-[9px]">Ext</Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

            <div className="border-t" />

            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">{t('Base URL')}</Label>
                <Input
                  value={config.baseUrl}
                  onChange={(e) => updateConfig('baseUrl', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('API Key')}</Label>
                <Input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => updateConfig('apiKey', e.target.value)}
                  placeholder="sk-..."
                  className="h-7 text-xs font-mono"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={handleClear} disabled={!tasks.length} className="h-6 text-[11px]">
                  {t('Clear')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Card className="overflow-hidden border-sky-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
            <CardContent className="p-3.5">
              <div className="mb-3 flex items-center gap-2">
                <Label className="text-xs">{t('Generation Mode')}:</Label>
                <div className="flex gap-1">
                  {(['text-to-video', 'image-to-video', 'video-extension'] as const).map((mode) => {
                    const supported =
                      !currentModel || currentModel.capabilities.includes(
                        mode === 'text-to-video' ? 't2v' : mode === 'image-to-video' ? 'i2v' : 'video-extension'
                      )
                    return (
                      <Button
                        key={mode}
                        variant={config.mode === mode ? 'default' : 'outline'}
                        size="sm"
                        disabled={!supported}
                        onClick={() => updateConfig('mode', mode)}
                        className={`h-7 text-xs ${
                          config.mode === mode
                            ? 'border-transparent bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm shadow-sky-500/30 hover:from-sky-600 hover:to-blue-700'
                            : 'border-sky-200/70 bg-white/50 text-foreground hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800/50'
                        }`}
                      >
                        {mode === 'text-to-video' && <Video className="mr-1 size-3" />}
                        {mode === 'image-to-video' && <ImageIcon className="mr-1 size-3" />}
                        {mode === 'video-extension' && <Play className="mr-1 size-3" />}
                        {getModeLabel(mode)}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div className="mb-3">
                <Label className="mb-1 text-xs">{t('Video Description')}</Label>
                <Textarea
                  value={config.prompt}
                  onChange={(e) => updateConfig('prompt', e.target.value)}
                  placeholder={t('Describe the video you want to generate...')}
                  className="min-h-[72px] resize-none text-sm"
                />
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {VIDEO_PRESET_PROMPTS.map((p) => (
                    <Button
                      key={p}
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1.5 text-[10px] text-muted-foreground"
                      onClick={() => setConfig((prev) => ({ ...prev, prompt: p }))}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>

              {config.mode === 'image-to-video' && (
                <div className="mb-3 space-y-2">
                  <Label className="text-xs">{t('Reference Image URL')}</Label>
                  {config.imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const next = [...config.imageUrls]
                          next[index] = e.target.value
                          updateConfig('imageUrls', next)
                        }}
                        placeholder={`${t('Image')} ${index + 1} URL`}
                        className="h-7 text-xs font-mono"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateConfig(
                            'imageUrls',
                            config.imageUrls.filter((_, i) => i !== index)
                          )
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                  {config.imageUrls.length < (currentModel?.maxImages ?? 3) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateConfig('imageUrls', [...config.imageUrls, ''])
                      }
                      className="h-6 text-xs"
                    >
                      + {t('Add Image')}
                    </Button>
                  )}
                </div>
              )}

              {config.mode === 'video-extension' && (
                <div className="mb-3 space-y-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Video URL')}</Label>
                    {config.videoUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={url}
                          onChange={(e) => {
                            const next = [...config.videoUrls]
                            next[index] = e.target.value
                            updateConfig('videoUrls', next)
                          }}
                          placeholder={`${t('Video')} ${index + 1} URL`}
                          className="h-7 text-xs font-mono"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateConfig(
                              'videoUrls',
                              config.videoUrls.filter((_, i) => i !== index)
                            )
                          }
                          className="h-7 w-7 p-0"
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ))}
                    {config.videoUrls.length < (currentModel?.maxVideos ?? 1) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateConfig('videoUrls', [...config.videoUrls, ''])}
                        className="h-6 text-xs"
                      >
                        + {t('Add Video')}
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Audio URL')} ({t('Optional')})</Label>
                    {config.audioUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={url}
                          onChange={(e) => {
                            const next = [...config.audioUrls]
                            next[index] = e.target.value
                            updateConfig('audioUrls', next)
                          }}
                          placeholder={`${t('Audio')} ${index + 1} URL`}
                          className="h-7 text-xs font-mono"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateConfig(
                              'audioUrls',
                              config.audioUrls.filter((_, i) => i !== index)
                            )
                          }
                          className="h-7 w-7 p-0"
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ))}
                    {config.audioUrls.length < (currentModel?.maxAudios ?? 1) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateConfig('audioUrls', [...config.audioUrls, ''])}
                        className="h-6 text-xs"
                      >
                        + {t('Add Audio')}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">{t('Resolution')}</Label>
                  <Select
                    value={config.resolution}
                    onValueChange={(v) => updateConfig('resolution', v as VideoResolutions)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(currentModel?.resolutions || ['480p', '720p', '1080p', '4k']).map((r) => (
                        <SelectItem key={r} value={r} className="text-xs">
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t('Aspect Ratio')}</Label>
                  <Select
                    value={config.ratio}
                    onValueChange={(v) => updateConfig('ratio', v as VideoRatio)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(currentModel?.ratios || ['16:9', '9:16', '1:1']).map((r) => (
                        <SelectItem key={r} value={r} className="text-xs">
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">{t('Duration')}: {config.duration}s</Label>
                  </div>
                  <Slider
                    min={durationRange[0]}
                    max={durationRange[1]}
                    step={1}
                    value={[config.duration]}
                    onValueChange={(v) =>
                      updateConfig('duration', Number(Array.isArray(v) ? v[0] : v))
                    }
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {t('Range')}: {durationRange[0]}–{durationRange[1]}s
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">{t('Seed')}: {config.seed === -1 ? t('Random') : config.seed}</Label>
                  </div>
                  <div className="flex gap-2">
                    <Slider
                      min={-1}
                      max={999999}
                      step={1}
                      value={[config.seed]}
                      onValueChange={(v) =>
                        updateConfig('seed', Number(Array.isArray(v) ? v[0] : v))
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateConfig('seed', -1)}
                      className="h-6 px-2 text-xs"
                    >
                      {t('Random')}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t pt-2.5">
                <div className="text-xs text-muted-foreground">
                  {currentModel && (
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {currentModel.name}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <Button variant="destructive" size="sm" onClick={handleStop}>
                      <Clock className="mr-1 size-3" />
                      {t('Stop')}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm shadow-sky-500/30 hover:from-sky-600 hover:to-blue-700"
                      disabled={!canGenerate}
                      onClick={handleGenerate}
                    >
                      <Video className="mr-1 size-3" />
                      {t('Generate Video')}
                    </Button>
                  )}
                </div>
              </div>

              {progressText && (
                <div className="mt-2 flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-600">
                  <Loader2 className="size-3 animate-spin" />
                  {progressText}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-sky-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
            <div className="border-b px-3 py-1.5">
              <h3 className="text-sm font-medium">{t('Generation History')}</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3">
                {tasks.length === 0 ? (
                  <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                    <Video className="mb-2 size-8 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">{t('No generation history')}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/60">
                      {t('Configure parameters and click generate, results will appear here')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="overflow-hidden rounded-lg border border-sky-200/50 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60"
                      >
                        <div className="aspect-video w-full bg-muted/20">
                          {task.videoUrl ? (
                            <video
                              src={task.videoUrl}
                              controls
                              className="h-full w-full object-cover"
                            />
                          ) : task.status === 'processing' ? (
                            <div className="flex h-full items-center justify-center">
                              <Loader2 className="size-6 animate-spin text-foreground/30" />
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground/30">
                              <AlertCircle className="size-6" />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <div className="mb-1 flex items-center justify-between">
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {task.model}
                            </Badge>
                            {getStatusBadge(task.status)}
                          </div>
                          <p className="line-clamp-2 text-[11px] text-muted-foreground">
                            {task.prompt}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                            {task.resolution && <span>{task.resolution}</span>}
                            {task.ratio && <span>· {task.ratio}</span>}
                            {task.duration && <span>· {task.duration}s</span>}
                          </div>
                          {task.error && (
                            <p className="mt-1 text-[10px] text-red-500">{task.error}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  )
}
