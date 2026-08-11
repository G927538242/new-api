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
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import { SettingsCard } from '../components/settings-card'
import {
  SettingsForm,
  SettingsSwitchContent,
  SettingsSwitchItem,
} from '../components/settings-form-layout'
import { SettingsPageFormActions } from '../components/settings-page-context'
import { SettingsSection } from '../components/settings-section'
import { useResetForm } from '../hooks/use-reset-form'
import { useUpdateOption } from '../hooks/use-update-option'

const STORAGE_TYPE_OPTIONS = [
  { value: 'local', label: '本地存储' },
  { value: 's3', label: 'S3' },
  { value: 'minio', label: 'MinIO' },
  { value: 'oss', label: '阿里云 OSS' },
  { value: 'tos', label: '火山引擎 TOS' },
] as const

const schema = z.object({
  asset_setting: z.object({
    type: z.enum(['local', 's3', 'minio', 'oss', 'tos']),
    endpoint: z.string(),
    region: z.string(),
    bucket: z.string(),
    access_key: z.string(),
    secret_key: z.string(),
    path_prefix: z.string(),
    custom_domain: z.string(),
    force_path_style: z.boolean(),
    volc_access_key: z.string(),
    volc_secret_key: z.string(),
  }),
})

type FormInput = z.input<typeof schema>
type FormValues = z.output<typeof schema>

type FlatDefaults = {
  'asset_setting.type': string
  'asset_setting.endpoint': string
  'asset_setting.region': string
  'asset_setting.bucket': string
  'asset_setting.access_key': string
  'asset_setting.secret_key': string
  'asset_setting.path_prefix': string
  'asset_setting.custom_domain': string
  'asset_setting.force_path_style': boolean
  'asset_setting.volc_access_key': string
  'asset_setting.volc_secret_key': string
}

const PASSWORD_KEYS: Array<keyof FlatDefaults> = [
  'asset_setting.access_key',
  'asset_setting.secret_key',
  'asset_setting.volc_access_key',
  'asset_setting.volc_secret_key',
]

const buildFormDefaults = (defaults: FlatDefaults): FormInput => ({
  asset_setting: {
    type: (defaults['asset_setting.type'] as FormValues['asset_setting']['type']) ?? 'local',
    endpoint: defaults['asset_setting.endpoint'] ?? '',
    region: defaults['asset_setting.region'] ?? '',
    bucket: defaults['asset_setting.bucket'] ?? '',
    access_key: defaults['asset_setting.access_key'] ?? '',
    secret_key: defaults['asset_setting.secret_key'] ?? '',
    path_prefix: defaults['asset_setting.path_prefix'] ?? 'assets/',
    custom_domain: defaults['asset_setting.custom_domain'] ?? '',
    force_path_style: defaults['asset_setting.force_path_style'] ?? false,
    volc_access_key: defaults['asset_setting.volc_access_key'] ?? '',
    volc_secret_key: defaults['asset_setting.volc_secret_key'] ?? '',
  },
})

const flattenFormValues = (values: FormValues): FlatDefaults => ({
  'asset_setting.type': values.asset_setting.type,
  'asset_setting.endpoint': values.asset_setting.endpoint,
  'asset_setting.region': values.asset_setting.region,
  'asset_setting.bucket': values.asset_setting.bucket,
  'asset_setting.access_key': values.asset_setting.access_key,
  'asset_setting.secret_key': values.asset_setting.secret_key,
  'asset_setting.path_prefix': values.asset_setting.path_prefix,
  'asset_setting.custom_domain': values.asset_setting.custom_domain,
  'asset_setting.force_path_style': values.asset_setting.force_path_style,
  'asset_setting.volc_access_key': values.asset_setting.volc_access_key,
  'asset_setting.volc_secret_key': values.asset_setting.volc_secret_key,
})

type MaterialLibrarySectionProps = {
  defaultValues: FlatDefaults
}

