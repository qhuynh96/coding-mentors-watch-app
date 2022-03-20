import { useState, useContext } from "react";
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

  const { rooms, getRooms, addNewRoom } = useContext(RoomsContext);

  socket.on(RoomEvent.SERVER_ROOMS, ({ rooms, userId }) => {
    setUserId(userId);
    getRooms && getRooms(rooms);
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage socket={socket} />} />
        <Route
          path="/room/:roomID"
          element={<NewRoom socket={socket} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
