import { memo, useCallback, useEffect, useState } from 'react'
import { Address } from '@project-serum/anchor'
import { tokenProvider, util, useInfix, Infix } from '@sentre/senhub'
import { DataLoader } from '@sen-use/web3'

import { Tooltip } from 'antd'
import { metaplexProvider } from 'helper'

const DEFAULT_SYMBOL = 'TOKN'
const MAX_SYMBOL_SIZE = 2
const ENDED_SORT = '...'

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
    const infix = useInfix()

    const isMobile = infix < Infix.sm

    const deriveSymbols = useCallback(async () => {
      if (!util.isAddress(mintAddress.toString()))
        return setSymbol(DEFAULT_SYMBOL)
      // Find atomic tokens
      const token = await tokenProvider.findByAddress(mintAddress)
      if (token) {
        var tokens = await tokenProvider.findAtomicTokens(mintAddress)
      } else {
        tokens = [
          await DataLoader.load(
            'metaplexProvider.findByAddress' + mintAddress.toString(),
            () => metaplexProvider.findByAddress(mintAddress),
          ),
        ]
      }
      const symbols = tokens.map((token) => {
        if (!token?.symbol) return mintAddress.toString().substring(0, 4)
        return token.symbol
      })

      let displaySymbol = symbols.slice(0, MAX_SYMBOL_SIZE).join(separator)
      if (symbols.length > MAX_SYMBOL_SIZE) displaySymbol += ENDED_SORT
      return setSymbol(displaySymbol)
    }, [mintAddress, separator])

    useEffect(() => {
      deriveSymbols()
    }, [deriveSymbols])

    return (
      <Tooltip
        title={symbol}
        visible={!symbol.endsWith(ENDED_SORT) || isMobile ? false : undefined}
      >
        <span>{symbol}</span>
      </Tooltip>
    )
  },
)

export default MintSymbol
