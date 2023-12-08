<template>
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
          <el-button text type="primary" @click.stop="handleEdit(item)"
            ><el-icon :size="12"><Edit /></el-icon
          ></el-button>
          <el-popconfirm
            width="220"
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon-color="#626AEF"
            title="是否要删除该分类？"
            @confirm.stop="handleDelete(item.id)"
          >
            <template #reference>
              <el-button text type="primary" @click.stop=""
                ><el-icon :size="12"><Close /></el-icon
              ></el-button>
            </template>
          </el-popconfirm>
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
</template>
<script setup>
import { deleteimageClass } from "@/api/image.js";
import { getimageClass } from "@/api/image.js";
import bus from "./bus.js";
//删除
const handleDelete = (id) => {
  loading.value = true;
  deleteimageClass(id)
    .then((res) => {
      ElNotification({
        message: "删除成功",
        type: "success",
      });
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
// 修改
const handleEdit = (item) => {
  emit("edit", item);
};
const emit = defineEmits(["edit"]);

const loading = ref(false);
const imgClassList = ref([]);
const activeId = ref(0);

// 分页
const currentPage = ref(1); //当前页码
const limit = ref(10); //一页多少数据
const total = ref(0); //总数量

const getData = (page = 1) => {
  currentPage.value = page;
  loading.value = true;
  getimageClass(page)
    .then((res) => {
      imgClassList.value = res.list;
      total.value = res.totalCount;
      activeId.value = res.list[0].id;
      bus.emit("imgClassId", res.list[0].id);
    })
    .finally(() => {
      loading.value = false;
    });
};
getData();
defineExpose({
  getData,
});

const handleChangeActiveId = (id) => {
  activeId.value = id;
  bus.emit("imgClassId", id);
};
</script>
<style scoped>
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
