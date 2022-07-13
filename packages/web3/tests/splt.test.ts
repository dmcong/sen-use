import { AnchorProvider, Wallet, web3, BN } from '@project-serum/anchor'

import { createMintAndMintTo } from '../src/splt/index'

describe('splt-test', () => {
  const cluster = web3.clusterApiUrl('devnet')
  const connection = new web3.Connection(cluster, 'confirmed')
  const wallet = new Wallet(
    web3.Keypair.fromSecretKey(
      Buffer.from([
        171, 48, 115, 67, 12, 248, 208, 101, 168, 52, 107, 205, 98, 135, 92, 73,
        136, 249, 206, 79, 205, 49, 106, 192, 175, 183, 179, 124, 197, 209, 103,
        121, 86, 141, 53, 4, 25, 205, 249, 230, 101, 112, 9, 188, 86, 179, 71,
        31, 109, 21, 207, 138, 127, 79, 112, 136, 166, 246, 84, 158, 213, 65,
        173, 244,
      ]),
    ),
  )
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    skipPreflight: true,
  })

  before('Is generate data!', async () => {
    await provider.connection.requestAirdrop(wallet.publicKey, 1000000000)
    console.log('requestAirdrop')
    console.log('wallet', wallet.publicKey.toBase58())
  })

  it('Is created Mint!', async () => {
    const mint = new web3.Keypair()
    const data = await createMintAndMintTo(provider, {
      amount: new BN(10000),
      mint,
    })
    console.log('data', data)
  })
})
