import request from '@/utils/request'

//获取学习地图列表
export async function getLocationList(params) {
  return await request.get('/manage/educationalMap/page', params)
}

//学习地图数据新增
export async function addLData(params) {
  return await request.post('/manage/educationalMap/save', params)
}

//学习地图数据更新
export async function updateLData(params) {
  return await request.post('/manage/educationalMap/update', params)
}

//学习地图数据上下架
export async function changeLStat(id) {
  return await request.get('/manage/educationalMap/upOrDown', { id })
}

//学习地图详情
export async function getLocationInfo(id) {
  return await request.get('/manage/educationalMap/get', { id })
}
