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

function getDefaultRows(t: (key: string) => string): PricingTableRow[] {
  return [
    { model: 'DeepSeek V3', modality: t('home.pricing.modality.text'), input: '¥1', output: '¥2', cache: '¥0.1', context: '64K' },
    { model: 'DeepSeek R1', modality: t('home.pricing.modality.text'), input: '¥4', output: '¥16', cache: '¥0.5', context: '64K' },
    { model: 'GPT-4o', modality: t('home.pricing.modality.textImage'), input: '¥18', output: '¥70', cache: '¥1.8', context: '128K' },
    { model: 'Claude Sonnet 4', modality: t('home.pricing.modality.text'), input: '¥22', output: '¥110', cache: '¥2.2', context: '200K' },
    { model: 'Qwen Max', modality: t('home.pricing.modality.text'), input: '¥10', output: '¥30', cache: '¥1', context: '32K' },
    { model: 'GLM-4', modality: t('home.pricing.modality.text'), input: '¥5', output: '¥15', cache: '¥0.5', context: '128K' },
  ]
}

function formatPrice(value: number, symbol: string): string {
  if (!isFinite(value) || value < 0) return `${symbol}0`
  if (value === 0) return `${symbol}0`
  let formatted: string
  if (value >= 1) {
    formatted = value.toFixed(2)
    if (formatted.endsWith('.00')) formatted = formatted.slice(0, -3)
    else if (formatted.endsWith('0')) formatted = formatted.slice(0, -1)
  } else if (value >= 0.01) {
    formatted = value.toFixed(2)
  } else {
    formatted = value.toFixed(4)
  }
  return `${symbol}${formatted}`
}

function mapModality(raw: string, t: (key: string) => string): string {
  const lower = (raw || '').toLowerCase()
  if (lower.includes('image') || lower.includes('vision') || lower === 'text+image') {
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
        const res = await api.get('/api/home/pricing', { skipBusinessError: true } as any)
        const body = res?.data as HomePricingResponse | undefined
        if (!body || typeof body !== 'object') return null
        return body
      } catch {
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
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
      modality: mapModality(r.modality ?? 'text', t),
      input: formatPrice(r.input_per_million ?? 0, currencySymbol),
      output: formatPrice(r.output_per_million ?? 0, currencySymbol),
      cache: formatPrice(r.cache_per_million ?? 0, currencySymbol),
      context: r.context_window ?? '',
    }))
  } else {
    rows = getDefaultRows(t)
  }

  return (
    <section className='relative py-28 md:py-36'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Header */}
        <div
          className='home-reveal-up mb-14 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between'
          style={{ animationDelay: '0ms' }}
        >
          <div className='max-w-xl'>
            <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
              <span className='size-1 rounded-full bg-foreground/30' />
              {t('home.pricing.eyebrow')}
            </span>
            <h2 className='text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
              {t('home.pricing.title')}
            </h2>
            <p className='mt-4 text-[15px] leading-7 text-muted-foreground'>
              {t('home.pricing.subtitle')}
            </p>
          </div>
          <div className='hidden shrink-0 items-center gap-2 text-[12px] text-muted-foreground md:flex'>
            <span className='relative flex size-1.5'>
              <span className='home-pulse-dot absolute inline-flex size-full rounded-full bg-emerald-500/60' />
              <span className='relative inline-flex size-1.5 rounded-full bg-emerald-500' />
            </span>
            实时同步上游价格
          </div>
        </div>

        {/* Table */}
        <div
          className='home-reveal-up overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm'
          style={{ animationDelay: '100ms' }}
        >
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[640px] border-collapse'>
              <thead>
                <tr className='border-b border-border bg-muted/40'>
                  <th className='px-6 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-muted-foreground'>
                    {t('home.pricing.col.model')}
                  </th>
                  <th className='px-6 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-muted-foreground'>
                    {t('home.pricing.col.modality')}
                  </th>
                  <th className='px-6 py-4 text-right text-[11px] font-semibold tracking-wider uppercase text-muted-foreground'>
                    {t('home.pricing.col.input')}
                  </th>
                  <th className='px-6 py-4 text-right text-[11px] font-semibold tracking-wider uppercase text-muted-foreground'>
                    {t('home.pricing.col.output')}
                  </th>
                  <th className='px-6 py-4 text-right text-[11px] font-semibold tracking-wider uppercase text-muted-foreground'>
                    {t('home.pricing.col.cache')}
                  </th>
                  <th className='px-6 py-4 text-right text-[11px] font-semibold tracking-wider uppercase text-muted-foreground'>
                    {t('home.pricing.col.context')}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/70'>
                {rows.map((row) => (
                  <tr key={row.model} className='group transition-colors hover:bg-muted/30'>
                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center gap-2 text-[14px] font-semibold text-foreground'>
                        <span className='size-1.5 rounded-full bg-foreground/20 transition-colors group-hover:bg-foreground/60' />
                        {row.model}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center rounded border border-border bg-muted/40 px-2 py-0.5 text-[11.5px] text-muted-foreground'>
                        {row.modality}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <span className='font-mono text-[14px] tabular-nums text-foreground'>
                        {row.input}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <span className='font-mono text-[14px] tabular-nums text-foreground'>
                        {row.output}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <span className='font-mono text-[14px] tabular-nums text-foreground'>
                        {row.cache}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <span className='font-mono text-[14px] tabular-nums text-muted-foreground'>
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
