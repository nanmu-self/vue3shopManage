import { createRouter, createWebHashHistory } from "vue-router";
import Index from "@/pages/index.vue";
import LOGIN from "@/pages/login.vue";
import NotFound from "@/pages/404.vue";
const routes = [
  {
    path: "/",
    component: Index,
  },
  {
    path: "/login",
    component: LOGIN,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
