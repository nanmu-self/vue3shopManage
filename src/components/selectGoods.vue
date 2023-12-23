<template>
  <el-dialog
    title="选择商品"
    v-model="visible"
    width="80%"
    top="5vh"
    destroy-on-close
  >
    <div class="flex items-center">
      <span class="text-xs mr-1">关键字</span>
      <el-input
        v-model="searchKey"
        placeholder="商品关键字"
        clearable
        size="small"
        style="width: 150px"
      />
      <el-button class="ml-2" type="primary" size="small" @click="searchGoods"
        >搜索</el-button
      >
      <el-button class="ml-2" type="primary" size="small" @click="resetSearch"
        >重置搜索</el-button
      >
    </div>
    <el-table
      height="60vh"
      v-loading="loading"
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品" width="300">
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
      <el-table-column prop="stock" align="center" label="总库存" />
      <el-table-column align="center" label="价格(元)">
        <template #default="{ row }">
          <span class="text-rose-500 text-xs">￥{{ row.min_price }}</span>
          <el-divider direction="vertical"></el-divider>

          <span class="text-gray-400 text-xs">￥{{ row.min_oprice }}</span>
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
    <template #footer>
      <span>
        <el-button @click="dialogSwitch">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { getGoodsList } from "@/api/goods";

import { useInitTable } from "@/hooks/useCommon";
const {
  tableData,
  totalCount,
  loading,

  getData,
} = useInitTable({
  getList: getGoodsList, //获取列表

  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list;
    totalCount.value = res.totalCount;
  },
});
const visible = ref(false);

const dialogSwitch = () => {
  visible.value = !visible.value;
};
const ids = ref([]);
//多选
const handleSelectionChange = (val) => {
  ids.value = val.map((item) => item.id);
};
getData(1, { tab: "saling" });

const submit = () => {
  emit("submit", ids.value);
  dialogSwitch();
};

const searchKey = ref("");
const searchGoods = () => {
  getData(1, { tab: "saling", title: searchKey.value });
};

const emit = defineEmits(["submit"]);

const resetSearch = () => {
  searchKey.value = "";
  getData(1, { tab: "saling" });
};

defineExpose({
  dialogSwitch,
});
</script>
