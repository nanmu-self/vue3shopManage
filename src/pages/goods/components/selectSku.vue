<template>
  <el-dialog
    v-model="centerDialogVisible"
    title="规格选择"
    width="80%"
    destroy-on-close
    style="margin-top: 8vh"
  >
    <el-container style="height: 65vh" class="relative">
      <el-aside width="220px" class="image-aside">
        <div class="top" style="height: 80%">
          <div
            v-for="(item, i) in tableData"
            :key="item.id"
            :class="{ active: active === i }"
            class="sku-list"
            @click="activeId(i)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <el-pagination
            background
            layout="prev, next"
            :total="totalCount"
            :current-page="currentPage"
            :page-size="limit"
            @current-change="getData"
          />
        </div>
      </el-aside>
      <el-main class="absolute" style="left: 220px">
        <el-checkbox-group v-model="form.list" size="small">
          <el-checkbox :label="item" border v-for="(item, i) in list" :key="i">
            {{ item }}</el-checkbox
          >
        </el-checkbox-group>
      </el-main>
    </el-container>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { getSkuList, selectGoodsSpecOptionValue } from "@/api/skus.js";
import { useInitTable } from "@/hooks/useCommon.js";
import { getGoodsDetail } from "../hooks/sku.js";
let { tableData, totalCount, getData, currentPage, limit } = useInitTable({
  getList: getSkuList,
  success: (res) => {
    active.value = 0;
    list.value = res.list[0].default.split(",");
    tableData.value = res.list;
    totalCount.value = res.totalCount;
  },
});

const list = ref([]);
const form = reactive({
  list: [],
});

const active = ref(0);
const activeId = (index) => {
  active.value = index;
  form.list = [];
  list.value = tableData.value[index].default.split(",");
};

const submit = () => {
  let name = tableData.value[active.value].name;
  selectGoodsSpecOptionValue(normId.value, {
    name,
    value: form.list,
  }).then((res) => {
    dialogSwitch();
    getGoodsDetail();
  });
};

getData();

const centerDialogVisible = ref(false);
const normId = ref(0);

const dialogSwitch = (item) => {
  if (item) {
    normId.value = item.id;
  }
  centerDialogVisible.value = !centerDialogVisible.value;
};
defineExpose({ dialogSwitch });
</script>
<style scoped>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}
.top {
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 50px;
}
.bottom {
  @apply absolute bottom-0 left-0 right-0 flex items-center justify-center;
  height: 50px;
}
.sku-list {
  @apply p-3 text-sm text-gray-600 cursor-pointer;
  border-bottom: 1px solid #f4f4f4;
}
.sku-list:hover {
  @apply bg-gray-100;
}
.active {
  @apply bg-gray-100;
}
</style>
