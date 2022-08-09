import { useCallback, useEffect, useState } from 'react'
import { useAccount, DataLoader } from '@sentre/senhub'

import metaplexNFT, { MetadataDataType } from '../metaplex'
import { BN } from 'bn.js'

const useNFTsByOwner = (ownerPublickey: string) => {
  const [nfts, setNfts] = useState<MetadataDataType[]>()
  const [nftsFiltered, setNftFiltered] = useState<MetadataDataType[]>()
  const { accounts } = useAccount()

  const fetchNFTs = useCallback(async () => {
    if (!ownerPublickey) return setNfts(undefined)
    const metaplex = new metaplexNFT()
    const nftsFetching = await DataLoader.load(
      'findDataByOwner' + ownerPublickey,
      () => metaplex.findDataByOwner(ownerPublickey),
    )
    setNfts(nftsFetching)
  }, [ownerPublickey])

  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  const filterNFTs = useCallback(async () => {
    if (!nfts) return setNftFiltered(undefined)
    const { splt } = window.sentre
    let nftsFiltered: MetadataDataType[] = []
    await Promise.all(
      nfts.map(async (nft: MetadataDataType) => {
        const nftTokenAccount = await splt.deriveAssociatedAddress(
          ownerPublickey,
          nft.mint,
        )
        let nftAccountData = accounts[nftTokenAccount]
        if (new BN(nftAccountData?.amount.toString()).eq(new BN(1))) {
          nftsFiltered.push(nft)
        }
      }),
    )
    return setNftFiltered(nftsFiltered)
  }, [accounts, nfts, ownerPublickey])

  useEffect(() => {
    filterNFTs()
  }, [filterNFTs])

  return { nfts: nftsFiltered }
}

export default useNFTsByOwner
