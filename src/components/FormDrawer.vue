<template>
  <el-drawer
    v-model="drawer"
    :title="title"
    :size="size"
    :close-on-click-modal="false"
    :destroy-on-close="destroyOnClose"
  >
    <div class="formDrawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="action">
        <el-button :loading="loading" type="primary" @click="submitForm"
          >提交</el-button
        >
        <el-button type="default" @click="drawerswitch">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
defineProps({
  title: String,
  size: {
    type: String,
    default: "45%",
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["submit"]);
const loading = ref(false);
const loadingSwitch = () => {
  loading.value = !loading.value;
};

const drawer = ref(false);
// 显示和隐藏
const drawerswitch = () => {
  drawer.value = !drawer.value;
};

const submitForm = () => {
  emit("submit");
};
defineExpose({
  drawerswitch,
  loadingSwitch,
});
</script>
<style scoped>
.formDrawer {
  @apply flex flex-col;
  width: 100%;
  height: 100%;
}
.body {
  flex: 1;
  overflow-y: auto;
}
.action {
  height: 50px;
  @apply flex items-center;
}
</style>
