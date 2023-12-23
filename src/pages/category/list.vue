<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <el-button type="primary" size="small" @click="addBtn">新增</el-button>
        <el-tooltip effect="dark" content="刷新数据" placement="top">
          <el-button text type="primary" size="default" @click="getData">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </template>
    <div v-loading="loading">
      <div
        class="flex justify-between items-center cursor-pointer h-[50px] itemList px-3"
        v-for="(item, i) in tableData"
        :key="i"
      >
        <span class="text-sm">{{ item.name }}</span>
        <div>
          <el-button type="primary" size="default" @click="" link
            >推荐商品</el-button
          >
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="item.status"
            @change="handleSwitch(item)"
            :loading="switchLoading"
            class="mx-2"
          >
          </el-switch>
          <el-button
            type="primary"
            size="default"
            @click="handleEdit(item)"
            link
            >修改</el-button
          >
          <el-popconfirm
            title="是否要删除该分类?"
            @confirm="handleDelete(item.id)"
            confirm-button-text="删除"
            cancel-button-text="取消"
          >
            <template #reference>
              <el-button type="danger" size="default" link
                >删除</el-button
              ></template
            >
          </el-popconfirm>
        </div>
      </div>
    </div>
  </el-card>

  <FormDrawer
    ref="formDrawerRef"
    :title="selectedId ? '修改分类' : '新增分类'"
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="80px"
      :inline="false"
      size="default"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="分类名称"></el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import {
  getCategoryList,
  addCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
} from "@/api/category";
import { useInitTable } from "@/hooks/useCommon";
let {
  getData,
  tableData,
  selectedId,
  formDrawerRef,
  addBtn,
  form,
  handleSubmit,
  formRef,
  handleEdit,
  loading,
  handleDelete,
} = useInitTable({
  getList: getCategoryList,
  success: (res) => {
    tableData.value = res;
  },
  deleteFun: deleteCategory,
  addData: addCategory,
  updateData: updateCategory,
  InitFormData: {
    name: "",
  },
});

getData();

let rules = {
  name: [
    {
      required: true,
      message: "请输入分类名称",
      trigger: "blur",
    },
  ],
};
//修改状态
const switchLoading = ref(false);
const handleSwitch = (item) => {
  switchLoading.value = true;
  updateCategoryStatus(item.id, { status: item.status })
    .then((res) => {
      getData();
    })
    .finally(() => {
      switchLoading.value = false;
    });
};
</script>

<style scoped>
.itemList:hover {
  background-color: rgb(245, 247, 250);
}
</style>
