import { useState, useEffect, useContext, useCallback } from "react";

import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { RoomEvent } from "../RoomEvent";
import { RoomsContext } from "../context/RoomsContext";

type Props = {
  socket: Socket;
};

function HomePage({ socket }: Props) {
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);

  const [inputRoomID, setInputRoomID] = useState<string>("");

  const { rooms, getRooms, addNewRoom } = useContext(RoomsContext);

  const createRoom = useCallback((): void => {
    socket.emit(RoomEvent.CREATE_ROOM, { roomId: uuidv4() });
  }, [socket]);

  const joinRoom = useCallback(() => {
    socket.emit(RoomEvent.JOIN_ROOM, { roomId: inputRoomID });
  }, [inputRoomID, socket]);

  useEffect(() => {
    socket.on(RoomEvent.SERVER_ROOMS, ({ rooms, userId }) => {
      setUserId(userId);
      getRooms && getRooms(rooms);
    });

    socket.on(RoomEvent.CREATED_ROOM, (newRoom) => {
      addNewRoom && addNewRoom(newRoom);
      navigate(`/room/${newRoom.roomId}`);
    });

    socket.on(RoomEvent.JOINED_ROOM, ({ userId, roomId }) => {
      navigate(`/room/${roomId}`);
    });
  }, [addNewRoom, getRooms, navigate, socket]);


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
