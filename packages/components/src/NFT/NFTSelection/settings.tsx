import { Row, Col, Space, Popover, Typography, Switch, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

export type SettingsProps = {
  hiddenUnknownNFTs: boolean
  setHiddenUnknownNFTs: (checked: boolean) => void
}

const Settings = ({
  hiddenUnknownNFTs,
  setHiddenUnknownNFTs,
}: SettingsProps) => {
  return (
    <Popover
      zIndex={1000}
      content={
        <Row gutter={[8, 8]} style={{ maxWidth: 224 }}>
          <Col span={24}>
            <Space size="large">
              <Switch
                size="small"
                checked={hiddenUnknownNFTs}
                onChange={(checked) => setHiddenUnknownNFTs(checked)}
              />
              <Typography.Text>Hide unknown NFTs</Typography.Text>
            </Space>
          </Col>
        </Row>
      }
      trigger="click"
      placement="topRight"
    >
      <Button
        size="large"
        style={{ background: 'transparent' }}
        icon={<IonIcon style={{ cursor: 'pointer' }} name="cog-outline" />}
      />
    </Popover>
  )
}
export default Settings
