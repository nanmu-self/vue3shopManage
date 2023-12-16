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
            <el-icon @click="moreFun(item)" class="cursor-pointer"
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

    <Skuitem
      :goodsSkusCardValue="item.goodsSkusCardValue"
      :id="item.id"
      :name="item.name"
    />
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
  <!-- //规格设置 -->
  <SkuTable />
</template>
<script setup>
import {
  addGoodsSpecOption,
  updateGoodsSpecOption,
  deleteGoodsSpecOption,
  sortGoodsSpecOption,
} from "@/api/goods.js";
import { goodsId, goodsSkusCard } from "../hooks/sku";
import selectSku from "./selectSku.vue";
import SkuTable from "./SkuTable.vue";
import Skuitem from "./Skuitem.vue";

const selectSkuRef = ref(null);

//排序
const sortMove = (i, type) => {
  let SkusCard = goodsSkusCard.value;

  let temp = SkusCard[i];
  if (type === "up") {
    SkusCard[i] = SkusCard[i - 1];
    SkusCard[i - 1] = temp;
  } else {
    SkusCard[i] = SkusCard[i + 1];
    SkusCard[i + 1] = temp;
  }

  let data = SkusCard.map((e, index) => {
    return {
      order: index + 1,
      id: e.id,
    };
  });
  sortGoodsSpecOption(data).then((res) => {
    console.log(res);
  });
};
const moreFun = (item) => {
  selectSkuRef.value.dialogSwitch(item);
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
      res.goodsSkusCardValue = [];
      goodsSkusCard.value.push(res);
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
      let i = goodsSkusCard.value.findIndex((item) => item.id == id);
      if (i > -1) {
        goodsSkusCard.value.splice(i, 1);
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
