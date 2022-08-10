import { useCallback, useEffect, useState } from 'react'
import { DataLoader, util } from '@sentre/senhub'

import metaplexNFT, { MetadataType } from '../metaplex'

export type Attribute = {
  trait_type: string
  value: string
}
export type NFTInfo = {
  name: string
  image: string
  symbol: string
  attributes: Attribute[]
  description: string
  external_url: string
}

const useNftMetaData = (mintAddress: string) => {
  const [metaData, setMetaData] = useState<MetadataType>()
  const [nftInfo, setNftInfo] = useState<NFTInfo>()
  const [loading, setLoading] = useState(false)
  const [isUnknownNFT, setIsUnknownNFT] = useState(false)

  const getMetaData = useCallback(async () => {
    if (!util.isAddress(mintAddress)) {
      setMetaData(undefined)
      return setNftInfo(undefined)
    }
    setLoading(true)
    try {
      const metaplex = new metaplexNFT()
      const metadata = await DataLoader.load(
        'getNftMetadata' + mintAddress,
        () => metaplex.getNftMetadata(mintAddress),
      )
      setMetaData(metadata)

      const url = metadata.data.data.uri
      const response = await DataLoader.load(
        'getNftMetadataUrl' + mintAddress,
        // Error with axios
        () => fetch(url).then((val) => val.json()),
      )
      setNftInfo(response)
    } catch (error: any) {
      setIsUnknownNFT(true)
    } finally {
      setLoading(false)
    }
  }, [mintAddress])

  useEffect(() => {
    getMetaData()
  }, [getMetaData])

  return { metadata: metaData, nftInfo, loading, isUnknownNFT }
}

export default useNftMetaData
