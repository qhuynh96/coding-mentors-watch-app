import axios from "axios"
import { Dispatch } from "redux"
import { ActionType } from "../action-types"
import { RoomAction } from "../actions"

export const createRoom = (userId: string) => async (dispatch: Dispatch<RoomAction>) =>{
   try {
       dispatch({
           type: ActionType.CREATEROOMLOADING,
           payload: ""
       })

       const res = await axios.get("http://localhost:5000/watch-app")
       dispatch({
        type: ActionType.CREATEROOMSUCCESS,
        payload: res.data
    })
       console.log(res)
   } catch (err) {
       dispatch({
           type: ActionType.CREATEROOMFAILURE,
       })
   }
}

