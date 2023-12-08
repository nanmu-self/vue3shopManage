<template>
  <el-upload
    drag
    :action="uploadimage"
    multiple
    name="img"
    :headers="{ token }"
    :data="data"
    :on-success="handleSuccess"
    :on-error="handleError"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">将文件拖到此处或 <em>单击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>
<script setup>
import { uploadimage } from "@/api/image.js";

let token = localStorage.getItem("token");
defineProps({
  data: Object,
});
const emit = defineEmits(["success"]);

// 上传成功
const handleSuccess = (response, uploadFile, uploadFiles) => {
  emit("success", response, uploadFile, uploadFiles);
};
//上传失败
const handleError = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).msg || "上传失败";
  ElNotification({
    message: msg,
    type: "error",
  });
};
</script>
