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
//修改商品
export function updateGoods(id, data) {
  return axios.post("/admin/goods/" + id, data);
}
//批量删除商品
export function deleteGoods(id) {
  if (!Array.isArray(id)) {
    id = [id];
  }
  return axios.post("/admin/goods/delete_all", {
    ids: id,
  });
}
//批量上架下架商品
export function updateGoodsStatus(ids, status) {
  return axios.post("/admin/goods/changestatus", {
    ids,
    status,
  });
}
//查看商品资料
export function getGoodsInfo(id) {
  return axios.get("/admin/goods/read/" + id);
}
