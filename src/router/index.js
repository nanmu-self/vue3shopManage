import { createRouter, createWebHashHistory } from "vue-router";
import Index from "@/pages/index.vue";
import LOGIN from "@/pages/login.vue";
import NotFound from "@/pages/404.vue";
import Admin from "@/layouts/admin.vue";
const routes = [
  {
    path: "/",
    component: Admin,
    children: [
      {
        path: "/",
        name: "Index",
        component: Index,
        meta: {
          title: "首页",
        },
      },
    ],
  },
  {
    path: "/login",
    component: LOGIN,
    meta: {
      title: "登录",
    },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
