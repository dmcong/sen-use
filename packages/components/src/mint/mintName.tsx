import { memo, useCallback, useEffect, useState } from 'react'
import { Address } from '@project-serum/anchor'
import { tokenProvider, useUI, util } from '@sentre/senhub'

import { Tooltip } from 'antd'

const DEFAULT_NAME = 'Unknown Token'

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
    const [shortenName, setShortenName] = useState(DEFAULT_NAME)
    const {
      ui: { width },
    } = useUI()

    const isMobile = width < 575

    const deriveNames = useCallback(async () => {
      if (!util.isAddress(mintAddress.toString())) return setName(DEFAULT_NAME)

      const tokens = await tokenProvider.findAtomicTokens(mintAddress)
      const names = tokens.map((token) => token?.name || DEFAULT_NAME)

      // Normal mint
      const maxNameDisplay = 2
      const shortenName = names.slice(0, maxNameDisplay)

      setShortenName(shortenName.join(separator))
      return setName(names.join(separator))
    }, [mintAddress, separator])

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
  },
)

export default MintName
