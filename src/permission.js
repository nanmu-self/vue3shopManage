import router from "./router";

let loadingInstance = null;

// 全局前置守卫
router.beforeEach((to, from, next) => {
  loadingInstance = ElLoading.service();
  const token = localStorage.getItem("token");
  // 登录校验
  if (to.path != "/login" && !token) {
    ElNotification({
      message: "请先登录",
      type: "error",
      duration: 3000,
    });
    return next({ path: "/login" });
  }
  //   防止重复登陆
  if (to.path == "/login" && token) {
    ElNotification({
      message: "请勿重复登陆",
      type: "warning",
      duration: 3000,
    });
    return next({ path: from.path || "/" });
  }

  next();
});

router.afterEach((to, from) => {
  //   ElLoading.service({ fullscreen: false });
  loadingInstance.close();
  //   修该页面标题
  document.title = to.meta.title;
});
