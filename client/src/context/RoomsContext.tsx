import { FC, ReactNode, useState, useContext, createContext } from "react";

type VideoProps ={
    src: string //https
    playing: Boolean // true ? play : pause
    start: string // ISOString
    pause: number // milisecond
}
export interface RoomProps {
  roomId: string;
  admin: string;
  members: string[];  
  onPlay?: VideoProps
  videos?: VideoProps['src'][]
}

interface RoomsContextInterface {
  rooms?: RoomProps[];
  getRooms?: (rooms: RoomProps[]) => void;
  addNewRoom?: (room: RoomProps) => void;
  playVideo?: (onPlay: VideoProps,roomId: string) => void

}

export const RoomsContext = createContext<RoomsContextInterface>({});

export const RoomsContextProvider: FC<ReactNode> = ({
  children,
}) => {
  const [rooms, setRooms] = useState<RoomProps[]>([]);

  const getRooms = (rooms: RoomProps[]): void => {
    setRooms(rooms);
  };

  const addNewRoom = (room: RoomProps): void => {
    setRooms([...rooms, room]);
  };
    const playVideo = (videoOnPlay: VideoProps,roomId: string):void =>{
    setRooms(rooms.map((r: RoomProps)=>r.roomId === roomId ? {...r, onPlay: videoOnPlay }: r))
}
  return (
    <RoomsContext.Provider value={{ rooms, getRooms, addNewRoom,playVideo }}>
      {children}
    </RoomsContext.Provider>
  );
};


export const useRooms = () => useContext(RoomsContext);
