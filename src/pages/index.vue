<template>
  <!-- 第一部分 -->
  <el-row :gutter="20">
    <template v-if="panels.length === 0">
      <el-col v-for="i in 4" :span="6" :offset="0">
        <el-skeleton style="width: 100%" animated loading>
          <template #template>
            <el-card shadow="hover" style="border: 0" class="cursor-pointer">
              <template #header>
                <div class="flex justify-between items-center">
                  <el-skeleton-item variant="text" style="width: 30%" />
                  <el-skeleton-item variant="text" style="width: 30%" />
                </div>
              </template>
              <el-skeleton-item variant="text" style="width: 30%" />
              <el-divider />
              <div class="flex justify-between text-gray-500 text-sm">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item variant="text" style="width: 30%" />
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>

    <el-col :span="6" :offset="0" v-for="(item, i) in panels" :key="i">
      <el-card shadow="hover" style="border: 0" class="cursor-pointer">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-sm">{{ item.title }}</span>
            <el-tag :type="item.unitColor" effect="plain">
              {{ item.unit }}
            </el-tag>
          </div>
        </template>
        <span class="text-3xl font-bold text-gray-500">
          <CountTo :value="item.value" />
        </span>
        <el-divider />
        <div class="flex justify-between text-gray-500 text-sm">
          <span>{{ item.subTitle }}</span
          ><span> {{ item.subValue }}</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第二部分 -->
  <el-row :gutter="20" class="my-5">
    <el-col :span="3" :offset="0" v-for="(item, i) in iconNavs" :key="i">
      <el-card shadow="hover" @click="$router.push(item.path)">
        <div class="flex justify-center items-center flex-col cursor-pointer">
          <el-icon :size="16" class="mb-1">
            <component :class="item.color" :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 第三部分 -->
  <el-row :gutter="20">
    <!-- 订单统计 -->
    <el-col :span="12" :offset="0">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-sm">订单统计</span>
            <div>
              <el-check-tag
                @click="changeTab(item.value)"
                :checked="activeName === item.value"
                style="margin-right: 8px"
                v-for="(item, i) in options"
                :key="i"
                >{{ item.text }}</el-check-tag
              >
            </div>
          </div>
        </template>
        <div id="echartsBox" style="width: 100%; height: 300px"></div>
      </el-card>
    </el-col>
    <!-- 店铺及商品提示 -->
    <el-col :span="12" :offset="0">
      <el-card shadow="always">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-sm">店铺及商品提示</span>
            <el-tag type="danger" effect="plain"> 店铺及商品提示 </el-tag>
          </div>
        </template>
        <el-row :gutter="20" class="flex items-center">
          <el-col :span="6" :offset="0" v-for="(item, i) in goods" :key="i">
            <el-card shadow="hover" class="cards cursor-pointer">
              <div class="flex flex-col items-center justify-center">
                <span class="text-xl mb-2">{{ item.value }}</span>
                <span class="text-xs text-gray-500">{{ item.label }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <!-- 交易提示 -->
      <el-card shadow="always" class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-sm">交易提示</span>
            <el-tag type="danger" effect="plain">
              需要立即处理的交易订单
            </el-tag>
          </div>
        </template>
        <el-row :gutter="20" class="flex items-center">
          <el-col :span="6" :offset="0" v-for="(item, i) in order" :key="i">
            <el-card shadow="hover" class="cards cursor-pointer">
              <div class="flex flex-col items-center justify-center">
                <span class="text-xl mb-2">{{ item.value }}</span>
                <span class="text-xs text-gray-500">{{ item.label }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { getStatistics1, getStatistics2, getStatistics3 } from "@/api/index.js";
import CountTo from "@/components/CountTo.vue";

const goods = ref([]);
const order = ref([]);
getStatistics2().then((res) => {
  goods.value = res.goods;
  order.value = res.order;
});

let myChart = null;
onMounted(() => {
  echarts.use([GridComponent, BarChart, CanvasRenderer]);

  let chartDom = document.getElementById("echartsBox");
  myChart = echarts.init(chartDom);

  renderingEcharts();
});

const renderingEcharts = () => {
  let option = {
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [],
        type: "bar",
      },
    ],
  };
  myChart.showLoading();
  getStatistics3(activeName.value)
    .then((res) => {
      option.xAxis.data = res.x;
      option.series[0].data = res.y;
      myChart.setOption(option);
    })
    .finally(() => {
      myChart.hideLoading();
    });
};

// 当前选中的标签
const activeName = ref("week");
//改变标签
const changeTab = (tab) => {
  activeName.value = tab;
  renderingEcharts();
};
const options = [
  {
    text: "近1个月",
    value: "month",
  },
  {
    text: "近1周",
    value: "week",
  },
  {
    text: "近24小时",
    value: "hour",
  },
];

const panels = ref([]);
//后台首页统计1
getStatistics1().then((res) => {
  panels.value = res.panels;
});
// 页面销毁移除echarts
onBeforeUnmount(() => {
  if (echarts) {
    myChart.dispose();
  }
});
const iconNavs = ref([
  {
    icon: "user",
    color: "text-light-blue-500",
    title: "用户",
    path: "/user/list",
  },
  {
    icon: "shopping-cart",
    color: "text-violet-500",
    title: "商品",
    path: "/goods/list",
  },
  {
    icon: "tickets",
    color: "text-fuchsia-500",
    title: "订单",
    path: "/order/list",
  },
  {
    icon: "chat-dot-square",
    color: "text-teal-500",
    title: "评价",
    path: "/comment/list",
  },
  {
    icon: "picture",
    color: "text-rose-500",
    title: "图库",
    path: "/image/list",
  },
  {
    icon: "bell",
    color: "text-green-500",
    title: "公告",
    path: "/notice/list",
  },
  {
    icon: "set-up",
    color: "text-grey-500",
    title: "配置",
    path: "/setting/base",
  },
  {
    icon: "files",
    color: "text-yellow-500",
    title: "优惠券",
    path: "/coupon/list",
  },
]);
</script>
<style scoped>
.cards {
  @apply border-0 bg-light-400;
}
</style>
