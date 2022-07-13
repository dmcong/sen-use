import { IPFS } from './../src/ipfs'

const KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg4MzdCZUI2ODM5MTcwODZjQUI3OTU0MzI3ZTgwOWU1ZTlCZTc2NTEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTU0NTU5NzI5MjAsIm5hbWUiOiJTZW50cmUifQ.Jf7oQOKMrBxp5morvs7DR_As4EU9Y5WybyuvY1teFN8'

describe('ipfs test', () => {
  const ipfs = new IPFS(KEY)

  before('Is generate data!', async () => {})

  it('Add Ipfs!', async () => {})

  it('Get Ipfs!', async () => {
    const cid = 'bafybeidd2gyhagleh47qeg77xqndy2qy3yzn4vkxmk775bg2t5lpuy7pcu'
    const res = await ipfs.get(cid)
    console.log('res', res)
  })
})
