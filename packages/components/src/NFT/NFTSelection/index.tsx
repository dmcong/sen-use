import { Fragment, useState } from 'react'

import { Button, Modal } from 'antd'
import SearchNFT from './search'

export enum searchNFTType {
  nfts = 'nfts',
  collections = 'collections',
}

export type NFTSelectionProps = {
  onSelect?: (mintAddress: string) => void
  selectedNFTs?: string[]
  searchNFTby?: searchNFTType
  title?: string
  collectionAddress?: string[]
}

const NFTSelection = ({
  selectedNFTs = [],
  onSelect = () => {},
  searchNFTby = searchNFTType.nfts,
  title = 'NFT Selection',
  collectionAddress = [],
}: NFTSelectionProps) => {
  const [visible, setVisible] = useState(false)

  const onSelectNFT = (mintAddress: string) => {
    onSelect(mintAddress)
    setVisible(false)
  }

  return (
    <Fragment>
      <Button type="text" onClick={() => setVisible(true)}>
        {title}
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        closable={false}
        centered
        className="mint-select-modal"
      >
        <SearchNFT
          onSelect={onSelectNFT}
          selectedNFTs={selectedNFTs}
          searchNFTby={searchNFTby}
          collectionAddress={collectionAddress}
        />
      </Modal>
    </Fragment>
  )
}

export default NFTSelection