export function MaterialLibrarySection({
  defaultValues,
}: MaterialLibrarySectionProps) {
  const updateOption = useUpdateOption()

  const formDefaults = useMemo(
    () => buildFormDefaults(defaultValues),
    [defaultValues]
  )

  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: formDefaults,
  })

  useResetForm(form, formDefaults)

  const onSubmit = async (values: FormValues) => {
    const flattened = flattenFormValues(values)
    const updates: Array<{ key: string; value: string | boolean }> = []

    for (const key of Object.keys(flattened) as Array<keyof FlatDefaults>) {
      const value = flattened[key]
      const initialValue = defaultValues[key]

      if (PASSWORD_KEYS.includes(key) && value === '') {
        continue
      }

      if (value !== initialValue) {
        updates.push({ key, value })
      }
    }

    if (updates.length === 0) {
      toast.info('没有需要保存的更改')
      return
    }

    for (const update of updates) {
      await updateOption.mutateAsync(update)
    }
  }

  return (
    <SettingsSection title='存储配置'>
      <Form {...form}>
        <SettingsForm onSubmit={form.handleSubmit(onSubmit)}>
          <SettingsPageFormActions
            onSave={form.handleSubmit(onSubmit)}
            isSaving={updateOption.isPending}
            saveLabel='保存存储配置'
          />

          <SettingsCard title='对象存储配置（S3/OSS/MinIO/TOS）'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='asset_setting.type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>存储类型</FormLabel>
                    <Select
                      items={STORAGE_TYPE_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectGroup>
                          {STORAGE_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      选择对象存储服务类型，本地存储无需填写下方配置。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='asset_setting.endpoint'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint</FormLabel>
                    <FormControl>
                      <Input
                        type='url'
                        placeholder='如 https://oss-cn-shanghai.aliyuncs.com'
                        autoComplete='off'
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      S3 兼容端点地址。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='asset_setting.region'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>区域</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='如 cn-shanghai'
                        autoComplete='off'
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='asset_setting.bucket'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>桶名</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='如 my-assets-bucket'
                        autoComplete='off'
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='asset_setting.access_key'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Key</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='输入新值以更新'
                        autoComplete='new-password'
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      S3 访问密钥 ID。留空保持现有值不变。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='asset_setting.secret_key'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Key</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='输入新值以更新'
                        autoComplete='new-password'
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      S3 访问密钥。留空保持现有值不变。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='asset_setting.path_prefix'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>对象 key 前缀</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='如 assets/'
                        autoComplete='off'
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='asset_setting.custom_domain'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>自定义访问域名</FormLabel>
                    <FormControl>
                      <Input
                        type='url'
                        placeholder='CDN 域名（可选）'
                        autoComplete='off'
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      用于生成素材访问 URL 的自定义域名（CDN）。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='asset_setting.force_path_style'
                render={({ field }) => (
                  <SettingsSwitchItem>
                    <SettingsSwitchContent>
                      <FormLabel>强制路径风格</FormLabel>
                      <FormDescription>
                        MinIO 等兼容 S3 的服务通常需要开启。
                      </FormDescription>
                    </SettingsSwitchContent>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </SettingsSwitchItem>
                )}
              />
            </div>
          </SettingsCard>

          <SettingsCard title='火山引擎方舟素材库 AK/SK'>
            <div className='space-y-4'>
              <p className='text-muted-foreground text-sm'>
                方舟素材 API 仅支持 AK/SK 鉴权（非 API
                Key），请在火山引擎控制台 IAM &gt; 密钥管理 获取。
              </p>

              <FormField
                control={form.control}
                name='asset_setting.volc_access_key'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volc Access Key</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='输入新值以更新'
                        autoComplete='new-password'
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      火山引擎 Access Key。留空保持现有值不变。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='asset_setting.volc_secret_key'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volc Secret Key</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='输入新值以更新'
                        autoComplete='new-password'
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      火山引擎 Secret Key。留空保持现有值不变。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsCard>
        </SettingsForm>
      </Form>
    </SettingsSection>
  )
}
