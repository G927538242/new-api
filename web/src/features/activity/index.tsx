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
import { Link } from '@tanstack/react-router'
import { ArrowRight, Building2, Gift, Sparkles, Star, Zap } from 'lucide-react'
import { useState } from 'react'

import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  AnthropicIcon,
  ByteDanceIcon,
  DeepSeekIcon,
  GeminiIcon,
  MinimaxIcon,
  OpenAIIcon,
} from '@/features/home/components/sections/provider-icons'

const recommendedModels = [
  {
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: '多模态能力最强的模型，支持文本、图像和音频处理',
    tags: ['多模态', '推理', '通用'],
    highlight: true,
    Icon: OpenAIIcon,
  },
  {
    name: 'Claude 3.5 Sonnet',
    provider: 'Claude',
    description: '高性价比推理模型，在长上下文和代码生成方面表现优异',
    tags: ['推理', '代码', '长上下文'],
    highlight: true,
    Icon: AnthropicIcon,
  },
  {
    name: 'Gemini 2.0 Pro',
    provider: 'Gemini',
    description: '谷歌最新一代多模态模型，支持实时流式输出',
    tags: ['多模态', '流式', '实时'],
    highlight: false,
    Icon: GeminiIcon,
  },
  {
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    description: '国产大模型，中文能力突出，性价比极高',
    tags: ['中文', '性价比', '开源'],
    highlight: true,
    Icon: DeepSeekIcon,
  },
  {
    name: 'Kimi K2',
    provider: 'Moonshot',
    description: '超长上下文窗口，适合企业级文档处理',
    tags: ['长上下文', '企业', '文档'],
    highlight: false,
    Icon: MinimaxIcon,
  },
  {
    name: 'Qwen3',
    provider: 'Alibaba',
    description: '阿里巴巴通义系列，中文理解与生成能力业界领先',
    tags: ['中文', '企业', 'RAG'],
    highlight: false,
    Icon: ByteDanceIcon,
  },
]

// 黑白灰极简 AI 主题配图（系统 text_to_image 生成）
const heroImagePrompt =
  'Ultra minimal monochrome AI gateway abstract background, thin white geometric wireframe neural network mesh over matte black surface, a few silver glowing nodes, premium enterprise SaaS aesthetic, strict black white gray color palette, high contrast, clean spacious composition, cinematic soft depth, no text, no watermark'

