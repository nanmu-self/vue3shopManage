import axios from "@/axios.js";
// 增加商品规格
export function addSku(data) {
  return axios.post("/admin/skus", data);
}
//修改商品规格
export function updateSku(id, data) {
  return axios.post(`/admin/skus/${id}`, data);
}
//获取商品规格列表
export function getSkuList(page) {
  return axios.get("/admin/skus/" + page);
}
//批量删除商品规格
export function deleteSku(id) {
  // 判断id是否为数组
  if (!Array.isArray(id)) {
    id = [id];
  }
  return axios.post(`/admin/skus/delete_all`, {
    ids: id,
  });
}
//修改商品规格状态
export function updateSkuStatus(id, status) {
  return axios.post(`/admin/skus/${id}/update_status`, {
    status,
  });
}
//选择设置商品规格选项和值
export function selectGoodsSpecOptionValue(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}/set`, data);
}
