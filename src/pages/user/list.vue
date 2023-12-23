<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-xm mr-1">关键词</span>
          <el-input
            class="flex-1"
            v-model="searchKey"
            placeholder="手机号/邮箱/会员昵称"
            clearable
          />
        </div>
        <div class="flex items-center">
          <span class="text-xm mr-1">会员等级</span>
          <el-select
            clearable
            v-model="userLevelKey"
            class="m-2"
            placeholder="请选择会员等级"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            @click="
              handleSearch(1, {
                keyword: searchKey,
                user_level_id: userLevelKey,
              })
            "
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
      <el-table-column label="会员" width="200">
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

      <el-table-column prop="user_level.name" label="会员等级" align="center">
        <!-- <template #default="{ row }">
          {{ row.user_level }}
        </template> -->
      </el-table-column>
      <el-table-column
        label="登录注册时间"
        prop="create_time"
        width="120"
        align="center"
      ></el-table-column>
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
              title="是否要删除该用户？"
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
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <selectImg v-model="form.avatar" />
      </el-form-item>
      <el-form-item label="会员等级" prop="user_level_id">
        <el-select v-model="form.user_level_id" placeholder="选择会员等级">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone" placeholder="手机"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="邮箱"></el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import selectImg from "@/components/selectImg.vue";

import {
  getUserList,
  addUser,
  deleteUser,
  updateUserStatus,
  updateUser,
} from "@/api/user.js";
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
  deleteFun: deleteUser, //删除
  getList: getUserList, //获取列表
  updateData: updateUser, //更新数据
  addData: addUser, //新增数据
  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list.map((e) => {
      e.loading = false;
      return e;
    });
    roles.value = res.user_level;
    totalCount.value = res.totalCount;
  },
  // 初始化表单数据
  InitFormData: {
    username: "",
    password: "",
    nickname: "",
    user_level_id: null,
    status: 1,
    avatar: "",
    phone: "",
    email: "",
  },
});

//搜索管理员
const searchKey = ref("");

// 会员等级关键字
const userLevelKey = ref("");

// 重置按钮
const reset = () => {
  searchKey.value = "";
  userLevelKey.value = "";
  getData();
};

// 禁用会员
const handleSwitch = (status, item) => {
  item.loading = true;
  updateUserStatus(item.id, { status })
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
  user_level_id: [
    {
      required: true,
      message: "请选择会员等级",
    },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  email: [
    {
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: "请输入正确的邮箱格式",
      trigger: "blur",
    },
  ],
};

// 所有管理员角色
const roles = ref([]);

getData();
</script>
