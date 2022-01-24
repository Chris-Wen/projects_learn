import { createStore, combineReducers, applyMiddleware } from 'redux'
import courseReducer from './reducers/course'
import { globalReducer } from './reducers'
import thunk from 'redux-thunk'

const reducers = combineReducers({
  global: globalReducer,
  course: courseReducer,
})

let store = createStore(reducers, applyMiddleware(thunk))

export default store
