<template>
  <div class="menuBox" :style="{ width: expand ? '240px' : '64px' }">
    <el-menu
      default-active="2"
      class="border-0"
      @select="handleSelect"
      :collapse="!expand"
      :collapse-transition="false"
      :unique-opened="true"
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
import { useRouter } from "vue-router";
const router = useRouter();
const store = useUserStore();
const { users, expand } = storeToRefs(store);
const handleSelect = (e) => {
  router.push(e);
};
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
/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
.menuBox::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}

/*定义滚动条轨道
 内阴影+圆角*/
.menuBox ::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
/*定义滑块
     内阴影+圆角*/
.menuBox ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #b3b3b3;
}
</style>
