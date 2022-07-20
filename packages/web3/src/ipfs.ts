import { Web3Storage } from 'web3.storage'
import { DataLoader } from './dataloader'
import { CID } from 'multiformats/cid'

const mapSingleton = new Map<string, Web3Storage>()

function getSingleton(key: string, endpoint: string): Web3Storage {
  const id = `${key}:${endpoint}`
  let instance = mapSingleton.get(id)
  if (instance) return instance
  // create new instance
  instance = new Web3Storage({
    endpoint: new URL(endpoint),
    token: key,
  })
  mapSingleton.set(id, instance)
  return getSingleton(key, endpoint)
}

export class IPFS {
  private provider: Web3Storage
  constructor(
    private key: string,
    private endpoint = 'https://api.web3.storage',
  ) {
    this.provider = getSingleton(this.key, this.endpoint)
  }

  set = async (data: object) => {
    const file = new File([JSON.stringify(data)], 'file', {
      type: 'application/json',
    })
    const cid = await this.provider.put([file])
    const {
      multihash: { digest },
    } = CID.parse(cid)
    return { cid, digest }
  }

  decodeCID = (digest: string | Buffer | Uint8Array | number[]) => {
    if (typeof digest === 'string') return digest
    const v0Prefix = new Uint8Array([18, 32])
    const v0Digest = new Uint8Array(v0Prefix.length + digest?.length)
    v0Digest.set(v0Prefix) // multicodec + length
    v0Digest.set(digest, v0Prefix.length)
    const cid = CID.decode(v0Digest)
    return cid.toString()
  }

  get = async <T>(
    digest: string | Buffer | Uint8Array | number[],
  ): Promise<T> => {
    const cid = this.decodeCID(digest)
    return DataLoader.load<T>(`ipfs:${cid}`, async () => {
      const re = await this.provider.get(cid)
      const file = ((await re?.files()) || [])[0]
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        try {
          if (!file) throw new Error('Cannot read empty file')
          reader.onload = () => {
            const contents = reader.result?.toString()
            if (!contents) throw new Error('Cannot read empty file')
            return resolve(JSON.parse(contents))
          }
          reader.readAsText(file)
        } catch (er: any) {
          return reject(er.message)
        }
      })
    })
  }
}
