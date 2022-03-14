import { useContext } from "react";
import { useState, useEffect } from "react";
import {v4} from 'uuid'
import { RoomProps, RoomsContext, useRooms } from "./context/RoomsContext";
import { RoomEvent, SocketProps } from "./interface";

function App({ socket }: SocketProps) {
  const [userId,setUserId]= useState<string | null>(null)
  //Context
  const {rooms,getRooms,addNewRoom} = useContext(RoomsContext)
  //socket on
  socket.on(RoomEvent.SERVER_ROOMS,({rooms,userId})=>{    
    setUserId(userId)
    getRooms && getRooms(rooms)
  })

  socket.on(RoomEvent.CREATED_ROOM,newRoom=>{
    addNewRoom && addNewRoom(newRoom)
  })
  socket.on(RoomEvent.JOINED_ROOM,({userId,roomId})=>{
  })
  //create rooms
  const createRoom = ():void =>{
    socket.emit(RoomEvent.CREATE_ROOM,{roomId:generateRoomId()})    
  }
  //join room
  const joinRoom = (roomId: string): void =>{
    socket.emit(RoomEvent.JOIN_ROOM,{roomId})
  }
  //Generate RoomId
  const generateRoomId = () =>{
    const roomId = v4()
    return roomId
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
