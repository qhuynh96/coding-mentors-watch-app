import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Socket } from "socket.io-client";
import HomePage from "./pages/HomePage";
import NewRoom from "./pages/NewRoom";
import NotFound from "./pages/NotFound";

function App({socket}: {socket: Socket}) {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage socket={socket} />} />
        <Route path="/room/:roomId" element={<NewRoom socket={socket} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
