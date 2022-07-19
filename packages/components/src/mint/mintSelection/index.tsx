import { CSSProperties, Fragment, useState } from 'react'

import { Button, Modal, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintAvatar, MintSymbol } from '../index'
import SearchMints from './searchMints'

export type MintSelectionProps = {
  value?: string
  onChange?: (value: string) => void
  style?: CSSProperties
  disabled?: boolean
  nativeSol?: boolean
  placeholder?: string
}

const MintSelection = ({
  value = '',
  onChange = () => {},
  style = {},
  disabled = false,
  nativeSol = false,
  placeholder,
}: MintSelectionProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <Fragment>
      <Button
        type="text"
        onClick={() => setVisible(true)}
        style={{ padding: 4, ...style }}
        disabled={disabled}
      >
        <Space>
          <MintAvatar mintAddress={value} />
          {placeholder && !value ? (
            placeholder
          ) : (
            <MintSymbol mintAddress={value} />
          )}
          <IonIcon name="chevron-down-outline" />
        </Space>
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        closable={false}
        centered
        className="mint-select-modal"
        destroyOnClose
      >
        <SearchMints
          onChange={onChange}
          onClose={() => setVisible(false)}
          nativeSol={nativeSol}
          value={value}
        />
      </Modal>
    </Fragment>
  )
}

export default MintSelection
