import * as actionTypes from './actionTypes'
import db from '@/utils/storage'

let defaultState = {
  courseType: db.get('courseType', []),
  subjects: db.get('subject', []),
}

function courseReducer(state = defaultState, { type, payload = {} }) {
  switch (type) {
    case actionTypes.SET_COURSE_TYPE:
      return {
        ...state,
        courseType: payload,
      }
    case actionTypes.SET_SUBJECTS:
      return {
        ...state,
        subjects: payload,
      }

    default:
      return state
  }
}

export default courseReducer
