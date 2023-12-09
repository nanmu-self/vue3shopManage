import axios from "@/axios.js";
// 登陆
export function login(username, password) {
  return axios.post("/admin/login", {
    username,
    password,
  });
}
// 获取用户信息
export function getInfo() {
  return axios.post("/admin/getinfo");
}
//退出登陆
export function logout() {
  return axios.post("/admin/logout");
}
//修改密码
export function changePassword(oldpassword, password, repassword) {
  return axios.post("/admin/updatepassword", {
    oldpassword,
    password,
    repassword,
  });
}
//管理员列表
export function getAdminList(page = 1, keyword = "", limit = 10) {
  return axios.get(`/admin/manager/${page}?limit=${limit}&keyword=${keyword}`);
}
//修改管理员状态
export function changeAdminStatus(id, status) {
  return axios.post(`/admin/manager/${id}/update_status`, {
    status,
  });
}
//增加管理员
export function addAdmin(username, password, role_id, status, avatar) {
  return axios.post("/admin/manager", {
    username,
    password,
    role_id,
    status,
    avatar,
  });
}
//修改管理员
export function updateAdmin(id, username, password, role_id, status, avatar) {
  return axios.post("/admin/manager/" + id, {
    username,
    password,
    role_id,
    status,
    avatar,
  });
}
//删除管理员
export function deleteAdmin(id) {
  return axios.post(`/admin/manager/${id}/delete`);
}
