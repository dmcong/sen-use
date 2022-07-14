import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  MintProvider,
  AccountProvider,
  PoolProvider,
} from '@sentre/senhub'

import View from 'view'

import model from 'model'
import configs from 'configs'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <UIProvider appId={appId} antd>
      <WalletProvider>
        <MintProvider>
          <AccountProvider>
            <PoolProvider>
              <Provider store={model}>
                <View />
              </Provider>
            </PoolProvider>
          </AccountProvider>
        </MintProvider>
      </WalletProvider>
    </UIProvider>
  )
}

export * from 'static.app'
