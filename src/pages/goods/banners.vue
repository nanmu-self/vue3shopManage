<template>
  <el-dialog
    v-model="dialogVisible"
    title="设置轮播图"
    width="70%"
    destroy-on-close
  >
    <div v-loading="loading">
      <selectImg v-model="goodsBanner" :limit="9" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogSwitch">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import selectImg from "@/components/selectImg.vue";
import { getGoodsInfo, setGoodsBanner } from "@/api/goods.js";

const loading = ref(false);

const dialogVisible = ref(false);
const goodsBanner = ref([]);

const goodsId = ref(0);
const dialogSwitch = (item) => {
  dialogVisible.value = !dialogVisible.value;
  if (!item.id) return;
  goodsId.value = item.id;
  loading.value = true;
  getGoodsInfo(item.id)
    .then((res) => {
      console.log(res);
      goodsBanner.value = res.goodsBanner.map((e) => e.url);
    })
    .finally(() => {
      loading.value = false;
    });
};
defineExpose({ dialogSwitch });

const emit = defineEmits(["refreshData"]);
//提交
const submit = () => {
  loading.value = true;
  setGoodsBanner(goodsId.value, goodsBanner.value)
    .then((res) => {
      ElNotification({
        message: "设置轮播图成功",
        type: "success",
      });
      emit("refreshData");
      dialogVisible.value = false;
    })
    .finally(() => {
      dialogVisible.value = false;
      loading.value = false;
    });
};
</script>
