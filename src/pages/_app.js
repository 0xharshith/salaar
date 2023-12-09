import '@/styles/globals.css'
import { WagmiConfig, createConfig, mainnet } from 'wagmi'
import { createPublicClient, http } from 'viem'

export default function App({ Component, pageProps }) {
  const config = createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
      chain: mainnet,
      transport: http()
    }),
  })
  return <WagmiConfig config={config}><Component {...pageProps} /></WagmiConfig>
}
