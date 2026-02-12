import { useAccount, useBalance, useReadContract, useReadContracts, useWriteContract  } from 'wagmi'
import { erc20Abi, formatUnits, parseUnits } from 'viem';
import { useChainId } from 'wagmi'
import { useState, useEffect } from 'react';
import { SocketAddress } from 'net';



export function Hooks() {
    const account = useAccount();
    const chainId = useChainId();
    const writeContract = useWriteContract();
    const [spender, setSpender] = useState("");
    const [isAuto, setIsAuto] = useState(false);
    const [Traddress, setTrAddress] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [sender, setSender] = useState("");
    const [Recipient, setRecipient] = useState("");

    console.log("chainId: ", chainId);
    const TokenAddress: `0x${string}` = chainId === 1 //반드시 0x로 시작해야함
        ? "0xdAC17F958D2ee523a2206206994597C13D831ec7" 
        :"0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; //usdc
        // : "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0"; // Sepolia

    const wagmiReadContract = {
        address : TokenAddress,
        abi: erc20Abi,
    }
    const {data: supply, refetch: supplyRefetch} = useReadContract(
        {
            ...wagmiReadContract,
            functionName: 'totalSupply',
            query:
            {
                //if isAuto, automatic 60 sec refresh
                refetchInterval: isAuto ? 6000 : false,
            }

        }
    );
    const result = useReadContracts({
        contracts: [
        // {
        //     // abi: erc20Abi,
        //     // address: TokenAddress,
        //     ...wagmiReadContract,
        //     functionName: 'totalSupply',
        // },
        {
            ...wagmiReadContract,
            abi: erc20Abi,
            functionName: 'symbol',
        } as const,
        {
            ...wagmiReadContract,
            abi: erc20Abi,
            args: [account.address as `0x${string}`,  spender as `0x${string}`],
            functionName: 'allowance',
        } as const,
        {
            ...wagmiReadContract,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [account.address as `0x${string}`],
        }
    // "0x1f79BD178EcFbF880903E31C45206670704043AC"
        ],})
         
    console.log("result: ", result);
//    const IntervalBalance = ()=>{
//     useEffect(()=>{
//         const setbal = setInterval(() => {
//             const {data: balance, refetch} = useBalance({
//                                 address: account.address,
//                             })
//         }, 1000);
//         return (clearInterval(setbal));
//     })
//    }

    const {data: balance, refetch: balanceRefetch} = useBalance({
    address: account.address,
    refetchInterval: 60000,
            })


    const handleApprove = () => {
        writeContract.writeContract({
            abi: erc20Abi,
            address: TokenAddress,
            functionName: 'approve',
            args: [spender as `0x${string}`, BigInt(100000000000000000000n)],
            chainId: 11155111
        })
    }
    const handleTransToken = () => {
        writeContract.writeContract({
            abi: erc20Abi,
            address: TokenAddress,
            functionName: 'transfer',
            args: [Traddress as `0x${string}`, BigInt(transferAmount)], //받는 주소와 수량
            chainId: 11155111
        })
    }

    const handleTransferForm = () => {
        // const amount = parseUnits(transferAmount, 6);
        writeContract.writeContract({
            abi: erc20Abi,
            address: TokenAddress,
            functionName: 'transferFrom',
            args: [sender as `0x${string}`, Recipient as `0x${string}`, parseUnits(transferAmount, 6)], //보내는 주소, 받는 주소와 수량
            chainId: 11155111
        })
    }

    const handleMint = () => {
        writeContract.writeContract({
            abi: erc20Abi,
            address: TokenAddress,
            functionName: 'mint',
            args: [account.address as `0x${string}`, parseUnits(transferAmount, 6)], //받는 주소와 수량
            chainId: 11155111
        })
    }

    const handleBurn = () => {
        writeContract.writeContract({
            abi: erc20Abi,
            address: TokenAddress,
            functionName: 'transfer',
            args: ['0x0000000000000000000000000000000000000000' as `0x${string}`, parseUnits(transferAmount, 6)], //받는 주소와 수량
            chainId: 11155111
        })
    }
  return <>
    <div>
        <ul>
            <li>Balance:  {balance?.formatted ? formatUnits(balance.formatted, 6) : '0'} {balance?.symbol}</li>
            <li>ChainId : {chainId}</li>
            <li>Total Supply:  {supply?.toString() ? formatUnits(supply, 6) : '0'}</li>
            <button onClick={() => setIsAuto(!isAuto)}>{isAuto ? 'auto renew' : 'auto renew on'}</button>

      {/* 2. 수동 리프레시 버튼 */}
            <button onClick={() => supplyRefetch()} disabled={isAuto}> Renew</button>
            <li>Symbol:  {result.data?.[0]?.result?.toString()}</li>
            <li>Allowance:  {result.data?.[1]?.result?.toString()}</li>
            <li>My Token Balance:  {result.data?.[2]?.result ? formatUnits(result.data[2].result, 6) : '0'}</li>
            <li><input type="text" placeholder='spender adderess' onChange={(e)=>setSpender(e.target.value)}/></li>
            <li><button onClick={handleApprove}>Approve</button></li>

            <li><input type="text" placeholder='Address' onChange={(e)=>setTrAddress(e.target.value)}/> 
                <input type="text" placeholder='Amount' onChange={(e)=>setTransferAmount(e.target.value)}/></li>

            <li><button onClick={handleTransToken}>Transfer</button></li>
            <li><input type="text" placeholder='Sender Address' onChange={(e)=>setSender(e.target.value)}/>
                <input type="text" placeholder='Recipient Address' onChange={(e)=>setRecipient(e.target.value)}/>
                <input type="text" placeholder='Amount' onChange={(e)=>setTransferAmount(e.target.value)}/></li>
            <li><button onClick={handleTransferForm}>TransferFrom</button></li>
        </ul>
    </div>
  </>
}

