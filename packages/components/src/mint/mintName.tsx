import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { account } from '@senswap/sen-js'
import { useMint, usePool } from '@sentre/senhub'
import { Address } from '@project-serum/anchor'

const DEFAULT_NAME = 'Unknown Token'

type MintNameProps = {
  mintAddress: Address
  separator?: string
  reversed?: boolean
}

/**
 * Mint/Token name, supporting LP tokens
 * @param mintAddress -  Mint address
 * @param separator - (Optional) In case of LP tokens, the names is combined by 2 token names. The separator is to separate them.
 * @param reversed - (Optional) The default LP token names is A-B. The reversed is to change it to B-A
 * @returns name
 */
const MintName = memo(
  ({ mintAddress, separator = ' • ', reversed = false }: MintNameProps) => {
    const [name, setName] = useState(DEFAULT_NAME)
    const { tokenProvider } = useMint()
    const { pools } = usePool()

    const mint = useMemo(() => mintAddress.toString(), [mintAddress])

    const deriveName = useCallback(
      async (address: string) => {
        const token = await tokenProvider.findByAddress(address)
        if (token?.name) return token.name
        return DEFAULT_NAME
      },
      [tokenProvider],
    )

    const deriveNames = useCallback(async () => {
      if (!account.isAddress(mint)) return setName(DEFAULT_NAME)
      // LP mint
      const poolData = Object.values(pools || {}).find(
        ({ mint_lpt }) => mint_lpt === mint,
      )
      if (poolData) {
        const { mint_a, mint_b } = poolData
        const names = await Promise.all([mint_a, mint_b].map(deriveName))
        if (reversed) names.reverse()
        return setName(`${names.join(separator)} LP`)
      }
      // Normal mint
      const name = await deriveName(mint)
      return setName(name)
    }, [mint, reversed, deriveName, pools, separator])

    useEffect(() => {
      deriveNames()
    }, [deriveNames])

    return <span>{name}</span>
  },
)

export default MintName
