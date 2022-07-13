import { BN, AnchorProvider, web3, Address } from '@project-serum/anchor'
import { Transaction } from '@solana/web3.js'

import * as Tx from './transactions'

type MintToParams = {
  amount: BN
  mint: web3.Keypair
  dstAddress?: Address
  decimals?: number
}
export const createMintAndMintTo = async (
  provider: AnchorProvider,
  { amount, mint, dstAddress, decimals = 9 }: MintToParams,
  sendAndConfirm = true,
) => {
  const txCreateMint = await Tx.initTxCreateMint(provider, {
    mint,
    decimals,
  })
  const mintAddress = mint.publicKey
  const txCreateTokenAccount = await Tx.initTxCreateTokenAccount(provider, {
    mintAddress,
    owner: dstAddress,
  })
  const txMinTo = await Tx.initTxMintTo(provider, {
    mintAddress: mint.publicKey,
    amount,
    dstAddress,
  })
  const transaction = new Transaction().add(
    txCreateMint,
    txCreateTokenAccount,
    txMinTo,
  )
  // Send transaction if needed
  let txId = ''
  if (sendAndConfirm) txId = await provider.sendAndConfirm(transaction, [mint])
  return { txId, transaction, signer: [mint] }
}

export * from './transactions'
