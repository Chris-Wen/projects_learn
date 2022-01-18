import { createStore, combineReducers, applyMiddleware } from 'redux'
import courseReducer from './reducers/course'
import thunk from 'redux-thunk'

const reducers = combineReducers({
  course: courseReducer,
})

let store = createStore(reducers, applyMiddleware(thunk))

export default store
