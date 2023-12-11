<template>
  <FormDrawer
    ref="formDrawerRef"
    size="60%"
    title="设置商品详情"
    @submit="handleSubmit"
    destroyOnClose
  >
    <Editor v-model="content" />
  </FormDrawer>
</template>
<script setup>
import Editor from "@/components/Editor.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import { updateGoods } from "@/api/goods";

const content = ref("");

const goodsId = ref(0);

const handleSubmit = () => {
  formDrawerRef.value.drawerswitch();
  updateGoods(goodsId.value, { content: content.value }).then((res) => {
    ElNotification({
      message: "设置商品详情成功",
      type: "success",
    });
    emit("refreshData");
  });
};
const formDrawerRef = ref(null);

const dialogSwitch = (item) => {
  goodsId.value = item.id;
  content.value = item.content;
  formDrawerRef.value.drawerswitch();
};
const emit = defineEmits(["refreshData"]);
defineExpose({ dialogSwitch });
</script>
