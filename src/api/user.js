import axios from "@/axios.js";

// 用户列表
export function getUserList(page, data) {
  return axios.get("/admin/user/" + page, { params: data });
}
// 增加用户
export function addUser(data) {
  return axios.post("/admin/user", data);
}
// 修改用户
export function updateUser(id, data) {
  return axios.post("/admin/user/" + id, data);
}
//修改用户状态
export function updateUserStatus(id, data) {
  return axios.post(`/admin/user/${id}/update_status`, data);
}
//删除会员
export function deleteUser(id) {
  return axios.post(`/admin/user/${id}/delete`);
}
