<template>
  <div class="text-sm text-gray-500 mt-5">规格设置</div>
  <table>
    <tr>
      <th
        :colspan="item.colspan"
        :rowspan="item.rowspan"
        class="border"
        v-for="(item, i) in tableData"
        :key="i"
        width="100"
      >
        {{ item.name }}
      </th>
    </tr>
    <tr>
      <template v-for="(item, i) in goodsSkusCard" :key="i">
        <th v-if="item.goodsSkusCardValue.length > 0" class="border" width="80">
          {{ item.name }}
        </th>
      </template>
    </tr>
    <tbody>
      <tr v-for="(item, i) in goodsSkus" :key="i">
        <td class="border text-center" v-for="(td, i2) in item.skus" :key="i2">
          {{ td.value }}
        </td>
        <td class="border">
          <el-input v-model="item.pprice" size="small" type="number"></el-input>
        </td>
        <td class="border">
          <el-input v-model="item.oprice" size="small" type="number"></el-input>
        </td>
        <td class="border">
          <el-input v-model="item.cprice" size="small" type="number"></el-input>
        </td>
        <td class="border">
          <el-input v-model="item.stock" size="small" type="number"></el-input>
        </td>
        <td class="border">
          <el-input v-model="item.volume" size="small" type="number"></el-input>
        </td>
        <td class="border">
          <el-input v-model="item.weight" size="small" type="number"></el-input>
        </td>
        <td class="border">
          <el-input v-model="item.code" size="small"></el-input>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { goodsSkusCard, goodsSkus } from "../hooks/sku";

console.log(goodsSkus);
console.log(5555);
console.log(goodsSkusCard);
const tableData = computed(() => {
  let len = 0;

  goodsSkusCard.value.forEach((item) => {
    if (item.goodsSkusCardValue.length > 0) {
      len += 1;
    }
  });
  return [
    {
      name: "商品规格",
      colspan: len,
    },
    { name: "销售价", rowspan: 2 },
    { name: "市场价", rowspan: 2 },
    { name: "成本价", rowspan: 2 },
    { name: "库存", rowspan: 2 },
    { name: "体积", rowspan: 2 },
    { name: "重量", rowspan: 2 },
    { name: "编码", rowspan: 2 },
  ];
});
</script>

<style scoped></style>
