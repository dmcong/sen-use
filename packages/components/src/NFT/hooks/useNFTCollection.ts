import { useCallback, useEffect, useState } from 'react'

import { MetadataDataType } from '../metaplex'
import useNftMetaData from './useNftMetaData'
import useNFTsByOwner from './useNFTsByOwner'

export type useNFTCollectionProps = {
  ownerPublickey: string
  searchCollectionAddress?: string
}

export const useNFTCollection = ({
  ownerPublickey,
  searchCollectionAddress = '',
}: useNFTCollectionProps) => {
  const { nfts } = useNFTsByOwner(ownerPublickey)
  const { metadata: nftMetaData } = useNftMetaData(searchCollectionAddress)
  const [nftsCollection, setNFTsCollection] =
    useState<Record<string, MetadataDataType[]>>()

  const filterNFTsByCollection = useCallback(async () => {
    let collectionNFTs: Record<string, MetadataDataType[]> = {}

    if (searchCollectionAddress.length > 0 && nftMetaData?.data) {
      collectionNFTs[nftMetaData.data.mint] = [nftMetaData.data]
    } else {
      nfts?.forEach((nft: MetadataDataType) => {
        if (nft.collection) {
          return (collectionNFTs[nft.collection.key] = collectionNFTs[
            nft.collection.key
          ]
            ? [...collectionNFTs[nft.collection.key], nft]
            : [nft])
        }
      })
    }
    return setNFTsCollection(collectionNFTs)
  }, [nftMetaData?.data, nfts, searchCollectionAddress.length])

  useEffect(() => {
    filterNFTsByCollection()
  }, [filterNFTsByCollection])

  return { collections: nftsCollection }
}

export default useNFTCollection
