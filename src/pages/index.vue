<template>
  <div>首页{{ num }}</div>
  <div>{{ store.users }}</div>
</template>
<script setup>
import { useUserStore } from "@/store/index.js";
const store = useUserStore();
const num = ref(555);
</script>
