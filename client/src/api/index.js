import ajax from "./ajax";

/* 用户登录 */
export const reqLogin = data => ajax('/login', data, "POST")

/* 新增用户 */
export const reqUserAdd = data => ajax('/manage/user/add', data, "POST")

/* 获取分类列表 */
export const reqCategories = data => ajax('/manage/category/list', data)

/* 添加分类 */
export const reqCategoryAdd = data => ajax('/manage/category/add', data, "POST")

/* 修改分类 */
export const reqCategoryUpdate = data => ajax('/manage/category/update', data, "POST")