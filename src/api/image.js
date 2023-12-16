import axios from "@/axios.js";
// 后台首页统计1
//获取图库分类
export function getimageClass(page) {
  return axios.get("/admin/image_class/" + page);
}
//增加图库分类
export function createimageClass(name, order) {
  return axios.post("/admin/image_class", {
    name,
    order,
  });
}
//修改图库分类
export function upimageClass(id, name, order) {
  return axios.post("/admin/image_class/" + id, {
    name,
    order,
  });
}
//删除图库分类
export function deleteimageClass(id) {
  return axios.post(`/admin/image_class/${id}/delete`);
}
// 获取指定分类下的图片列表
export function getimageList(page, id) {
  console.log(id, page);
  return axios.get(`/admin/image_class/${id}/image/${page}`);
}
//修改图片名称

export function upimageName(id, name) {
  return axios.post(`/admin/image/` + id, {
    name,
  });
}
//删除图片
export function deleteimage(ids) {
  return axios.post(`/admin/image/delete_all`, {
    ids,
  });
}

//上传图片
export const uploadimage = "/api/admin/image/upload";
