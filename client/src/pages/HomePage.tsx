import { useState, useEffect, useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { RoomEvent } from "../RoomEvent";
import { RoomsContext } from "../context/RoomsContext";
type Props = {
  socket: Socket;
  auth: string | null;
};

function HomePage({ socket, auth }: Props) {
  const navigate = useNavigate();
  const [inputRoomID, setInputRoomID] = useState<string>("");
  const { rooms, getRooms, addNewRoom } = useContext(RoomsContext);

  const createRoom = useCallback(() => {
    socket.emit(RoomEvent.CREATE_ROOM, { roomId: uuidv4(), userId: auth });
  }, [socket,auth]);

  const joinRoom = useCallback(() => {
    socket.emit(RoomEvent.JOIN_ROOM, { roomId: inputRoomID, userId: auth });
  }, [inputRoomID, socket,auth]);

  useEffect(() => {
    socket.on(RoomEvent.CREATED_ROOM, ({ userId, newRoom }) => {
      addNewRoom && addNewRoom(newRoom);

      auth === userId &&
        navigate(`/room/${newRoom.roomId}`, {
          state: { userId, roomInfo: newRoom },
        });
    });

    socket.on(RoomEvent.JOINED_ROOM, ({ userId, roomInfo }) => {
      // TODOs: add roomInfo into context for homepage display
      auth === userId &&
        navigate(`/room/${roomInfo.roomId}`, { state: { userId, roomInfo } });
    });
  }, [addNewRoom, getRooms, socket, navigate,auth]);

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
