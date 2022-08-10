import { memo, useCallback, useEffect, useState } from 'react'
import { Address } from '@project-serum/anchor'
import { tokenProvider, useUI, util } from '@sentre/senhub'

import { Tooltip } from 'antd'

const DEFAULT_SYMBOL = 'TOKN'

/**
 * Mint/Token symbol, supporting LP tokens
 * @param mintAddress -  Mint address
 * @param separator - (Optional) In case of LP tokens, the symbols is combined by 2 token symbols. The separator is to separate them.
 * @param reversed - (Optional) The default LP token symbol is A-B. The reversed is to change it to B-A
 * @returns symbol
 */
const MintSymbol = memo(
  ({
    mintAddress,
    separator = ' • ',
    reversed = false,
  }: {
    mintAddress: Address
    separator?: string
    reversed?: boolean
  }) => {
    const [symbol, setSymbol] = useState(DEFAULT_SYMBOL)
    const [shortenSymbol, setShortenSymbol] = useState(DEFAULT_SYMBOL)
    const {
      ui: { width },
    } = useUI()

    const isMobile = width < 575

    const deriveSymbols = useCallback(async () => {
      if (!util.isAddress(mintAddress.toString()))
        return setSymbol(DEFAULT_SYMBOL)

      const tokens = await tokenProvider.findAtomicTokens(mintAddress)
      const symbols = tokens.map((token) => {
        if (!token?.symbol) return mintAddress.toString().substring(0, 4)
        return token.symbol
      })

      const maxSymbolDisplay = 2
      const shortenSymbol = symbols.slice(0, maxSymbolDisplay)

      setShortenSymbol(shortenSymbol.join(separator))
      return setSymbol(symbols.join(separator))
    }, [mintAddress, separator])

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
  },
)

export default MintSymbol
