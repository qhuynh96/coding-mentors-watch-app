import { FC, ReactNode, useState, useContext, createContext } from "react";

export interface RoomProps {
  roomId: string;
  admin: string;
  members: string[];
}

interface RoomsContextInterface {
  rooms?: RoomProps[];
  getRooms?: (rooms: RoomProps[]) => void;
  addNewRoom?: (room: RoomProps) => void;
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

  return (
    <RoomsContext.Provider value={{ rooms, getRooms, addNewRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
