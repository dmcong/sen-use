import { useCallback, useEffect, useState } from 'react'
import { account } from '@senswap/sen-js'
import { tokenProvider } from '@sentre/senhub'

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

  const deriveName = useCallback(async (address: string) => {
    const token = await tokenProvider.findByAddress(address)
    if (token?.name) return token.name
    return DEFAULT_NAME
  }, [])

  const deriveNames = useCallback(async () => {
    if (!account.isAddress(mintAddress)) return setName(DEFAULT_NAME)

    // Normal mint
    const name = await deriveName(mintAddress)
    return setName(name)
  }, [mintAddress, deriveName])

  useEffect(() => {
    deriveNames()
  }, [deriveNames])

  return <span>{name}</span>
}

export default MintName
