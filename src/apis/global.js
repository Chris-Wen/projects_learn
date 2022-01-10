import request from '@/utils/request'

export async function getTest() {
  return await request.get('/system/user/getLoginInfo')
}

export async function getSubject() {
  return await request.get('/manage/course/listCourseSubject')
}
