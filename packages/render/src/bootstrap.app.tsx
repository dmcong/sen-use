import { Provider } from 'react-redux'
import { UIProvider } from '@sentre/senhub'

import View from 'view'

import model from 'model'

import configs from 'configs'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <Provider store={model}>
      <UIProvider appId={appId} antd>
        <View />
      </UIProvider>
    </Provider>
  )
}

export * from 'static.app'