function textToImageUrl(prompt: string, size: string): string {
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`
}

export function ActivityCenter() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    phone: '',
    website: '',
    businessType: '',
    scale: '',
    requirements: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <PublicLayout showMainContainer={false}>
      <div className='mx-auto max-w-[1200px] px-6 pt-24 pb-10 space-y-20'>
        {/* ==================== Hero ==================== */}
        <section className='home-reveal-up relative overflow-hidden bg-gradient-to-b from-sky-100/90 via-white/40 to-transparent pt-6 dark:from-sky-950/40 dark:via-slate-950/20 dark:to-transparent'>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/15" />
            <div className="absolute top-16 right-[-8%] h-[300px] w-[300px] rounded-full bg-sky-300/15 blur-3xl dark:bg-sky-600/10" />
          </div>
          {/* Top badge */}
          <div className='relative mb-8 flex justify-center'>
            <span className='inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/60 px-4 py-1.5 text-[12px] font-medium text-muted-foreground backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60'>
              <Sparkles className='size-3.5 text-sky-500' />
              官方活动中心
            </span>
          </div>

          {/* Headline */}
          <div className='relative flex flex-col items-center text-center'>
            <h1 className='text-[clamp(2.4rem,5vw,4rem)] leading-[1.08] font-semibold tracking-tight'>
              探索主流 AI 模型
              <span className='home-shimmer-text block text-foreground/60'>
                免费领取测试额度
              </span>
            </h1>
            <p className='mt-6 max-w-2xl text-[16px] leading-7 text-muted-foreground'>
              面向开发者和企业用户，提供最新 AI 模型推荐、企业认证注册通道，以及丰厚的测试 Token 赠送活动
            </p>
            <div className='mt-9 flex flex-col items-center gap-4 sm:flex-row sm:gap-5'>
              <Button
                className='h-12 rounded-lg border-0 bg-gradient-to-r from-sky-500 to-blue-600 px-7 text-[14px] font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] hover:from-sky-600 hover:to-blue-700'
                render={<Link to='/sign-up' />}
              >
                立即参与活动
                <ArrowRight className='ml-2 size-4' />
              </Button>
              <Link
                to='/pricing'
                className='inline-flex h-12 items-center gap-2 rounded-lg border border-border px-6 text-[14px] font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-foreground/5'
              >
                查看模型价格
              </Link>
            </div>
          </div>

          {/* Dark glass hero card */}
          <div className='home-reveal-up mt-14 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1117] to-[#0a0e14]' style={{ animationDelay: '160ms' }}>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              {/* Left: activity highlights */}
              <div className='relative p-8 md:p-10'>
                <div className="pointer-events-none absolute -top-20 -left-20 h-52 w-52 rounded-full bg-white/[0.04] blur-3xl" />
                <div className='mb-8 flex items-center gap-2 text-[11px] font-medium tracking-widest text-white/40 uppercase'>
                  <span className='inline-block h-px w-8 bg-white/30' />
                  活动亮点
                </div>
                <div className='space-y-6'>
                  {[
                    {
                      icon: Gift,
                      title: '新注册赠送测试额度',
                      desc: '完成企业认证，即可领取等值 ¥500 的测试 Token',
                    },
                    {
                      icon: Zap,
                      title: '首充额外赠送',
                      desc: '活动期间首笔充值享 20% 额外赠送，多充多送',
                    },
                    {
                      icon: Star,
                      title: '全模型免费体验',
                      desc: '活动期间开放全部主流模型，注册即可在线体验',
                    },
                  ].map((item) => (
                    <div key={item.title} className='flex items-start gap-4'>
                      <div className='flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]'>
                        <item.icon className='size-5 text-white/80' />
                      </div>
                      <div>
                        <h3 className='text-[15px] font-medium text-white'>
                          {item.title}
                        </h3>
                        <p className='mt-1 text-[13px] leading-relaxed text-white/50'>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: generated monochrome visual */}
              <div className='relative min-h-[280px] lg:min-h-[400px]'>
                <img
                  src={textToImageUrl(heroImagePrompt, 'landscape_4_3')}
                  alt='AI 模型网络'
                  loading='lazy'
                  decoding='async'
                  className='absolute inset-0 size-full object-cover opacity-90'
                />
                <div className='absolute inset-0 bg-gradient-to-r from-[#0d1117] via-transparent to-transparent lg:bg-gradient-to-r' />
                <div className='absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-transparent to-transparent' />
              </div>
            </div>
          </div>
        </section>

        {/* ==================== Recommended Models ==================== */}
        <section className='home-reveal-up'>
          <div className='mb-8 flex items-end justify-between gap-4'>
            <div>
              <div className='mb-3 flex items-center gap-2'>
                <span className='inline-block h-px w-8 bg-foreground/30' />
                <span className='text-[11px] font-medium tracking-widest text-muted-foreground uppercase'>
                  Model Showcase
                </span>
              </div>
              <h2 className='text-2xl font-semibold tracking-tight'>
                主流模型推荐
              </h2>
              <p className='mt-2 text-sm text-muted-foreground'>
                精选当前最受欢迎的 AI 模型，涵盖文本、多模态、代码等场景
              </p>
            </div>
            <Button
              variant='outline'
              className='hidden shrink-0 text-foreground sm:inline-flex'
              render={<Link to='/pricing' />}
            >
              查看全部
              <ArrowRight className='ml-1.5 size-4' />
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {recommendedModels.map((model) => {
              const IconComponent = model.Icon
              return (
                <Card
                  key={model.name}
                  className='group relative overflow-hidden border-border/70 bg-background transition-all hover:border-foreground/25 hover:shadow-md'
                >
                  {model.highlight && (
                    <div className='absolute top-3 right-3'>
                      <span className='inline-flex items-center gap-1 rounded-full border border-foreground/15 bg-foreground/5 px-2 py-0.5 text-xs font-medium text-foreground/80'>
                        <Zap className='size-3' />
                        热门
                      </span>
                    </div>
                  )}
                  <CardHeader className='pb-3'>
                    <div className='flex items-center gap-3'>
                      <div className='flex size-10 items-center justify-center rounded-lg border border-border/70 bg-background p-2'>
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <CardTitle className='text-base leading-tight'>
                          {model.name}
                        </CardTitle>
                        <CardDescription className='text-xs'>
                          {model.provider}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <p className='text-sm leading-relaxed text-muted-foreground'>
                      {model.description}
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                      {model.tags.map((tag) => (
                        <span
                          key={tag}
                          className='inline-flex rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='mt-2 h-8 px-0 text-foreground/80 hover:bg-transparent hover:text-foreground'
                      render={<Link to='/pricing' />}
                    >
                      查看详情
                      <ArrowRight className='ml-0.5 size-3' />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* ==================== Enterprise Certification ==================== */}
        <section className='home-reveal-up grid grid-cols-1 lg:grid-cols-5 gap-10'>
          {/* Left Info Panel */}
          <div className='lg:col-span-2 space-y-8'>
            <div>
              <div className='mb-3 flex items-center gap-2'>
                <span className='inline-block h-px w-8 bg-foreground/30' />
                <span className='text-[11px] font-medium tracking-widest text-muted-foreground uppercase'>
                  Enterprise
                </span>
              </div>
              <h2 className='text-2xl font-semibold tracking-tight flex items-center gap-2'>
                <Building2 className='size-5 text-foreground/70' />
                企业认证注册
              </h2>
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                完成企业认证后，您将获得以下专属权益：
              </p>
            </div>

            <div className='space-y-3'>
              <div className='flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4'>
                <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground'>
                  <Gift className='size-5' />
                </div>
                <div>
                  <h3 className='text-sm font-medium'>测试 Token 赠送</h3>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    新注册企业用户可免费领取{' '}
                    <span className='font-semibold text-foreground'>
                      等值 ¥500
                    </span>{' '}
                    的测试 Token 额度
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4'>
                <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground'>
                  <Zap className='size-5' />
                </div>
                <div>
                  <h3 className='text-sm font-medium'>专属客服支持</h3>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    1 对 1 技术对接，快速响应 API 接入和集成问题
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4'>
                <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground'>
                  <Star className='size-5' />
                </div>
                <div>
                  <h3 className='text-sm font-medium'>企业级 SLA 保障</h3>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    99.9% 可用性保障，专属通道优先路由，业务稳定无忧
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Registration Form */}
          <div className='lg:col-span-3'>
            <Card className='border-border/60 bg-background/80 shadow-sm backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-lg'>企业认证申请表</CardTitle>
                <CardDescription>
                  填写以下信息，我们将在 1-3 个工作日内完成审核
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className='flex flex-col items-center justify-center py-12 space-y-4'>
                    <div className='flex size-16 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5 text-foreground'>
                      <svg
                        className='size-8'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    </div>
                    <h3 className='text-lg font-semibold'>提交成功！</h3>
                    <p className='max-w-sm text-center text-sm text-muted-foreground'>
                      您的企业认证申请已提交，我们将尽快与您联系。审核通过后，测试
                      Token 将自动发放至您的账户。
                    </p>
                    <Button
                      variant='outline'
                      className='text-foreground'
                      render={<Link to='/sign-up' />}
                    >
                      前往注册登录
                      <ArrowRight className='ml-1 size-4' />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='companyName'>企业名称 *</Label>
                        <Input
                          id='companyName'
                          value={formData.companyName}
                          onChange={(e) =>
                            updateField('companyName', e.target.value)
                          }
                          placeholder='请输入企业全称'
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='website'>企业网站</Label>
                        <Input
                          id='website'
                          value={formData.website}
                          onChange={(e) =>
                            updateField('website', e.target.value)
                          }
                          placeholder='https://example.com'
                          type='url'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='contactName'>联系人姓名 *</Label>
                        <Input
                          id='contactName'
                          value={formData.contactName}
                          onChange={(e) =>
                            updateField('contactName', e.target.value)
                          }
                          placeholder='请输入联系人姓名'
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='contactEmail'>企业邮箱 *</Label>
                        <Input
                          id='contactEmail'
                          value={formData.contactEmail}
                          onChange={(e) =>
                            updateField('contactEmail', e.target.value)
                          }
                          placeholder='name@company.com'
                          type='email'
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='phone'>联系电话</Label>
                        <Input
                          id='phone'
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder='请输入手机号码'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='businessType'>业务类型 *</Label>
                        <select
                          id='businessType'
                          value={formData.businessType}
                          onChange={(e) =>
                            updateField('businessType', e.target.value)
                          }
                          className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                          required
                        >
                          <option value=''>请选择业务类型</option>
                          <option value='web'>互联网应用</option>
                          <option value='finance'>金融科技</option>
                          <option value='education'>教育科技</option>
                          <option value='health'>医疗健康</option>
                          <option value='manufacturing'>智能制造</option>
                          <option value='media'>媒体内容</option>
                          <option value='other'>其他</option>
                        </select>
                      </div>
                      <div className='space-y-2 md:col-span-2'>
                        <Label htmlFor='scale'>企业规模 *</Label>
                        <div className='flex gap-2'>
                          {['1-50人', '50-200人', '200-1000人', '1000人以上'].map(
                            (scale) => (
                              <button
                                key={scale}
                                type='button'
                                onClick={() => updateField('scale', scale)}
                                className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                                  formData.scale === scale
                                    ? 'border-foreground/60 bg-foreground/5 text-foreground'
                                    : 'border-border bg-background hover:bg-muted/50'
                                }`}
                              >
                                {scale}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      <div className='space-y-2 md:col-span-2'>
                        <Label htmlFor='requirements'>业务需求描述</Label>
                        <Textarea
                          id='requirements'
                          value={formData.requirements}
                          onChange={(e) =>
                            updateField('requirements', e.target.value)
                          }
                          placeholder='请简要描述您的业务场景和模型需求，便于我们为您推荐合适的方案'
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className='flex items-center justify-between pt-2'>
                      <p className='text-xs text-muted-foreground'>
                        提交即表示您同意{' '}
                        <Link
                          to='/user-agreement'
                          className='underline hover:text-foreground'
                        >
                          用户协议
                        </Link>{' '}
                        和{' '}
                        <Link
                          to='/privacy-policy'
                          className='underline hover:text-foreground'
                        >
                          隐私政策
                        </Link>
                      </p>
                      <Button
                        type='submit'
                        className='h-9 rounded-md bg-foreground px-5 text-sm font-medium text-background hover:bg-foreground/90'
                      >
                        提交申请
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ==================== Benefits Banner ==================== */}
        <section className='home-reveal-up relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1117] to-[#0a0e14] p-8 md:p-10'>
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl" />
          <div className='relative flex flex-col items-center justify-between gap-6 md:flex-row'>
            <div className='flex items-center gap-4'>
              <div className='flex size-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]'>
                <Gift className='size-7 text-white/80' />
              </div>
              <div>
                <h3 className='text-xl font-semibold text-white'>
                  限时活动：注册即送测试额度
                </h3>
                <p className='mt-1 text-sm text-white/50'>
                  完成企业认证，新用户首充享 20% 额外赠送
                </p>
              </div>
            </div>
            <div className='flex gap-3'>
              <Button
                className='h-10 rounded-lg border-0 bg-white px-6 text-sm font-semibold text-[#0a0e14] transition-all hover:bg-white/90'
                render={<Link to='/sign-up' />}
              >
                立即注册
                <ArrowRight className='ml-1.5 size-4' />
              </Button>
              <Button
                variant='outline'
                className='h-10 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
                render={<Link to='/pricing' />}
              >
                了解更多
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
