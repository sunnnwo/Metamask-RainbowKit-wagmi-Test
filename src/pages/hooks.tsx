import { useAccount, useBalance, useReadContract, useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem';
import { useChainId } from 'wagmi'



export function Hooks() {
    const account = useAccount();
    const chainId = useChainId();

    console.log("chainId: ", chainId);
    const TokenAddress: `0x${string}` = chainId === 1 
        ? "0xdAC17F958D2ee523a2206206994597C13D831ec7" 
        : "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0"; // Sepolia

    const wagmiReadContract = {
        address : TokenAddress,
        abi: erc20Abi,
    }

    const result = useReadContracts({
        contracts: [
        {
            // abi: erc20Abi,
            // address: TokenAddress,
            ...wagmiReadContract,
            functionName: 'totalSupply',
        },
        {
            // abi: erc20Abi,
            // address: TokenAddress,
            ...wagmiReadContract,
            functionName: 'symbol',
        }
    
        ],})
   
    console.log("result: ", result);
    const {data: balance, refetch} = useBalance({
    address: account.address,
    })
  return <>
    <div>
        <ul>
            <li>Balance:  {balance?.formatted}</li>
            <li>ChainId : {chainId}</li>
            <li>Total Supply:  {result.data?.[0]?.result?.toString()}</li>
            <li>Symbol:  {result.data?.[1]?.result?.toString()}</li>
        </ul>
    </div>
  </>
}

