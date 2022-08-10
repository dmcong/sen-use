import { useCallback, useEffect, useState } from 'react'
import { utilsBN } from '@sen-use/web3'
import { Address, BN } from '@project-serum/anchor'
import { tokenProvider, useGetMintDecimals, util } from '@sentre/senhub'

export const useMintPrice = (mintAddress: Address) => {
  const getMintDecimals = useGetMintDecimals()
  const [price, setPrice] = useState<number>()

  const getJupiterPrice = useCallback(
    async (addressToken: string) => {
      const priceUrl = `https://quote-api.jup.ag/v1/quote?inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputMint=${addressToken}&amount=1000000&slippage=1`
      const { data } = await (await fetch(priceUrl)).json()
      const decimals = await getMintDecimals({
        mintAddress: mintAddress.toString(),
      })
      const bestOutput = await utilsBN.undecimalize(
        new BN(data[0].outAmount),
        decimals || 0,
      )
      return setPrice(1 / Number(bestOutput))
    },
    [getMintDecimals, mintAddress],
  )

  const getTokenPrice = useCallback(async () => {
    try {
      const token = await tokenProvider.findByAddress(mintAddress)
      const ticket = token?.extensions?.coingeckoId
      if (!!ticket) {
        const CGKTokenInfo = await util.fetchCGK(ticket)
        const price = CGKTokenInfo.price
        if (price) return price
      }
    } catch (err) {}
    let jupiterPrice = await getJupiterPrice(mintAddress.toString())
    return jupiterPrice
  }, [getJupiterPrice, mintAddress])

  useEffect(() => {
    getTokenPrice()
  }, [getTokenPrice])

  return price
}
