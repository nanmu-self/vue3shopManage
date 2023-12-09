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
  {
    path: "/user/list",
    name: "/user/list",
    component: () => import("@/pages/user/list.vue"),
    meta: {
      title: "用户列表",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: () => import("@/pages/order/list.vue"),
    meta: {
      title: "订单列表",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: () => import("@/pages/comment/list.vue"),
    meta: {
      title: "评价列表",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: () => import("@/pages/image/list.vue"),
    meta: {
      title: "图库列表",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: () => import("@/pages/notice/list.vue"),
    meta: {
      title: "公告",
    },
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: () => import("@/pages/setting/base.vue"),
    meta: {
      title: "配置",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: () => import("@/pages/coupon/list.vue"),
    meta: {
      title: "优惠券",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: () => import("@/pages/manager/list.vue"),
    meta: {
      title: "管理员管理",
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
