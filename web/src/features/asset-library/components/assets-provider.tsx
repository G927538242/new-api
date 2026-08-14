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
import React, { useState } from 'react'

import useDialogState from '@/hooks/use-dialog'

import type { Asset, AssetChannel, AssetGroup, AssetsDialogType } from '../types'

type AssetsContextType = {
  open: AssetsDialogType | null
  setOpen: (str: AssetsDialogType | null) => void
  currentRow: Asset | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Asset | null>>
  currentGroupId: number | null
  setCurrentGroupId: React.Dispatch<React.SetStateAction<number | null>>
  currentGroup: AssetGroup | null
  setCurrentGroup: React.Dispatch<React.SetStateAction<AssetGroup | null>>
  currentModel: string
  setCurrentModel: React.Dispatch<React.SetStateAction<string>>
  // 素材上游渠道：当前模型自动归属的渠道
  channels: AssetChannel[]
  setChannels: React.Dispatch<React.SetStateAction<AssetChannel[]>>
  currentChannel: AssetChannel | null
  setCurrentChannel: React.Dispatch<React.SetStateAction<AssetChannel | null>>
  refreshTrigger: number
  triggerRefresh: () => void
  groupsRefreshTrigger: number
  triggerGroupsRefresh: () => void
}

const AssetsContext = React.createContext<AssetsContextType | null>(null)

export function AssetsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<AssetsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Asset | null>(null)
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null)
  const [currentGroup, setCurrentGroup] = useState<AssetGroup | null>(null)
  const [currentModel, setCurrentModel] = useState<string>('')
  const [channels, setChannels] = useState<AssetChannel[]>([])
  const [currentChannel, setCurrentChannel] = useState<AssetChannel | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [groupsRefreshTrigger, setGroupsRefreshTrigger] = useState(0)

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1)
  const triggerGroupsRefresh = () =>
    setGroupsRefreshTrigger((prev) => prev + 1)

  return (
    <AssetsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        currentGroupId,
        setCurrentGroupId,
        currentGroup,
        setCurrentGroup,
        currentModel,
        setCurrentModel,
        channels,
        setChannels,
        currentChannel,
        setCurrentChannel,
        refreshTrigger,
        triggerRefresh,
        groupsRefreshTrigger,
        triggerGroupsRefresh,
      }}
    >
      {children}
    </AssetsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAssets = () => {
  const assetsContext = React.useContext(AssetsContext)

  if (!assetsContext) {
    throw new Error('useAssets has to be used within <AssetsProvider>')
  }

  return assetsContext
}
