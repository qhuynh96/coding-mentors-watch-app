import { useCallback } from "react";
import { FC, ReactNode, useState, useContext, createContext } from "react";

export interface IVideo {
  url: string; // https
  playing: boolean; // true ? play : pause
  latestUpdateAt: number; // (second) start, seekTo, play & pause
  progress: number; // (second) video progress at latestUpdate
}
export interface IRoom {
  roomId: string;
  admin: string;
  members: string[];
  onPlay: IVideo;
  videos: string[];
}

interface RoomsContextInterface {
  rooms?: IRoom[];
  getRooms?: (rooms: IRoom[]) => void;
  addNewRoom?: (room: IRoom) => void;
}

export const RoomsContext = createContext<RoomsContextInterface>({});

export const RoomsContextProvider: FC<ReactNode> = ({ children }) => {
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const getRooms = useCallback(
    (rooms: IRoom[]) => {
      setRooms(rooms);
    },
    [setRooms]
  );

  const addNewRoom = useCallback(
    (room: IRoom) => {
      setRooms((prev) => [...prev, room]);
    },
    [setRooms]
  );

  return (
    <RoomsContext.Provider value={{ rooms, getRooms, addNewRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
