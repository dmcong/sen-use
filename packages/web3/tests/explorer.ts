import { Connection } from '@solana/web3.js'
import { SolanaExplorer } from '../src/explorer'
const fs = require('fs')

const conn: Connection = new Connection('https://devnet.genesysgo.net/')

describe('rpc test', () => {
  const SolanaExporer = new SolanaExplorer(conn)

  it('Fetch multi address!', async () => {
    const transactions = await SolanaExporer.fetchTransactions(
      'Hxzy3cvdPz48RodavEN4P41TZp4g6Vd1kEMaUiZMof1u',
      { limit: 200 },
    )
    console.log('transactions', transactions)
    fs.writeFileSync(
      './transactions.json',
      JSON.stringify(transactions, null, 4),
    )
    for (const trans of transactions) {
      const accountKeys = trans.transaction.message.accountKeys
      const message = trans.transaction.message
      for (const ix of message.instructions) {
        const { programId } = ix
      }
    }
  })
})
