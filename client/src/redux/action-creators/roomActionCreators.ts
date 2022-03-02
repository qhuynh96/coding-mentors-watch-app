import axios from "axios"
import { Dispatch } from "redux"
import { ActionType } from "../action-types"
import { RoomData } from "../reducers/roomReducer"
export const createRoom = (userId: string) => async (dispatch: Dispatch) =>{
   try {
       dispatch({
           type: ActionType.CREATEROOMLOADING
       })

       const res = await axios.get("http://localhost:5000/watch-app")
       console.log(res)
   } catch (err) {
       dispatch({
           type: ActionType.CREATEROOMFAILURE
       })
   }
}

