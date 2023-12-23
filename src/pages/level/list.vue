<template>
  <el-card shadow="never">
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="addBtn"> 新增</el-button>
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-button type="primary" text="" size="default" @click="getData(1)">
          <el-icon><Refresh /></el-icon
        ></el-button>
      </el-tooltip>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="会员等级" />
      <el-table-column prop="discount" label="折扣率" align="center" />
      <el-table-column prop="level" label="等级序号" align="center" />
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
            title="是否要删除该会员等级？"
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
      <el-form-item label="等级名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="等级权重">
        <el-input-number v-model="form.level" :min="1" :max="1000" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="升级条件">
        <div>
          <span class="mr-2"> 累计消费满</span>
          <el-input
            type="number"
            min="0"
            v-model="form.max_price"
            style="width: 50%"
          >
            <template #append>元</template>
          </el-input>
        </div>
        <span class="text-gray-400 text-xs mt-2"
          >设置会员等级所需要的累计消费必须大于等于0,单位：元</span
        >
        <div class="mt-2">
          <span class="mr-2"> 累计次数满</span>
          <el-input
            type="number"
            min="0"
            v-model="form.max_times"
            style="width: 50%"
          >
            <template #append>次</template>
          </el-input>
        </div>

        <span class="text-gray-400 text-xs mt-2"
          >设置会员等级所需要的购买量必须大于等于0,单位：笔</span
        >
      </el-form-item>
      <el-form-item label="折扣率(%)">
        <el-input
          type="number"
          min="0"
          v-model="form.discount"
          style="width: 30%"
        >
          <template #append>%</template>
        </el-input>
        <span class="text-gray-400 text-xs mt-2"
          >折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</span
        >
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import {
  levelList,
  levelAdd,
  levelStatus,
  levelUpdate,
  levelDelete,
} from "@/api/level.js";
import { useInitTable } from "@/hooks/useCommon";
const {
  tableData,
  totalCount,
  loading,
  formRef,
  selectedId,
  formDrawerRef,
  getData,
  form,
  addBtn,
  handleDelete,
  handleEdit,
  handleSubmit,
} = useInitTable({
  getList: levelList, //获取列表
  deleteFun: levelDelete, //删除
  updateData: levelUpdate, //更新数据
  addData: levelAdd, //新增数据
  InitFormData: {
    name: "",
    level: 100,
    status: 1,
    max_price: 0,
    max_times: 0,
    discount: 0,
  },
  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list;
    totalCount.value = res.totalCount;
  },
});

const rules = {
  name: [
    {
      required: true,
      message: "请输入等级名称",
    },
  ],
};

const handleSwitch = (status, item) => {
  levelStatus(item.id, { status }).then((res) => {
    getData();
  });
};
getData();
</script>
