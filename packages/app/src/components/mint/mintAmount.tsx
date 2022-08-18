import { memo, useCallback, useState } from 'react'
import { useDebounce } from 'react-use'
import { Address, BN } from '@project-serum/anchor'
import { util } from '@sentre/senhub'

import { useGetMintAmountUI } from 'hooks/mint/useGetMintAmountUI'

type MintAmountProps = {
  mintAddress: Address
  amount: BN
  formatter?: string | ((val: string) => string)
}

const MintAmount = ({
  mintAddress,
  amount,
  formatter = '0,0.[0000]',
}: MintAmountProps) => {
  const [amountUI, setAmountUI] = useState('--')
  const getMintAmountUI = useGetMintAmountUI()

  const updateAmount = useCallback(async () => {
    let amountUI = await getMintAmountUI(mintAddress, amount)
    if (typeof formatter === 'string') {
      amountUI = util.numeric(amountUI).format(formatter)
    } else {
      amountUI = formatter(amountUI)
    }
    return setAmountUI(amountUI)
  }, [amount, formatter, getMintAmountUI, mintAddress])
  useDebounce(updateAmount, 300, [updateAmount])

  return <span>{amountUI}</span>
}

export default memo(MintAmount)
