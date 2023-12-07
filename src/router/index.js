import { createRouter, createWebHashHistory } from "vue-router";
import LOGIN from "@/pages/login.vue";
import NotFound from "@/pages/404.vue";
import Admin from "@/layouts/admin.vue";

const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
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

const asyncRouter = [
  {
    path: "/",
    name: "/",
    component: () => import("@/pages/index.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component: () => import("@/pages/goods/list.vue"),
    meta: {
      title: "商品列表",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: () => import("@/pages/category/list.vue"),
    meta: {
      title: "分类管理",
    },
  },
];

export const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export function addRouter(menus) {
  let isrouter = false;
  function add(arr) {
    arr.forEach((element) => {
      let item = asyncRouter.find((e) => e.path == element.frontpath);

      if (item && !router.hasRoute(item.path)) {
        router.addRoute("admin", item);
        isrouter = true;
      }
      if (element.child && element.child.length > 0) {
        add(element.child);
      }
    });
  }
  add(menus);
  return isrouter;
}
