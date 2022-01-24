import request from '@/utils/request'

//获取运营列表
export async function getBannerList(params) {
  return await request.get('/manage/banner/page', params)
}

//运营列表数据删除
export async function deleteBData(id) {
  return await request.post('/manage/banner/delete', { id })
}

//运营数据新增
export async function addBData(params) {
  return await request.post('/manage/banner/save', params)
}

//运营数据更新
export async function updateBData(params) {
  return await request.post('/manage/banner/update', params)
}

//运营数据上下架
export async function changeBStat(id) {
  return await request.post('/manage/banner/upDown', { id })
}
