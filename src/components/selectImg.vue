<template>
  <div v-if="modelValue" class="">
    <el-image
      fit="cover"
      class="rounded border w-[100px] h-[100px]"
      :src="modelValue"
    ></el-image>
  </div>
  <div
    @click="dialogVisible = true"
    class="ml-2 w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100)"
  >
    <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
  </div>
  <el-dialog v-model="dialogVisible" title="选择图片" width="80%" top="5vh">
    <el-container style="height: 70vh">
      <imgAside ref="imgAsideRef" />
      <imgMain @selectimg="selectimg" ref="imgMainRef" isCheckbox />
    </el-container>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import imgAside from "@/pages/image/img-aside.vue";
import imgMain from "@/pages/image/img-main.vue";
const dialogVisible = ref(false);
const props = defineProps({
  modelValue: [String, Array],
});
const emit = defineEmits(["update:modelValue"]);

//选中的图片
let urls = [];
const selectimg = (item) => {
  urls = item.map((e) => e.url);
  console.log(urls);
};
const submit = () => {
  if (urls.length) {
    emit("update:modelValue", urls[0]);
    dialogVisible.value = false;
  }
};
</script>
<style>
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
