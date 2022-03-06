import { Server, Socket } from "socket.io";

function socket({io}: {io: Server}) {
    io.on('connect', (socket: any)=>{
        console.log('we have a new connection');
      
        socket.on('disconnect',()=>{
            console.log('user has left')
        })
      })
}

export default socket