import { BooleanLiteral } from "typescript"
import { ActionType } from "../action-types"
import { RoomAction } from "../actions"

const initialState: RoomState = {
    room: null,
    isLoading: false,
    error: false,
}

export interface RoomData {
    id: string;
    admin: string;
    members: string[]
}

export interface RoomState{
    room: RoomData | null;
    isLoading: Boolean;
    error: boolean
}


const reducer = (state = initialState , action: RoomAction) =>{
    switch (action.type) {
        case ActionType.CREATEROOMLOADING:
            return {
                isLoading: true
            }    
        case ActionType.CREATEROOMSUCCESS:
            return {
                isLoading: false,
                error: false,
                room: action.payload
            }
        case ActionType.CREATEROOMFAILURE:
            return{
                isLoading: false,
                error: true,
            }
        default:
            return state
    }
}

export default reducer