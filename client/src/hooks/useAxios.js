import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { serverAxios } from "../api/server";

// type Props = {
//   socket: Socket;
// };

function useAxios(params) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (params) => {
    try {
      const result = await serverAxios.request(params);
      setResponse(result.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(params);
  }, []);

  return { response, error, loading };
}

export default useAxios;
