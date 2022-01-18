import request from '@/utils/request'

//获取课程标签
export async function getCourseLabel(subjectId, ageIds) {
  return await request.get('/manage/course/listCourseLabel', { subjectId, ageIds })
}
//新增课程
export async function addCourse(params) {
  return await request.post('/manage/course/save', params, 'application/json')
}

//修改课程
export async function updateCourse(params) {
  return await request.post('/manage/course/update', params, 'application/json')
}

//获取课程列表
export async function getCourseList(params) {
  return await request.get('/manage/course/page', params)
}
//获取课程详情
export async function getCourseDetail(courseId) {
  return await request.get('/manage/course/get', { courseId })
}

//修改上下架状态
export async function changeCourseStat(courseId) {
  return await request.get('/manage/course/upOrDown', { courseId })
}
