<template>
  <el-card shadow="never">
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="handleAdd">
        新增</el-button
      >
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

const getData = (page = 1) => {
  console.log(page);
  loading.value = true;
  getNotice(page)
    .then((res) => {
      tableData.value = res.list;
      totalCount.value = res.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
};
getData();
</script>
