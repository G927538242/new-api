import React, { useState } from 'react'

import type { SubAccount } from '../types'

export type SubAccountsDialogType =
  | 'create'
  | 'edit'
  | 'manage'
  | 'status'
  | 'delete'
  | null

type SubAccountsContextType = {
  open: SubAccountsDialogType
  setOpen: (v: SubAccountsDialogType) => void
  currentRow: SubAccount | null
  setCurrentRow: React.Dispatch<React.SetStateAction<SubAccount | null>>
  refreshTrigger: number
  triggerRefresh: () => void
}

const SubAccountsContext = React.createContext<SubAccountsContextType | null>(
  null
)

export function SubAccountsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState<SubAccountsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<SubAccount | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1)

  return (
    <SubAccountsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </SubAccountsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSubAccounts = () => {
  const context = React.useContext(SubAccountsContext)
  if (!context) {
    throw new Error('useSubAccounts has to be used within <SubAccountsProvider>')
  }
  return context
}
