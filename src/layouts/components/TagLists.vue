<template>
  <div class="tagBox" :style="{ left: expand ? '240px' : '64px' }">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      class="flex-1"
      @tab-remove="removeTab"
      style="min-width: 100px"
      @tab-change="tabChange"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path !== '/'"
      >
      </el-tab-pane>
    </el-tabs>
    <span class="tagBtn">
      <el-dropdown @command="handleCommand">
        <span>
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <div style="height: 32px"></div>
</template>
<script setup>
import { useUserStore } from "@/store/index.js";
import { storeToRefs } from "pinia";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
const store = useUserStore();
const { expand } = storeToRefs(store);

const route = useRoute();
const router = useRouter();

// 关闭其他和关闭全部
const handleCommand = (e) => {
  let tableTabs = editableTabs.value;
  let length = tableTabs.length;
  if (e == "closeOther") {
    let item = tableTabs.find(
      (element) => element.path == editableTabsValue.value
    );
    tableTabs.splice(1, length - 1);
    tableTabs.push(item);
  } else {
    tableTabs.splice(1, length - 1);
    router.push("/");
  }
};

const editableTabsValue = ref(route.fullPath);
const editableTabs = ref([
  {
    title: "首页",
    path: "/",
  },
]);
if (sessionStorage.getItem("tableTabs")) {
  editableTabs.value = JSON.parse(sessionStorage.getItem("tableTabs"));
}

watch(editableTabs.value, (newval, oldval) => {
  sessionStorage.setItem("tableTabs", JSON.stringify(newval));
});

const addTab = (title, path) => {
  editableTabs.value.push({
    title,
    path,
  });
};
onBeforeRouteUpdate((to, from) => {
  let exist = editableTabs.value.find((e) => e.path === to.fullPath);
  if (!exist) {
    addTab(to.meta.title, to.fullPath);
  }
  editableTabsValue.value = to.fullPath;
});

const tabChange = (e) => {
  router.push(e);
};

const removeTab = (e) => {
  let arr = editableTabs.value;
  let select = editableTabsValue.value;
  let index = arr.findIndex((element) => element.path === e);
  if (e == select) {
    select = arr[index + 1] || arr[index - 1];
    router.push(select);
  }
  arr.splice(index, 1);
};
</script>
<style scoped>
.tagBox {
  @apply fixed bg-gray-100 flex items-center px-2;
  top: 64px;
  height: 44px;
  right: 0;
}
.tagBtn {
  @apply bg-white rounded ml-auto flex items-center justify-center;
  height: 32px;
  width: 32px;
}
:deep(.el-tabs__header) {
  margin-bottom: 0;
  border: 0;
  @apply flex items-center;
}
:deep(.el-tabs__item) {
  border: 0 !important;
  height: 32px;
  line-height: 32px;
  @apply bg-white mx-1 rounded;
}
:deep(.el-tabs__nav) {
  border: 0 !important;
}
:deep(.el-tabs__nav-prev),
:deep(.el-tabs__nav-next) {
  height: 32px;
  line-height: 32px;
}
:deep(.is-disabled) {
  @apply text-gray-300;
  cursor: not-allowed;
}
</style>
