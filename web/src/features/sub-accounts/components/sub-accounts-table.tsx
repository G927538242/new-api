import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '@/components/empty-state'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatQuota, formatTimestampToDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import { getSubAccounts } from '../api'
import { SUB_ACCOUNT_STATUS_BADGE } from '../constants'
import type { SubAccount } from '../types'
import { useSubAccounts } from './sub-accounts-provider'

const PAGE_SIZE = 10

export function SubAccountsTable() {
  const { t } = useTranslation()
  const { setOpen, setCurrentRow, refreshTrigger } = useSubAccounts()
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['sub-accounts', page, keyword, refreshTrigger],
    queryFn: () => getSubAccounts({ page, page_size: PAGE_SIZE, keyword }),
  })

  const total = data?.data?.total ?? 0
  const items = data?.data?.items ?? []
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const stats = useMemo(() => {
    const enabled = items.filter((i) => i.status === 1).length
    const totalQuota = items.reduce((acc, i) => acc + (i.quota || 0), 0)
    return { enabled, totalQuota }
  }, [items])

  const openManage = (row: SubAccount) => {
    setCurrentRow(row)
    setOpen('manage')
  }

  const openEdit = (row: SubAccount) => {
    setCurrentRow(row)
    setOpen('edit')
  }

  const openStatus = (row: SubAccount) => {
    setCurrentRow(row)
    setOpen('status')
  }

  const openDelete = (row: SubAccount) => {
    setCurrentRow(row)
    setOpen('delete')
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>
            {t('Total')}: <span className='font-medium text-foreground'>{total}</span>
          </span>
          <span className='text-border'>|</span>
          <span>
            {t('Enabled')}:{' '}
            <span className='font-medium text-foreground'>{stats.enabled}</span>
          </span>
          <span className='hidden text-border sm:inline'>|</span>
          <span className='hidden sm:inline'>
            {t('Allocated Quota')}:{' '}
            <span className='font-medium text-foreground'>
              {formatQuota(stats.totalQuota)}
            </span>
          </span>
        </div>
        <div className='relative w-full sm:w-64'>
          <Search className='text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2' />
          <Input
            placeholder={t('Search sub-account')}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
              setPage(1)
            }}
            className='pl-8'
          />
        </div>
      </div>

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('ID')}</TableHead>
              <TableHead>{t('Username')}</TableHead>
              <TableHead>{t('Display Name')}</TableHead>
              <TableHead>{t('Status')}</TableHead>
              <TableHead className='text-right'>{t('Quota')}</TableHead>
              <TableHead className='text-right'>{t('Used')}</TableHead>
              <TableHead className='text-right'>{t('Requests')}</TableHead>
              <TableHead>{t('Created')}</TableHead>
              <TableHead className='text-right'>{t('Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className='h-24 text-center text-sm text-muted-foreground'>
                  {t('Loading')}...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className='h-24 p-0'>
                  <EmptyState
                    title={keyword ? t('No matching sub-accounts') : t('No sub-accounts yet')}
                    description={
                      keyword
                        ? t('Try a different keyword')
                        : t('Create a sub-account to get started')
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const statusConfig = SUB_ACCOUNT_STATUS_BADGE[item.status]
                return (
                  <TableRow key={item.id}>
                    <TableCell className='text-muted-foreground'>{item.id}</TableCell>
                    <TableCell className='font-medium'>{item.username}</TableCell>
                    <TableCell className='text-muted-foreground'>
                      {item.display_name || '-'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={statusConfig?.label ?? String(item.status)}
                        variant={statusConfig?.variant ?? 'neutral'}
                        copyable={false}
                      />
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatQuota(item.quota)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums text-muted-foreground'>
                      {formatQuota(item.used_quota)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums text-muted-foreground'>
                      {item.request_count ?? 0}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {formatTimestampToDate(item.created_at)}
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant='ghost' size='sm' className='h-7 px-2 text-xs' />}
                        >
                          {t('Actions')}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-40'>
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>{item.username}</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEdit(item)}>
                            {t('Edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openManage(item)}>
                            {t('Quota & Password')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {item.status === 1 ? (
                            <DropdownMenuItem
                              className='text-destructive'
                              onClick={() => openStatus(item)}
                            >
                              {t('Disable')}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className='text-success'
                              onClick={() => openStatus(item)}
                            >
                              {t('Enable')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => openDelete(item)}
                          >
                            {t('Delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className={cn('flex justify-end')}>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {page > 1 && (
                  <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
                )}
              </PaginationItem>
              <PaginationItem>
                <span className='text-muted-foreground px-3 text-sm'>
                  {page} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                {page < totalPages && (
                  <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
