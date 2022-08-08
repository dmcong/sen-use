import { useMemo, useState } from 'react'
import { useWallet } from '@sentre/senhub'
import LazyLoad from '@sentre/react-lazyload'

import { Col, Empty, Row } from 'antd'
import CardNFT from '../../cardNFT'
import SearchEngine from '../search/searchEngine'

import useNFTsByOwnerAndCollection from '../../hooks/useNFTsByOwnerAndCollection'

export type ListNFTsProps = {
  searchText: string
  hiddenUnknownNFTs?: boolean
  onSelect: (mintAddress: string) => void
  collectionAddress?: string
}

const ListNFTs = ({
  searchText,
  hiddenUnknownNFTs,
  onSelect,
  collectionAddress = '',
}: ListNFTsProps) => {
  const [listNFTsUnknown, setListNFTsUnknown] = useState<
    Record<string, boolean>
  >({})

  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { nftsSortByCollection: nfts } = useNFTsByOwnerAndCollection(
    walletAddress,
    collectionAddress,
  )

  const onSelectNFT = (mintAddress: string) => {
    onSelect(mintAddress)
  }

  const addUnknownNFT = (mintNFT: string) => {
    if (listNFTsUnknown[mintNFT]) return
    const nftsUnknown = Object.assign(listNFTsUnknown, {
      [mintNFT]: true,
    })
    setListNFTsUnknown(JSON.parse(JSON.stringify(nftsUnknown)))
  }

  const filteredList = useMemo(() => {
    if (!nfts) return []
    let nftsCheckCondition = nfts
    if (hiddenUnknownNFTs)
      nftsCheckCondition = nfts.filter((nft) => !listNFTsUnknown[nft.mint])
    if (!searchText.length) return nftsCheckCondition

    const engine = new SearchEngine(nftsCheckCondition)
    const filtered = engine.search(searchText)
    return filtered
  }, [hiddenUnknownNFTs, listNFTsUnknown, nfts, searchText])

  return (
    <Row gutter={[24, 24]} className="scrollbar" style={{ height: 300 }}>
      {filteredList?.length ? (
        filteredList.map((nft) => (
          <Col xs={12} md={8} style={{ textAlign: 'center' }} key={nft.mint}>
            <LazyLoad height={100} overflow throttle={300}>
              <CardNFT
                mintAddress={nft.mint}
                onSelect={onSelectNFT}
                addUnknownNFT={addUnknownNFT}
              />
            </LazyLoad>
          </Col>
        ))
      ) : (
        <Col span={24} style={{ textAlign: 'center' }}>
          <Empty style={{ padding: 40 }} />
        </Col>
      )}
    </Row>
  )
}

export default ListNFTs
