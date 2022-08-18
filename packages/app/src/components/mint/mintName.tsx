import { memo, useCallback, useEffect, useState } from 'react'
import { Address } from '@project-serum/anchor'
import { tokenProvider, useUI, util } from '@sentre/senhub'
import { DataLoader } from '@sen-use/web3'

import { Tooltip } from 'antd'
import { metaplexProvider } from 'helper'

const DEFAULT_NAME = 'Unknown Token'
const MAX_NAME_SIZE = 2
const ENDED_SORT = '...'
/**
 * Mint/Token name, supporting LP tokens
 * @param mintAddress -  Mint address
 * @param separator - (Optional) In case of LP tokens, the names is combined by 2 token names. The separator is to separate them.
 * @param reversed - (Optional) The default LP token names is A-B. The reversed is to change it to B-A
 * @returns name
 */
const MintName = memo(
  ({
    mintAddress,
    separator = ' • ',
    reversed = false,
  }: {
    mintAddress: Address
    separator?: string
    reversed?: boolean
  }) => {
    const [name, setName] = useState(DEFAULT_NAME)
    const {
      ui: { width },
    } = useUI()

    const isMobile = width < 575

    const deriveNames = useCallback(async () => {
      if (!util.isAddress(mintAddress.toString())) return setName(DEFAULT_NAME)
      // Find atomic tokens
      let tokens = await tokenProvider.findAtomicTokens(mintAddress)
      if (!tokens) {
        tokens = [
          await DataLoader.load(
            'metaplexProvider.findByAddress' + mintAddress.toString(),
            () => metaplexProvider.findByAddress(mintAddress),
          ),
        ]
      }
      // Get name in token info
      const names = tokens.map((token) => token?.name || DEFAULT_NAME)
      // Build mint name
      let displayName = names.slice(0, MAX_NAME_SIZE).join(separator)
      if (names.length > MAX_NAME_SIZE) displayName += ENDED_SORT
      return setName(displayName)
    }, [mintAddress, separator])

    useEffect(() => {
      deriveNames()
    }, [deriveNames])

    return (
      <Tooltip
        title={name}
        visible={name.endsWith(ENDED_SORT) || isMobile ? false : undefined}
      >
        <span>{name}</span>
      </Tooltip>
    )
  },
)

export default MintName
