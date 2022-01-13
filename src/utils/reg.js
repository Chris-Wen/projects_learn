/**
 * 正则表达式
 */

//中英文数字，正则
export const zywRange28 = /^[\u4E00-\u9FA5A-Za-z0-9]{2,8}$/
//正整数
export const integerReg = /^[1-9]\d*$/
//价格
export const priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
