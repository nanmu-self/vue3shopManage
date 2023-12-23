//会员等级
import axios from "@/axios.js";

//会员等级列表
export function levelList(page) {
  return axios.get("/admin/user_level/" + page);
}
