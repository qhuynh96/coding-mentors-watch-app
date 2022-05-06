import React from "react";
import { useContext, useEffect } from "react";
import useAxios from "./useAxios";
import { RoomsContext } from "../context/RoomsContext";

function useFetchRooms(params) {
  const { getRooms } = useContext(RoomsContext);
  const { response, error, loading } = useAxios(params);

  useEffect(() => {
    const fetchRooms = async () => {
      getRooms && getRooms(response);
    };
    fetchRooms();
  }, [getRooms]);
}

export default useFetchRooms;
