import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  arbitrum,
  base,
  mainnet,
  opBNB,
  opBNBTestnet,
  optimism,
  polygon,
  sepolia,
  bscTestnet,
} from 'wagmi/chains';


export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '00000000000000000000000000000000',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
    opBNBTestnet,
    bscTestnet
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  // transports: {
  //   [mainnet.id]: http(),
  //   [sepolia.id]: http('https://rpc.ankr.com/eth_sepolia'), // 세폴리아용 안정적인 RPC
  // },
  ssr: true,
});
