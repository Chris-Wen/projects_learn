import db from '@/utils/storage'

//actionType
const globalActionType = {
  TOKEN_ACTION: 'TOKEN_ACTION',
}

//state
let defaultState = {
  token: db.get('ACCESS_TOKEN', ''),
}

//action
export const changeTokenAction = (payload) => {
  db.save('ACCESS_TOKEN', payload, true)
  return {
    type: globalActionType.TOKEN_ACTION,
    payload,
  }
}

//reducer
export function globalReducer(state = defaultState, { type, payload }) {
  switch (type) {
    case globalActionType.TOKEN_ACTION:
      return {
        ...state,
        token: payload,
      }

    default:
      return state
  }
}
