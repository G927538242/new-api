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
    <section className='relative py-28 md:py-36'>
      <div className='mx-auto max-w-[1200px] px-6'>
        <div className='grid items-center gap-16 lg:grid-cols-12 lg:gap-16'>
          {/* Left: code block */}
          <div className='home-reveal-up lg:col-span-7' style={{ animationDelay: '0ms' }}>
            <div
              className='relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1117] to-[#0a0e14]'
              style={{
                boxShadow: `
                  0 24px 48px -12px rgba(0, 0, 0, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.04) inset
                `,
              }}
            >
              {/* Header */}
              <div className='flex items-center justify-between border-b border-white/5 px-5 py-3'>
                <div className='flex items-center gap-3'>
                  <div className='flex gap-1.5'>
                    <span className='size-2.5 rounded-full bg-[#ff5f56]' />
                    <span className='size-2.5 rounded-full bg-[#ffbd2e]' />
                    <span className='size-2.5 rounded-full bg-[#27c93f]' />
                  </div>
                  <span className='font-mono text-[11px] tracking-wider text-white/40'>
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
              <pre className='overflow-x-auto p-5 font-mono text-[12px] leading-6'>
                <code>
                  <span className='text-violet-400'>import</span>{' '}
                  <span className='text-white'>{'{'}</span>{' '}
                  <span className='text-sky-300'>OpenAI</span>{' '}
                  <span className='text-white'>{'}'}</span>{' '}
                  <span className='text-violet-400'>from</span>{' '}
                  <span className='text-amber-400'>&quot;openai&quot;</span>
                  <span className='text-white'>;</span>
                  {'\n'}
                  <span className='text-violet-400'>const</span>{' '}
                  <span className='text-white'>client</span>{' '}
                  <span className='text-white'>=</span>{' '}
                  <span className='text-violet-400'>new</span>{' '}
                  <span className='text-blue-400'>OpenAI</span>
                  <span className='text-white'>({'{'}</span>
                  {'\n  '}
                  <span className='text-sky-300'>baseURL</span>
                  <span className='text-white'>:</span>{' '}
                  <span className='text-amber-400'>&quot;{'{{BASE_URL}}'}/v1&quot;</span>
                  <span className='text-white'>,</span>
                  {'\n  '}
                  <span className='text-sky-300'>apiKey</span>
                  <span className='text-white'>:</span>{' '}
                  <span className='text-white'>process</span>
                  <span className='text-white'>.</span>
                  <span className='text-white'>env</span>
                  <span className='text-white'>.</span>
                  <span className='text-white'>LINGYIYUN_API_KEY</span>
                  <span className='text-white'>,</span>
                  {'\n'}
                  <span className='text-white'>{'}'});</span>
                  {'\n'}
                  <span className='text-violet-400'>const</span>{' '}
                  <span className='text-white'>response</span>{' '}
                  <span className='text-white'>=</span>{' '}
                  <span className='text-violet-400'>await</span>{' '}
                  <span className='text-white'>client</span>
                  <span className='text-white'>.</span>
                  <span className='text-white'>chat</span>
                  <span className='text-white'>.</span>
                  <span className='text-white'>completions</span>
                  <span className='text-white'>.</span>
                  <span className='text-blue-400'>create</span>
                  <span className='text-white'>({'{'}</span>
                  {'\n  '}
                  <span className='text-sky-300'>model</span>
                  <span className='text-white'>:</span>{' '}
                  <span className='text-amber-400'>&quot;deepseek-v3&quot;</span>
                  <span className='text-white'>,</span>
                  {'\n  '}
                  <span className='text-sky-300'>messages</span>
                  <span className='text-white'>:</span>{' '}
                  <span className='text-white'>[{'{'}</span>
                  <span className='text-sky-300'>role</span>
                  <span className='text-white'>:</span>{' '}
                  <span className='text-amber-400'>&quot;user&quot;</span>
                  <span className='text-white'>,</span>{' '}
                  <span className='text-sky-300'>content</span>
                  <span className='text-white'>:</span>{' '}
                  <span className='text-amber-400'>&quot;你好&quot;</span>
                  <span className='text-white'>{'}'}],</span>
                  {'\n'}
                  <span className='text-white'>{'}'});</span>
                  {'\n'}
                  <span className='text-blue-400'>console</span>
                  <span className='text-white'>.</span>
                  <span className='text-blue-400'>log</span>
                  <span className='text-white'>(</span>
                  <span className='text-white'>response</span>
                  <span className='text-white'>.</span>
                  <span className='text-white'>choices</span>
                  <span className='text-white'>[</span>
                  <span className='text-violet-400'>0</span>
                  <span className='text-white'>].</span>
                  <span className='text-white'>message</span>
                  <span className='text-white'>.</span>
                  <span className='text-white'>content</span>
                  <span className='text-white'>);</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Right: copy */}
          <div className='home-reveal-up lg:col-span-5' style={{ animationDelay: '120ms' }}>
            <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
              <span className='size-1 rounded-full bg-foreground/30' />
              {t('home.code.eyebrow')}
            </span>

            <h2 className='text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
              {t('home.code.title')}
            </h2>
            <p className='mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground'>
              {t('home.code.subtitle')}
            </p>

            <div className='mt-10 space-y-0'>
              {[
                { num: '01', text: 'Get your API key from the dashboard' },
                { num: '02', text: 'Install your preferred SDK' },
                { num: '03', text: 'Make your first API call' },
              ].map((step, i) => (
                <div key={step.num} className='relative flex items-start gap-4 pb-8'>
                  {/* Vertical connector */}
                  {i < 2 && (
                    <span className='absolute top-10 left-[13px] h-[calc(100%-2.5rem)] w-px bg-border' />
                  )}
                  <span className='z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-[10px] font-semibold text-foreground'>
                    {step.num}
                  </span>
                  <div className='flex-1 pt-1'>
                    <p className='text-[14.5px] text-foreground'>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
