import { memo, useCallback, useState } from 'react'
import { useDebounce } from 'react-use'
import { Address, BN } from '@project-serum/anchor'
import { util } from '@sentre/senhub'

import { useGetTotalValue } from 'hooks/mint/useGetPrice'

const MintTotalValue = ({
  mintAddress,
  amount,
  format = '$0,0.[0000]',
}: {
  mintAddress: Address
  amount: BN
  format?: string
}) => {
  const [totalValue, setTotalValue] = useState('--')
  const getTotalValue = useGetTotalValue()

  const updateTotalValue = useCallback(async () => {
    const totalValue = await getTotalValue(mintAddress, amount)
    return setTotalValue(util.numeric(totalValue).format(format))
  }, [amount, format, getTotalValue, mintAddress])
  useDebounce(updateTotalValue, 300, [updateTotalValue])

  return <span>{totalValue}</span>
}

export default memo(MintTotalValue)
