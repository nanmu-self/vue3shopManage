//商品评论

import axios from "@/axios.js";

// 商品评价列表
export function goodsCommentList(page) {
  return axios.get("/admin/goods_comment/" + page);
}
//回复商品评价
export function replyGoodsComment(id, data) {
  return axios.post("/admin/goods_comment/review/" + id, data);
}
//修改商品评价状态
export function updateGoodsComment(id, status) {
  return axios.post(`/admin/goods_comment/${id}/update_status`, { status });
}
