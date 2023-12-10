//商品接口
import axios from "@/axios.js";
//增加商品
export function addGoods(data) {
  return axios.post("/admin/goods", data);
}
//获取商品列表
export function getGoodsList(page = 1, data) {
  return axios.get("/admin/goods/" + page, { params: data });
}
