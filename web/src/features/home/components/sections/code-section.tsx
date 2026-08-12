import { Check, Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

interface CodeSectionProps {
  className?: string
}

export function CodeSection(_props: CodeSectionProps) {
  const { t } = useTranslation()
  const { copiedText, copyToClipboard } = useCopyToClipboard({ notify: false })

  const rawCode = `import { OpenAI } from "openai";
const client = new OpenAI({
  baseURL: "{{BASE_URL}}/v1",
  apiKey: process.env.LINGYIYUN_API_KEY,
});
const response = await client.chat.completions.create({
  model: "deepseek-v3",
  messages: [{ role: "user", content: "你好" }],
});
console.log(response.choices[0].message.content);`

  const isCopied = copiedText === rawCode

  return (
    <section className='relative py-32 md:py-40'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <div className='grid items-center gap-16 lg:grid-cols-12 lg:gap-20'>
          {/* Left content */}
          <div className='home-reveal-up lg:col-span-5' style={{ animationDelay: '0ms' }}>
            <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
              {t('home.code.eyebrow')}
            </span>

            <h2 className='text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
              {t('home.code.title')}
            </h2>
            <p className='mt-5 max-w-md text-[15px] leading-7 text-muted-foreground'>
              {t('home.code.subtitle')}
            </p>

            <div className='mt-10 space-y-5'>
              {[
                { num: '01', text: 'Get your API key from the dashboard' },
                { num: '02', text: 'Install your preferred SDK' },
                { num: '03', text: 'Make your first API call' },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <span className="mt-0.5 font-mono text-[11px] font-semibold text-foreground/40">
                    {step.num}
                  </span>
                  <div className="flex-1">
                    <div className="mb-2 h-px w-8 bg-border" />
                    <p className="text-[14px] text-foreground">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right code block */}
          <div className='home-reveal-up lg:col-span-7' style={{ animationDelay: '120ms' }}>
            <div className='relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1117] to-[#0a0e14]'
              style={{
                boxShadow: `
                  0 24px 48px -12px rgba(0, 0, 0, 0.35),
                  0 0 0 1px rgba(255, 255, 255, 0.04) inset
                `,
              }}
            >
              {/* Header */}
              <div className='flex items-center justify-between border-b border-white/5 px-5 py-3'>
                <div className='flex items-center gap-3'>
                  <div className="flex gap-1.5">
                    <span className='size-2.5 rounded-full bg-[#ff5f56]' />
                    <span className='size-2.5 rounded-full bg-[#ffbd2e]' />
                    <span className='size-2.5 rounded-full bg-[#27c93f]' />
                  </div>
                  <span className="font-mono text-[11px] tracking-wider text-white/40">
                    openai-sdk.ts
                  </span>
                </div>
                <button
                  type='button'
                  onClick={() => copyToClipboard(rawCode)}
                  aria-label={t('Copy to clipboard')}
                  className='inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-[11px] text-white/50 transition-all hover:border-white/20 hover:text-white'
                >
                  {isCopied ? (
                    <Check className='size-3' />
                  ) : (
                    <Copy className='size-3' />
                  )}
                  <span>{isCopied ? t('Copied!') : t('Copy')}</span>
                </button>
              </div>

              {/* Code */}
              <pre className='p-5 font-mono text-[12px] leading-6 overflow-x-auto'>
                <code>
                  <span className="text-violet-400">import</span>{' '}
                  <span className="text-white">{ '{' }</span>{' '}
                  <span className="text-sky-300">OpenAI</span>{' '}
                  <span className="text-white">{ '}'}</span>{' '}
                  <span className="text-violet-400">from</span>{' '}
                  <span className="text-amber-400">&quot;openai&quot;</span>
                  <span className="text-white">;</span>
                  {'\n'}
                  <span className="text-violet-400">const</span>{' '}
                  <span className="text-white">client</span>{' '}
                  <span className="text-white">=</span>{' '}
                  <span className="text-violet-400">new</span>{' '}
                  <span className="text-blue-400">OpenAI</span>
                  <span className="text-white">({'{'}</span>
                  {'\n  '}
                  <span className="text-sky-300">baseURL</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-amber-400">&quot;{'{{BASE_URL}}'}/v1&quot;</span>
                  <span className="text-white">,</span>
                  {'\n  '}
                  <span className="text-sky-300">apiKey</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-white">process</span>
                  <span className="text-white">.</span>
                  <span className="text-white">env</span>
                  <span className="text-white">.</span>
                  <span className="text-white">LINGYIYUN_API_KEY</span>
                  <span className="text-white">,</span>
                  {'\n'}
                  <span className="text-white">{ '}'});</span>
                  {'\n'}
                  <span className="text-violet-400">const</span>{' '}
                  <span className="text-white">response</span>{' '}
                  <span className="text-white">=</span>{' '}
                  <span className="text-violet-400">await</span>{' '}
                  <span className="text-white">client</span>
                  <span className="text-white">.</span>
                  <span className="text-white">chat</span>
                  <span className="text-white">.</span>
                  <span className="text-white">completions</span>
                  <span className="text-white">.</span>
                  <span className="text-blue-400">create</span>
                  <span className="text-white">({'{'}</span>
                  {'\n  '}
                  <span className="text-sky-300">model</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-amber-400">&quot;deepseek-v3&quot;</span>
                  <span className="text-white">,</span>
                  {'\n  '}
                  <span className="text-sky-300">messages</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-white">[{'{'}</span>
                  <span className="text-sky-300">role</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-amber-400">&quot;user&quot;</span>
                  <span className="text-white">,</span>{' '}
                  <span className="text-sky-300">content</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-amber-400">&quot;你好&quot;</span>
                  <span className="text-white">{ '}'}],</span>
                  {'\n'}
                  <span className="text-white">{ '}'});</span>
                  {'\n'}
                  <span className="text-blue-400">console</span>
                  <span className="text-white">.</span>
                  <span className="text-blue-400">log</span>
                  <span className="text-white">(</span>
                  <span className="text-white">response</span>
                  <span className="text-white">.</span>
                  <span className="text-white">choices</span>
                  <span className="text-white">[</span>
                  <span className="text-violet-400">0</span>
                  <span className="text-white">].</span>
                  <span className="text-white">message</span>
                  <span className="text-white">.</span>
                  <span className="text-white">content</span>
                  <span className="text-white">);</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
