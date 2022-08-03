import { useCallback, useEffect, useState } from 'react'

import { MetadataDataType } from '../metaplex'
import useOwnerNFT from './useOwnerNFT'

const useOwnerNftByCollection = (
  ownerPublickey: string,
  collectionAddress?: string,
) => {
  const { nfts } = useOwnerNFT(ownerPublickey)
  const [nftsFiltered, setNftsFiltered] =
    useState<Record<string, MetadataDataType[]>>()
  const [nftsSortByCollection, setNftsSortByCollection] =
    useState<MetadataDataType[]>()

  const filterNFTsByCollection = useCallback(async () => {
    let listNFTs: Record<string, MetadataDataType[]> = {}
    nfts?.forEach((nft: MetadataDataType) => {
      if (nft.collection) {
        return (listNFTs[nft.collection.key] = listNFTs[nft.collection.key]
          ? [...listNFTs[nft.collection.key], nft]
          : [nft])
      }
      return (listNFTs[`unknown`] = listNFTs[`unknown`]
        ? [...listNFTs[`unknown`], nft]
        : [nft])
    })
    let listNftsSortByCollection: MetadataDataType[] = []
    if (collectionAddress) {
      Array.prototype.push.apply(
        listNftsSortByCollection,
        listNFTs[collectionAddress],
      )
    } else {
      Object.keys(listNFTs).map((collection) =>
        Array.prototype.push.apply(
          listNftsSortByCollection,
          listNFTs[collection],
        ),
      )
    }
    setNftsSortByCollection(listNftsSortByCollection)
    return setNftsFiltered(listNFTs)
  }, [collectionAddress, nfts])

  useEffect(() => {
    filterNFTsByCollection()
  }, [filterNFTsByCollection])

  return { nfts: nftsFiltered, nftsSortByCollection }
}

export default useOwnerNftByCollection
