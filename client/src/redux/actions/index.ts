import { ActionType } from "../action-types";
import { RoomData } from "../reducers/roomReducer";

interface CreateRoomLoading{
    type: ActionType.CREATEROOMLOADING
}

interface CreateRoomSuccess{
    type: ActionType.CREATEROOMSUCCESS
    payload: RoomData
}

interface CreateRoomFailure{
    type: ActionType.CREATEROOMFAILURE
}

export type RoomAction = CreateRoomLoading | CreateRoomSuccess | CreateRoomFailure