import {combineReducers} from "redux"
import roomReducer from './roomReducer'

const reducers = combineReducers({
    bank: roomReducer
})

export default reducers

export type State = ReturnType<typeof reducers> 