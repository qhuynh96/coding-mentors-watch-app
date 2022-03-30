import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomsContext } from "./context/RoomsContext";
import { RoomEvent } from "./RoomEvent";
import { Socket } from "socket.io-client";
import HomePage from "./pages/HomePage";
import NewRoom from "./pages/NewRoom";
import NotFound from "./pages/NotFound";
import { useStorage } from "./hooks/useStorage";
import { serverAxios } from "./api/server";

type Props = {
  socket: Socket;
};

function App({ socket }: Props) {
  //store in browser
  const [auth, setAuth] = useStorage("userId", null);
  const { rooms, getRooms, addNewRoom } = useContext(RoomsContext);

  useEffect(() => {
    const getUserId = async () => {
      const res = await serverAxios.get("/watch-app/user");
      setAuth(res.data);
    };
    getUserId();
  }, []);
  useEffect(() => {
    socket.on(RoomEvent.SERVER_ROOMS, ({ rooms }) => {
      getRooms && getRooms(rooms);
    });
  }, [getRooms, socket]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage auth={auth} socket={socket} />} />
        <Route path="/room/:roomID" element={<NewRoom socket={socket} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
