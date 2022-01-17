import * as actionTyps from './actionTypes'
import { getCourseType, getSubject } from '@/apis/global'
import { resJudge } from '@/utils/global'
import db from '@/utils/storage'

// 课程类型Action
export const changeCourseTypeAction = (payload) => {
  db.save('courseType', payload)
  return {
    type: actionTyps.SET_COURSE_TYPE,
    payload,
  }
}

//科目类型Action
export const changeSubjectsAction = (payload) => {
  db.save('subjects', payload)
  return {
    type: actionTyps.SET_SUBJECTS,
    payload,
  }
}

//------------- 异步action -----------------

export const getCourseTypeAction = () => async (dispatch) => {
  let r = await getCourseType()
  resJudge(r) && dispatch(changeCourseTypeAction(r.data))
}

export const getSubjectsAction = () => async (dispatch) => {
  let r = await getSubject()
  resJudge(r) && dispatch(changeSubjectsAction(r.data))
}
