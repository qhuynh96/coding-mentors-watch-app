import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { io } from "socket.io-client";
import { SOCKET_URL } from "./config/default";
import { RoomsContextProvider } from "./context/RoomsContext";

const socket = io(SOCKET_URL);

ReactDOM.render(
  <React.StrictMode>
    <RoomsContextProvider>
      <App socket={socket} />
    </RoomsContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
