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
//设置商品轮播图
export function setGoodsBanner(id, banners) {
  return axios.post("/admin/goods/banners/" + id, { banners });
}
//更新商品规格
export function updateGoodsSpec(id, data) {
  return axios.post("/admin/goods/updateskus/" + id, data);
}
//添加商品规格选项
export function addGoodsSpecOption(data) {
  return axios.post("/admin/goods_skus_card", data);
}
//修改商品规格选项
export function updateGoodsSpecOption(id, data) {
  return axios.post("/admin/goods_skus_card/" + id, data);
}
//删除商品规格选项

export function deleteGoodsSpecOption(id) {
  return axios.post(`/admin/goods_skus_card/${id}/delete`);
}
//排序商品规格选项
export function sortGoodsSpecOption(data) {
  return axios.post(`/admin/goods_skus_card/sort`, {
    sortdata: data,
  });
}
//添加商品规格选项的值
export function addGoodsSpecOptionValue(data) {
  return axios.post("/admin/goods_skus_card_value", data);
}
//修改商品规格选项的值
export function updateGoodsSpecOptionValue(id, data) {
  return axios.post("/admin/goods_skus_card_value/" + id, data);
}
//删除商品规格选项的值
export function deleteGoodsSpecOptionValue(id) {
  return axios.post(`/admin/goods_skus_card_value/${id}/delete`);
}
