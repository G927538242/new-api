import { useTranslation } from 'react-i18next'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      num: '01',
      title: t('home.steps.01.title'),
      desc: t('home.steps.01.desc'),
      hint: t('home.steps.01.hint'),
    },
    {
      num: '02',
      title: t('home.steps.02.title'),
      desc: t('home.steps.02.desc'),
      hint: t('home.steps.02.hint'),
    },
    {
      num: '03',
      title: t('home.steps.03.title'),
      desc: t('home.steps.03.desc'),
      hint: t('home.steps.03.hint'),
    },
  ]

  return (
    <section className='relative py-32 md:py-40'>
      <div className='mx-auto max-w-[1200px] px-6'>
        {/* Header */}
        <div className='home-reveal-up mb-16 flex flex-col items-center text-center' style={{ animationDelay: '0ms' }}>
          <span className='mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground'>
            {t('home.steps.eyebrow')}
          </span>
          <h2 className='max-w-2xl text-[clamp(2rem,4vw,3rem)] leading-[1.15] font-semibold tracking-tight text-foreground'>
            {t('home.steps.title')}
          </h2>
          <p className='mt-5 max-w-xl text-[16px] leading-7 text-muted-foreground'>
            {t('home.steps.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className='grid gap-6 md:grid-cols-3'>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className='home-reveal-up group relative rounded-2xl border border-border bg-background p-8 home-card-hover'
              style={{ animationDelay: `${(i + 1) * 120}ms` }}
            >
              {/* Number */}
              <div className='mb-6 flex items-center gap-3'>
                <span className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground">
                  STEP
                </span>
                <span className="font-mono text-2xl font-bold tracking-tight text-foreground/10 group-hover:text-foreground/20">
                  {step.num}
                </span>
              </div>

              {/* Content */}
              <h3 className='text-[20px] font-semibold tracking-tight text-foreground'>
                {step.title}
              </h3>
              <p className='mt-3 text-[14px] leading-6 text-muted-foreground'>
                {step.desc}
              </p>

              {/* Hint badge */}
              {step.hint && (
                <div className='mt-6 inline-block rounded-lg border border-border bg-muted/30 px-3 py-1.5 font-mono text-[11px] text-muted-foreground'>
                  {step.hint}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
