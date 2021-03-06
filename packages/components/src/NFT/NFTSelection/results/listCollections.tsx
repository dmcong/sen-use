import { useCallback, useEffect, useMemo } from 'react'
import { useWallet } from '@sentre/senhub'
import { useHistory } from 'react-router-dom'
import LazyLoad from '@sentre/react-lazyload'

import { Col, Empty, Row } from 'antd'
import CardNFT from '../../cardNFT'

import useNFTCollection from '../../hooks/useNFTCollection'

type ListCollectionsProps = {
  searchText: string
  onSelect: (mintAddress: string) => void
}
const ListCollections = ({ searchText, onSelect }: ListCollectionsProps) => {
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { collections } = useNFTCollection(walletAddress, searchText)

  const onSelectNFT = (mintAddress: string) => {
    onSelect(mintAddress)
  }

  return (
    <Row gutter={[24, 24]} className="scrollbar" style={{ height: 300 }}>
      {collections && Object.keys(collections).length > 0 ? (
        Object.keys(collections).map((collectionAddress) => (
          <Col xs={12} md={8} key={collectionAddress}>
            <LazyLoad height={100} overflow throttle={300}>
              <CardNFT mintAddress={collectionAddress} onSelect={onSelectNFT} />
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

export default ListCollections
