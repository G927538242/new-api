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
    <section className='relative py-32 md:py-40'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Header */}
        <div className='home-reveal-up mb-16 flex flex-col items-center text-center' style={{ animationDelay: '0ms' }}>
          <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
            {t('home.compatibility.eyebrow')}
          </span>
          <h2 className='max-w-2xl text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
            {t('home.compatibility.title')}
          </h2>
          <p className='mt-5 max-w-xl text-[16px] leading-7 text-muted-foreground'>
            {t('home.compatibility.subtitle')}
          </p>
        </div>

        {/* Compatible formats */}
        <div className='mb-12 grid gap-6 md:grid-cols-3'>
          {compatibleFormats.map((fmt, i) => (
            <div
              key={fmt.name}
              className='home-reveal-up group rounded-2xl border border-border bg-background p-6 home-card-hover'
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <h3 className='text-[18px] font-semibold text-foreground'>{fmt.name}</h3>
                <span className='rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground'>
                  Compatible
                </span>
              </div>
              <p className='mt-2 text-[13px] text-muted-foreground'>{fmt.desc}</p>
              <div className="my-4 h-px bg-border" />
              <div className='space-y-1 font-mono text-[11px] text-muted-foreground'>
                {fmt.paths.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* API endpoints table */}
        <div className='home-reveal-up mb-12' style={{ animationDelay: '400ms' }}>
          <div className="mb-5 flex items-center gap-3">
            <span className="text-[12px] font-semibold tracking-wide text-muted-foreground">
              {t('home.compatibility.endpointsTitle')}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className='overflow-hidden rounded-xl border border-border bg-background'>
            <table className='w-full'>
              <tbody>
                {apiEndpoints.map((ep, i) => (
                  <tr
                    key={ep.path}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 1 ? 'bg-muted/20' : ''}`}
                  >
                    <td className='px-5 py-3.5 w-24'>
                      <span className='font-mono text-[10px] font-semibold tracking-wider text-muted-foreground'>
                        {ep.method}
                      </span>
                    </td>
                    <td className='px-5 py-3.5 font-mono text-[13px] text-foreground'>
                      {ep.path}
                    </td>
                    <td className='px-5 py-3.5 text-right text-[13px] text-muted-foreground'>
                      {ep.label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supported tools */}
        <div className='home-reveal-up' style={{ animationDelay: '500ms' }}>
          <div className="mb-5 flex items-center gap-3">
            <span className="text-[12px] font-semibold tracking-wide text-muted-foreground">
              {t('home.compatibility.toolsTitle')}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className='flex flex-wrap gap-3'>
            {supportedTools.map((tool) => (
              <span
                key={tool}
                className='rounded-lg border border-border bg-background px-3.5 py-2 text-[13px] text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground'
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
