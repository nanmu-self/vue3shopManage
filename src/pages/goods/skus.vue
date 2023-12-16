<template>
  <FormDrawer
    ref="formDrawerRef"
    title="设置商品规格"
    @submit="submit"
    destroyOnClose
    size="60%"
  >
    <el-form :model="form" ref="formRef" label-width="80px">
      <el-form-item label="规格类型" class="items-center">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0" size="large">单规格</el-radio>
          <el-radio :label="1" size="large">多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.sku_type == 0">
        <el-form-item label="市场价格">
          <el-input
            v-model="form.sku_value.oprice"
            type="number"
            style="width: 30%"
          >
            <template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input
            v-model="form.sku_value.pprice"
            type="number"
            style="width: 30%"
            ><template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input
            v-model="form.sku_value.cprice"
            type="number"
            style="width: 30%"
            ><template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input
            v-model="form.sku_value.weight"
            type="number"
            style="width: 30%"
            ><template #append>公斤</template></el-input
          >
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input
            v-model="form.sku_value.volume"
            type="number"
            style="width: 30%"
            ><template #append>立方米</template></el-input
          >
        </el-form-item>
      </template>
      <template v-else>
        <!-- //多规格 -->
        <SkuCard />
      </template>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import SkuCard from "./components/SkuCard.vue";
import { updateGoodsSpec } from "@/api/goods";
import { goodsId, getGoodsDetail } from "./hooks/sku";

const formDrawerRef = ref(null);
const form = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  },
});

const submit = () => {
  updateGoodsSpec(goodsId.value, form).then((res) => {
    ElNotification({
      message: "设置商品规格成功",
      type: "success",
    });
    emit("refreshData");
  });
  formDrawerRef.value.drawerswitch();
};

const dialogSwitch = (item) => {
  console.log(item);
  goodsId.value = item.id;
  getGoodsDetail(item.id);
  form.sku_type = item.sku_type;
  form.sku_value = item.sku_value || {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  };

  formDrawerRef.value.drawerswitch();
};
const emit = defineEmits(["refreshData"]);
defineExpose({ dialogSwitch });
</script>
