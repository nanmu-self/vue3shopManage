<template>
  <div class="head">
    <div class="flex items-center">
      <div class="login">
        <el-icon class="mr-1"><ChromeFilled /></el-icon>
        <div>商城后台</div>
      </div>
      <el-icon class="icon-btn"><Fold /></el-icon>
      <el-tooltip effect="dark" content="刷新" placement="bottom">
        <el-icon class="icon-btn" @click="handleRelad"><Refresh /></el-icon>
      </el-tooltip>
    </div>
    <div class="flex items-center">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon class="icon-btn" @click="toggleFullscreen">
          <Aim v-if="isFullscreen" />
          <FullScreen v-else />
        </el-icon>
      </el-tooltip>
      <el-dropdown @command="handleCommand">
        <div class="flex items-center text-light-50">
          <el-avatar :size="25" :src="users.avatar" />
          <div class="mx-2">{{ users.username }}</div>
          <el-icon class="">
            <arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import screenfull from "screenfull";
import { useUserStore } from "@/store/index.js";
import { storeToRefs } from "pinia";
const store = useUserStore();
const { users } = storeToRefs(store);

//全屏方法
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  screenfull.toggle();
};
const isFullscreen = ref(false);

// onMounted(() => {
//   if (screenfull.isEnabled) {
//     screenfull.on('change', handleFullscreenChange);
//   }
// })
// const handleFullscreenChange()=> {
//     if (screenfull.isFullscreen) {
//       // 全屏状态
//       // 在这里你可以执行你需要的操作
//     } else {
//       // 非全屏状态
//       // 在这里你可以执行你需要的操作
//     }
//   }

//退出登陆
const handleLogout = () => {
  ElMessageBox.confirm("是否退出登陆", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then((res) => {
    logout().finally(() => {
      //   移除token
      localStorage.removeItem("token");
      store.users = {};
      router.push("/login");
      ElNotification({
        message: "成功退出",
        type: "success",
        duration: 3000,
      });
    });
  });
};

const handleCommand = (c) => {
  switch (c) {
    case "rePassword":
      break;
    case "logout":
      handleLogout();
      break;
  }
};

const handleRelad = () => {
  window.location.reload();
};
</script>
<style scoped>
.head {
  @apply flex items-center justify-between text-light-50 bg-blue-500 fixed top-0 left-0 right-0;
  height: 64px;
}
.login {
  @apply flex items-center justify-center text-xl font-thin;
  width: 250px;
}
.icon-btn {
  @apply cursor-pointer items-center justify-center;
  width: 40px;
  height: 64px;
}
.icon-btn:hover {
  @apply bg-blue-600;
}
</style>
