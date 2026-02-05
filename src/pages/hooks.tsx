import { useAccount, useBalance, useReadContract, useReadContracts, useWriteContract  } from 'wagmi'
import { erc20Abi } from 'viem';
import { useChainId } from 'wagmi'



export function Hooks() {
    const account = useAccount();
    const chainId = useChainId();
    const writeContract = useWriteContract()


    console.log("chainId: ", chainId);
    const TokenAddress: `0x${string}` = chainId === 1 //반드시 0x로 시작해야함
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
        },
        {
            // abi: erc20Abi,
            // address: TokenAddress,
            ...wagmiReadContract,
            args: [account.address as `0x${string}`,  "0x1f79BD178EcFbF880903E31C45206670704043AC" as `0x${string}`],
            functionName: 'allowance',
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
            <li>Allowance:  {result.data?.[2]?.result?.toString()}</li>
            <button onClick={()=>{
                writeContract.writeContract({
                    abi: erc20Abi,
                    address: TokenAddress,
                    functionName: 'approve',
                    args: ["0x1f79BD178EcFbF880903E31C45206670704043AC" as `0x${string}`, BigInt(100000000000000000000n)],
                })
            }}
            >Approve</button>
        </ul>
    </div>
  </>
}

