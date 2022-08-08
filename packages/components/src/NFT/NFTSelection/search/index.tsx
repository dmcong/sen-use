import { useState } from 'react'
import { useUI } from '@sentre/senhub'

import { Row, Col, Input, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import Settings from '../settings'
import Results from '../results'

import { searchNFTType, NFTSelectionProps } from '../../NFTSelection'

const Search = ({
  onSelect = () => {},
  searchNFTby = searchNFTType.nfts,
  collectionAddress = [],
  selectedNFTs = [],
}: NFTSelectionProps) => {
  const {
    ui: { width },
  } = useUI()
  const isMobile = width < 992
  const [keyword, setKeyword] = useState('')
  const [hiddenUnknownNFTs, setHiddenUnknownNFTs] = useState(true)

  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Input
          placeholder={
            searchNFTby === searchNFTType.nfts
              ? 'Search NFT in your wallet'
              : 'Search by collection address'
          }
          size="large"
          style={{ minWidth: isMobile ? undefined : 296 }}
          value={keyword}
          prefix={
            <Button
              type="text"
              style={{ marginLeft: -7 }}
              size="small"
              onClick={keyword ? () => setKeyword('') : () => {}}
              icon={
                <IonIcon name={keyword ? 'close-outline' : 'search-outline'} />
              }
            />
          }
          onChange={(e) => setKeyword(e.target.value || '')}
        />
      </Col>
      {searchNFTby === searchNFTType.nfts && (
        <Col>
          <Settings
            hiddenUnknownNFTs={hiddenUnknownNFTs}
            setHiddenUnknownNFTs={setHiddenUnknownNFTs}
          />
        </Col>
      )}
      <Col span={24}>
        <Results
          searchNFTby={searchNFTby}
          searchText={keyword}
          hiddenUnknownNFTs={hiddenUnknownNFTs}
          onSelect={onSelect}
          collectionAddress={collectionAddress}
          selectedNFTs={selectedNFTs}
        />
      </Col>
    </Row>
  )
}

export default Search
