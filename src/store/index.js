import { createStore, combineReducers } from 'redux'
import courseReducer from './reducers/course'

const reducers = combineReducers({
  course: courseReducer,
})

console.log(reducers)

let store = createStore(reducers)

export default store
