import { useCallback, useEffect, useState } from 'react'
import { account } from '@senswap/sen-js'
import { useUI } from '@sentre/senhub'

import { Tooltip } from 'antd'

import { tokenProviderGlobal } from './tokenProviderGlobal'

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
  const [shortenSymbol, setShortenSymbol] = useState(DEFAULT_SYMBOL)
  const {
    ui: { width },
  } = useUI()

  const isMobile = width < 575

  const deriveSymbol = useCallback(async (address: string) => {
    const tokens = await tokenProviderGlobal.findAtomicTokens(address)
    const symbols = tokens.map((token) => {
      if (!token?.symbol) return address.substring(0, 4)
      return token.symbol
    })
    return symbols
  }, [])

  const deriveSymbols = useCallback(async () => {
    if (!account.isAddress(mintAddress)) return setSymbol(DEFAULT_SYMBOL)

    // Normal mint
    const symbols = await deriveSymbol(mintAddress)
    const maxSymbolDisplay = 2
    const shortenSymbol = symbols.slice(0, maxSymbolDisplay)

    setShortenSymbol(shortenSymbol.join(separator))
    return setSymbol(symbols.join(separator))
  }, [mintAddress, deriveSymbol, separator])

  useEffect(() => {
    deriveSymbols()
  }, [deriveSymbols])

  return (
    <Tooltip
      title={symbol}
      visible={shortenSymbol === symbol || isMobile ? false : undefined}
    >
      <span>
        {shortenSymbol}
        {shortenSymbol !== symbol ? '...' : ' '}
      </span>
    </Tooltip>
  )
}

export default MintSymbol
