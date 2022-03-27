import { useState, useEffect, useContext, useCallback } from "react";

import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { RoomEvent } from "../RoomEvent";
import { RoomProps, RoomsContext } from "../context/RoomsContext";
type Props = {
  socket: Socket;
};


function HomePage({ socket }: Props) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [inputRoomID, setInputRoomID] = useState<string>("");

  const { rooms, getRooms, addNewRoom } = useContext(RoomsContext);
  
  const createRoom = useCallback(() => {
    socket.emit(RoomEvent.CREATE_ROOM, { roomId: uuidv4(), userId });    
  }, [userId,socket]);

  const joinRoom = useCallback(() => {
    socket.emit(RoomEvent.JOIN_ROOM, { roomId: inputRoomID });
    navigate(`/room/${inputRoomID}`,{state: {userId}});
  }, [inputRoomID, socket,userId]);
  
  useEffect(()=>{
    socket.on(RoomEvent.SERVER_ROOMS, ({ rooms, userId }) => {
      setUserId(userId);
      getRooms && getRooms(rooms);
    });
  },[socket])

  useEffect(() => {    
    socket.on(RoomEvent.CREATED_ROOM, ({newRoom}) => {
      addNewRoom && addNewRoom(newRoom);
      //To prevent navigating all clients to new room, we put a condition
      userId === newRoom.admin && navigate(`/room/${newRoom.roomId}`,{state: {userId}});  
    });
    
  }, [userId]);

  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Button onClick={createRoom}>Create Room</Button>
      <TextField
        label="RoomID"
        id="roomID-input"
        type="text"
        value={inputRoomID}
        onChange={useCallback(
          (event) => setInputRoomID(event.target.value),
          []
        )}
        placeholder="Enter room ID"
      />
      <Button onClick={joinRoom}>Join</Button>
    </div>
  );
}

export default HomePage;
