<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-sm mr-1">关键词</span>
          <el-input
            class="flex-1"
            v-model="searchKey"
            placeholder="管理员昵称"
            clearable
          />
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            @click="handleSearch(1, searchKey)"
            >搜索</el-button
          >
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
    </template>
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="addBtn"> 新增</el-button>
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-button type="primary" text="" size="default" @click="getData()">
          <el-icon><Refresh /></el-icon
        ></el-button>
      </el-tooltip>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="管理员" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar size="large" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            /></el-avatar>
            <div class="flex flex-col ml-2">
              <span class="text-base">{{ row.username }}</span>
              <span class="text-sm">ID:{{ row.id }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属角色" width="200" align="center">
        <template #default="{ row }"> {{ row.role?.name }}</template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
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
          <span v-if="scope.row.super == 1" class="text-gray-500 text-sm"
            >暂无操作</span
          >
          <div v-else>
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
              title="是否要删除该管理员？"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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
    :title="selectedId ? '修改用户' : '新增用户'"
    @submit="handleSubmit"
  >
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <selectImg v-model="form.avatar" />
      </el-form-item>
      <el-form-item label="所属角色" prop="role_id">
        <el-select v-model="form.role_id" placeholder="选择所属角色">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import selectImg from "@/components/selectImg.vue";
import {
  getAdminList,
  changeAdminStatus,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "@/api/admin.js";
import { useInitTable } from "@/hooks/useCommon";
const {
  handleDelete,
  selectedId,
  formRef,
  tableData,
  totalCount,
  loading,
  getData,
  form,
  formDrawerRef,
  handleEdit,
  addBtn,
  handleSubmit,
  handleSearch,
} = useInitTable({
  deleteFun: deleteAdmin, //删除
  getList: getAdminList, //获取列表
  updateData: updateAdmin, //更新数据
  addData: addAdmin, //新增数据
  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list.map((e) => {
      e.loading = false;
      return e;
    });
    roles.value = res.roles;
    totalCount.value = res.totalCount;
  },
  // 初始化表单数据
  InitFormData: {
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: "",
  },
});

//搜索管理员
const searchKey = ref("");

// 重置按钮
const reset = () => {
  searchKey.value = "";
  getData();
};

// 禁用管理员
const handleSwitch = (status, item) => {
  item.loading = true;
  changeAdminStatus(item.id, status)
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

//表单验证规则
const rules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
  role_id: [
    {
      required: true,
      message: "请选择所属角色",
    },
  ],
};

// 所有管理员角色
const roles = ref([]);

getData();
</script>
