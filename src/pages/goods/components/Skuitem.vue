<template>
  <el-tag
    v-for="(tag, i) in goodsSkusCardValue"
    :key="tag.id"
    class="mx-1"
    closable
    :disable-transitions="false"
    effect="plain"
    @close="handleClose(tag, i)"
  >
    <el-input
      v-model="tag.value"
      placeholder="选项值"
      size="small"
      @change="handleInputChange(tag)"
      style="margin-left: -10px; width: 60px"
    ></el-input>
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    style="width: 60px"
    size="small"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
    + 添加规格值
  </el-button>
</template>
<script setup>
import {
  addGoodsSpecOptionValue,
  updateGoodsSpecOptionValue,
  deleteGoodsSpecOptionValue,
} from "@/api/goods";
import { getGoodsDetail } from "../hooks/sku";
const props = defineProps({
  goodsSkusCardValue: Array,
  id: Number,
  name: String,
});

const inputValue = ref("");
const inputVisible = ref(false);
//删除
const handleClose = (tag, i) => {
  props.goodsSkusCardValue.splice(i, 1);
  deleteGoodsSpecOptionValue(tag.id).then((res) => {
    getGoodsDetail();
  });
};
//修改
const handleInputChange = (tag) => {
  updateGoodsSpecOptionValue(tag.id, tag).then((res) => {
    console.log(res);
  });
};

//添加
const handleInputConfirm = () => {
  if (inputValue.value == "") {
    inputValue.value = "";
    inputVisible.value = false;
    return;
  }
  // let goodsSkusCardValue = props.goodsSkusCardValue;
  let obj = {
    goods_skus_card_id: props.id,
    name: props.name,
    order: 50,
    value: inputValue.value,
  };
  addGoodsSpecOptionValue(obj).then((res) => {
    // goodsSkusCardValue.push(res);
    getGoodsDetail();
    inputValue.value = "";
    inputVisible.value = false;
  });
};

const showInput = () => {
  inputVisible.value = true;
};
</script>
<style scoped></style>
