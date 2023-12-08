<template>
  <div class="menuBox" :style="{ width: expand ? '240px' : '64px' }">
    <el-menu
      class="border-0"
      @select="handleSelect"
      :collapse="!expand"
      :collapse-transition="false"
      :unique-opened="true"
      :default-active="defaultActive"
    >
      <template v-for="(item, i) in users.menus" :key="i">
        <el-sub-menu :index="item.name" v-if="item.child && item.child.length">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>

          <el-menu-item
            v-for="(item2, i2) in item.child"
            :key="i2"
            :index="item2.frontpath"
          >
            <el-icon> <component :is="item2.icon"></component></el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item :index="item.frontpath" v-else>
          <el-icon> <component :is="item.icon"></component></el-icon>
          <span>{{ item.name }}1</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script setup>
import { useUserStore } from "@/store/index.js";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const store = useUserStore();
const { users, expand } = storeToRefs(store);
// 点击跳转
const handleSelect = (e) => {
  router.push(e);
};
//默认打开
const defaultActive = ref(route.path);
</script>
<style scoped>
.menuBox {
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  transition: 0.2s;
  @apply shadow-md fixed bg-light-50;
}
</style>
