//会员等级
import axios from "@/axios.js";

//会员等级列表
export function levelList(page) {
  return axios.get("/admin/user_level/" + page);
}
//增加会员等级
export function levelAdd(data) {
  return axios.post("/admin/user_level", data);
}
//修改会员等级状态
export function levelStatus(id, data) {
  return axios.post(`/admin/user_level/${id}/update_status`, data);
}
//修改会员等级
export function levelUpdate(id, data) {
  return axios.post(`/admin/user_level/` + id, data);
}
// 删除会员等级
export function levelDelete(id) {
  return axios.post(`/admin/user_level/${id}/delete`);
}
