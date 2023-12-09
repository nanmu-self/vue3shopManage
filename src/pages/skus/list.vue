<template>
  <el-card shadow="never">
    <div class="flex items-center justify-between mb-4">
      <div>
        <el-button type="primary" size="small" @click="addBtn"> 新增</el-button>
        <el-popconfirm
          width="220"
          confirm-button-text="确认"
          cancel-button-text="取消"
          title="是否要删除选中规格？"
          @confirm="handleDelete(ids)"
        >
          <template #reference>
            <el-button type="danger" size="small"> 批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-button type="primary" text="" size="default" @click="getData(1)">
          <el-icon><Refresh /></el-icon
        ></el-button>
      </el-tooltip>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="规格名称" />
      <el-table-column
        prop="default"
        label="规格值"
        width="380"
        align="center"
      />
      <el-table-column prop="order" label="排序" align="center" />
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleSwitch($event, row)"
            :loading="row.loading"
            :disabled="row.super == 1"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            text
            @click="handleEdit(scope.row)"
            >修改</el-button
          >

          <el-popconfirm
            width="220"
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon-color="#626AEF"
            title="是否要删除该规格？"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" text>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-center items-center mt-4">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        @current-change="getData"
      />
    </div>
  </el-card>
  <FormDrawer
    destroyOnClose
    ref="formDrawerRef"
    :title="selectedId ? '修改规格' : '新增规格'"
    @submit="handleSubmit"
  >
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
      <el-form-item label="规格名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="1" :max="1000" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="规格值" prop="default">
        <TagInput v-model="form.default" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import TagInput from "./TagInput.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import {
  addSku,
  updateSku,
  getSkuList,
  deleteSku,
  updateSkuStatus,
} from "@/api/skus.js";
import { useInitTable } from "@/hooks/useCommon";
const {
  tableData,
  totalCount,
  loading,
  formRef,
  selectedId,
  formDrawerRef,
  getData,
  form,
  addBtn,
  handleDelete,
  handleEdit,
  handleSubmit,
} = useInitTable({
  getList: getSkuList, //获取列表
  deleteFun: deleteSku, //删除
  updateData: updateSku, //更新数据
  addData: addSku, //新增数据
  InitFormData: {
    status: 1,
    name: "",
    order: 50,
    default: "",
  },
  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list.map((e) => {
      e.loading = false;
      return e;
    });
    totalCount.value = res.totalCount;
  },
});
//表单验证规格
const rules = {
  name: [
    {
      required: true,
      message: "请输入规格名称",
    },
  ],
  default: [
    {
      required: true,
      message: "请输入规格值",
    },
  ],
};
// 修改状态
const handleSwitch = (status, item) => {
  item.loading = true;
  updateSkuStatus(item.id, status)
    .then((res) => {
      ElNotification({
        message: status ? "启用成功" : "禁用成功",
        type: "success",
      });
      item.status = status;
    })
    .finally(() => {
      item.loading = false;
    });
};
getData();
//多选ids
const ids = ref([]);
//监听多选
const handleSelectionChange = (val) => {
  ids.value = val.map((e) => e.id);
};
</script>
