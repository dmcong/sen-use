import { memo, useCallback, useEffect, useState } from 'react'
import { Address } from '@project-serum/anchor'
import { util } from '@sentre/senhub'

import { useGetMintPrice } from 'hooks/mint/useGetPrice'

const MintPrice = ({
  mintAddress,
  format = '$0,0.[0000]',
}: {
  mintAddress: Address
  format?: string
}) => {
  const [price, setPrice] = useState('--')
  const getMintPrice = useGetMintPrice()

  const updateMintPrice = useCallback(async () => {
    const price = await getMintPrice(mintAddress)
    return setPrice(util.numeric(price).format(format))
  }, [format, mintAddress, getMintPrice])
  useEffect(() => {
    updateMintPrice()
  }, [updateMintPrice])

  return <span>{util.numeric(price).format(format)}</span>
}

export default memo(MintPrice)
