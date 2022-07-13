/**
 * Refer: anchor-master/ts/src/program/namespace/types.ts
 */

import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import {
  Idl,
  IdlInstruction,
  IdlType,
  IdlTypeDef,
  IdlTypeDefTyEnum,
  IdlTypeDefTyStruct,
} from './idl'

/**
 * Custom type
 */
export type IxAgrsData<
  IDL extends Idl,
  N extends AllInstructions<IDL>['name'],
> = {
  [K in AllInstructionsMap<IDL>[N]['args'][number]['name']]: DecodeType<
    Extract<AllInstructionsMap<IDL>[N]['args'][number], { name: K }>['type'],
    IdlTypes<IDL>
  >
}
/**
 * ===============================Anchor Type==================================
 */
/**
 * All instructions for an IDL.
 */
export type AllInstructions<IDL extends Idl> = IDL['instructions'][number]

/**
 * Returns a type of instruction name to the IdlInstruction.
 */
export type InstructionMap<I extends IdlInstruction> = {
  [K in I['name']]: I & { name: K }
}

/**
 * Returns a type of instruction name to the IdlInstruction.
 */
export type AllInstructionsMap<IDL extends Idl> = InstructionMap<
  AllInstructions<IDL>
>

/**
 * All accounts for an IDL.
 */
export type AllAccounts<IDL extends Idl> = IDL['accounts'] extends undefined
  ? IdlTypeDef
  : NonNullable<IDL['accounts']>[number]

/**
 * IDL Data Type
 */

type TypeMap = {
  publicKey: PublicKey
  bool: boolean
  string: string
} & {
  [K in 'u8' | 'i8' | 'u16' | 'i16' | 'u32' | 'i32' | 'f32' | 'f64']: number
} & {
  [K in 'u64' | 'i64' | 'u128' | 'i128']: BN
}

type DecodeType<T extends IdlType, Defined> = T extends keyof TypeMap
  ? TypeMap[T]
  : T extends { defined: keyof Defined }
  ? Defined[T['defined']]
  : T extends { option: { defined: keyof Defined } }
  ? Defined[T['option']['defined']] | null
  : T extends { option: keyof TypeMap }
  ? TypeMap[T['option']] | null
  : T extends { coption: { defined: keyof Defined } }
  ? Defined[T['coption']['defined']] | null
  : T extends { coption: keyof TypeMap }
  ? TypeMap[T['coption']] | null
  : T extends { vec: keyof TypeMap }
  ? TypeMap[T['vec']][]
  : T extends { array: [defined: keyof TypeMap, size: number] }
  ? TypeMap[T['array'][0]][]
  : unknown

type FieldsOfType<I extends IdlTypeDef> = NonNullable<
  I['type'] extends IdlTypeDefTyStruct
    ? I['type']['fields']
    : I['type'] extends IdlTypeDefTyEnum
    ? I['type']['variants'][number]['fields']
    : any[]
>[number]

type TypeDef<I extends IdlTypeDef, Defined> = {
  [F in FieldsOfType<I>['name']]: DecodeType<
    (FieldsOfType<I> & { name: F })['type'],
    Defined
  >
}

type TypeDefDictionary<T extends IdlTypeDef[], Defined> = {
  [K in T[number]['name']]: TypeDef<T[number] & { name: K }, Defined>
}

type IdlTypes<T extends Idl> = TypeDefDictionary<
  NonNullable<T['types']>,
  Record<string, never>
>
