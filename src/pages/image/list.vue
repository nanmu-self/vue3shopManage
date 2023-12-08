<template>
  <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handleCreate"
        >新增图片分类</el-button
      >
      <el-button type="warning" size="small" @click="handleUpload"
        >上传图片</el-button
      >
    </el-header>
    <el-container>
      <imgAside ref="imgAsideRef" @edit="handleEdit" />
      <imgMain ref="imgMainRef" />
    </el-container>
  </el-container>

  <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
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
import { createimageClass, upimageClass } from "@/api/image.js";
import imgAside from "./img-aside.vue";
import imgMain from "./img-main.vue";
const windowHeight = window.innerHeight || document.body.clientHeight;
let h = windowHeight - 64 - 44 - 40;

const imgMainRef = ref(null);
// 上传图片按钮
const handleUpload = () => {
  imgMainRef.value.drawerSwitch();
};

const drawerTitle = ref("");
const editId = ref(0);
// 修改图库分类
const handleEdit = (item) => {
  drawerTitle.value = "修改图片分类";
  editId.value = item.id;
  form.name = item.name;
  form.order = item.order;
  formDrawerRef.value.drawerswitch();
};

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
const imgAsideRef = ref(null);
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return false;
    formDrawerRef.value.loadingSwitch();
    let fun = editId.value
      ? upimageClass(editId.value, form.name, form.order)
      : createimageClass(form.name, form.order);
    fun
      .then((res) => {
        ElNotification({
          message: editId.value ? "修改成功" : "新增成功",
          type: "success",
        });
        imgAsideRef.value.getData();
        formDrawerRef.value.drawerswitch();
      })
      .finally(() => {
        formDrawerRef.value.loadingSwitch();
      });
  });
};
//新增分类
const handleCreate = () => {
  editId.value = 0;
  drawerTitle.value = "新增图片分类";
  form.name = "";
  form.order = 50;
  formDrawerRef.value.drawerswitch();
};
</script>
<style>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}
.top {
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 50px;
}
.bottom {
  @apply absolute bottom-0 left-0 right-0 flex items-center justify-center;
  height: 50px;
}
</style>
