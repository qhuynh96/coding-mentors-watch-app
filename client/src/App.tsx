import { useState } from "react";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:5000");

  const [serverStatus, setServerStatus] = useState("connecting to server...");

  const fetchServerStatus = () => {
    fetch("http://localhost:5000/watch-app")
      .then((res) => res.json())
      .then((res) => setServerStatus(res.message))
      .catch((error) => setServerStatus(error.message));
  };

  fetchServerStatus();

  return (
    <>
      <p>Server status: {serverStatus}</p>
    </>
  );
}

export default App;
