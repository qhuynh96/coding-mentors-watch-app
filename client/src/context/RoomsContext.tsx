import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

export interface RoomProps {
    roomId:string,
    admin: string,
    members: string[]
}

interface RoomsContext {
    rooms?: RoomProps[] 
    getRooms?: (rooms: RoomProps[]) => void
    addNewRoom?: (room: RoomProps) => void
}

export const RoomsContext = createContext<RoomsContext >({})

export const RoomsContextProvider: React.FC<React.ReactNode> = ({children}) =>{
    const [rooms,setRooms] = useState<RoomProps[]>([])
    //get rooms
    const getRooms = (rooms: RoomProps[]):void =>{
        setRooms(rooms)
    }
    //add new room
    const addNewRoom = (room: RoomProps):void =>{
        setRooms([...rooms,room])
    }
    return (
        <RoomsContext.Provider value={{rooms,getRooms,addNewRoom}}>
            {children}
        </RoomsContext.Provider>
    )
}

export const useRooms =() => useContext(RoomsContext)