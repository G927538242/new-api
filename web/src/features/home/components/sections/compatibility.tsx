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
    <section className='border-t border-border bg-transparent py-28 md:py-36'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div className='home-fade-in-up mb-16 max-w-xl opacity-0' style={{ animationDelay: '0ms' }}>
          <p className='mb-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground'>
            {t('home.compatibility.eyebrow')}
          </p>
          <h2 className='text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.01em]'>
            {t('home.compatibility.title')}
          </h2>
          <p className='mt-4 text-[15px] leading-7 text-muted-foreground'>
            {t('home.compatibility.subtitle')}
          </p>
        </div>

        {/* 兼容的 API 格式 */}
        <div className='home-fade-in-up mb-12 opacity-0' style={{ animationDelay: '80ms' }}>
          <div className='grid gap-4 md:grid-cols-3'>
            {compatibleFormats.map((fmt) => (
              <div
                key={fmt.name}
                className='border border-border rounded-md p-5 bg-background'
              >
                <div className='flex items-baseline justify-between'>
                  <h3 className='text-[14px] font-semibold text-foreground'>{fmt.name}</h3>
                  <span className='text-[11px] text-muted-foreground font-mono'>兼容</span>
                </div>
                <p className='mt-1 text-[12px] text-muted-foreground'>{fmt.desc}</p>
                <div className='mt-3 space-y-1'>
                  {fmt.paths.map((p) => (
                    <p key={p} className='text-[11px] font-mono text-muted-foreground/70'>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 支持的接口列表 */}
        <div className='home-fade-in-up mb-12 opacity-0' style={{ animationDelay: '160ms' }}>
          <h3 className='mb-4 text-[13px] font-medium text-foreground/80'>
            {t('home.compatibility.endpointsTitle')}
          </h3>
          <div className='border border-border rounded-md overflow-hidden'>
            <div className='grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 sm:divide-x'>
              {[apiEndpoints.slice(0, 6), apiEndpoints.slice(6)].map((group, gi) => (
                <div key={gi} className='divide-y divide-border'>
                  {group.map((ep) => (
                    <div
                      key={ep.path}
                      className='flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-muted/[0.03]'
                    >
                      <span className='inline-flex shrink-0 items-center rounded-sm bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono font-medium text-foreground/60'>
                        {ep.method}
                      </span>
                      <code className='text-[12px] font-mono text-foreground/80'>{ep.path}</code>
                      <span className='ml-auto text-[12px] text-muted-foreground'>{ep.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 支持的工具 */}
        <div className='home-fade-in-up opacity-0' style={{ animationDelay: '240ms' }}>
          <h3 className='mb-4 text-[13px] font-medium text-foreground/80'>
            {t('home.compatibility.toolsTitle')}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {supportedTools.map((tool) => (
              <span
                key={tool}
                className='border border-border rounded-md px-3 py-1.5 text-[12px] text-muted-foreground transition-colors duration-150 hover:text-foreground hover:border-border/80'
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
