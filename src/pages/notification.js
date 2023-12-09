import React, { useEffect, useState } from 'react'
import Example from '@/components/sidebar'
import * as PushSDK from '@pushprotocol/restapi'
import {ethers} from 'ethers';
import { useWalletClient } from 'wagmi'

export default function notification ()  {
    const { data: walletClient } = useWalletClient()
    console.log(walletClient)
    const recepientAddress = ""
    const [notifications,setNotifications] = useState([]);
    //const provider = new ethers.providers.Web3Provider(window.ethereum)
   // const signer = provider.getSigner()
    useEffect(()=>{
        const notifications = async() =>{
            const notifs = await PushSDK.user.getFeeds({
                user:recepientAddress,
                env:"staging"
            })
            setNotifications(notifs)
            console.log(notifs)
        }
        notifications()
    })
  return (
    <div>
    <Example/>
     </div>

  )
}
