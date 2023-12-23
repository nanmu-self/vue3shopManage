// 商品分类
import axios from "@/axios.js";
//获取商品分类列表
export function getCategoryList() {
  return axios.get("/admin/category");
}
//增加商品分类
export function addCategory(data) {
  return axios.post("/admin/category", data);
}
//修改商品分类
export function updateCategory(id, data) {
  return axios.post("/admin/category/" + id, data);
}
//删除商品分类
export function deleteCategory(id) {
  return axios.post(`/admin/category/${id}/delete`);
}
// 修改商品分类状态
export function updateCategoryStatus(id, data) {
  return axios.post(`/admin/category/${id}/update_status`, data);
}
