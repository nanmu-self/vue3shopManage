<template>
  <el-main class="image-aside" v-loading="loading">
    <div class="top p-3">
      <el-row :gutter="10">
        <el-col
          class="mb-3"
          :span="6"
          :offset="0"
          v-for="item in tableData"
          :key="item.id"
        >
          <el-card
            shadow="hover"
            :body-style="{ padding: 0 }"
            :class="{ active: item.checked }"
          >
            <div class="relative">
              <el-image
                :src="item.url"
                fit="cover"
                class="w-full h-[150px]"
                :preview-src-list="[item.url]"
                :initial-index="0"
              ></el-image>
              <div class="imgTitle">{{ item.name }}</div>
            </div>
            <div class="flex items-center justify-center">
              <el-checkbox
                v-if="isCheckbox"
                v-model="item.checked"
                @change="handleCheck(item)"
              />
              <el-button
                type="primary"
                size="small"
                text
                @click="handleEdit(item)"
                >重命名</el-button
              >
              <el-popconfirm
                width="220"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon-color="#626AEF"
                title="是否要删除该图片？"
                @confirm="handleDelete(item.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData($event, selectedId)"
      />
    </div>
  </el-main>

  <el-drawer v-model="drawer" title="上传图片">
    <upFile :data="{ image_class_id: selectedId }" @success="upingSuccess" />
  </el-drawer>
</template>
<script setup>
import { getimageList, upimageName, deleteimage } from "@/api/image.js";
import upFile from "@/components/upFile.vue";
import bus from "./bus.js";

import { useInitTable } from "@/hooks/useCommon.js";
let {
  currentPage,
  limit,
  selectedId,
  totalCount,
  loading,
  tableData,
  getData,
} = useInitTable({
  getList: getimageList,
  success: (res) => {
    tableData.value = res.list.map((e) => {
      e.checked = false;
      return e;
    });
    totalCount.value = res.totalCount;
  },
});

const props = defineProps({
  isCheckbox: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 1,
  },
});
//选择图片
const handleCheck = (item) => {
  let t = tableData.value.filter((e) => e.checked);

  if (item.checked && t.length > props.limit) {
    item.checked = false;
    return ElNotification({
      message: "不能在选啦！最多选" + props.limit + "张图片",
      type: "error",
    });
  }
  emit("selectimg", t);
};

const emit = defineEmits(["selectimg"]);
const upingSuccess = (res) => {
  ElNotification({
    message: "上传成功",
    type: "success",
  });
  getData();
  drawer.value = false;
};

const drawer = ref(false);
const drawerSwitch = () => {
  drawer.value = !drawer.value;
};
defineExpose({
  drawerSwitch,
});
//删除图片
const handleDelete = (id) => {
  loading.value = true;
  deleteimage([id]).then((res) => {
    ElNotification({
      message: "删除成功",
      type: "success",
    });
    getData(1);
    loading.value = false;
  });
};

//修改图片名称
const handleEdit = (item) => {
  ElMessageBox.prompt("重命名", "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputPattern: /^[^\s]+[\s\S]*[^\s]+$/,
    inputErrorMessage: "内容不能为空",
    inputValue: item.name,
  }).then(({ value }) => {
    loading.value = true;
    upimageName(item.id, value)
      .then((res) => {
        ElNotification({
          message: "修改成功",
          type: "success",
        });
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

bus.on("imgClassId", (e) => {
  selectedId.value = e;
  getData(currentPage.value, selectedId.value);
});
</script>

<style scoped>
.imgTitle {
  /* top: 132px; */
  bottom: 10px;
  left: 0;
  right: 0;
  @apply absolute truncate text-sm text-gray-100 bg-opacity-50 bg-gray-800 p-1;
}
.active {
  border-color: rgb(59, 130, 246) !important;
}
</style>
