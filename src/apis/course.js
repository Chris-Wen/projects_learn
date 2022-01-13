import request from '@/utils/request'

export async function getCourseLabel(subjectId, ageIds) {
  return await request.get('/manage/course/listCourseLabel', { subjectId, ageIds })
}

export async function addCourse(params) {
  return await request.post('/manage/course/save', params, 'application/json')
}
