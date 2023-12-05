<template>
  <el-container>
    <el-header>
      <Head />
    </el-header>
    <el-container>
      <el-aside><Menu /></el-aside>
      <el-main>
        <TagList />
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import Head from "./components/Head.vue";
import Menu from "./components/Menu.vue";
import TagList from "./components/TagList.vue";
</script>
