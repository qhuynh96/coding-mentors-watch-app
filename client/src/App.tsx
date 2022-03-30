import { useState, useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomProps, RoomsContext, useRooms } from "./context/RoomsContext";
import { RoomEvent } from "./RoomEvent";
import { Socket } from "socket.io-client";
import HomePage from "./pages/HomePage";
import NewRoom from "./pages/NewRoom";
import NotFound from "./pages/NotFound";
import { useStorage } from "./hooks/useStorage";
import { v4 as uuidv4 } from "uuid";
import { serverAxios } from "./api/server";
import axios from "axios";
import { useCallback } from "react";

type Props = {
  socket: Socket;
};

function App({ socket }: Props) {
  const getUserId = async () => {
    const res = await serverAxios.get("/watch-app/user");
    return res.data;
  };
  //store in browser
  const [auth] = useStorage("userId", getUserId());
  const { rooms, getRooms, addNewRoom } = useContext(RoomsContext);

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
