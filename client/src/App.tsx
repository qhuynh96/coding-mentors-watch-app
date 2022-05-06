import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomsContext } from "./context/RoomsContext";
import { Socket } from "socket.io-client";
import HomePage from "./pages/HomePage";
import NewRoom from "./pages/NewRoom";
import NotFound from "./pages/NotFound";
import { useStorage } from "./hooks/useStorage";
import { serverAxios } from "./api/server";
import  useAxios  from "./hooks/useAxios"
import useGetUserId from "./hooks/useGetUserId"
import useFetchRooms from "./hooks/useFetchRooms";

type Props = {
  socket: Socket;
};

function App({ socket }: Props) {
  const auth = useGetUserId({
    method:"get",
    url:"/watch-app/user"
  })

  useFetchRooms({
    method: "get",
    url:"/watch-app/rooms/"
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage auth={auth} socket={socket} />} />
        <Route path="/room/:roomId" element={<NewRoom socket={socket} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
