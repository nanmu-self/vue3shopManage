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
          <el-button type="primary" size="small" @click="searchUser"
            >搜索</el-button
          >
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
    </template>
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="handleAdd">
        新增</el-button
      >
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
      <el-form-item label="所属角色">
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
import selectImg from "./selectImg.vue";
import {
  getAdminList,
  changeAdminStatus,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "@/api/admin.js";

//搜索管理员
const searchKey = ref("");
const searchUser = () => {
  getData(1, searchKey.value);
};
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
      //   getData();
    })
    .finally(() => {
      item.loading = false;
    });
};

//删除公告
const handleDelete = (id) => {
  deleteAdmin(id).then((res) => {
    ElNotification({
      message: "删除成功",
      type: "success",
    });
    getData();
  });
};

//选中的id
const selectedId = ref(0);
//修改管理员
const handleEdit = (item) => {
  console.log(item);
  selectedId.value = item.id;
  form.username = item.username;
  form.role_id = item.role_id;
  form.status = item.status;
  form.avatar = item.avatar;

  formDrawerRef.value.drawerswitch();
};

const formRef = ref(null);

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return false;
    let { username, password, role_id, status, avatar } = form;
    let fun = selectedId.value
      ? updateAdmin(
          selectedId.value,
          username,
          password,
          role_id,
          status,
          avatar
        )
      : addAdmin(username, password, role_id, status, avatar);
    fun.then((res) => {
      ElNotification({
        message: selectedId.value ? "修改成功" : "新增成功",
        type: "success",
      });
      getData();
      formDrawerRef.value.drawerswitch();
    });
  });
};

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
};
const form = reactive({
  username: "",
  password: "",
  role_id: null,
  status: 1,
  avatar: "",
});

const formDrawerRef = ref(null);

// 新增用户
const handleAdd = () => {
  selectedId.value = 0;
  form.username = "";
  form.password = "";
  form.role_id = null;
  form.status = 1;
  form.avatar = "";
  formDrawerRef.value.drawerswitch();
};

const tableData = ref([]);
const totalCount = ref(0);
const loading = ref(false);
// 所有管理员角色
const roles = ref([]);

const getData = (page = 1, keyword = "", limit = 10) => {
  loading.value = true;
  getAdminList(page, keyword, limit)
    .then((res) => {
      console.log(res);
      tableData.value = res.list.map((e) => {
        e.loading = false;
        return e;
      });
      roles.value = res.roles;
      totalCount.value = res.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
};
getData();
</script>
