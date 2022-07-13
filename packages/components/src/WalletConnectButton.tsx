import { Button, ButtonProps } from 'antd'
import { FC } from 'react'

export const WalletConnectButton: FC<ButtonProps> = ({
  type = 'primary',
  size = 'large',
  htmlType = 'button',
  children,
  disabled,
  onClick,
  ...props
}) => {
  return (
    <Button type={type} size={size} htmlType={htmlType} {...props}>
      {'content'}
    </Button>
  )
}
