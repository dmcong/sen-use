import { CSSProperties, Fragment, useState } from 'react'

import { Button, Modal, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import SearchMints from './searchMints'
import { MintAvatar, MintSymbol } from 'components'

export type MintSelectionProps = {
  value?: string
  onChange?: (value: string) => void
  style?: CSSProperties
  disabled?: boolean
  nativeSol?: boolean
  placeholder?: string
  mints?: string[]
}

const MintSelection = ({
  value,
  onChange = () => {},
  style = {},
  disabled = false,
  nativeSol = false,
  placeholder,
  mints,
}: MintSelectionProps) => {
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState('')

  const selectedVal = value || selected

  const onSelect = (selected: string) => {
    onChange(selected)
    setSelected(selected)
  }

  return (
    <Fragment>
      <Button
        type="text"
        onClick={() => setVisible(true)}
        style={{ padding: 4, ...style }}
        disabled={disabled}
      >
        <Space>
          <MintAvatar mintAddress={selectedVal} />
          {placeholder && !selectedVal ? (
            placeholder
          ) : (
            <MintSymbol mintAddress={selectedVal} />
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
          onChange={onSelect}
          onClose={() => setVisible(false)}
          nativeSol={nativeSol}
          value={value}
          mints={mints}
        />
      </Modal>
    </Fragment>
  )
}

export default MintSelection
