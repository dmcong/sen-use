import { File, Web3Storage } from 'web3.storage'

let IpfsSingleton: IPFS
export class IPFS {
  private provider: Web3Storage
  constructor(key: string) {
    this.provider = IpfsSingleton
      ? IpfsSingleton.provider
      : new Web3Storage({
          endpoint: new URL('https://api.web3.storage'),
          token: key,
        })
    IpfsSingleton = this
  }

  set = async (data: object) => {
    const file = new File([JSON.stringify(data)], 'file', {
      type: 'application/json',
    })
    const cid = await this.provider.put([file])
    return cid
  }

  get = async (cid: string) => {
    const re = await this.provider.get(cid)
    return re?.files()
  }
}
