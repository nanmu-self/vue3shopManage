<template>
  <el-dialog
    v-model="centerDialogVisible"
    title="规格选择"
    width="80%"
    destroy-on-close
  >
    <el-container style="height: 65vh" class="relative">
      <el-aside width="220px" class="image-aside">
        <div class="top" style="height: 80%">
          <div v-for="i in 100">{{ i }}</div>
        </div>
        <div class="bottom">分析</div>
      </el-aside>
      <el-main class="absolute" style="left: 220px">Main</el-main>
    </el-container>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { getSkuList } from "@/api/skus.js";

const centerDialogVisible = ref(false);

getSkuList(1).then((res) => {
  console.log(res);
});

const dialogSwitch = () => {
  centerDialogVisible.value = !centerDialogVisible.value;
};
defineExpose({ dialogSwitch });
</script>
<style scoped>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}
.top {
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 50px;
}
.bottom {
  @apply absolute bottom-0 left-0 right-0 flex items-center justify-center;
  height: 50px;
}
</style>
