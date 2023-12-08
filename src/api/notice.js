import axios from "@/axios.js";
// 获取公告列表
export function getNotice(page) {
  return axios.get("/admin/notice/" + page);
}
//增加公告
export function addNotice(title, content) {
  return axios.post("/admin/notice", {
    title,
    content,
  });
}
//修改公告
export function updateNotice(id, title, content) {
  console.log(id, title, content);
  return axios.post("/admin/notice/" + id, {
    title,
    content,
  });
}

//删除公告
export function deleteNotice(id) {
  return axios.post(`/admin/notice/${id}/delete`);
}
