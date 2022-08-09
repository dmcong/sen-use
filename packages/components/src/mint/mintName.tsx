import { useCallback, useEffect, useState } from 'react'
import { account } from '@senswap/sen-js'
import { useUI } from '@sentre/senhub'

import { Tooltip } from 'antd'

import { tokenProviderGlobal } from './tokenProviderGlobal'

const DEFAULT_NAME = 'Unknown Token'

/**
 * Mint/Token name, supporting LP tokens
 * @param mintAddress -  Mint address
 * @param separator - (Optional) In case of LP tokens, the names is combined by 2 token names. The separator is to separate them.
 * @param reversed - (Optional) The default LP token names is A-B. The reversed is to change it to B-A
 * @returns name
 */
const MintName = ({
  mintAddress,
  separator = ' • ',
  reversed = false,
}: {
  mintAddress: string
  separator?: string
  reversed?: boolean
}) => {
  const [name, setName] = useState(DEFAULT_NAME)
  const [shortenName, setShortenName] = useState(DEFAULT_NAME)
  const {
    ui: { width },
  } = useUI()

  const isMobile = width < 575
  const deriveName = useCallback(async (address: string) => {
    const tokens = await tokenProviderGlobal.findAtomicTokens(address)
    const names = tokens.map((token) => {
      if (!token?.name) return DEFAULT_NAME
      return token.name
    })
    return names
  }, [])

  const deriveNames = useCallback(async () => {
    if (!account.isAddress(mintAddress)) return setName(DEFAULT_NAME)

    // Normal mint
    const listName = await deriveName(mintAddress)
    const maxNameDisplay = 2
    const shortenName = listName.slice(0, maxNameDisplay)

    setShortenName(shortenName.join(separator))
    return setName(listName.join(separator))
  }, [mintAddress, deriveName, separator])

  useEffect(() => {
    deriveNames()
  }, [deriveNames])

  return (
    <Tooltip
      title={name}
      visible={shortenName === name || isMobile ? false : undefined}
    >
      <span>
        {shortenName}
        {shortenName !== name ? '...' : ' '}
      </span>
    </Tooltip>
  )
}

export default MintName
