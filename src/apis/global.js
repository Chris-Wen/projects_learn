import request from '@/utils/request'

/**
 *  腾讯地图位置搜索推荐 --- jsonp 请求
 *
 * @export
 * @param {*} keyword  必传
 * @param {Number|String} adcode 必传
 * @returns
 */
export async function addressSearch(keyword, adcode) {
  if (!keyword || !adcode) return
  let params = {
    key: 'JFZBZ-OQJK4-4DIUC-XMBBA-RVNLV-IXBOU',
    orderby: '_distance',
    page_size: 10,
    output: 'jsonp',
    category: '培训,机构,教育',
    keyword,
    boundary: `region(${adcode}, 1)`,
    callback: 'searchCallback',
  }
  return await request.jsonp('https://apis.map.qq.com/ws/place/v1/search', params)
}

export async function addressLocation(address, region) {
  if (!address) return
  if (region) address = `${region}${address}`
  let params = {
    address,
    key: 'JFZBZ-OQJK4-4DIUC-XMBBA-RVNLV-IXBOU',
    output: 'jsonp',
    callback: 'addressCallback',
  }
  return await request.jsonp('https://apis.map.qq.com/ws/geocoder/v1/', params)
}

export async function getSubject() {
  return await request.get('/manage/course/listCourseSubject')
}

export async function getGrade(subjectId) {
  return await request.get(`/manage/course/listCourseAgeBySubject?subjectId=${subjectId}`)
}

export async function getCourseType() {
  return await request.get('/manage/course/listCourseType')
}
