<template>
  <selectImg
    v-model="selectImgArr"
    :preview="false"
    ref="selectImgRef"
    :limit="9"
  />
  <div id="sample">
    <Editor
      api-key="81tv0gl9hreuyyf3xyed3xok66rs0rax8pi0wnto04ivt5x7"
      :init="init"
      v-model="content"
    />
  </div>
</template>
<script setup>
import Editor from "@tinymce/tinymce-vue";
import selectImg from "@/components/selectImg.vue";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const selectImgRef = ref(null);
const content = ref(props.modelValue);
const init = {
  language: "zh_CN",
  selector: "textarea",
  height: 600,
  plugins: "lists link image table code help wordcount",
  toolbar: [
    "fullscreen undo redo restoredraft | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat imageUpload",
  ],
  setup: (editor) => {
    editor.ui.registry.addButton("imageUpload", {
      tooltip: "插入图片",
      icon: "edit-image",
      onAction() {
        selectImgRef.value.dialogSwitch();
        // console.log("imageUpload");
        // editor.insertContent(
        //   "<img src='https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png' style='width: 100%;' />"
        // );
      },
    });
  },
};

const selectImgArr = ref([]);
watch(selectImgArr, (val) => {
  for (let imgurl of val) {
    content.value += `<img src="${imgurl}" style="width: 100%;"/>`;
  }
});
</script>

<style scoped>
#sample {
  height: 100%;
}
</style>
