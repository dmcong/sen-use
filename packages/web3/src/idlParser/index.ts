import {
  BorshInstructionCoder,
  Idl,
  IdlAccounts,
  Program,
} from '@project-serum/anchor'
import { sha256 } from 'js-sha256'
import camelcase from 'camelcase'
import { snakeCase } from 'snake-case'

import { getRawProgram } from '../utils'
import { AllAccounts, AllInstructions, IxAgrsData } from './types'

/**
 * Number of bytes of the account discriminator.
 */
const DISCRIMINATOR_SIZE = 8

/**
 * Calculates and returns a unique 8 byte discriminator prepended to all anchor accounts.
 * @param name The name of the account to calculate the discriminator.
 */
export const accountDiscriminator = (name: string): Buffer => {
  return Buffer.from(
    sha256.digest(`account:${camelcase(name, { pascalCase: true })}`),
  ).slice(0, DISCRIMINATOR_SIZE)
}

/**
 * Calculates and returns a unique 8 byte discriminator prepended to all anchor instructions.
 * @param name The name of the instruction to calculate the discriminator.
 */
export const ixDiscriminator = (ixName: string): Buffer => {
  let name = snakeCase(ixName)
  let preimage = `global:${name}`
  return Buffer.from(sha256.digest(preimage)).slice(0, DISCRIMINATOR_SIZE)
}

export class IdlParser<T extends Idl> {
  program: Program<T>
  idl: Idl
  constructor(idl: T) {
    this.program = getRawProgram<T>(idl)
    this.idl = idl
  }

  parserAccountData = (
    accountName: AllAccounts<T>['name'],
    bufData: Buffer,
    discriminator: boolean = true,
  ) => {
    if (!discriminator) {
      const discriminatorBuf: Buffer = accountDiscriminator(accountName)
      bufData = Buffer.concat([discriminatorBuf, bufData])
    }

    return this.program.coder.accounts.decode<
      IdlAccounts<T>[typeof accountName]
    >(accountName, bufData)
  }

  parserIxData = (
    ixName: AllInstructions<T>['name'],
    bufData: Buffer,
    discriminator: boolean = true,
  ) => {
    try {
      const ix = this.idl.instructions.find((e) => e.name === ixName)
      if (!ix) return null

      if (!discriminator) {
        const discriminatorBuf: Buffer = ixDiscriminator(ixName)
        bufData = Buffer.concat([discriminatorBuf, bufData])
      }
      const borshInstructionCoder = new BorshInstructionCoder(this.idl)
      const decodeData = borshInstructionCoder.decode(bufData)

      if (!decodeData) return null
      return {
        name: decodeData.name,
        data: decodeData.data as IxAgrsData<T, typeof ixName>,
      }
    } catch (error) {
      return null
    }
  }
}
