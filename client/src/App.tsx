import { useState, useEffect } from "react";
import {v4} from 'uuid'
import { RoomProps, useRooms } from "./context/RoomsContext";
import { RoomEvent, SocketProps } from "./interface";





function App({ socket }: SocketProps) {
  //Context
  const {rooms,getRooms,addNewRoom} = useRooms()
  //get rooms
  socket.on(RoomEvent.SERVER_ROOMS,rooms=>{
    
  })
  //create rooms
  const createRoom = () =>{
    const roomId = v4()
    socket.emit(RoomEvent.CREATE_ROOM,(roomId: string)=>{
      socket.on(RoomEvent.CREATED_ROOM,(newRoom: RoomProps)=>{
        console.log(newRoom)
      })
    })
  }
  

  const [serverStatus, setServerStatus] = useState("connecting to server...");

  useEffect(() => {
    fetch("http://localhost:5000/watch-app")
      .then((res) => res.json())
      .then((res) => setServerStatus(res.message))
      .catch((error) => setServerStatus(error.message));
  }, []);

  return (
    <>
      <button onClick={createRoom}>create Room</button>
      <p>Server status: {serverStatus}</p>
    </>
  );
}

export default App;
