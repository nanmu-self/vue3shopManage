<template>
  <el-card shadow="never">
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="addBtn"> 新增</el-button>
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-button type="primary" text="" size="default" @click="getData(1)">
          <el-icon><Refresh /></el-icon
        ></el-button>
      </el-tooltip>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" width="380" />
      <el-table-column
        prop="update_time"
        label="发布时间"
        width="380"
        align="center"
      />
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
            title="是否要删除该公告？"
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
    ref="formDrawerRef"
    :title="selectedId ? '修改公告' : '新增公告'"
    @submit="handleSubmit"
  >
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input v-model="form.content" type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import {
  getNotice,
  addNotice,
  updateNotice,
  deleteNotice,
} from "@/api/notice.js";
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
  getList: getNotice, //获取列表
  deleteFun: deleteNotice, //删除
  updateData: updateNotice, //更新数据
  addData: addNotice, //新增数据
  InitFormData: {
    title: "",
    content: "",
  },
  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list;
    totalCount.value = res.totalCount;
  },
});

const rules = {
  title: [
    {
      required: true,
      message: "请输入公告标题",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入公告内容",
    },
  ],
};

getData();
</script>
