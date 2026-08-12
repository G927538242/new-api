import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Dialog } from '@/components/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatQuota, parseQuotaFromDollars } from '@/lib/format'

import { createSubAccount, manageSubAccount, updateSubAccount } from '../api'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants'
import { useSubAccounts } from './sub-accounts-provider'

// ============================================================================
// 创建子账户
// ============================================================================

function CreateSubAccountDialog() {
  const { t } = useTranslation()
  const { open, setOpen, triggerRefresh } = useSubAccounts()
  const isOpen = open === 'create'
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: '',
    display_name: '',
    quota: '',
    remark: '',
  })

  useEffect(() => {
    if (isOpen) {
      setForm({ username: '', password: '', display_name: '', quota: '', remark: '' })
    }
  }, [isOpen])

  const handleSubmit = async () => {
    const username = form.username.trim()
    const password = form.password.trim()
    if (!username) {
      toast.error(t(ERROR_MESSAGES.USERNAME_REQUIRED))
      return
    }
    if (password.length < 8 || password.length > 20) {
      toast.error(t(ERROR_MESSAGES.PASSWORD_INVALID))
      return
    }
    const quota = form.quota === '' ? 0 : parseQuotaFromDollars(Number(form.quota))
    if (quota < 0 || Number.isNaN(quota)) {
      toast.error(t(ERROR_MESSAGES.QUOTA_INVALID))
      return
    }
    setIsSaving(true)
    try {
      const res = await createSubAccount({
        username,
        password,
        display_name: form.display_name.trim() || undefined,
        quota,
        remark: form.remark.trim() || undefined,
      })
      if (res.success) {
        toast.success(t(SUCCESS_MESSAGES.CREATED))
        triggerRefresh()
        setOpen(null)
      } else {
        toast.error(res.message || t(ERROR_MESSAGES.CREATE_FAILED))
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.CREATE_FAILED))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => !v && setOpen(null)}
      title={t('Create Sub-account')}
      description={t('Sub-accounts need to complete personal certification before using the API')}
      contentHeight='auto'
      bodyClassName='space-y-4'
      footer={
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setOpen(null)} disabled={isSaving}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className='size-4 animate-spin' />}
            {t('Create')}
          </Button>
        </div>
      }
    >
      <div className='space-y-4'>
        <div className='grid gap-2'>
          <Label htmlFor='sub-username'>
            {t('Username')} <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='sub-username'
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            placeholder={t('Sub-account username')}
            maxLength={20}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='sub-password'>
            {t('Password')} <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='sub-password'
            type='password'
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder={t('8-20 characters')}
            maxLength={20}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='sub-display-name'>{t('Display Name')}</Label>
          <Input
            id='sub-display-name'
            value={form.display_name}
            onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
            maxLength={20}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='sub-quota'>{t('Allocate Quota')}</Label>
          <Input
            id='sub-quota'
            type='number'
            min={0}
            step='0.01'
            value={form.quota}
            onChange={(e) => setForm((f) => ({ ...f, quota: e.target.value }))}
            placeholder='0'
          />
          <p className='text-muted-foreground text-xs'>
            {t('Quota is deducted from your balance when creating')}
          </p>
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='sub-remark'>{t('Remark')}</Label>
          <Textarea
            id='sub-remark'
            value={form.remark}
            onChange={(e) => setForm((f) => ({ ...f, remark: e.target.value }))}
            rows={2}
            maxLength={255}
          />
        </div>
      </div>
    </Dialog>
  )
}

// ============================================================================
// 编辑子账户
// ============================================================================

function EditSubAccountDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow, triggerRefresh } = useSubAccounts()
  const isOpen = open === 'edit'
  const [isSaving, setIsSaving] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [remark, setRemark] = useState('')

  useEffect(() => {
    if (isOpen && currentRow) {
      setDisplayName(currentRow.display_name ?? '')
      setRemark(currentRow.remark ?? '')
    }
  }, [isOpen, currentRow])

  const handleSubmit = async () => {
    if (!currentRow) return
    setIsSaving(true)
    try {
      const res = await updateSubAccount(currentRow.id, {
        display_name: displayName.trim(),
        remark: remark.trim(),
      })
      if (res.success) {
        toast.success(t(SUCCESS_MESSAGES.UPDATED))
        triggerRefresh()
        setOpen(null)
      } else {
        toast.error(res.message || t(ERROR_MESSAGES.UPDATE_FAILED))
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.UPDATE_FAILED))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => !v && setOpen(null)}
      title={t('Edit Sub-account')}
      description={currentRow?.username}
      contentHeight='auto'
      bodyClassName='space-y-4'
      footer={
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setOpen(null)} disabled={isSaving}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className='size-4 animate-spin' />}
            {t('Save')}
          </Button>
        </div>
      }
    >
      <div className='space-y-4'>
        <div className='grid gap-2'>
          <Label htmlFor='edit-display-name'>{t('Display Name')}</Label>
          <Input
            id='edit-display-name'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={20}
          />
        </div>
        <div className='grid gap-2'>
          <Label htmlFor='edit-remark'>{t('Remark')}</Label>
          <Textarea
            id='edit-remark'
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={2}
            maxLength={255}
          />
        </div>
      </div>
    </Dialog>
  )
}

// ============================================================================
// 额度 & 密码管理
// ============================================================================

type ManageMode = 'add_quota' | 'subtract_quota' | 'override_quota' | 'reset_password'

function ManageSubAccountDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow, triggerRefresh } = useSubAccounts()
  const isOpen = open === 'manage'
  const [isSaving, setIsSaving] = useState(false)
  const [mode, setMode] = useState<ManageMode>('add_quota')
  const [quota, setQuota] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMode('add_quota')
      setQuota('')
      setPassword('')
    }
  }, [isOpen])

  const modes: { value: ManageMode; label: string }[] = [
    { value: 'add_quota', label: t('Allocate Quota') },
    { value: 'subtract_quota', label: t('Deduct Quota') },
    { value: 'override_quota', label: t('Override Quota') },
    { value: 'reset_password', label: t('Reset Password') },
  ]

  const handleSubmit = async () => {
    if (!currentRow) return
    if (mode === 'reset_password') {
      if (password.length < 8 || password.length > 20) {
        toast.error(t(ERROR_MESSAGES.PASSWORD_INVALID))
        return
      }
    } else {
      const value = Number(quota)
      if (!Number.isFinite(value) || value <= 0) {
        toast.error(t(ERROR_MESSAGES.QUOTA_INVALID))
        return
      }
    }

    setIsSaving(true)
    try {
      const payload =
        mode === 'reset_password'
          ? { action: mode, value: password }
          : { action: mode, quota: parseQuotaFromDollars(Number(quota)) }
      const res = await manageSubAccount(currentRow.id, payload)
      if (res.success) {
        const msgMap: Record<ManageMode, string> = {
          add_quota: SUCCESS_MESSAGES.QUOTA_ADDED,
          subtract_quota: SUCCESS_MESSAGES.QUOTA_SUBTRACTED,
          override_quota: SUCCESS_MESSAGES.QUOTA_OVERRIDDEN,
          reset_password: SUCCESS_MESSAGES.PASSWORD_RESET,
        }
        toast.success(t(msgMap[mode]))
        triggerRefresh()
        setOpen(null)
      } else {
        toast.error(res.message || t(ERROR_MESSAGES.MANAGE_FAILED))
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.MANAGE_FAILED))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => !v && setOpen(null)}
      title={t('Manage Sub-account')}
      description={
        currentRow
          ? `${currentRow.username} · ${t('Quota')}: ${formatQuota(currentRow.quota)}`
          : undefined
      }
      contentHeight='auto'
      bodyClassName='space-y-4'
      footer={
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setOpen(null)} disabled={isSaving}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className='size-4 animate-spin' />}
            {t('Confirm')}
          </Button>
        </div>
      }
    >
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-2'>
          {modes.map((m) => (
            <Button
              key={m.value}
              type='button'
              variant={mode === m.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => setMode(m.value)}
            >
              {m.label}
            </Button>
          ))}
        </div>

        {mode === 'reset_password' ? (
          <div className='grid gap-2'>
            <Label htmlFor='manage-password'>{t('New Password')}</Label>
            <Input
              id='manage-password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('8-20 characters')}
              maxLength={20}
            />
          </div>
        ) : (
          <div className='grid gap-2'>
            <Label htmlFor='manage-quota'>{t('Quota Amount')}</Label>
            <Input
              id='manage-quota'
              type='number'
              min={0}
              step='0.01'
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              placeholder={t('Enter amount')}
            />
            {mode === 'add_quota' && (
              <p className='text-muted-foreground text-xs'>
                {t('Quota is deducted from your balance')}
              </p>
            )}
            {mode === 'override_quota' && (
              <p className='text-muted-foreground text-xs'>
                {t('Set the sub-account quota to a specific value')}
              </p>
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}

// ============================================================================
// 删除子账户
// ============================================================================

function DeleteSubAccountDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow, triggerRefresh } = useSubAccounts()
  const isOpen = open === 'delete'
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!currentRow) return
    setIsDeleting(true)
    try {
      const res = await manageSubAccount(currentRow.id, { action: 'delete' })
      if (res.success) {
        toast.success(t(SUCCESS_MESSAGES.DELETED))
        triggerRefresh()
        setOpen(null)
      } else {
        toast.error(res.message || t(ERROR_MESSAGES.MANAGE_FAILED))
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.MANAGE_FAILED))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => !v && setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Delete Sub-account')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('Delete sub-account confirmation', {
              username: currentRow?.username ?? '',
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isDeleting && <Loader2 className='size-4 animate-spin' />}
            {t('Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ============================================================================
// 启用 / 禁用子账户
// ============================================================================

function StatusSubAccountDialog() {
  const { t } = useTranslation()
  const { open, setOpen, currentRow, triggerRefresh } = useSubAccounts()
  const isOpen = open === 'status'
  const isEnable = currentRow?.status !== 1
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = async () => {
    if (!currentRow) return
    setIsSaving(true)
    try {
      const res = await manageSubAccount(currentRow.id, {
        action: isEnable ? 'enable' : 'disable',
      })
      if (res.success) {
        toast.success(t(isEnable ? SUCCESS_MESSAGES.ENABLED : SUCCESS_MESSAGES.DISABLED))
        triggerRefresh()
        setOpen(null)
      } else {
        toast.error(res.message || t(ERROR_MESSAGES.MANAGE_FAILED))
      }
    } catch {
      toast.error(t(ERROR_MESSAGES.MANAGE_FAILED))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => !v && setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEnable ? t('Enable Sub-account') : t('Disable Sub-account')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEnable
              ? t('Enable sub-account confirmation', {
                  username: currentRow?.username ?? '',
                })
              : t('Disable sub-account confirmation', {
                  username: currentRow?.username ?? '',
                })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSaving}>{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSaving}
            onClick={(e) => {
              e.preventDefault()
              handleToggle()
            }}
            className={isEnable ? '' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
          >
            {isSaving && <Loader2 className='size-4 animate-spin' />}
            {isEnable ? t('Enable') : t('Disable')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function SubAccountsDialogs() {
  return (
    <>
      <CreateSubAccountDialog />
      <EditSubAccountDialog />
      <ManageSubAccountDialog />
      <StatusSubAccountDialog />
      <DeleteSubAccountDialog />
    </>
  )
}
