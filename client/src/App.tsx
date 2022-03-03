import { useState } from "react";
import Join from "./components/Join";

function App() {
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
      <Join/>
    </>
  );
}

export default App;
