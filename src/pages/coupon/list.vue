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
      <el-table-column prop="title" label="优惠卷名称" width="350">
        <template #default="{ row }">
          <div
            class="border border-dashed py-2 px-4 rounded"
            :class="row.statusText == '领取中' ? 'active' : 'inactive'"
          >
            <div class="font-bold text-md">{{ row.name }}</div>
            <div>{{ row.start_time }}~{{ row.end_time }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusText" label="状态" align="center" />
      <el-table-column label="优惠" align="center">
        <template #default="{ row }">
          {{ row.type ? "折扣" : "满减"
          }}{{ row.type ? row.value + "折" : "￥" + row.value }}
        </template>
      </el-table-column>
      <el-table-column prop="total" label="发放数量" align="center" />
      <el-table-column prop="used" label="已使用" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <div class="flex justify-center items-center">
            <el-button
              v-if="scope.row.statusText == '未开始'"
              type="primary"
              size="small"
              text
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              v-if="scope.row.statusText != '领取中'"
              width="220"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon-color="#626AEF"
              title="是否要删除该优惠劵？"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
          <el-popconfirm
            v-if="scope.row.statusText == '领取中'"
            width="220"
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon-color="#626AEF"
            title="是否让优惠劵失效？"
            @confirm="handleInvalid(scope.row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small">失效</el-button>
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
    <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type" class="ml-4">
          <el-radio :label="0" size="large">满减</el-radio>
          <el-radio :label="1" size="large">折扣</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="面值">
        <el-input v-model="form.value" style="width: 50%">
          <template #append> {{ form.type ? "折" : "元" }} </template>
        </el-input>
      </el-form-item>
      <el-form-item label="发行量">
        <el-input-number v-model="form.total" :min="0" :max="10000">
        </el-input-number>
      </el-form-item>
      <el-form-item label="最低使用价格">
        <!-- <el-input-number v-model="form.min_price" :min="0" :max="10000" /> -->
        <el-input
          v-model="form.min_price"
          type="number"
          placeholder="输入使用价格"
          style="width: 50%"
        />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.order" :min="0" :max="1000" />
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import {
  addCoupon,
  updateCoupon,
  getCouponList,
  deleteCoupon,
  invalidCoupon,
} from "@/api/coupon.js";
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
  getList: getCouponList, //获取列表
  deleteFun: deleteCoupon, //删除
  updateData: updateCoupon, //更新数据
  addData: addCoupon, //新增数据
  InitFormData: {
    name: "",
    type: 0,
    value: 0,
    total: 0,
    min_price: 0,
    start_time: "",
    end_time: "",
    order: 50,
    desc: "",
  },
  // 获取数据成功之后的回调
  success: (res) => {
    tableData.value = res.list.map((item) => {
      item.statusText = invalid(item);
      return item;
    });
    totalCount.value = res.totalCount;
  },
});

const rules = {
  name: [
    {
      required: true,
      message: "请输入优惠卷名称",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入公告内容",
    },
  ],
};

getData();

//判断优惠卷状态
function invalid(row) {
  let s = "领取中";
  let start_time = new Date(row.start_time).getTime();
  let now = new Date().getTime();
  let end_time = new Date(row.end_time).getTime();
  if (start_time > now) {
    s = "未开始";
  } else if (end_time < now) {
    s = "已过期";
  } else if (row.status == 0) {
    s = "已失效";
  }
  return s;
}

const time = ref([]);
watch(time, (newVal) => {
  form.start_time = new Date(newVal[0]).getTime();
  form.end_time = new Date(newVal[1]).getTime();
});
watch(form, (newVal) => {
  time.value[0] = new Date(newVal.start_time).getTime();
  time.value[1] = new Date(newVal.end_time).getTime();
});

// 让优惠劵失效
const handleInvalid = (id) => {
  invalidCoupon(id).then((res) => {
    ElNotification({
      message: "失效成功",
      type: "success",
    });
    getData();
  });
};
</script>
<style scoped>
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
}
.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
