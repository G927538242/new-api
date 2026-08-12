import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { Building2, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { submitCertification } from '../api'
import { CertificationUpload } from './certification-upload'
import type { CertificationRecord, CertType } from '../types'

interface CertificationFormProps {
  initialRecord?: CertificationRecord | null
  defaultType?: CertType
  onSubmitted: () => void
  /** 企业子账户仅支持个人认证，隐藏企业认证选项 */
  subAccountOnly?: boolean
}

const emptyForm = {
  type: 'personal' as CertType,
  realName: '',
  idCardNo: '',
  idCardFront: '',
  idCardBack: '',
  businessLicense: '',
  contactName: '',
  contactPhone: '',
  contactIdFront: '',
  contactIdBack: '',
}

/** 个人/企业认证申请表单 */
export function CertificationForm({
  initialRecord,
  defaultType,
  onSubmitted,
  subAccountOnly = false,
}: CertificationFormProps) {
  const { t } = useTranslation()
  const [form, setForm] = React.useState(() => {
    if (initialRecord) {
      return {
        type: initialRecord.type,
        realName: initialRecord.real_name,
        idCardNo: initialRecord.id_card_no,
        idCardFront: initialRecord.id_card_front,
        idCardBack: initialRecord.id_card_back,
        businessLicense: initialRecord.business_license,
        contactName: initialRecord.contact_name,
        contactPhone: initialRecord.contact_phone,
        contactIdFront: initialRecord.contact_id_front,
        contactIdBack: initialRecord.contact_id_back,
      }
    }
    // 企业子账户强制个人认证
    return { ...emptyForm, type: (subAccountOnly ? 'personal' : defaultType) ?? 'personal' }
  })
  const [submitting, setSubmitting] = React.useState(false)

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const isPersonal = form.type === 'personal'

  const validate = (): string => {
    if (!form.realName.trim()) return isPersonal ? '请填写真实姓名' : '请填写企业名称'
    if (!form.idCardNo.trim())
      return isPersonal ? '请填写身份证号' : '请填写统一社会信用代码'
    if (isPersonal) {
      if (!form.idCardFront) return '请上传身份证正面照片'
      if (!form.idCardBack) return '请上传身份证反面照片'
    } else {
      if (!form.businessLicense) return '请上传营业执照'
      if (!form.contactName.trim()) return '请填写联系人姓名'
      if (!form.contactIdFront) return '请上传经办人身份证正面照片'
      if (!form.contactIdBack) return '请上传经办人身份证反面照片'
    }
    return ''
  }

  const handleSubmit = async () => {
    const error = validate()
    if (error) {
      toast.error(error)
      return
    }
    setSubmitting(true)
    try {
      const res = await submitCertification({
        type: form.type,
        real_name: form.realName.trim(),
        id_card_no: form.idCardNo.trim(),
        id_card_front: form.idCardFront,
        id_card_back: form.idCardBack,
        business_license: form.businessLicense,
        contact_name: form.contactName.trim(),
        contact_phone: form.contactPhone.trim(),
        contact_id_front: form.contactIdFront,
        contact_id_back: form.contactIdBack,
      })
      if (res.success) {
        toast.success('认证申请已提交，请等待管理员审核')
        onSubmitted()
      } else {
        toast.error(res.message || t('Submit failed'))
      }
    } catch {
      toast.error(t('Submit failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='space-y-5'>
      {/* 认证类型切换 */}
      <div className='grid grid-cols-2 gap-2'>
        <button
          type='button'
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
            isPersonal
              ? 'border-primary/60 bg-primary/5 text-foreground'
              : 'border-border text-muted-foreground hover:bg-muted/40'
          )}
          onClick={() => set('type', 'personal')}
        >
          <UserRound className='size-4' />
          个人认证
        </button>
        {!subAccountOnly && (
          <button
            type='button'
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
              !isPersonal
                ? 'border-primary/60 bg-primary/5 text-foreground'
                : 'border-border text-muted-foreground hover:bg-muted/40'
            )}
            onClick={() => set('type', 'enterprise')}
          >
            <Building2 className='size-4' />
            企业认证
          </button>
        )}
      </div>

      <div className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label>{isPersonal ? '真实姓名' : '企业名称'}</Label>
            <Input
              value={form.realName}
              onChange={(e) => set('realName', e.target.value)}
              placeholder={isPersonal ? '请输入真实姓名' : '请输入企业全称'}
            />
          </div>
          <div className='space-y-1.5'>
            <Label>{isPersonal ? '身份证号' : '统一社会信用代码'}</Label>
            <Input
              value={form.idCardNo}
              onChange={(e) => set('idCardNo', e.target.value)}
              placeholder={
                isPersonal ? '请输入身份证号' : '请输入统一社会信用代码'
              }
            />
          </div>
        </div>

        {isPersonal ? (
          <div className='grid gap-4 sm:grid-cols-2'>
            <CertificationUpload
              label='身份证正面'
              description='请上传身份证正面照片'
              value={form.idCardFront}
              onChange={(url) => set('idCardFront', url)}
            />
            <CertificationUpload
              label='身份证反面'
              description='请上传身份证反面照片'
              value={form.idCardBack}
              onChange={(url) => set('idCardBack', url)}
            />
          </div>
        ) : (
          <div className='space-y-4'>
            <CertificationUpload
              label='营业执照'
              description='请上传营业执照照片（支持 jpg/png/webp，不超过 5MB）'
              value={form.businessLicense}
              onChange={(url) => set('businessLicense', url)}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-1.5'>
                <Label>联系人姓名</Label>
                <Input
                  value={form.contactName}
                  onChange={(e) => set('contactName', e.target.value)}
                  placeholder='请输入联系人姓名'
                />
              </div>
              <div className='space-y-1.5'>
                <Label>联系电话</Label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => set('contactPhone', e.target.value)}
                  placeholder='请输入联系电话'
                />
              </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <CertificationUpload
                label='经办人身份证正面'
                description='请上传经办人身份证正面照片'
                value={form.contactIdFront}
                onChange={(url) => set('contactIdFront', url)}
              />
              <CertificationUpload
                label='经办人身份证反面'
                description='请上传经办人身份证反面照片'
                value={form.contactIdBack}
                onChange={(url) => set('contactIdBack', url)}
              />
            </div>
          </div>
        )}

        {isPersonal && (
          <div className='space-y-1.5'>
            <Label>联系电话</Label>
            <Input
              value={form.contactPhone}
              onChange={(e) => set('contactPhone', e.target.value)}
              placeholder='请输入联系电话（选填）'
            />
          </div>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={submitting} className='w-full sm:w-auto'>
        {submitting ? '提交中...' : '提交认证申请'}
      </Button>
    </div>
  )
}
