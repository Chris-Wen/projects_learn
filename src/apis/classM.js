import request from '@/utils/request'

/**
 * 班级管理相关接口
 */

//获取班级列表
export async function getClassesList(params) {
  return await request.get('/manage/class/page', params)
}

//获取班级详情
export async function getClassDetail(params) {
  return await request.get('/manage/class/get', params)
}

export async function addClass(params) {
  return await request.post('/manage/class/save', params, 'application/json')
}

export async function getCourseList() {
  return await request.get('/manage/class/listCourse')
}

export async function getClassRoomList() {
  return await request.get('/manage/class/pageClassRoom', { current: 1, size: 1000 })
}
