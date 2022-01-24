import request from '@/utils/request'

//小程序管理
export async function updateAppletsData(params) {
  return await request.post('/manage/miniApp/update', params)
}

export async function getAppletsList(params) {
  return await request.get('/manage/miniApp/page', params)
}
