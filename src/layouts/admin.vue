<template>
  <el-container>
    <el-header>
      <Head />
    </el-header>
    <el-container>
      <el-aside
        style="transition: 0.5s"
        :style="{ width: store.expand ? '240px' : '64px' }"
        ><Menu
      /></el-aside>
      <el-main>
        <TagList />
        <router-view v-slot="{ Component }">
          <keep-alive :max="10">
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import Head from "./components/Head.vue";
import Menu from "./components/Menu.vue";

import TagList from "./components/TagLists.vue";

import { useUserStore } from "@/store/index.js";
const store = useUserStore();
</script>
<style scoped></style>
