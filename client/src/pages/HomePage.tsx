import { useState, useEffect, useContext } from "react";
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
  const [roomID, setRoomID] = useState<string | null>(null);
  const [inputRoomID, setInputRoomID] = useState<string>("");

  const { rooms, getRooms, addNewRoom } = useContext(RoomsContext);

  socket.on(RoomEvent.SERVER_ROOMS, ({ rooms, userId }) => {
    setUserId(userId);
    getRooms && getRooms(rooms);
  });

  socket.on(RoomEvent.CREATED_ROOM, (newRoom) => {
    addNewRoom && addNewRoom(newRoom);
    setRoomID(newRoom.roomId);
  });

  socket.on(RoomEvent.JOINED_ROOM, ({ userId, roomId }) => {
    setRoomID(roomId);
  });

  const createRoom = (): void => {
    socket.emit(RoomEvent.CREATE_ROOM, { roomId: generateRoomId() });
  };

  const joinRoom = (roomId: string): void => {
    socket.emit(RoomEvent.JOIN_ROOM, { roomId });
  };

  const generateRoomId = (): string => {
    return uuidv4();
  };

  useEffect(() => {
    /**
     * the if condition if used to prevent useEffect run on first render
     * when roomID === null, and the client will be directed to /room/null
     * TODO: there might be a better alternative
     */
    if (roomID !== null) {
      navigate(`/room/${roomID}`);
    }
    return () => {
      setRoomID(null);
    };
  }, [roomID, navigate]);

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
        onChange={(event) => setInputRoomID(event.target.value)}
        placeholder="Enter room ID"
      />
      <Button onClick={() => joinRoom(inputRoomID)}>Join</Button>
    </div>
  );
}

export default HomePage;
