import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { io } from "socket.io-client";
import { SOCKET_URL } from "./config/default";

const socket = io(SOCKET_URL);

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket}/>
  </React.StrictMode>,
  document.getElementById("root")
);