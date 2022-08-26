import { useCallback } from 'react'
import { tokenProvider } from '@sentre/senhub'
import { Address, BN } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'

import { useGetMintDecimals } from './useGetMintDecimals'

export const useGetMintPrice = () => {
  const getPrice = useCallback(async (mintAddress: Address) => {
    return tokenProvider.getPrice(mintAddress)
  }, [])
  return getPrice
}

export const useGetTotalValue = () => {
  const getMintDecimals = useGetMintDecimals()
  const getPrice = useGetMintPrice()

  const getTotalValue = useCallback(
    async (mintAddress: Address, amountBN: BN): Promise<number> => {
      try {
        if (!amountBN.gt(new BN(0))) return 0
        const price = await getPrice(mintAddress)
        if (!price) return 0
        const decimals = await getMintDecimals({
          mintAddress: mintAddress.toString(),
        })
        const amount = utilsBN.undecimalize(amountBN, decimals || 0)
        return Number(amount) * price
      } catch (error) {
        return 0
      }
    },
    [getMintDecimals, getPrice],
  )

  return getTotalValue
}
