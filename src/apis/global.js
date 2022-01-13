import request from '@/utils/request'

export async function getSubject() {
  return await request.get('/manage/course/listCourseSubject')
}

export async function getGrade(subjectId) {
  return await request.get(`/manage/course/listCourseAgeBySubject?subjectId=${subjectId}`)
}

export async function getCourseType() {
  return await request.get('/manage/course/listCourseType')
}
