import { useState, useEffect } from "react";
import {v4} from 'uuid'
import { RoomProps, useRooms } from "./context/RoomsContext";
import { RoomEvent, SocketProps } from "./interface";

function App({ socket }: SocketProps) {
  
  //Context
  const {rooms,getRooms,addNewRoom} = useRooms()
  //socket on
  socket.on(RoomEvent.SERVER_ROOMS,rooms=>{    
    //getRooms does not work but console.log work
    getRooms && getRooms(rooms)
  })
  socket.on(RoomEvent.CREATED_ROOM,newRoom=>{
  })
  socket.on(RoomEvent.JOINED_ROOM,({userId,roomId})=>{
  })
  //create rooms
  const createRoom = () =>{
    const roomId = v4()
    socket.emit(RoomEvent.CREATE_ROOM,roomId)
  }
  //join room
  const joinRoom = (roomId: string) =>{
    socket.emit(RoomEvent.JOIN_ROOM,roomId)
  }

  console.log(rooms)
  

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
