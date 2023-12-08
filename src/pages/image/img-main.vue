<template>
  <el-main class="image-aside" v-loading="loading">
    <div class="top p-3">
      <el-row :gutter="10">
        <el-col :span="6" :offset="0" v-for="item in dataList" :key="item.id">
          <el-card shadow="hover" :body-style="{ padding: 0 }">
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
            <div class="flex items-center justify-center p-2">
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
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-main>

  <el-drawer v-model="drawer" title="上传图片">
    <upFile :data="{ image_class_id: imageClassId }" @success="upingSuccess" />
  </el-drawer>
</template>
<script setup>
import { getimageList, upimageName, deleteimage } from "@/api/image.js";
import upFile from "@/components/upFile.vue";
import bus from "./bus.js";

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

const imageClassId = ref(0);

bus.on("imgClassId", (e) => {
  imageClassId.value = e;
  getData(1);
});

const dataList = ref([]);
const loading = ref(false);
// 分页
const currentPage = ref(1); //当前页码
const limit = ref(10); //一页多少数据
const total = ref(0); //总数量

const getData = (page = 1) => {
  currentPage.value = page;
  loading.value = true;
  getimageList(imageClassId.value, currentPage.value)
    .then((res) => {
      dataList.value = res.list;
      total.value = res.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped>
.imgTitle {
  /* top: 132px; */
  bottom: 5px;
  left: 0;
  right: 0;
  @apply absolute truncate text-sm text-gray-100 bg-opacity-50 bg-gray-800 p-1;
}
</style>
