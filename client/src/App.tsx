import HomePage from "./components/HomePage";
import NewRoom from "./components/NewRoom";
import { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { RoomProps, RoomsContext, useRooms } from "./context/RoomsContext";
import { RoomEvent } from "./RoomEvent"
import { Socket } from "socket.io-client";

type Props = {
  socket: Socket;
};

function App({ socket }: Props) {
  const [userId, setUserId] = useState<string | null>(null);

  const { rooms, getRooms, addNewRoom } = useContext(RoomsContext);

  socket.on(RoomEvent.SERVER_ROOMS, ({ rooms, userId }) => {
    setUserId(userId);
    getRooms && getRooms(rooms);
  });

  socket.on(RoomEvent.CREATED_ROOM, (newRoom) => {
    addNewRoom && addNewRoom(newRoom);
  });

  socket.on(RoomEvent.JOINED_ROOM, ({ userId, roomId }) => {});

  const createRoom = (): void => {
    socket.emit(RoomEvent.CREATE_ROOM, { roomId: generateRoomId() });
  };

  const joinRoom = (roomId: string): void => {
    socket.emit(RoomEvent.JOIN_ROOM, { roomId });
  };

  const generateRoomId = (): string => {
    return uuidv4();
  };

  const [serverStatus, setServerStatus] = useState("connecting to server...");

  useEffect(() => {
    fetch("http://localhost:5000/watch-app")
      .then((res) => res.json())
      .then((res) => setServerStatus(res.message))
      .catch((error) => setServerStatus(error.message));
  });

  return (
    <>
      {/* <p>Server status: {serverStatus}</p> */}
      {/* <HomePage /> */}
      <NewRoom />
      <button onClick={createRoom}>Create Room</button>
      <p>Server status: {serverStatus}</p>
    </>
  );
}

export default App;
