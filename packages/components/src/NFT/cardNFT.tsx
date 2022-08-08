import { useEffect } from 'react'

import { Row, Col, Typography, Image, Spin } from 'antd'
import Address from './address'

import useNftMetaData from './hooks/useNftMetaData'

import IMAGE_DEFAULT from './static/images/nft-default.png'

export type CardNFTProps = {
  mintAddress: string
  onSelect?: (mintAddress: string) => void
  isShowName?: boolean
  size?: number
  addUnknownNFT?: (mintAddress: string) => void
}

const CardNFT = ({
  mintAddress,
  onSelect,
  isShowName = true,
  size,
  addUnknownNFT,
}: CardNFTProps) => {
  const { loading, nftInfo, metadata, isUnknownNFT } =
    useNftMetaData(mintAddress)

  useEffect(() => {
    if (addUnknownNFT && isUnknownNFT) {
      addUnknownNFT(mintAddress)
    }
  }, [addUnknownNFT, isUnknownNFT, loading, mintAddress, nftInfo])

  return (
    <Spin spinning={loading}>
      <Row gutter={[12, 12]} style={{ cursor: 'pointer' }}>
        <Col
          span={24}
          style={{ textAlign: 'center', width: size }}
          onClick={() => (onSelect ? onSelect(mintAddress) : null)}
        >
          <Image
            src={nftInfo?.image || IMAGE_DEFAULT}
            preview={false}
            style={{ borderRadius: 4, aspectRatio: '1', objectFit: 'cover' }}
          />
        </Col>
        {isShowName && (
          <Col span={24} style={{ textAlign: 'left' }}>
            <Row>
              <Col span={24}>
                <Typography.Title ellipsis={{ tooltip: true }} level={5}>
                  {nftInfo?.name || metadata?.data.data.name}
                </Typography.Title>
              </Col>
              <Col span={24}>
                <Address address={mintAddress} />
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </Spin>
  )
}

export default CardNFT
