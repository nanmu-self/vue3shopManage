// 商品分类
import axios from "@/axios.js";
//获取商品分类列表
export function getCategoryList(params) {
  return axios.get("/admin/category");
}
