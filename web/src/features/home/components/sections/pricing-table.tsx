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
import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

interface PricingTableProps {
  className?: string
}

interface HomePricingRowPayload {
  model: string
  modality: string
  input_per_million: number
  output_per_million: number
  cache_per_million: number
  context_window: string
}

interface HomePricingResponse {
  success: boolean
  message?: string
  data?: HomePricingRowPayload[] | null
  currency_symbol?: string | null
}

interface PricingTableRow {
  model: string
  modality: string
  input: string
  output: string
  cache: string
  context: string
}

const DEFAULT_CURRENCY_SYMBOL = '¥'
const MODALITY_TEXT = 'text'
const MODALITY_TEXT_IMAGE = 'text+image'

function getDefaultRows(t: (key: string) => string): PricingTableRow[] {
  return [
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
}

function formatPrice(value: number, symbol: string): string {
  if (!isFinite(value) || value < 0) {
    return `${symbol}0`
  }
  if (value === 0) {
    return `${symbol}0`
  }
  let formatted: string
  if (value >= 1) {
    formatted = value.toFixed(2)
    if (formatted.endsWith('.00')) {
      formatted = formatted.slice(0, -3)
    } else if (formatted.endsWith('0')) {
      formatted = formatted.slice(0, -1)
    }
  } else if (value >= 0.01) {
    formatted = value.toFixed(2)
  } else {
    formatted = value.toFixed(4)
  }
  return `${symbol}${formatted}`
}

function mapModality(raw: string, t: (key: string) => string): string {
  const lower = (raw || '').toLowerCase()
  if (lower.includes('image') || lower.includes('vision') || lower === MODALITY_TEXT_IMAGE) {
    return t('home.pricing.modality.textImage')
  }
  return t('home.pricing.modality.text')
}

export function PricingTable(_props: PricingTableProps) {
  const { t } = useTranslation()

  const { data } = useQuery<HomePricingResponse | null>({
    queryKey: ['home-pricing'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/home/pricing', {
          skipBusinessError: true,
        } as any)
        const body = res?.data as HomePricingResponse | undefined
        if (!body || typeof body !== 'object') return null
        return body
      } catch {
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Only retry transient errors; don't retry if route is missing or misconfigured.
      if (failureCount >= 1) return false
      const status = error?.response?.status
      if (status === 404 || status === 405 || status >= 500) return false
      return true
    },
  })

  const currencySymbol =
    typeof data?.currency_symbol === 'string' && data.currency_symbol.trim() !== ''
      ? data.currency_symbol
      : DEFAULT_CURRENCY_SYMBOL

  let rows: PricingTableRow[]
  const serverRows =
    Array.isArray(data?.data) && data && (data.data as HomePricingRowPayload[]).length > 0
      ? (data.data as HomePricingRowPayload[])
      : null

  if (serverRows) {
    rows = serverRows.map<PricingTableRow>((r) => ({
      model: r.model ?? '',
      modality: mapModality(r.modality ?? MODALITY_TEXT, t),
      input: formatPrice(r.input_per_million ?? 0, currencySymbol),
      output: formatPrice(r.output_per_million ?? 0, currencySymbol),
      cache: formatPrice(r.cache_per_million ?? 0, currencySymbol),
      context: r.context_window ?? '',
    }))
  } else {
    rows = getDefaultRows(t)
  }

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
