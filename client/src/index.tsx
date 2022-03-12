import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket}/>
  </React.StrictMode>,
  document.getElementById("root")
);
