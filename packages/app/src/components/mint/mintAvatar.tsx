import { memo, ReactNode, useCallback, useEffect, useState } from 'react'
import { Address } from '@project-serum/anchor'
import { tokenProvider, util } from '@sentre/senhub'

import { Avatar, Spin } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { DataLoader } from '@sen-use/web3'
import { metaplexProvider } from 'helper'

const DEFAULT_AVATARS: Array<string | undefined> = [undefined]

export type MintAvatarProps = {
  mintAddress: Address
  size?: number
  icon?: ReactNode
  reversed?: boolean
}

/**
 * Mint/Token avatar, supporting LP tokens
 * @param mintAddress -  Mint address
 * @param size - Avatar size. Default 24px.
 * @param icon - Fallback icon for unknown token
 * @param reversed - (Optional) The default LP token avatar is A-B. The reversed is to change it to B-A
 * @returns name
 */
const MintAvatar = ({
  mintAddress,
  size = 24,
  icon = <IonIcon name="diamond-outline" />,
  reversed = false,
  ...props
}: MintAvatarProps) => {
  const [avatars, setAvatars] = useState<(string | undefined)[]>()

  const deriveAvatars = useCallback(async () => {
    if (!util.isAddress(mintAddress.toString()))
      return setAvatars(DEFAULT_AVATARS)
    const token = await tokenProvider.findByAddress(mintAddress)
    if (token) {
      var tokens = await tokenProvider.findAtomicTokens(mintAddress)
    } else {
      tokens = [
        await DataLoader.load(
          'metaplexProvider.findAtomicTokens' + mintAddress.toString(),
          () => metaplexProvider.findByAddress(mintAddress),
        ),
      ]
    }
    return setAvatars(tokens.map((token) => token?.logoURI))
  }, [mintAddress])
  useEffect(() => {
    deriveAvatars()
  }, [deriveAvatars])

  if (!avatars || !(avatars.length > 1))
    return (
      <Avatar
        src={avatars?.[0]}
        size={size}
        style={{ backgroundColor: '#2D3355', border: 'none' }}
        {...props}
      >
        <Spin size="small" spinning={util.isAddress(mintAddress.toString())}>
          {icon}
        </Spin>
      </Avatar>
    )

  return (
    <Avatar.Group
      maxCount={2}
      style={{ display: 'block', whiteSpace: 'nowrap' }}
      maxStyle={{ backgroundColor: '#2D3355' }}
      size={size}
      {...props}
    >
      {avatars.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar}
          size={size}
          style={{ backgroundColor: '#2D3355', border: 'none' }}
        >
          {icon}
        </Avatar>
      ))}
    </Avatar.Group>
  )
}

export default memo(MintAvatar)
