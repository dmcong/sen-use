import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'

import View from 'view'

import model from 'model'

import configs from 'configs'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <Provider store={model}>
      <section id={appId} style={{ background: 'transparent' }}>
        <ConfigProvider
          getPopupContainer={() =>
            document.getElementById(appId) as HTMLElement
          }
        >
          <View />
        </ConfigProvider>
      </section>
    </Provider>
  )
}

export * from 'static.app'
