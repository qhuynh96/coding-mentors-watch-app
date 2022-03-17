import { useState, useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomProps, RoomsContext, useRooms } from "./context/RoomsContext";
import { RoomEvent } from "./RoomEvent";
import { Socket } from "socket.io-client";
import HomePage from "./pages/HomePage";
import NewRoom from "./pages/NewRoom";

import NotFound from "./pages/NotFound";

type Props = {
  socket: Socket;
};

function App({ socket }: Props) {
  const [userId, setUserId] = useState<string | null>(null);

  const { rooms, getRooms, addNewRoom,playVideo } = useContext(RoomsContext);

  useEffect(() => {
    socket.on(RoomEvent.SERVER_ROOMS, ({ rooms, userId }) => {
      setUserId(userId);
      getRooms && getRooms(rooms);
    });
  }, [getRooms, socket]);

<<<<<<< HEAD
=======
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

    //Play video
    const handlePlay = (src: string, room: RoomProps) =>{
      if (!room.onPlay) {
        const videoOnPlay = {src, playing: true, start: (new Date()).toISOString(), pause: 0}
        playVideo && playVideo(videoOnPlay,room.roomId)
      //Emit to server
        socket.emit(RoomEvent.PLAY_VIDEO, {videoOnPlay,roomId: room.roomId})
      }     
      //Send resquest for next movie 
    }


  const [serverStatus, setServerStatus] = useState("connecting to server...");

  useEffect(() => {
    fetch("http://localhost:5000/watch-app")
      .then((res) => res.json())
      .then((res) => setServerStatus(res.message))
      .catch((error) => setServerStatus(error.message));
  });
>>>>>>> 446f86c (lay video and broadcast)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage socket={socket} />} />
        <Route path="/room/:roomID" element={<NewRoom socket={socket} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
