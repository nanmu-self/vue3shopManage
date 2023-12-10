import axios from "@/axios.js";

//增加优惠券
export function addCoupon(data) {
  return axios.post("/admin/coupon", data);
}
//修改优惠券
export function updateCoupon(id, data) {
  return axios.post("/admin/coupon/" + id, data);
}
//优惠券列表
export function getCouponList(page) {
  return axios.get("/admin/coupon/" + page);
}
//删除优惠券
export function deleteCoupon(id) {
  return axios.post(`/admin/coupon/${id}/delete`);
}
//失效优惠券
export function invalidCoupon(id, status = 0) {
  return axios.post(`/admin/coupon/${id}/update_status`, { status });
}
