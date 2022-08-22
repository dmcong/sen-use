import { web3, BN } from '@project-serum/anchor'
import { IPFS } from '../src/ipfs'

const KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg4MzdCZUI2ODM5MTcwODZjQUI3OTU0MzI3ZTgwOWU1ZTlCZTc2NTEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTU0NTU5NzI5MjAsIm5hbWUiOiJTZW50cmUifQ.Jf7oQOKMrBxp5morvs7DR_As4EU9Y5WybyuvY1teFN8'

type MapTypes = {
  pool: {
    address: string
    amount: number
  }
  farm: {
    address: web3.PublicKey
    amount: BN
  }
}
type Idl = ['pool', 'farm']
const IDL: Idl = ['pool', 'farm']

describe('ipfs test', () => {
  const ipfs = new IPFS<MapTypes, Idl>(KEY, IDL)
  let cid = ''
  it('Add Ipfs!', async () => {
    const data = await ipfs.methods.pool.set({ address: 'ok', amount: 12 })
    cid = data.cid
  })

  it('Get Ipfs!', async () => {
    const pool = await ipfs.methods.pool.get(cid)
    console.log('pool', pool)
  })
})
