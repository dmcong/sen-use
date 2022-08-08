import { useCallback, useEffect, useState } from 'react'

import { MetadataDataType } from '../metaplex'
import useNFTsByOwner from './useNFTsByOwner'

const useNFTsByOwnerAndCollection = (
  ownerPublickey: string,
  collectionAddress?: string[],
) => {
  const { nfts } = useNFTsByOwner(ownerPublickey)
  const [nftsGroupByCollection, setNftsGroupByCollection] =
    useState<Record<string, MetadataDataType[]>>()
  const [nftsSortByCollection, setNftsSortByCollection] =
    useState<MetadataDataType[]>()

  const filterNFTsByCollection = useCallback(async () => {
    let listNFTsGroupByCollection: Record<string, MetadataDataType[]> = {}
    nfts?.forEach((nft: MetadataDataType) => {
      if (nft.collection) {
        return (listNFTsGroupByCollection[nft.collection.key] =
          listNFTsGroupByCollection[nft.collection.key]
            ? [...listNFTsGroupByCollection[nft.collection.key], nft]
            : [nft])
      }
      return (listNFTsGroupByCollection[`unknown`] = listNFTsGroupByCollection[
        `unknown`
      ]
        ? [...listNFTsGroupByCollection[`unknown`], nft]
        : [nft])
    })
    let listNftsSortByCollection: MetadataDataType[] = []
    if (collectionAddress?.length) {
      collectionAddress.map((collection) =>
        Array.prototype.push.apply(
          listNftsSortByCollection,
          listNFTsGroupByCollection[collection],
        ),
      )
    } else {
      Object.keys(listNFTsGroupByCollection).map((collection) =>
        Array.prototype.push.apply(
          listNftsSortByCollection,
          listNFTsGroupByCollection[collection],
        ),
      )
    }
    setNftsSortByCollection(listNftsSortByCollection)
    return setNftsGroupByCollection(listNFTsGroupByCollection)
  }, [collectionAddress, nfts])

  useEffect(() => {
    filterNFTsByCollection()
  }, [filterNFTsByCollection])

  return { nftsGroupByCollection, nftsSortByCollection }
}

export default useNFTsByOwnerAndCollection
