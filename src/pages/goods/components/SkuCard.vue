<template>
  <el-card
    v-loading="cardLoading"
    shadow="never"
    v-for="(item, i) in goodsSkusCard"
    :key="item.id"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <el-input
          v-model="item.name"
          style="width: 200px"
          placeholder="规格名称"
          @blur="updateGoodsSpec(item)"
        >
          <template #append>
            <el-icon @click="selectSkuRef.dialogSwitch()" class="cursor-pointer"
              ><More
            /></el-icon>
          </template>
        </el-input>
        <div>
          <el-button
            size="small"
            @click="sortMove(i, 'up')"
            :disabled="i === 0"
          >
            <el-icon><Top /></el-icon
          ></el-button>
          <el-button
            size="small"
            @click="sortMove(i)"
            :disabled="i === goodsSkusCard.length - 1"
          >
            <el-icon><Bottom /></el-icon>
          </el-button>
          <el-popconfirm
            title="是否要删除该选项？"
            @confirm="defineEmits(item.id)"
          >
            <template #reference>
              <el-button size="small">
                <el-icon><Delete /></el-icon
              ></el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </template>
    <Skuitem :goodsSkusCardValue="item.goods_skus_card_value" />
  </el-card>

  <el-button
    class="mt-2"
    type="success"
    :loading="btnLoading"
    size="small"
    @click="addOption"
    >添加规格值</el-button
  >

  <selectSku ref="selectSkuRef" />
</template>
<script setup>
import {
  addGoodsSpecOption,
  updateGoodsSpecOption,
  deleteGoodsSpecOption,
  sortGoodsSpecOption,
} from "@/api/goods.js";
import { goodsId } from "../hooks/sku";
import selectSku from "./selectSku.vue";
import Skuitem from "./Skuitem.vue";
const props = defineProps({
  goodsSkusCard: Array,
});
const selectSkuRef = ref(null);
//排序
const sortMove = (i, type) => {
  let { goodsSkusCard } = props;
  let temp = goodsSkusCard[i];
  if (type === "up") {
    goodsSkusCard[i] = goodsSkusCard[i - 1];
    goodsSkusCard[i - 1] = temp;
  } else {
    goodsSkusCard[i] = goodsSkusCard[i + 1];
    goodsSkusCard[i + 1] = temp;
  }
  let data = goodsSkusCard.map((e, index) => {
    return {
      order: index + 1,
      id: e.id,
    };
  });
  sortGoodsSpecOption(data).then((res) => {
    console.log(res);
  });
};

const cardLoading = ref(false);
const btnLoading = ref(false);

const addOption = () => {
  let obj = {
    goods_id: goodsId.value,
    name: "规格名称",
    order: 50,
    type: 0,
  };

  btnLoading.value = true;
  //添加规格
  addGoodsSpecOption(obj)
    .then((res) => {
      res.goods_skus_card_value = [];
      props.goodsSkusCard.push(res);
    })
    .finally(() => {
      btnLoading.value = false;
    });
};
//更新规格
const updateGoodsSpec = (item) => {
  let { id, goods_id, name, order, type } = item;
  updateGoodsSpecOption(id, { goods_id, name, order, type });
};
//删除规格
const defineEmits = (id) => {
  cardLoading.value = true;
  deleteGoodsSpecOption(id)
    .then((res) => {
      let i = props.goodsSkusCard.findIndex((item) => item.id == id);
      if (i > -1) {
        props.goodsSkusCard.splice(i, 1);
      }
    })
    .finally(() => {
      cardLoading.value = false;
    });
};
</script>
<style scoped>
:deep(.el-card__header) {
  @apply bg-gray-50 p-2;
}
</style>
