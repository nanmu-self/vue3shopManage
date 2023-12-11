<template>
  <div class="flex" v-if="preview">
    <div v-if="modelValue" class="">
      <el-image
        v-if="typeof modelValue == 'string'"
        fit="cover"
        class="rounded border w-[100px] h-[100px]"
        :src="modelValue"
      ></el-image>
      <div v-else class="flex flex-wrap">
        <div class="relative" v-for="(item, i) in modelValue">
          <el-image
            :key="i"
            fit="cover"
            class="rounded border w-[100px] h-[100px] mx-2"
            :src="item"
          >
          </el-image>
          <el-icon
            class="top-[5px] bg-white rounded-full cursor-pointer"
            style="position: absolute; right: 15px"
            @click="remove(i)"
            ><CircleClose
          /></el-icon>
        </div>
        <div
          @click="dialogVisible = true"
          class="ml-2 w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100)"
        >
          <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
        </div>
      </div>
    </div>
    <div
      v-if="typeof modelValue == 'string'"
      @click="dialogVisible = true"
      class="ml-2 w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100)"
    >
      <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="选择图片" width="80%" top="5vh">
    <el-container style="height: 70vh">
      <imgAside ref="imgAsideRef" />
      <imgMain
        @selectimg="selectimg"
        ref="imgMainRef"
        isCheckbox
        :limit="limit"
      />
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
  limit: {
    type: Number,
    default: 1,
  },
  preview: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["update:modelValue"]);
const dialogSwitch = () => {
  dialogVisible.value = !dialogVisible.value;
};
defineExpose({ dialogSwitch });

//选中的图片
let urls = [];
const selectimg = (item) => {
  urls = item.map((e) => e.url);
};
const submit = () => {
  if (props.limit == 1) {
    emit("update:modelValue", urls[0]);
    dialogVisible.value = false;
  } else {
    //去除重复的图片
    let val = [...new Set([...props.modelValue, ...urls])];

    emit("update:modelValue", val);
    dialogVisible.value = false;
  }
};
const remove = (i) => {
  props.modelValue.splice(i, 1);
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
