<template>
  <div>首页</div>
  <div>{{ users.username }}</div>
  <el-button @click="handleLogout">退出登陆</el-button>
</template>
<script setup>
import { useUserStore } from "@/store/index.js";
import { storeToRefs } from "pinia";
import { logout } from "@/api/admin.js";
import { useRouter } from "vue-router";
const router = useRouter();

const store = useUserStore();
const { users } = storeToRefs(store);

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
</script>
