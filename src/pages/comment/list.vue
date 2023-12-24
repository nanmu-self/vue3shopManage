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
          <el-button
            type="primary"
            size="small"
            @click="handleSearch(1, searchKey)"
            >搜索</el-button
          >
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
    </template>

    <el-table
      default-expand-all
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-18">
            <el-avatar
              :size="50"
              :src="row.user.avatar"
              fit="cover"
            ></el-avatar>
            <div class="ml-3 flex-1">
              <div class="flex">
                <span>{{ row.user.nickname || row.user.username }}</span>
                <span class="text-gray-400">{{ row.create_time }}</span>
              </div>
              <div class="my-2">{{ row.review.data }}</div>
              <el-image
                style="width: 100px; height: 100px"
                class="rounded"
                v-for="(item, i) in row.review.image"
                :key="i"
                :src="item"
                fit="cover"
                :lazy="true"
              ></el-image>
              <div v-if="row.textareaEdit">
                <el-input
                  v-model="textareaText"
                  placeholder="请输入内容"
                  :rows="2"
                  type="textarea"
                ></el-input>
                <div class="py-2">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleReply(row)"
                    class="mr-1"
                    >回复</el-button
                  >
                  <el-button size="small" @click="row.textareaEdit = false"
                    >取消</el-button
                  >
                </div>
              </div>
              <template v-else>
                <div
                  class="bg-gray-100 mt-3 rounded p-3"
                  v-for="(item, i) in row.extra"
                  :key="i"
                >
                  <div class="flex justify-between">
                    <span class="font-bold">客服</span>
                    <el-button
                      type="info"
                      size="small"
                      @click="EditBtn(row, item.data)"
                      >修改</el-button
                    >
                  </div>
                  <span>{{ item.data }}</span>
                </div>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column label="商品" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar
              size="large"
              :src="row.goods_item.cover"
              fit="cover"
              shape="square"
            >
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            /></el-avatar>

            <span class="text-sm ml-2">{{ row.goods_item.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" width="200" align="center">
        <template #default="{ row }">
          <span>昵称：{{ row.user.nickname || row.user.username }}</span>
          <el-rate v-model="row.rating" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="评价时间" align="center" />
      <el-table-column label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleSwitch($event, row)"
            :loading="row.loading"
          />
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
</template>
<script setup>
import {
  goodsCommentList,
  replyGoodsComment,
  updateGoodsComment,
} from "@/api/goods_comment.js";
import { useInitTable } from "@/hooks/useCommon";
const { tableData, totalCount, loading, getData, handleSearch } = useInitTable({
  getList: goodsCommentList, //获取列表

  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list.map((e) => {
      e.loading = false;
      e.textareaEdit = false;
      return e;
    });
    totalCount.value = res.totalCount;
  },
});

//搜索管理员
const searchKey = ref("");

// 重置按钮
const reset = () => {
  searchKey.value = "";
  getData();
};

// 禁用管理员
const handleSwitch = (status, item) => {
  item.loading = true;
  updateGoodsComment(item.id, status)
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

const textareaText = ref("");
// 回复
const handleReply = (item) => {
  replyGoodsComment(item.id, { data: textareaText.value }).then((res) => {
    item.textareaEdit = false;
    getData();
  });
};
const EditBtn = (row, data) => {
  textareaText.value = data;
  row.textareaEdit = true;
};
getData();
</script>
