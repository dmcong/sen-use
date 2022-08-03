import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'

import View from 'view'

import model from 'model'

import configs from 'configs'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  const configProviderAntd = {
    getPopupContainer: () => document.getElementById(appId) as HTMLElement,
    prefixCls: appId,
  }
  ConfigProvider({ ...configProviderAntd })

  return (
    <Provider store={model}>
      <View />
    </Provider>
  )
}

export * from 'static.app'
