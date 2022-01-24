import request from '@/utils/request'

/**
 * 班级管理相关接口
 */

//获取班级列表
export async function getClassesList(params) {
  return await request.get('/manage/class/page', params)
}

//获取班级详情
export async function getClassDetail(id) {
  return await request.get('/manage/class/get', { id })
}

export async function addClass(params) {
  return await request.post('/manage/class/save', params)
}

export async function updateClass(params) {
  return await request.post('/manage/class/update', params)
}

export async function getCourseList() {
  return await request.get('/manage/class/listCourse')
}

export async function getClassRoomList() {
  return await request.get('/manage/class/pageClassRoom', { current: 1, size: 1000 })
}

//名单相关
export async function getStudentList(classId) {
  return await request.get('/manage/class/classStudent/list', { classId })
}

export async function deleteStudent(registrationId) {
  return await request.get('/manage/class/classStudent/delete', { registrationId })
}

export async function cancelPayment(registrationId) {
  return await request.get('/manage/class/classStudent/cancelPayment', { registrationId })
}

export async function payment(params) {
  return await request.post('/manage/class/classStudent/payment', params)
}

export async function refund(params) {
  return await request.post('/manage/class/classStudent/refund', params)
}

//签到相关接口
export async function getSignList(classId) {
  return await request.get('/manage/class/sign/list', { classId })
}

export async function getSingleList(params) {
  return await request.get('/manage/class/sign/get', params)
}

export async function sign(params) {
  return await request.post('/manage/class/sign/sign', params)
}

export async function updateSign(params) {
  return await request.post('/manage/class/sign/updateSign', params)
}
