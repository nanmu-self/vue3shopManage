<template>
  <el-aside class="image-aside" width="220px" v-loading="loading">
    <div class="top">
      <div
        class="list"
        :class="{ active: selectedId == item.id }"
        v-for="item in tableData"
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
        layout="prev, next"
        :total="totalCount"
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
import { useInitTable } from "@/hooks/useCommon.js";
let { getData, currentPage, limit, totalCount, loading, tableData } =
  useInitTable({
    getList: getimageClass,
    success: (res) => {
      console.log(res);
      tableData.value = res.list;
      totalCount.value = res.totalCount;
      selectedId.value = res.list[0].id;
      bus.emit("imgClassId", res.list[0].id);
    },
  });
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

const selectedId = ref(0);

getData();

defineExpose({
  getData,
});

const handleChangeActiveId = (id) => {
  selectedId.value = id;
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
