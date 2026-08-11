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

interface PricingTableProps {
  className?: string
}

export function PricingTable(_props: PricingTableProps) {
  const { t } = useTranslation()

  const rows = [
    {
      model: 'DeepSeek V3',
      modality: t('home.pricing.modality.text'),
      input: '¥1',
      output: '¥2',
      cache: '¥0.1',
      context: '64K',
    },
    {
      model: 'DeepSeek R1',
      modality: t('home.pricing.modality.text'),
      input: '¥4',
      output: '¥16',
      cache: '¥0.5',
      context: '64K',
    },
    {
      model: 'GPT-4o',
      modality: t('home.pricing.modality.textImage'),
      input: '¥18',
      output: '¥70',
      cache: '¥1.8',
      context: '128K',
    },
    {
      model: 'Claude Sonnet 4',
      modality: t('home.pricing.modality.text'),
      input: '¥22',
      output: '¥110',
      cache: '¥2.2',
      context: '200K',
    },
    {
      model: 'Qwen Max',
      modality: t('home.pricing.modality.text'),
      input: '¥10',
      output: '¥30',
      cache: '¥1',
      context: '32K',
    },
    {
      model: 'GLM-4',
      modality: t('home.pricing.modality.text'),
      input: '¥5',
      output: '¥15',
      cache: '¥0.5',
      context: '128K',
    },
  ]

  return (
    <section className='border-t border-border bg-transparent py-28 md:py-36'>
      <div className='mx-auto max-w-[1100px] px-6'>
        <div className='home-fade-in-up mb-16 max-w-xl' style={{ animationDelay: '0ms' }}>
          <p className='mb-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground'>
            {t('home.pricing.eyebrow')}
          </p>
          <h2 className='text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.01em]'>
            {t('home.pricing.title')}
          </h2>
          <p className='mt-4 text-[15px] leading-7 text-muted-foreground'>
            {t('home.pricing.subtitle')}
          </p>
        </div>

        <div
          className='home-fade-in-up border border-border rounded-md overflow-hidden opacity-0 bg-background'
          style={{ animationDelay: '80ms' }}
        >
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[640px] border-collapse'>
              <thead>
                <tr className='border-b border-border bg-muted/5'>
                  <th className='text-[11px] font-medium tracking-wider uppercase text-muted-foreground py-4 px-5 text-left'>
                    {t('home.pricing.col.model')}
                  </th>
                  <th className='text-[11px] font-medium tracking-wider uppercase text-muted-foreground py-4 px-5 text-left'>
                    {t('home.pricing.col.modality')}
                  </th>
                  <th className='text-[11px] font-medium tracking-wider uppercase text-muted-foreground py-4 px-5 text-right'>
                    {t('home.pricing.col.input')}
                  </th>
                  <th className='text-[11px] font-medium tracking-wider uppercase text-muted-foreground py-4 px-5 text-right'>
                    {t('home.pricing.col.output')}
                  </th>
                  <th className='text-[11px] font-medium tracking-wider uppercase text-muted-foreground py-4 px-5 text-right'>
                    {t('home.pricing.col.cache')}
                  </th>
                  <th className='text-[11px] font-medium tracking-wider uppercase text-muted-foreground py-4 px-5 text-right'>
                    {t('home.pricing.col.context')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.model}
                    className='border-b border-border last:border-0 transition-colors hover:bg-muted/5'
                  >
                    <td className='text-foreground px-5 py-4 text-[14px] font-medium'>
                      {row.model}
                    </td>
                    <td className='text-muted-foreground px-5 py-4 text-[14px]'>
                      {row.modality}
                    </td>
                    <td className='px-5 py-4 text-right'>
                      <span className='text-[14px] font-mono tabular-nums text-foreground'>
                        {row.input}
                      </span>
                    </td>
                    <td className='px-5 py-4 text-right'>
                      <span className='text-[14px] font-mono tabular-nums text-foreground'>
                        {row.output}
                      </span>
                    </td>
                    <td className='px-5 py-4 text-right'>
                      <span className='text-[14px] font-mono tabular-nums text-foreground'>
                        {row.cache}
                      </span>
                    </td>
                    <td className='px-5 py-4 text-right'>
                      <span className='text-[14px] font-mono tabular-nums text-foreground'>
                        {row.context}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
