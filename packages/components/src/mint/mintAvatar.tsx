import { memo, ReactNode, useCallback, useEffect, useState } from 'react'
import { Address } from '@project-serum/anchor'
import { tokenProvider, util } from '@sentre/senhub'

import { Avatar } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const DEFAULT_AVATARS: Array<string | undefined> = [undefined]

export type MintAvatarProps = {
  key?: string
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
const MintAvatar = memo(
  ({
    key,
    mintAddress,
    size = 24,
    icon = <IonIcon name="diamond-outline" />,
    reversed = false,
    ...props
  }: MintAvatarProps) => {
    const [avatars, setAvatars] = useState(DEFAULT_AVATARS)

    const deriveAvatar = useCallback(async (address: Address) => {
      const tokens = await tokenProvider.findAtomicTokens(address)
      return tokens.map((token) => token?.logoURI)
    }, [])

    const deriveAvatars = useCallback(async () => {
      if (!util.isAddress(mintAddress.toString()))
        return setAvatars(DEFAULT_AVATARS)
      const avatar = await deriveAvatar(mintAddress)
      return setAvatars(avatar)
    }, [mintAddress, deriveAvatar])

    useEffect(() => {
      deriveAvatars()
    }, [deriveAvatars])

    if (avatars.length === 1)
      return (
        <Avatar
          src={avatars[0]}
          size={size}
          style={{ backgroundColor: '#2D3355', border: 'none' }}
          {...props}
        >
          {icon}
        </Avatar>
      )
    return (
      <Avatar.Group
        maxCount={2}
        style={{ display: 'block', whiteSpace: 'nowrap' }}
        maxStyle={{ backgroundColor: '#2D3355' }}
        {...props}
        size={size}
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
  },
)

export default MintAvatar
