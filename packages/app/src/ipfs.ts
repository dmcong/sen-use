import { File, Web3Storage } from 'web3.storage'
import localforage from 'localforage'

import { CID } from 'multiformats/cid'
import { DataLoader } from '@sen-use/web3'

var store = localforage.createInstance({
  name: 'cache-ipfs',
  storeName: 'cache-ipfs',
})

export class IPFS<
  MapTypes extends Record<string, any>,
  T extends Array<keyof MapTypes>,
> {
  private provider: Web3Storage
  constructor(
    private key: string,
    private IDL: T,
    private endpoint = 'https://api.web3.storage',
  ) {
    this.provider = new Web3Storage({
      endpoint: new URL(this.endpoint),
      token: this.key,
    })
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

  get methods() {
    const methods: {
      [x in T[number]]: {
        get: (
          digest: string | Buffer | Uint8Array | number[],
        ) => Promise<MapTypes[x]>
        set: (data: MapTypes[x]) => Promise<{ cid: string; digest: Uint8Array }>
      }
    } = {} as any
    for (const elm of this.IDL) {
      methods[elm] = {
        set: (data) => this.set(data),
        get: (digest) => this.get(digest),
      }
    }
    return methods
  }

  private async set(data: any, cache = true): Promise<any> {
    const file = new File([JSON.stringify(data)], 'file', {
      type: 'application/json',
    })
    const cid = await this.provider.put([file])
    const {
      multihash: { digest },
    } = CID.parse(cid)
    // Save IPFS to cache
    if (cache) {
      try {
        await store.setItem(this.decodeCID(digest), { data, checked: false })
      } catch (error) {
        console.log('error-ipfs-cache-set:', error)
      }
    }

    return { cid, digest }
  }

  private async get(
    digest: string | Buffer | Uint8Array | number[],
    cache = true,
  ): Promise<any> {
    const cid = this.decodeCID(digest)
    return DataLoader.load(`ipfs:${cid}`, async () => {
      // Check cache data
      if (cache) {
        try {
          const cacheData = await store.getItem<any>(cid)
          console.log('cacheData', cacheData)
          if (cacheData) {
            const { data, checked } = cacheData
            if (!checked) {
              // Recheck data on IPFS
              try {
                this.get(digest, false).then((rp) => {
                  console.log('rp', rp)
                  if (!!rp) store.setItem(cid, { data: rp, checked: true })
                })
              } catch (error) {
                console.log('error check')
                this.set(data)
              }
            }
            return data
          }
        } catch (error) {
          console.log('error-ipfs-cache-get:', error)
        }
      }

      const re = await this.provider.get(cid)
      const file = ((await re?.files()) || [])[0]
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        try {
          if (!file) throw new Error('Cannot read empty file')
          reader.onload = async () => {
            const contents = reader.result?.toString()
            if (!contents) throw new Error('Cannot read empty file')
            const ipfsData = JSON.parse(contents)
            // Set status cache data
            try {
              await store.setItem(cid, { data: ipfsData, checked: true })
            } catch (error) {
              console.log('error-ipfs-cache-set:', error)
            }
            return resolve(ipfsData)
          }
          reader.readAsText(file)
        } catch (er: any) {
          return reject(er.message)
        }
      })
    })
  }
}
