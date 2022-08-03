import { CSSProperties } from 'react'

import { Image } from 'antd'

import useNftMetaData from './hooks/useNftMetaData'

import IMAGE_DEFAULT from './static/images/nft-default.png'

export type CardNFTProps = {
  mintAddress: string
  onSelect?: (mintAddress: string) => void
  size?: number
  style?: CSSProperties
}

const AvatarNFT = ({ mintAddress, size, style }: CardNFTProps) => {
  const { nftInfo } = useNftMetaData(mintAddress)

  return (
    <Image
      src={nftInfo?.image || IMAGE_DEFAULT}
      preview={false}
      style={{
        borderRadius: 4,
        width: size,
        height: size,
        aspectRatio: '1',
        objectFit: 'cover',
        ...style,
      }}
    />
  )
}

export default AvatarNFT
