import store from '@/store'
// 常量、公共方法 - 业务相关

export const UPLOAD_URL = `${process.env.REACT_APP_BASE_URL}/manage/public/file/fastDfs/upload`
export const WEEKOPTIONS = [
  { text: '周一', value: 1 },
  { text: '周二', value: 2 },
  { text: '周三', value: 3 },
  { text: '周四', value: 4 },
  { text: '周五', value: 5 },
  { text: '周六', value: 6 },
  { text: '周日', value: 7 },
]

export let getToken = () => store.getState().global.token

export let resJudge = (r) => Boolean(r && r.code === 200)
