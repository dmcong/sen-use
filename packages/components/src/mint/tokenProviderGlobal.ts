import {
  BalansolTokenProvider,
  SenLpTokenProvider,
  SplTokenProvider,
  TokenProvider,
} from '@sentre/senhub'

const splTokenProvider = new SplTokenProvider()
const balansolProvider = new BalansolTokenProvider()
const senLpProvider = new SenLpTokenProvider()

export const tokenProviderGlobal = new TokenProvider([
  splTokenProvider,
  balansolProvider,
  senLpProvider,
])
