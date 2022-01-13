// 常量、公共方法 - 业务相关
import db from './storage'
export const UPLOAD_URL = `${process.env.REACT_APP_BASE_URL}/manage/public/file/fastDfs/upload`

export let getToken = () => db.get('ACCESS_TOKEN', 'test')

export let resJudge = (r) => Boolean(r && r.code === 200)
