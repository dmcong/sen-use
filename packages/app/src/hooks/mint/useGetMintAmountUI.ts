import { useCallback } from 'react'
import { Address, BN } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'

import { useGetMintDecimals } from './useGetMintDecimals'

export const useGetMintAmountUI = () => {
  const getMintDecimals = useGetMintDecimals()

  const getMintAmountUI = useCallback(
    async (mintAddress: Address, amount: BN) => {
      const decimals = await getMintDecimals({ mintAddress })
      const amountUI = utilsBN.undecimalize(amount, decimals)
      return amountUI
    },
    [getMintDecimals],
  )

  return getMintAmountUI
}
