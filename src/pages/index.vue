<template>
  <div>首页</div>
  <div>{{ users.username }}</div>
  <el-button>退出登陆</el-button>
</template>
<script setup>
import { useUserStore } from "@/store/index.js";
import { storeToRefs } from "pinia";
import { logout } from "@/api/admin.js";
import { useRouter } from "vue-router";
const router = useRouter();

const store = useUserStore();
const { users } = storeToRefs(store);
</script>
