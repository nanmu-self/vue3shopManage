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
      <div>
        <el-button type="primary" size="small" @click="addBtn"> 新增</el-button>
        <el-popconfirm
          width="220"
          confirm-button-text="确认"
          cancel-button-text="取消"
          title="是否要删除选中商品？"
          @confirm="handleDelete(ids)"
        >
          <template #reference>
            <el-button type="danger" size="small" :disabled="disabledBtn">
              批量删除</el-button
            >
          </template>
        </el-popconfirm>
        <el-button
          size="small"
          :disabled="disabledBtn"
          @click="changeStatus(1)"
          v-if="searchTab.tab == 'all' || searchTab.tab == 'off'"
          >上架</el-button
        >
        <el-button
          size="small"
          :disabled="disabledBtn"
          @click="changeStatus(0)"
          v-if="searchTab.tab == 'all' || searchTab.tab == 'saling'"
          >下架</el-button
        >
      </div>
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-button type="primary" text="" size="default" @click="getData()">
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
              :type="scope.row.goods_banner.length ? 'primary' : 'danger'"
              size="small"
              text
              @click="bannersRef.dialogSwitch(scope.row)"
              >商品轮播图</el-button
            >

            <el-button
              :type="scope.row.content ? 'primary' : 'danger'"
              size="small"
              text
              @click="contentRef.dialogSwitch(scope.row)"
              >商品详情</el-button
            >

            <el-popconfirm
              width="220"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon-color="#626AEF"
              title="是否要删除该商品？"
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
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="form.title" placeholder="不能超过60个字"></el-input>
      </el-form-item>
      <el-form-item label="封面">
        <selectImg v-model="form.cover" />
      </el-form-item>
      <el-form-item label="商品分类" prop="category_id">
        <el-select
          v-model="form.category_id"
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
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input
          type="textarea"
          v-model="form.desc"
          placeholder="商品描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="总库存" prop="stock">
        <el-input type="number" v-model="form.stock" style="width: 50%">
          <template #append> 件 </template>
        </el-input>
      </el-form-item>
      <el-form-item label="库存预警" prop="min_stock">
        <el-input type="number" v-model="form.min_stock" style="width: 50%">
          <template #append> 件 </template></el-input
        >
      </el-form-item>
      <el-form-item label="最低售价" prop="min_price">
        <el-input type="number" v-model="form.min_price" style="width: 50%">
          <template #append> 元 </template></el-input
        >
      </el-form-item>
      <el-form-item label="最低原价" prop="min_oprice" style="width: 50%">
        <el-input type="number" v-model="form.min_oprice">
          <template #append> 元 </template></el-input
        >
      </el-form-item>
      <el-form-item label="库存显示">
        <el-radio-group v-model="form.stock_display" class="ml-4">
          <el-radio :label="0" size="large">隐藏</el-radio>
          <el-radio :label="1" size="large">显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否上架">
        <el-radio-group v-model="form.status" class="ml-4">
          <el-radio :label="0" size="large">放入仓库</el-radio>
          <el-radio :label="1" size="large">立即上架</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </FormDrawer>
  <Banners ref="bannersRef" @refreshData="getData(1, searchTab)" />
  <Content ref="contentRef" />
</template>
<script setup>
import selectImg from "@/components/selectImg.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import Banners from "./banners.vue";
import Content from "./content.vue";
import { getCategoryList } from "@/api/category.js";
import {
  getGoodsList,
  addGoods,
  updateGoods,
  deleteGoods,
  updateGoodsStatus,
} from "@/api/goods.js";
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
  deleteFun: deleteGoods, //删除
  getList: getGoodsList, //获取列表
  updateData: updateGoods, //更新数据
  addData: addGoods, //新增数据
  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list;
    totalCount.value = res.totalCount;
  },
  // 初始化表单数据
  InitFormData: {
    title: "", //商品名称
    category_id: null, //商品分类
    cover: "", //	商品封面
    desc: "", //商品描述
    unit: "件", //商品单位
    stock: 200, //总库存
    min_stock: 10, //	库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1禁用
    min_price: 0, //最低销售价
    min_oprice: 0, //最低原价
  },
});
const contentRef = ref(null);
const bannersRef = ref(null);

const ids = ref([]);
//未选择禁用按钮
const disabledBtn = computed(() => {
  return ids.value.length == 0;
});
//多选
const handleSelectionChange = (val) => {
  ids.value = val.map((item) => item.id);
};

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
// 初始化分类
getCategories(true);
//tabs
const handleChange = (tab) => {
  getData(1, { tab });
};

//搜索
const searchTab = ref({
  tab: "all",
  title: "",
  category_id: "",
});

// 重置按钮
const reset = () => {
  searchTab.value = {
    tab: "all",
    title: "",
    category_id: "",
  };

  getData(1, { tab: "all" });
};

// 批量上下架
const changeStatus = (status) => {
  loading.value = true;
  updateGoodsStatus(ids.value, status)
    .then((res) => {
      ElNotification({
        message: status ? "上架成功" : "下架成功",
        type: "success",
      });
      getData(1, searchTab.value);
    })
    .finally(() => {
      loading.value = false;
    });
};

//表单验证规则
const rules = {
  title: [
    {
      required: true,
      message: "请输入商品名称",
    },
    {
      min: 1,
      max: 60,
      message: "长度在 1 到 60 个字符",
    },
  ],
  category_id: [
    {
      required: true,
      message: "请选择商品分类",
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
