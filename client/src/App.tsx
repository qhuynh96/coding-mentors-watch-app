import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import HomePage from "./components/HomePage";
import NewRoom from "./components/NewRoom";

function App() {
  const socket = io("http://localhost:5000");

  const [serverStatus, setServerStatus] = useState("connecting to server...");

  useEffect(() => {
    fetch("http://localhost:5000/watch-app")
      .then((res) => res.json())
      .then((res) => setServerStatus(res.message))
      .catch((error) => setServerStatus(error.message));
  });

  return (
    <>
      <p>Server status: {serverStatus}</p>
      {/* <HomePage /> */}
      <NewRoom />
    </>
  );
}

export default App;
