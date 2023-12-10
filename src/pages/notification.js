import React, { useEffect, useState } from 'react'
import Example from '@/components/sidebar'
import * as PushSDK from '@pushprotocol/restapi'
import {ethers} from 'ethers';
import { useWalletClient } from 'wagmi'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function notification ()  {
    const { address, isConnecting, isDisconnected } = useAccount()
    // console.log(walletClient) 
    const recepientAddress = ""
    const [notifications,setNotifications] = useState([]);
    
    useEffect(()=>{
        if (window?.ethereum && address) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            console.log(signer)
            const notifications = async() =>{
                const notifs = await PushSDK.user.getFeeds({
                    user:address,
                    env:"staging"
                })
                setNotifications(notifs)
                console.log(notifs)
            }
            notifications()
        }
    }, [address])
  return (
    <div>
    <Example/>
     </div>

  )
}
