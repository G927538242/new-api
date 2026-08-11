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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { PublicLayout } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { sendStreamingChat } from './api'
import {
  genId,
  getInitialConfig,
  loadMessages,
  saveConfig,
  saveMessages,
} from './storage'
import type { ChatMessage, PublicPlaygroundConfig } from './types'

const PRESET_PROMPTS = [
  '用一句话解释什么是大语言模型',
  '写一首关于秋天的七言绝句',
  '帮我写一份产品需求文档提纲',
  '写一个 Python 快速排序实现并注释',
]

const PRESET_MODELS = [
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-3.5-turbo',
  'claude-3.5-sonnet',
  'deepseek-chat',
  'qwen-plus',
  'doubao-seedance-2-5-260628',
]

export function PublicPlayground() {
  const { t } = useTranslation()
  const [config, setConfig] = useState<PublicPlaygroundConfig>(getInitialConfig)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const msgLoadedRef = useRef(false)

  // Load messages from localStorage
  useEffect(() => {
    const t = window.setTimeout(() => {
      const loaded = loadMessages() ?? []
      msgLoadedRef.current = true
      setMessages(loaded)
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  // Persist config
  useEffect(() => {
    saveConfig(config)
  }, [config])

  // Persist messages
  useEffect(() => {
    if (!msgLoadedRef.current) return
    const t = window.setTimeout(() => saveMessages(messages), 300)
    return () => window.clearTimeout(t)
  }, [messages])

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const updateConfig = useCallback(
    <K extends keyof PublicPlaygroundConfig>(key: K, value: PublicPlaygroundConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const canSend = useMemo(() => {
    return (
      !isSending &&
      input.trim().length > 0 &&
      config.model.trim().length > 0
    )
  }, [isSending, input, config.model])

  const handleSend = useCallback(
    (promptText?: string) => {
      const text = (promptText ?? input).trim()
      if (!text) return
      if (!config.model.trim()) {
        toast.error(t('Please select or enter a model'))
        return
      }
      if (!config.apiKey.trim() && !config.baseUrl.includes(window.location.origin)) {
        toast.warning(t('API Key is empty — the request may be rejected'))
      }

      const userMsg: ChatMessage = {
        id: genId(),
        role: 'user',
        content: text,
        status: 'complete',
      }
      const assistantMsg: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: '',
        status: 'loading',
      }
      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setInput('')
      setIsSending(true)

      const controller = new AbortController()
      abortRef.current = controller

      const sendList: ChatMessage[] = []
      setMessages((prev) => {
        // include all prev messages except the trailing assistant one (we already added)
        const base = prev.slice(0, -1)
        sendList.push(...base)
        return prev
      })

      void sendStreamingChat(
        sendList,
        config,
        {
          onUpdate: (chunk) => {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              if (!last || last.role !== 'assistant') return prev
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + chunk, status: 'streaming' },
              ]
            })
          },
          onComplete: () => {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              if (!last || last.role !== 'assistant') return prev
              return [
                ...prev.slice(0, -1),
                { ...last, status: last.content ? 'complete' : 'error', error: last.content ? undefined : 'Empty response' },
              ]
            })
            setIsSending(false)
            abortRef.current = null
          },
          onError: (err) => {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              if (!last || last.role !== 'assistant') return prev
              return [
                ...prev.slice(0, -1),
                { ...last, status: 'error', error: err },
              ]
            })
            setIsSending(false)
            abortRef.current = null
          },
        },
        controller.signal
      )
    },
    [input, config, t]
  )

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsSending(false)
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      if (!last || last.role !== 'assistant') return prev
      return [
        ...prev.slice(0, -1),
        { ...last, status: last.content ? 'complete' : 'error' },
      ]
    })
  }, [])

  const handleClear = useCallback(() => {
    setMessages([])
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <PublicLayout>
      <div className='flex h-[calc(100vh-64px)] min-h-[600px] w-full flex-col bg-background'>
        {/* Header */}
        <div className='border-b bg-card/40 backdrop-blur'>
          <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3'>
            <div className='flex items-center gap-2'>
              <h1 className='text-lg font-semibold'>{t('Open API')}</h1>
              <Badge variant='outline' className='text-xs'>
                {t('No login required')}
              </Badge>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowSettings((s) => !s)}
              >
                {showSettings ? t('Hide Settings') : t('Show Settings')}
              </Button>
              <Button variant='ghost' size='sm' onClick={handleClear} disabled={!messages.length}>
                {t('Clear')}
              </Button>
            </div>
          </div>
        </div>

        <div className='mx-auto flex w-full max-w-6xl flex-1 gap-4 overflow-hidden px-4 py-4'>
          {/* Settings Panel */}
          {showSettings && (
            <Card className='w-72 shrink-0 overflow-hidden'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>{t('API Settings')}</CardTitle>
                <CardDescription className='text-xs'>
                  {t('Configure Base URL and API Key')}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4 pb-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='pp-base-url'>{t('Base URL')}</Label>
                  <Input
                    id='pp-base-url'
                    value={config.baseUrl}
                    onChange={(e) => updateConfig('baseUrl', e.target.value)}
                    placeholder='https://api.example.com/v1'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='pp-api-key'>{t('API Key')}</Label>
                  <Input
                    id='pp-api-key'
                    type='password'
                    value={config.apiKey}
                    onChange={(e) => updateConfig('apiKey', e.target.value)}
                    placeholder='sk-...'
                  />
                </div>
                <div className='space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='pp-model'>{t('Model')}</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant='ghost' size='sm' className='h-6 px-2 text-xs' />}>
                        {t('Presets')}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        {PRESET_MODELS.map((m) => (
                          <DropdownMenuItem
                            key={m}
                            onClick={() => updateConfig('model', m)}
                            className='font-mono text-xs'
                          >
                            {m}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Input
                    id='pp-model'
                    value={config.model}
                    onChange={(e) => updateConfig('model', e.target.value)}
                    placeholder='gpt-4o-mini'
                    className='font-mono text-xs'
                  />
                </div>

                <div className='space-y-2 pt-2'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-xs'>{t('Temperature')}: {config.temperature.toFixed(2)}</Label>
                  </div>
                  <Slider
                    min={0}
                    max={2}
                    step={0.05}
                    value={[config.temperature]}
                    onValueChange={(v) =>
                      updateConfig(
                        'temperature',
                        Number(Array.isArray(v) ? v[0] : v)
                      )
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-xs'>{t('Top P')}: {config.top_p.toFixed(2)}</Label>
                  </div>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[config.top_p]}
                    onValueChange={(v) =>
                      updateConfig('top_p', Number(Array.isArray(v) ? v[0] : v))
                    }
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='pp-max-tokens' className='text-xs'>
                    {t('Max Tokens')}: {config.max_tokens}
                  </Label>
                  <Input
                    id='pp-max-tokens'
                    type='number'
                    min={1}
                    max={131072}
                    value={config.max_tokens}
                    onChange={(e) =>
                      updateConfig('max_tokens', Math.max(1, Number(e.target.value) || 1))
                    }
                  />
                </div>

                <div className='flex items-center justify-between pt-2'>
                  <Label htmlFor='pp-stream'>{t('Stream')}</Label>
                  <Switch
                    id='pp-stream'
                    checked={config.stream}
                    onCheckedChange={(v) => updateConfig('stream', v)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Area */}
          <div className='flex min-w-0 flex-1 flex-col gap-3'>
            <Card className='flex min-h-0 flex-1 flex-col overflow-hidden'>
              <ScrollArea ref={scrollRef} className='flex-1'>
                <div className='flex flex-col gap-4 p-5'>
                  {messages.length === 0 ? (
                    <div className='flex min-h-[300px] flex-col items-center justify-center text-center'>
                      <div className='mb-4 text-5xl'>🚀</div>
                      <h2 className='mb-2 text-xl font-semibold'>{t('Welcome to Open API Playground')}</h2>
                      <p className='mb-6 max-w-md text-sm text-muted-foreground'>
                        {t(
                          'Enter your API Key on the left (or leave empty for this server), type a message, and start testing. No login required.'
                        )}
                      </p>
                      <div className='flex flex-wrap justify-center gap-2'>
                        {PRESET_PROMPTS.map((p) => (
                          <Button
                            key={p}
                            variant='outline'
                            size='sm'
                            onClick={() => handleSend(p)}
                            className='max-w-[220px] truncate text-left'
                            title={p}
                          >
                            {p}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-3 ${
                          m.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                            m.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : m.status === 'error'
                                ? 'bg-destructive/10 text-destructive border border-destructive/20'
                                : 'bg-muted'
                          }`}
                        >
                          <div className='mb-1 flex items-center gap-2 text-[10px] opacity-60'>
                            <span className='uppercase'>{m.role}</span>
                            {m.status === 'streaming' && <Badge variant='outline' className='h-3 px-1 text-[10px]'>{t('streaming')}</Badge>}
                            {m.status === 'error' && <Badge variant='destructive' className='h-3 px-1 text-[10px]'>error</Badge>}
                          </div>
                          {m.status === 'loading' && !m.content ? (
                            <div className='h-4 w-16 animate-pulse rounded bg-muted-foreground/30' />
                          ) : (
                            <div className='whitespace-pre-wrap break-words leading-relaxed'>
                              {m.content || (m.status === 'error' ? m.error || '' : '')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>

            {/* Input */}
            <div className='shrink-0'>
              <div className='rounded-xl border bg-card p-3 shadow-sm'>
                <div className='mb-2 flex flex-wrap gap-1'>
                  {PRESET_PROMPTS.slice(0, 3).map((p) => (
                    <Button
                      key={p}
                      variant='ghost'
                      size='sm'
                      className='h-6 px-2 text-[11px] text-muted-foreground'
                      onClick={() => setInput(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('Type your message... (Shift + Enter for new line)')}
                  className='min-h-[72px] resize-none border-none bg-transparent p-1 text-sm shadow-none focus-visible:ring-0'
                  rows={3}
                />
                <div className='flex items-center justify-between pt-2'>
                  <div className='text-xs text-muted-foreground'>
                    <Badge variant='outline' className='font-mono text-[10px]'>
                      {config.model || t('no model')}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2'>
                    {isSending ? (
                      <Button variant='destructive' size='sm' onClick={handleStop}>
                        {t('Stop')}
                      </Button>
                    ) : (
                      <Button size='sm' disabled={!canSend} onClick={() => handleSend()}>
                        {t('Send')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
