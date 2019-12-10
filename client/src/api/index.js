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

/* 获取具体分类 */
export const reqCategory = data => ajax('/manage/category/info', data)

/* 获取商品分页列表 */
export const reqProducts = data => ajax('/manage/product/list', data)

/* 搜索商品分页列表 */
export const reqSearchProducts = data => ajax('/manage/product/search', data)

/* 更新商品状态(上架/下架) */
export const reqUpdateStatus = data => ajax('/manage/product/updateStatus', data, "POST")

/* 添加商品 */
export const reqAddProduct = data => ajax('/manage/product/add', data, "POST")

/* 更新商品 */
export const reqUpdateProduct = data => ajax('/manage/product/update', data, "POST")

/* 获取所有角色列表 */
export const reqRoles = data => ajax('/manage/role/list', data)

/* 添加角色 */
export const reqAddRole = data => ajax('/manage/role/add', data, "POST")