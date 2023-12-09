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
            title="是否要删除该管理员？"
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
import { getAdminList, changeAdminStatus } from "@/api/admin.js";

//搜索管理员
const searchKey = ref("");
const searchUser = () => {
  getData(searchKey.value);
};
const reset = () => {
  searchKey.value = "";
  getData();
};

// 禁用管理员
const handleSwitch = (status, item) => {
  console.log(status);
};

//删除公告
const handleDelete = (id) => {
  deleteNotice(id).then((res) => {
    ElNotification({
      message: "删除成功",
      type: "success",
    });
    getData();
  });
};

//选中的id
const selectedId = ref(0);
//修改公告
const handleEdit = (item) => {
  selectedId.value = item.id;
  form.title = item.title;
  form.content = item.content;
  formDrawerRef.value.drawerswitch();
};

const formRef = ref(null);

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return false;
    console.log(selectedId.value);
    let fun = selectedId.value
      ? updateNotice(selectedId.value, form.title, form.content)
      : addNotice(form.title, form.content);
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
const form = reactive({
  title: "",
  content: "",
});

const formDrawerRef = ref(null);

// 新增公告
const handleAdd = () => {
  selectedId.value = 0;
  form.title = "";
  form.content = "";
  formDrawerRef.value.drawerswitch();
};

const tableData = ref([]);
const totalCount = ref(0);
const loading = ref(false);

const getData = (keyword = "", page = 1, limit = 10) => {
  loading.value = true;
  getAdminList(keyword, page, limit)
    .then((res) => {
      console.log(res);
      tableData.value = res.list;
      // totalCount.value = res.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
};
getData();
</script>
