import { Address } from '@project-serum/anchor'
import { useGetMintDecimals as useGetMintDecimalsRaw } from '@sentre/senhub'
import { useCallback } from 'react'

export const useGetMintDecimals = () => {
  const getMintDecimalsRaw = useGetMintDecimalsRaw()

  const getMintDecimals = useCallback(
    async ({
      mintAddress,
      force,
    }: {
      mintAddress: Address
      force?: boolean
    }) => {
      const decimals = await getMintDecimalsRaw({
        mintAddress: mintAddress.toString(),
        force,
      })
      if (!decimals) {
        console.error('getMintDecimals: ', mintAddress)
        throw new Error("Can't get mint decimals")
      }
      return decimals
    },
    [getMintDecimalsRaw],
  )

  return getMintDecimals
}
