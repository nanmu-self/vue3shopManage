import axios from "@/axios.js";
// 增加商品规格

export function addSku(status, name, order, norm) {
  return axios.post("/admin/skus", {
    status,
    name,
    order,
    default: norm,
  });
}
