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
      <div className='mx-auto max-w-[1200px] px-6 pt-24 pb-10 space-y-16'>
        {/* Hero Section */}
      <section className='text-center space-y-5 py-8'>
        <div className='inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-4 py-1.5 text-sm font-medium text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'>
          <Sparkles className='size-4' />
          <span>官方活动中心</span>
        </div>
        <h1 className='text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight'>
          探索主流 AI 模型，<span className='bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent'>免费领取测试额度</span>
        </h1>
        <p className='mx-auto max-w-2xl text-muted-foreground text-base leading-relaxed'>
          面向开发者和企业用户，提供最新 AI 模型推荐、企业认证注册通道，以及丰厚的测试 Token 赠送活动
        </p>
        <div className='relative overflow-hidden rounded-2xl shadow-lg mt-8 ring-1 ring-border/40'>
          <img
            src='/assets/tokenhub/activity-hero.jpg'
            alt='活动中心'
            loading='lazy'
            decoding='async'
            className='aspect-[16/9] w-full object-cover'
          />
        </div>
      </section>

      {/* Recommended Models */}
      <section>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-semibold flex items-center gap-2'>
              <Star className='size-5 text-amber-500' />
              主流模型推荐
            </h2>
            <p className='text-sm text-muted-foreground mt-1'>精选当前最受欢迎的 AI 模型，涵盖文本、多模态、代码等场景</p>
          </div>
          <Button variant='outline' className='border-sky-200/60 bg-sky-50/60 text-sky-700 hover:bg-sky-100/70 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20' render={<Link to='/pricing' />}>
            查看全部 <ArrowRight className='ml-1 size-4' />
          </Button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {recommendedModels.map((model) => {
            const IconComponent = model.Icon
            return (
              <Card
                key={model.name}
                className={`group relative overflow-hidden transition-all hover:shadow-md ${
                  model.highlight
                    ? 'border-sky-200/60 bg-gradient-to-br from-sky-50/80 to-white dark:border-sky-500/30 dark:from-sky-500/10 dark:to-transparent'
                    : 'border-border/60 bg-background/60 backdrop-blur-sm'
                }`}
              >
                {model.highlight && (
                  <div className='absolute top-3 right-3'>
                    <span className='inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'>
                      <Zap className='size-3' />
                      热门
                    </span>
                  </div>
                )}
                <CardHeader className='pb-3'>
                  <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-lg bg-background border border-border/60 p-2'>
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <CardTitle className='text-base leading-tight'>{model.name}</CardTitle>
                      <CardDescription className='text-xs'>{model.provider}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <p className='text-sm text-muted-foreground leading-relaxed'>{model.description}</p>
                  <div className='flex flex-wrap gap-1.5'>
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className='inline-flex rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='mt-2 h-8 px-0 text-sky-600 hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-500/10'
                    render={<Link to='/pricing' />}
                  >
                    查看详情 <ArrowRight className='ml-0.5 size-3' />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Enterprise Certification */}
      <section className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
        {/* Left Info Panel */}
        <div className='lg:col-span-2 space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold flex items-center gap-2'>
              <Building2 className='size-5 text-sky-600' />
              企业认证注册
            </h2>
            <p className='text-sm text-muted-foreground mt-2 leading-relaxed'>
              完成企业认证后，您将获得以下专属权益：
            </p>
          </div>
          <div className='space-y-3'>
            <div className='flex items-start gap-3 rounded-xl bg-sky-50/60 p-4 dark:bg-sky-500/10'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'>
                <Gift className='size-5' />
              </div>
              <div>
                <h3 className='font-medium text-sm'>测试 Token 赠送</h3>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  新注册企业用户可免费领取 <span className='font-semibold text-foreground'>等值 ¥500</span> 的测试 Token 额度
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3 rounded-xl bg-violet-50/60 p-4 dark:bg-violet-500/10'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300'>
                <Zap className='size-5' />
              </div>
              <div>
                <h3 className='font-medium text-sm'>专属客服支持</h3>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  1 对 1 技术对接，快速响应 API 接入和集成问题
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3 rounded-xl bg-emerald-50/60 p-4 dark:bg-emerald-500/10'>
              <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'>
                <Star className='size-5' />
              </div>
              <div>
                <h3 className='font-medium text-sm'>企业级 SLA 保障</h3>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  99.9% 可用性保障，专属通道优先路由，业务稳定无忧
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className='lg:col-span-3'>
          <Card className='border-border/60 bg-background/80 backdrop-blur-sm shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg'>企业认证申请表</CardTitle>
              <CardDescription>填写以下信息，我们将在 1-3 个工作日内完成审核</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className='flex flex-col items-center justify-center py-12 space-y-4'>
                  <div className='flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'>
                    <svg className='size-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold'>提交成功！</h3>
                  <p className='text-sm text-muted-foreground text-center max-w-sm'>
                    您的企业认证申请已提交，我们将尽快与您联系。审核通过后，测试 Token 将自动发放至您的账户。
                  </p>
                  <Button
                    variant='outline'
                    className='border-sky-200/60 bg-sky-50/60 text-sky-700 hover:bg-sky-100/70 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20'
                    render={<Link to='/sign-up' />}
                  >
                    前往注册登录 <ArrowRight className='ml-1 size-4' />
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
                        onChange={(e) => updateField('companyName', e.target.value)}
                        placeholder='请输入企业全称'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='website'>企业网站</Label>
                      <Input
                        id='website'
                        value={formData.website}
                        onChange={(e) => updateField('website', e.target.value)}
                        placeholder='https://example.com'
                        type='url'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='contactName'>联系人姓名 *</Label>
                      <Input
                        id='contactName'
                        value={formData.contactName}
                        onChange={(e) => updateField('contactName', e.target.value)}
                        placeholder='请输入联系人姓名'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='contactEmail'>企业邮箱 *</Label>
                      <Input
                        id='contactEmail'
                        value={formData.contactEmail}
                        onChange={(e) => updateField('contactEmail', e.target.value)}
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
                        onChange={(e) => updateField('businessType', e.target.value)}
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
                        {['1-50人', '50-200人', '200-1000人', '1000人以上'].map((scale) => (
                          <button
                            key={scale}
                            type='button'
                            onClick={() => updateField('scale', scale)}
                            className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                              formData.scale === scale
                                ? 'border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-400 dark:bg-sky-500/20 dark:text-sky-300'
                                : 'border-border bg-background hover:bg-muted/50'
                            }`}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label htmlFor='requirements'>业务需求描述</Label>
                      <Textarea
                        id='requirements'
                        value={formData.requirements}
                        onChange={(e) => updateField('requirements', e.target.value)}
                        placeholder='请简要描述您的业务场景和模型需求，便于我们为您推荐合适的方案'
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className='flex items-center justify-between pt-2'>
                    <p className='text-xs text-muted-foreground'>
                      提交即表示您同意 <Link to='/user-agreement' className='underline hover:text-foreground'>用户协议</Link> 和 <Link to='/privacy-policy' className='underline hover:text-foreground'>隐私政策</Link>
                    </p>
                    <Button
                      type='submit'
                      className='h-9 rounded-md bg-sky-600 px-5 text-sm font-medium text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400'
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

      {/* Benefits Banner */}
      <section className='rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 p-8 text-white dark:from-sky-600 dark:to-blue-700'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          <div className='flex items-center gap-4'>
            <div className='flex size-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
              <Gift className='size-7' />
            </div>
            <div>
              <h3 className='text-xl font-semibold'>限时活动：注册即送测试额度</h3>
              <p className='text-sm text-white/80 mt-1'>完成企业认证，新用户首充享 20% 额外赠送</p>
            </div>
          </div>
          <div className='flex gap-3'>
            <Button
              variant='secondary'
              className='bg-white text-sky-700 hover:bg-white/90'
              render={<Link to='/sign-up' />}
            >
              立即注册 <ArrowRight className='ml-1 size-4' />
            </Button>
            <Button
              variant='outline'
              className='border-white/40 bg-white/10 text-white hover:bg-white/20'
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
