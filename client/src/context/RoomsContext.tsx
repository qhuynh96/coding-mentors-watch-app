import { useCallback } from "react";
import { FC, ReactNode, useState, useContext, createContext } from "react";

export interface IVideo {
  url: string; // https
  playing: boolean; // true ? play : pause
  playAt: number; // (milisecond) time the video played at
  totalOffsetTime: number; // (milisecond) calculated when one of following events happen: pause or jump to an arbitrary point of time
}
export interface RoomProps {
  roomId: string;
  admin: string;
  members: string[];
  onPlay: IVideo;
  videos: string[];
}

interface RoomsContextInterface {
  rooms?: RoomProps[];
  getRooms?: (rooms: RoomProps[]) => void;
  addNewRoom?: (room: RoomProps) => void;
  playVideo?: (onPlay: IVideo, roomId: string) => void;
}

export const RoomsContext = createContext<RoomsContextInterface>({});

export const RoomsContextProvider: FC<ReactNode> = ({ children }) => {
  const [rooms, setRooms] = useState<RoomProps[]>([]);

  const getRooms = useCallback((rooms: RoomProps[]): void => {
    setRooms(rooms);
  }, []);

  const addNewRoom = useCallback((room: RoomProps): void => {
    setRooms([...rooms, room]);
  }, []);
  const playVideo = useCallback((videoOnPlay: IVideo, roomId: string): void => {
    setRooms(
      rooms.map((r: RoomProps) =>
        r.roomId === roomId ? { ...r, onPlay: videoOnPlay } : r
      )
    );
  }, []);
  return (
    <RoomsContext.Provider value={{ rooms, getRooms, addNewRoom, playVideo }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
