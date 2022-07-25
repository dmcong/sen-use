import { IdlParser } from './../src/idlParser/index'
import { IDL } from './balancer_amm'

// type MapArg = {
//   [K in Args[number]['name']]: Extract<Args[number], { name: K }>['type']
// }

describe('idl parser test', () => {
  // @ts-ignore
  const idlParser = new IdlParser(IDL)
  before('Is generate data!', async () => {})
  it('parser account data!', async () => {
    // const data = idlParser.parserAccountData('farm', Buffer.from(''))
    // const test = await idlParser.program.account.farm.fetch('')
  })

  it('parser ix data!', async () => {
    // const data = idlParser.parserIxData('create', Buffer.from(''))
    // const test = data?.data
  })
})
