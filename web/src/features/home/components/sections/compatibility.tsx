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
import { useTranslation } from 'react-i18next'

const apiEndpoints = [
  { method: 'GET', path: '/v1/models', label: '模型列表' },
  { method: 'POST', path: '/v1/chat/completions', label: '对话补全' },
  { method: 'POST', path: '/v1/responses', label: 'Responses API' },
  { method: 'POST', path: '/v1/embeddings', label: '文本向量化' },
  { method: 'POST', path: '/v1/images/generations', label: '图像生成' },
  { method: 'POST', path: '/v1/audio/speech', label: '文本转语音' },
  { method: 'POST', path: '/v1/audio/transcriptions', label: '语音转文本' },
  { method: 'POST', path: '/v1/audio/translations', label: '语音翻译' },
  { method: 'POST', path: '/v1/video/generations', label: '视频生成' },
  { method: 'POST', path: '/v1/moderations', label: '内容审核' },
  { method: 'POST', path: '/v1/rerank', label: '重排序' },
]

const compatibleFormats = [
  { name: 'OpenAI', desc: 'Chat / Responses / Embeddings', paths: ['/v1/chat/completions', '/v1/responses'] },
  { name: 'Anthropic', desc: 'Messages API', paths: ['/v1/messages'] },
  { name: 'Gemini', desc: 'Generate Content', paths: ['/v1beta/models'] },
]

const supportedTools = [
  'Cursor', 'Claude Code', 'Codex', 'Windsurf', 'Continue',
  'JetBrains AI', 'VS Code Copilot', 'CC Switch', 'Cherry Studio',
  'ChatBox', 'LobeChat', 'NextChat', 'Open WebUI',
]

export function Compatibility() {
  const { t } = useTranslation()

  return (
    <section className='relative py-28 md:py-36'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Header */}
        <div
          className='home-reveal-up mb-16 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between'
          style={{ animationDelay: '0ms' }}
        >
          <div className='max-w-xl'>
            <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
              <span className='size-1 rounded-full bg-foreground/30' />
              {t('home.compatibility.eyebrow')}
            </span>
            <h2 className='text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
              {t('home.compatibility.title')}
            </h2>
            <p className='mt-4 text-[15px] leading-7 text-muted-foreground'>
              {t('home.compatibility.subtitle')}
            </p>
          </div>
          <span className='hidden shrink-0 items-center gap-2 font-mono text-[12px] text-muted-foreground md:flex'>
            <span className='size-1.5 rounded-full bg-emerald-500' />
            {apiEndpoints.length} endpoints
          </span>
        </div>

        <div className='grid gap-12 lg:grid-cols-12 lg:gap-16'>
          {/* Left: compatible protocols + tools */}
          <div className='space-y-10 lg:col-span-5'>
            <div className='home-reveal-up space-y-4' style={{ animationDelay: '100ms' }}>
              {compatibleFormats.map((fmt) => (
                <div
                  key={fmt.name}
                  className='group flex items-center gap-4 rounded-xl border border-border/80 bg-background p-5 transition-all hover:border-foreground/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]'
                >
                  <div className='flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 font-mono text-[13px] font-semibold text-foreground'>
                    {fmt.name.slice(0, 1)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='text-[15.5px] font-semibold text-foreground'>
                        {fmt.name}
                      </h3>
                      <span className='rounded border border-emerald-600/20 bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-semibold tracking-wide text-emerald-700 uppercase'>
                        Compatible
                      </span>
                    </div>
                    <p className='mt-0.5 text-[12.5px] text-muted-foreground'>
                      {fmt.desc}
                    </p>
                  </div>
                  <code className='hidden shrink-0 font-mono text-[10.5px] text-muted-foreground/80 xl:block'>
                    {fmt.paths[0]}
                  </code>
                </div>
              ))}
            </div>

            {/* Supported tools */}
            <div className='home-reveal-up' style={{ animationDelay: '200ms' }}>
              <div className='mb-4 flex items-center gap-3'>
                <span className='text-[12px] font-semibold tracking-wide text-muted-foreground'>
                  {t('home.compatibility.toolsTitle')}
                </span>
                <span className='h-px flex-1 bg-border' />
              </div>
              <div className='flex flex-wrap gap-2.5'>
                {supportedTools.map((tool) => (
                  <span
                    key={tool}
                    className='rounded-md border border-border/70 bg-background px-3 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground'
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: endpoints table */}
          <div className='home-reveal-up lg:col-span-7' style={{ animationDelay: '150ms' }}>
            <div className='mb-5 flex items-center gap-3'>
              <span className='text-[12px] font-semibold tracking-wide text-muted-foreground'>
                {t('home.compatibility.endpointsTitle')}
              </span>
              <span className='h-px flex-1 bg-border' />
            </div>
            <div className='overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-border bg-muted/40'>
                    <th className='w-24 px-5 py-3.5 text-left font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase'>
                      方法
                    </th>
                    <th className='px-5 py-3.5 text-left font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase'>
                      端点
                    </th>
                    <th className='px-5 py-3.5 text-right font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase'>
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apiEndpoints.map((ep) => (
                    <tr
                      key={ep.path}
                      className='border-b border-border/70 transition-colors last:border-0 hover:bg-muted/30'
                    >
                      <td className='px-5 py-3.5'>
                        <span
                          className={`inline-flex items-center justify-center rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                            ep.method === 'GET'
                              ? 'bg-foreground text-background'
                              : 'border border-border text-foreground'
                          }`}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td className='px-5 py-3.5 font-mono text-[12.5px] text-foreground'>
                        {ep.path}
                      </td>
                      <td className='px-5 py-3.5 text-right text-[12.5px] text-muted-foreground'>
                        {ep.label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
