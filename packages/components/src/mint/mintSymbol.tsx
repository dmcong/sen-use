import { useCallback, useEffect, useState } from 'react'
import { account } from '@senswap/sen-js'
import { tokenProvider } from '@sentre/senhub'

const DEFAULT_SYMBOL = 'TOKN'

/**
 * Mint/Token symbol, supporting LP tokens
 * @param mintAddress -  Mint address
 * @param separator - (Optional) In case of LP tokens, the symbols is combined by 2 token symbols. The separator is to separate them.
 * @param reversed - (Optional) The default LP token symbol is A-B. The reversed is to change it to B-A
 * @returns symbol
 */
const MintSymbol = ({
  mintAddress,
  separator = ' • ',
  reversed = false,
}: {
  mintAddress: string
  separator?: string
  reversed?: boolean
}) => {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL)

  const deriveSymbol = useCallback(async (address: string) => {
    const token = await tokenProvider.findByAddress(address)
    if (token?.symbol) return token.symbol
    return address.substring(0, 4)
  }, [])

  const deriveSymbols = useCallback(async () => {
    if (!account.isAddress(mintAddress)) return setSymbol(DEFAULT_SYMBOL)

    // Normal mint
    const symbol = await deriveSymbol(mintAddress)
    return setSymbol(symbol)
  }, [mintAddress, deriveSymbol])

  useEffect(() => {
    deriveSymbols()
  }, [deriveSymbols])

  return <span>{symbol + ' '}</span>
}

export default MintSymbol
