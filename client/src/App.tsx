import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

type Props = {
  socket: Socket;
};

function App({ socket }: Props) {
  const [serverStatus, setServerStatus] = useState("connecting to server...");

  useEffect(() => {
    fetch("http://localhost:5000/watch-app")
      .then((res) => res.json())
      .then((res) => setServerStatus(res.message))
      .catch((error) => setServerStatus(error.message));
  }, []);

  return (
    <>
      <p>Server status: {serverStatus}</p>
    </>
  );
}

export default App;
