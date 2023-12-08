<template>
  <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handleCreate"
        >新增图片分类</el-button
      >
    </el-header>

    <imgContainer />
  </el-container>

  <FormDrawer ref="formDrawerRef" title="新增" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.order" :min="1" :max="1000" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import { createimageClass } from "@/api/image.js";
import imgContainer from "./img-container.vue";
const windowHeight = window.innerHeight || document.body.clientHeight;
let h = windowHeight - 64 - 44 - 40;

const formRef = ref(null);

const form = reactive({
  name: "",
  order: 50,
});

let rules = {
  name: [
    {
      required: true,
      message: "请输入图片分类名称",
      trigger: "blur",
    },
  ],
};

const formDrawerRef = ref(null);

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return false;
    formDrawerRef.value.loadingSwitch();
    createimageClass(form.name, form.order)
      .then((res) => {
        ElNotification({
          message: "新增成功",
          type: "success",
        });
        formDrawerRef.value.drawerswitch();
      })
      .finally(() => {
        formDrawerRef.value.loadingSwitch();
      });
  });
};

const handleCreate = () => {
  formDrawerRef.value.drawerswitch();
};
</script>
<style scoped>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>
