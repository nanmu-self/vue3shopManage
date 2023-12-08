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
