<template>
  <el-tabs v-model="searchTab.tab" class="demo-tabs" @tab-change="handleChange">
    <el-tab-pane
      v-for="(item, i) in orderType"
      :key="i"
      :name="item.value"
      :label="item.name"
    ></el-tab-pane>
  </el-tabs>
  <el-card shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-xs mr-1">关键字</span>
          <el-input
            class="flex-1"
            v-model="searchTab.title"
            placeholder="商品名称"
            clearable
            size="small"
          />
          <div class="text-xs ml-5">商品分类</div>
          <el-select
            v-model="searchTab.category_id"
            class="m-2"
            placeholder="请选择商品分类"
            size="small"
            @visible-change="getCategories"
            :loading="selectLoading"
            clearable
          >
            <el-option
              v-for="item in categories"
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
            @click="handleSearch(1, searchTab)"
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
      <el-table-column prop="title" label="商品" width="300">
        <template #default="{ row }">
          <div class="flex">
            <el-image
              class="mr-3 rounded"
              :src="row.cover"
              fit="cover"
              :lazy="true"
              style="width: 50px; height: 50px"
            ></el-image>
            <div>
              <span>{{ row.title }}</span>
              <div>
                <span class="text-rose-500">￥{{ row.min_price }}</span>
                <el-divider direction="vertical" />
                <span class="text-gray-500 text-xs"
                  >￥{{ row.min_oprice }}</span
                >
              </div>
              <div class="text-gray-400 text-xs mb-1">
                分类:{{ row?.category?.name }}
              </div>
              <span class="text-gray-400 text-xs"
                >创建时间:{{ row?.category?.create_time }}</span
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sale_count" label="实际销量" align="center" />
      <el-table-column label="商品状态" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{
            row.status ? "上架" : "仓库"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="审核状态"
        align="center"
        v-if="searchTab.tab != 'delete'"
      >
        <template #default="{ row }">
          <div v-if="row.ischeck">{{ row.ischeck == 1 ? "通过" : "拒绝" }}</div>
          <div class="flex flex-col justify-center" v-else>
            <el-button type="success" size="small" @click="" plain
              >审核通过</el-button
            >
            <el-button
              style="margin-left: 0; margin-top: 5px"
              type="danger"
              size="small"
              @click=""
              plain
              >审核拒绝</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="总库存" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <span v-if="searchTab.tab == 'delete'" class="text-gray-500 text-sm"
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
            <el-button
              type="primary"
              size="small"
              text
              @click="handleEdit(scope.row)"
              >商品规格</el-button
            >

            <el-button
              type="primary"
              size="small"
              text
              @click="handleEdit(scope.row)"
              >商品详情</el-button
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
      <el-form-item label="头像"> </el-form-item>
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
import { getCategoryList } from "@/api/category.js";
import {
  getAdminList,
  changeAdminStatus,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "@/api/admin.js";
import { getGoodsList } from "@/api/goods.js";
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
  getList: getGoodsList, //获取列表
  updateData: updateAdmin, //更新数据
  addData: addAdmin, //新增数据
  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list;
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
//订单类型
const orderType = ref([
  {
    name: "全部",
    value: "all",
  },
  {
    name: "审核中",
    value: "checking",
  },
  {
    name: "出售中",
    value: "saling",
  },
  {
    name: "已下架",
    value: "off",
  },
  {
    name: "库存预警",
    value: "min_stock",
  },
  {
    name: "回收站",
    value: "delete",
  },
]);

// 分类列表
const categories = ref([]);
const selectLoading = ref(false);
// 获取分类
const getCategories = (e) => {
  if (e && categories.value.length == 0) {
    selectLoading.value = true;
    getCategoryList()
      .then((res) => {
        categories.value = res;
      })
      .finally(() => {
        selectLoading.value = false;
      });
  }
};

const handleChange = (tab) => {
  getData(1, { tab });
};

//搜索
const searchTab = ref({
  tab: "all",
  title: "",
  category_id: "",
  limit: 10,
});
// const searchGoods = () => {
//   getData(1, searchTab.value);
// };
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
getData(1, { tab: "all" });
</script>
<style scoped></style>
