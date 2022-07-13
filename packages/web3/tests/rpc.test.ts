import { Connection, PublicKey } from '@solana/web3.js'
import { getAccountDataSmart } from '../src/rpc'

function parseData(data: Buffer) {
  return Array.from(data)
}
describe('rpc test', () => {
  before('Is generate data!', async () => {})

  it('Fetch multi address!', async () => {
    const connection = new Connection('https://devnet.genesysgo.net')
    console.log('call')
    const data1 = getAccountDataSmart(
      {
        connection,
        publicKey: new PublicKey(
          '2AWpnMMfjc58XLKvVb4KfoVsvmfWYuNM4GSDTNGkMqkq',
        ),
      },
      parseData,
    )
    const data11 = getAccountDataSmart(
      {
        connection,
        publicKey: new PublicKey(
          '2AWpnMMfjc58XLKvVb4KfoVsvmfWYuNM4GSDTNGkMqkq',
        ),
      },
      parseData,
    )

    const data2 = getAccountDataSmart(
      {
        connection,
        publicKey: new PublicKey(
          '2rxF7zCPnKXN6bu2Kn6sjBRb9DnFG2sJ6PdNHzwQcz3f',
        ),
      },
      parseData,
    )

    const data3 = getAccountDataSmart(
      {
        connection,
        publicKey: new PublicKey(
          '2uwgrVSYY4rRnLfQge6DNjpE7ZoK832iitTVM9apuWs2',
        ),
      },
      parseData,
    )

    const data = await Promise.all([data1, data11, data2, data3])
    console.log('data', data)
  })
})
