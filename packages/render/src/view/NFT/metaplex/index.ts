import { rpc } from '@sentre/senhub'

import { Connection, programs } from '@metaplex/js'
import { PublicKey } from '@solana/web3.js'

import { isAddress } from './utils'

const {
  metadata: { Metadata, MetadataData },
} = programs

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
)

const DEFAULT_RPC_ENDPOINT = rpc

export type MetadataType = InstanceType<typeof Metadata>
export type MetadataDataType = InstanceType<typeof MetadataData>

class metaplexNFT {
  private _connection: Connection

  constructor(rpcEndpoint: string = DEFAULT_RPC_ENDPOINT) {
    this._connection = new Connection(rpcEndpoint)
  }
  /**
   * Get object array list NFTs belong to collections
   * @param ownerPublickey
   * @returns Record<string, MetadataDataType[]>
   */
  findDataByOwnerGroupByCollection = async (
    ownerPublickey: string,
  ): Promise<Record<string, MetadataDataType[]>> => {
    if (!isAddress(ownerPublickey)) throw new Error('Invalid address!')
    const nftsmetadata = await Metadata.findDataByOwner(
      this._connection,
      ownerPublickey,
    )
    let listNFTs: Record<string, MetadataDataType[]> = {}
    nftsmetadata.forEach((nft: MetadataDataType) => {
      if (nft.collection) {
        listNFTs[nft.collection.key] = listNFTs[nft.collection.key]
          ? [...listNFTs[nft.collection.key], nft]
          : [nft]
      }
    })
    return listNFTs
  }

  /**
   * Get array list NFTs
   * @param ownerPublickey
   * @returns MetadataDataType[]
   */
  findDataByOwner = async (
    ownerPublickey: string,
  ): Promise<MetadataDataType[]> => {
    if (!isAddress(ownerPublickey)) throw new Error('Invalid address!')
    const arrayNFTs = await Metadata.findDataByOwner(
      this._connection,
      ownerPublickey,
    )
    return arrayNFTs
  }

  /**
   * Get array list NFTs
   * @param mintAddress
   * @returns MetadataType
   */
  getNftMetadata = async (mintAddress: string): Promise<MetadataType> => {
    if (!isAddress(mintAddress)) throw new Error('Invalid address!')
    const metadata = await Metadata.findByMint(this._connection, mintAddress)
    return metadata
  }

  /**
   * Get array list NFTs
   * @param collectionAddress
   * @returns
   */

  getListAccountNFTsBelongToCollection = async (collectionAddress: string) => {
    const accounts = await this._connection.getProgramAccounts(
      TOKEN_METADATA_PROGRAM_ID,
      {
        commitment: 'confirmed',
        filters: [
          { dataSize: 679 },
          {
            memcmp: {
              offset: 368,
              bytes: collectionAddress,
            },
          },
        ],
      },
    )
    return accounts
  }

  /**
   * Get array list NFTs
   * @param collectionAddress
   * @returns boolean
   */

  isNftBelongsToCollection = async (
    mintNftAddress: string,
    collectionAddress: string,
  ) => {
    const tokenMetadata = await Metadata.findByMint(
      this._connection,
      mintNftAddress,
    )
    if (tokenMetadata.data.collection?.key === collectionAddress) return true
    return false
  }
}

export default metaplexNFT
