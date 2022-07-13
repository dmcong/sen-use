import { web3 } from '@project-serum/anchor'

const GET_MULTIPLE_ACCOUNTS_LIMIT: number = 99

async function getMultipleAccountsCore(
  connection: web3.Connection,
  publicKeys: web3.PublicKey[],
  commitmentOverride?: web3.Commitment,
): Promise<
  Array<null | { publicKey: web3.PublicKey; account: web3.AccountInfo<Buffer> }>
> {
  const commitment = commitmentOverride ?? connection.commitment
  const accounts = await connection.getMultipleAccountsInfo(
    publicKeys,
    commitment,
  )
  return accounts.map((account, idx) => {
    if (account === null) {
      return null
    }
    return {
      publicKey: publicKeys[idx],
      account,
    }
  })
}

function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map(
    (_, index) => array.slice(index * size, (index + 1) * size),
  )
}

export async function getMultipleAccounts(
  connection: web3.Connection,
  publicKeys: web3.PublicKey[],
  commitment?: web3.Commitment,
): Promise<
  Array<null | { publicKey: web3.PublicKey; account: web3.AccountInfo<Buffer> }>
> {
  if (publicKeys.length <= GET_MULTIPLE_ACCOUNTS_LIMIT) {
    return await getMultipleAccountsCore(connection, publicKeys, commitment)
  } else {
    const batches = chunks(publicKeys, GET_MULTIPLE_ACCOUNTS_LIMIT)
    const results = await Promise.all<
      Array<null | {
        publicKey: web3.PublicKey
        account: web3.AccountInfo<Buffer>
      }>
    >(
      batches.map((batch) =>
        getMultipleAccountsCore(connection, batch, commitment),
      ),
    )
    return results.flat()
  }
}

/**
 * SMART FETCH ACCOUNT WEB3
 */
type GetAccountDataSmartParams = {
  connection: web3.Connection
  publicKey: web3.PublicKey
  debounce?: number
  commitment?: web3.Commitment
}
/**
 * STORES
 */
let processStores = new Array<{
  publicKey: web3.PublicKey
  resolve: any
  reject: any
  data?: any
}>()
let processCache = new Map<string, any>()
export async function getAccountDataSmart<T>(
  params: GetAccountDataSmartParams,
  parseData: (data: Buffer, rawData?: web3.AccountInfo<Buffer>) => T,
): Promise<{ publicKey: web3.PublicKey; data: T | null }> {
  const {
    connection,
    publicKey,
    commitment = 'confirmed',
    debounce = 500,
  } = params
  const cacheKey = publicKey.toBase58()
  if (!processCache.has(cacheKey)) {
    const newProcess = new Promise((resolve, reject) => {
      async function fetchData() {
        const processes = processStores
        processStores = []
        processCache = new Map<string, any>()
        const accounts = await getMultipleAccounts(
          connection,
          processes.map((e) => e.publicKey),
          commitment,
        )
        for (let i = 0; i < processes.length; i++) {
          const process = processes[i]
          try {
            const acc = accounts[i]
            if (!acc?.account.data) throw new Error('Invalid Data')
            const accData = parseData(acc?.account.data)
            process.resolve({ publicKey: process.publicKey, data: accData })
          } catch (error) {
            process.resolve({ publicKey: process.publicKey, data: null })
          }
        }
      }
      if (!processStores.length) setTimeout(async () => fetchData(), debounce)
      processStores.push({ publicKey, resolve, reject })
    })
    processCache.set(cacheKey, newProcess)
  }
  return processCache.get(cacheKey)
}
