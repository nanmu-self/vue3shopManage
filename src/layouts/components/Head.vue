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

  <!-- <el-drawer
    v-model="drawer"
    title="修改密码"
    size="45%"
    :close-on-click-modal="false"
  >
   
  </el-drawer> -->
  <FormDrawer
    ref="formDrawerRef"
    title="修改密码"
    @submit="submitForm"
    destroyOnClose
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="旧密码" prop="oldpassword">
        <el-input type="password" v-model="form.oldpassword" />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="repassword">
        <el-input type="password" v-model="form.repassword" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import screenfull from "screenfull";
import { useUserStore } from "@/store/index.js";
import { storeToRefs } from "pinia";
import { changePassword, logout } from "@/api/admin.js";
import FormDrawer from "@/components/FormDrawer.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useUserStore();
const { users } = storeToRefs(store);
// const drawer = ref(false);

const form = reactive({
  oldpassword: "",
  password: "",
  repassword: "",
});

const rules = reactive({
  oldpassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
  password: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
  repassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
  ],
});
const formRef = ref(null);
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;
    formDrawerRef.value.loadingSwitch();
    changePassword(form.oldpassword, form.password, form.repassword)
      .then((res) => {
        ElNotification({
          message: "修改密码成功，请重新登陆",
          type: "success",
          duration: 3000,
        });
      })
      .finally(() => {
        formDrawerRef.value.loadingSwitch();
      });
  });
};

//全屏方法
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  screenfull.toggle();
};
const isFullscreen = ref(false);

//退出登陆
const handleLogout = () => {
  ElMessageBox.confirm("是否退出登陆", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then((res) => {
    // store.storeLogout();
    // router.push("/login");

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

const formDrawerRef = ref(null);
const handleCommand = (c) => {
  switch (c) {
    case "rePassword":
      formDrawerRef.value.drawerswitch();
      // drawer.value = true;
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
