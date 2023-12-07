<template>
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

  <el-row :gutter="20" class="mt-5">
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
</template>
<script setup>
import { useUserStore } from "@/store/index.js";
import { storeToRefs } from "pinia";
import { getStatistics1 } from "@/api/index.js";
import { useRouter } from "vue-router";
import CountTo from "@/components/CountTo.vue";
const router = useRouter();

const store = useUserStore();
const { users } = storeToRefs(store);

const panels = ref([]);
//后台首页统计1
getStatistics1().then((res) => {
  panels.value = res.panels;
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
