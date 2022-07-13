import {
  Address,
  AnchorProvider,
  Idl,
  Program,
  web3,
} from '@project-serum/anchor'

export const toPublicKey = (address: Address): web3.PublicKey => {
  const publicKey = new web3.PublicKey(address)
  return publicKey
}

export const toBase58 = (address: Address): string => {
  const publicKey = new web3.PublicKey(address)
  return publicKey.toBase58()
}

interface WalletInterface {
  signTransaction(tx: web3.Transaction): Promise<web3.Transaction>
  signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]>
}

export const getAnchorProvider = (
  node: string,
  walletAddress: Address,
  wallet: WalletInterface,
): AnchorProvider => {
  const connection = new web3.Connection(node, 'confirmed')
  const publicKey = new web3.PublicKey(walletAddress)
  return new AnchorProvider(
    connection,
    {
      publicKey: publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    },
    {
      commitment: 'confirmed',
      skipPreflight: true,
    },
  )
}

export const getRawAnchorProvider = (): AnchorProvider => {
  const cluster = web3.clusterApiUrl('mainnet-beta')
  const connection = new web3.Connection(cluster, 'confirmed')
  const keypair = web3.Keypair.generate()
  const wallet = new RawWallet(keypair.publicKey)
  return new AnchorProvider(
    connection,
    {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    },
    {
      commitment: 'confirmed',
      skipPreflight: true,
    },
  )
}

export const getRawProgram = <T extends Idl>(idl: T) => {
  const defaultProgram = web3.Keypair.generate().publicKey
  const provider = getRawAnchorProvider()
  return new Program(idl, defaultProgram, provider)
}

/**
 * RawWallet wallet.
 */
export default class RawWallet {
  constructor(readonly publicKey: web3.PublicKey) {}

  async signTransaction(tx: web3.Transaction): Promise<web3.Transaction> {
    throw new Error('')
  }

  async signAllTransactions(
    txs: web3.Transaction[],
  ): Promise<web3.Transaction[]> {
    throw new Error('')
  }
}
