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
  const k = 'text-violet-400'
  const s = 'text-emerald-400'
  const f = 'text-blue-300'
  const p = 'text-[#8b949e]'
  const id = 'text-[#c9d1d9]'

  return (
    <section className='border-t border-border bg-transparent py-28 md:py-36'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div className='home-fade-in-up mb-16 max-w-xl' style={{ animationDelay: '0ms' }}>
          <p className='mb-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground'>
            {t('home.code.eyebrow')}
          </p>
          <h2 className='text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.01em]'>
            {t('home.code.title')}
          </h2>
          <p className='mt-4 text-[15px] leading-7 text-muted-foreground'>
            {t('home.code.subtitle')}
          </p>
        </div>

        <div
          className='home-fade-in-up border border-border rounded-md overflow-hidden opacity-0'
          style={{ animationDelay: '80ms' }}
        >
          <div className='border-b border-border px-5 py-3 flex items-center justify-between bg-muted/5'>
            <div className='flex items-center gap-2'>
              <span className='size-2.5 rounded-full bg-red-500/70' />
              <span className='size-2.5 rounded-full bg-amber-500/70' />
              <span className='size-2.5 rounded-full bg-emerald-500/70' />
              <span className='ml-3 text-[11px] text-muted-foreground font-mono'>
                openai-sdk.ts
              </span>
            </div>
            <button
              type='button'
              onClick={() => copyToClipboard(rawCode)}
              aria-label={t('Copy to clipboard')}
              className='inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors'
            >
              {isCopied ? (
                <Check className='size-3.5 text-emerald-500/80' />
              ) : (
                <Copy className='size-3.5' />
              )}
              <span>
                {isCopied ? t('Copied!') : t('Copy')}
              </span>
            </button>
          </div>

          <pre className='bg-[#0d1117] p-5 text-[12.5px] font-mono leading-6 text-[#c9d1d9] overflow-x-auto'>
            <code>
              <span className={k}>import</span>{' '}
              <span className={p}>{'{'}</span>{' '}
              <span className={id}>OpenAI</span>{' '}
              <span className={p}>{'}'}</span>{' '}
              <span className={k}>from</span>{' '}
              <span className={s}>&quot;openai&quot;</span>
              <span className={p}>;</span>
              {'\n'}
              <span className={k}>const</span>{' '}
              <span className={id}>client</span>{' '}
              <span className={p}>=</span>{' '}
              <span className={k}>new</span>{' '}
              <span className={f}>OpenAI</span>
              <span className={p}>({'{'}</span>
              {'\n  '}
              <span className={id}>baseURL</span>
              <span className={p}>:</span>{' '}
              <span className={s}>&quot;{'{{BASE_URL}}'}/v1&quot;</span>
              <span className={p}>,</span>
              {'\n  '}
              <span className={id}>apiKey</span>
              <span className={p}>:</span>{' '}
              <span className={id}>process</span>
              <span className={p}>.</span>
              <span className={id}>env</span>
              <span className={p}>.</span>
              <span className={id}>LINGYIYUN_API_KEY</span>
              <span className={p}>,</span>
              {'\n'}
              <span className={p}>{'}'});</span>
              {'\n'}
              <span className={k}>const</span>{' '}
              <span className={id}>response</span>{' '}
              <span className={p}>=</span>{' '}
              <span className={k}>await</span>{' '}
              <span className={id}>client</span>
              <span className={p}>.</span>
              <span className={id}>chat</span>
              <span className={p}>.</span>
              <span className={id}>completions</span>
              <span className={p}>.</span>
              <span className={f}>create</span>
              <span className={p}>({'{'}</span>
              {'\n  '}
              <span className={id}>model</span>
              <span className={p}>:</span>{' '}
              <span className={s}>&quot;deepseek-v3&quot;</span>
              <span className={p}>,</span>
              {'\n  '}
              <span className={id}>messages</span>
              <span className={p}>:</span>{' '}
              <span className={p}>[{'{'}</span>{' '}
              <span className={id}>role</span>
              <span className={p}>:</span>{' '}
              <span className={s}>&quot;user&quot;</span>
              <span className={p}>,</span>{' '}
              <span className={id}>content</span>
              <span className={p}>:</span>{' '}
              <span className={s}>&quot;你好&quot;</span>{' '}
              <span className={p}>{'}'}],</span>
              {'\n'}
              <span className={p}>{'}'});</span>
              {'\n'}
              <span className={f}>console</span>
              <span className={p}>.</span>
              <span className={f}>log</span>
              <span className={p}>(</span>
              <span className={id}>response</span>
              <span className={p}>.</span>
              <span className={id}>choices</span>
              <span className={p}>[</span>
              <span className={s}>0</span>
              <span className={p}>].</span>
              <span className={id}>message</span>
              <span className={p}>.</span>
              <span className={id}>content</span>
              <span className={p}>);</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  )
}
