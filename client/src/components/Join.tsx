import React, { useState } from 'react'
import { useEffect } from 'react'
import { io,Socket } from 'socket.io-client'
interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
  }
  
  interface ClientToServerEvents {
    hello: () => void;
  }
    
const Join = () => {
   
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("");
    useEffect(()=>{
        console.log(socket)
    },[])
    const [name,setName] = useState('')
    const [room,setRoom] = useState('')
  return (
    <div>Join</div>
  )
}

export default Join