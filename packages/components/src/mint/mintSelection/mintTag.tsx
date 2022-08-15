import { util } from '@sentre/senhub'

import { Button, Card, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintAvatar } from '../index'
import MintSymbol from '../mintSymbol'

import './index.less'

export type MintTagProps = {
  mintAddress: string
  onClick?: (mintAddress: string) => void
  active?: boolean
  onRemove?: (mintAddress: string) => void
}

const MintTag = ({
  mintAddress,
  onClick = () => {},
  active = false,
  onRemove = () => {},
}: MintTagProps) => {
  return (
    <Card
      bodyStyle={{
        padding: 8,
        cursor: 'pointer',
      }}
      style={{
        position: 'relative',
        borderRadius: 8,
        backgroundColor: util.randomColor(mintAddress, 0.2),
      }}
      className="mint-tag"
      bordered={Boolean(active)}
      onClick={() => onClick(mintAddress)}
    >
      <Button
        className="btn-remove-recommend-tag"
        shape="circle"
        icon={<IonIcon name="close-outline" />}
        onClick={(e) => {
          e.stopPropagation()
          onRemove(mintAddress)
        }}
        style={{
          background: util.randomColor(mintAddress),
          border: `1px solid ${util.randomColor(mintAddress, 0.2)}`,
        }}
      />
      <Space size={8} style={{ width: '100%', justifyContent: 'center' }}>
        <MintAvatar mintAddress={mintAddress} />
        <Typography.Text
          style={{ color: util.randomColor(mintAddress), whiteSpace: 'nowrap' }}
        >
          <MintSymbol mintAddress={mintAddress} />
        </Typography.Text>
        {active && <IonIcon name="checkmark-outline" />}
      </Space>
    </Card>
  )
}
export default MintTag
