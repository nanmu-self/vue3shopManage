<template>
  <!-- <el-dialog
    v-model="dialogVisible"
    title="设置商品详情"
    width="70%"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <div>
      <Editor v-model="content" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogSwitch">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
  <selectImg ref="selectImgRef" /> -->
  <FormDrawer
    ref="formDrawerRef"
    size="60%"
    title="设置商品详情"
    @submit="handleSubmit"
  >
    <Editor v-model="content" />
  </FormDrawer>
</template>
<script setup>
import Editor from "@/components/Editor.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import { updateGoods } from "@/api/goods";

const content = ref("");

const handleSubmit = () => {};
const formDrawerRef = ref(null);

const dialogSwitch = (item) => {
  content.value = item.content;
  formDrawerRef.value.drawerswitch();
  //   dialogVisible.value = !dialogVisible.value;
  //   if (!item.id) return;
  //   goodsId.value = item.id;
  //   loading.value = true;
  //   getGoodsInfo(item.id)
  //     .then((res) => {
  //       console.log(res);
  //       goodsBanner.value = res.goodsBanner.map((e) => e.url);
  //     })
  //     .finally(() => {
  //       loading.value = false;
  //     });
};
defineExpose({ dialogSwitch });
</script>
