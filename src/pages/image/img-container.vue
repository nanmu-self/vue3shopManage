<template>
  <el-container>
    <el-aside class="image-aside" width="220px" v-loading="loading">
      <div class="top">
        <div
          class="list"
          :class="{ active: activeId == item.id }"
          v-for="item in imgClassList"
          :key="item.id"
          @click="handleChangeActiveId(item.id)"
        >
          <span class="truncate flex-1 text-sm text-gray-600">{{
            item.name
          }}</span>
          <div>
            <el-button text type="primary"
              ><el-icon :size="12"><Edit /></el-icon
            ></el-button>
            <el-button text type="primary"
              ><el-icon :size="12"><Close /></el-icon
            ></el-button>
          </div>
        </div>
      </div>
      <div class="bottom">
        <el-pagination
          background
          layout="prev,  next"
          :total="total"
          :current-page="currentPage"
          :page-size="limit"
          @current-change="getData"
        />
      </div>
    </el-aside>
    <el-main class="image-aside">
      <div class="top">
        <div v-for="i in 100">{{ i }}</div>
      </div>
      <div class="bottom">分页</div>
    </el-main>
  </el-container>
</template>
<script setup>
import { getimageClass } from "@/api/image.js";

const loading = ref(false);
const imgClassList = ref([]);
const activeId = ref(0);

// 分页
const currentPage = ref(1); //当前页码
const limit = ref(10); //一页多少数据
const total = ref(0); //总数量

const getData = (page = 1) => {
  console.log(page);
  currentPage.value = page;
  //   return;
  loading.value = true;
  getimageClass(page)
    .then((res) => {
      console.log(res);
      imgClassList.value = res.list;
      total.value = res.totalCount;
      activeId.value = res.list[0].id;
    })
    .finally(() => {
      loading.value = false;
    });
};
getData();

const handleChangeActiveId = (id) => {
  activeId.value = id;
};
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
.list {
  @apply flex items-center justify-between cursor-pointer p-3;
  border-bottom: 1px solid #eeeeee;
}
.list:hover,
.active {
  @apply bg-blue-50;
}
:deep(.el-button + .el-button) {
  margin: 0;
}
</style>
