import { useAccount, useBalance, useReadContract, useReadContracts, useWriteContract  } from 'wagmi'
import { erc20Abi, parseUnits } from 'viem';
import { useChainId } from 'wagmi'
import { useState, useEffect } from 'react';
import { SocketAddress } from 'net';
import { readContract } from 'viem/actions';
import { myerc20Abi } from './myerc20abi';

export function Hooks() {
    const account = useAccount();
    const chainId = useChainId();
    const writeContract = useWriteContract();
    const [spender, setSpender] = useState("");
    const [isAuto, setIsAuto] = useState(false);
    const [Traddress, setTrAddress] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    

	

    console.log("chainId: ", chainId);
    const TokenAddress: `0x${string}` = chainId === 1 //반드시 0x로 시작해야함
        ? "0xdAC17F958D2ee523a2206206994597C13D831ec7" 
        // :"0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; //usdc
        // : "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0"; // Sepolia
        :"0x6A7577c10cD3F595eB2dbB71331D7Bf7223E1Aac" //busd sepolia

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

	const {data: decimals} = useReadContract({
		...wagmiReadContract,
		functionName: 'decimals',
		address: TokenAddress,
		abi: erc20Abi,
	});
	console.log("decimals: ", decimals);
	const aumountDecimals = parseUnits(transferAmount, Number(decimals));



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
			functionName: 'balanceOf',
			args: [account.address as `0x${string}`],
		} as const,
        {
            ...wagmiReadContract,
            abi: erc20Abi,
            args: [account.address as `0x${string}`,  spender as `0x${string}`],
            functionName: 'allowance',
        } as const,
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
            args: [Traddress as `0x${string}`, aumountDecimals], //받는 주소와 수량
            chainId: 11155111
        })
    }

    // const handleBurnToken = () => {
    //     writeContract.writeContract({
    //         abi: erc20Abi,
    //         address: TokenAddress,
    //         functionName: 'transfer',
    //         args: ['0x000000000000000000000000000000000000dEaD' as `0x${string}`, aumountDecimals], 
    //         chainId: 11155111
    //     })
    // }
    const handleBurnToken = () => {
        writeContract.writeContract({
            abi: myerc20Abi,
            address: TokenAddress,
            functionName: 'burn',
            args: [aumountDecimals], 
            
        })
    }
    const handleMintToken = () => {
        writeContract.writeContract({
            abi: myerc20Abi,
            address: TokenAddress,
            functionName: 'mint',
            args: [aumountDecimals], 
            
        })
    }

  return <>
    <div>
		<h3>Account1: 0x2C8cF493f47cC6BdB5a819bEE1aC15225EC7af9A</h3>
		<h3>Account2: 0x8124B5BEE7b8fAc709eadd329C9E7C7666289619</h3>
        <ul>
            <li>Balance:  {balance?.formatted} {balance?.symbol}</li>
            <li>ChainId : {chainId}</li>
            <li>Total Supply:  {supply?.toString()}</li>
			<li>My balance: {balance?.formatted} {balance?.symbol}</li>
            <button onClick={() => setIsAuto(!isAuto)}>{isAuto ? 'auto renew' : 'auto renew on'}</button>

      {/* 2. 수동 리프레시 버튼 */}
            <button onClick={() => supplyRefetch()} disabled={isAuto}> Renew</button>
            <li>Symbol:  {result.data?.[0]?.result?.toString()}</li>
            <li>Allowance:  {result.data?.[1]?.result?.toString()}</li>
            <li><input type="text" placeholder='spender adderess' onChange={(e)=>setSpender(e.target.value)}/></li>
            <li><button onClick={handleApprove}>Approve</button></li>

            <li><input type="text" placeholder='Address' onChange={(e)=>setTrAddress(e.target.value)}/> 
                <input type="text" placeholder='Transfer or Burn or Mint Amount ' onChange={(e)=>setTransferAmount(e.target.value)}/></li>

            <li><button onClick={handleTransToken}>Transfer</button></li>
            <li><button onClick={handleBurnToken}>Burn</button> <button onClick={handleMintToken}>Mint</button></li>
        </ul>
    </div>
  </>
}

