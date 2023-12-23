<template>
  <!-- 推荐商品 -->
  <FormDrawer
    ref="FormDrawerRef"
    title="推荐商品"
    submitText="关联"
    @submit="proposeSubmit"
  >
    <el-table
      v-loading="proposeLoading"
      :data="proposeData"
      border
      style="width: 100%"
    >
      <el-table-column align="center" prop="goods_id" label="ID" />
      <el-table-column align="center" label="商品封面" width="180">
        <template #default="{ row }">
          <el-avatar shape="square" :size="100" fit="cover" :src="row.cover" />
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="商品名称" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-popconfirm
            title="是否确认要删除？"
            confirm-button-text="删除"
            cancel-button-text="取消"
            @confirm="proposeDelete(row.id)"
          >
            <template #reference>
              <el-button type="primary" link size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </FormDrawer>
  <SelectGoods ref="selectGoodsRef" @submit="association" />
</template>
<script setup>
import SelectGoods from "@/components/SelectGoods.vue";
import FormDrawer from "@/components/FormDrawer.vue";
import {
  getCategoryProductList,
  deleteCategoryProduct,
  addCategoryProduct,
} from "@/api/category";

// 推荐商品逻辑
const proposeId = ref(0);
const FormDrawerRef = ref(null);
const proposeData = ref([]);
const proposeBtn = (id) => {
  proposeId.value = id;
  getpropose();
  FormDrawerRef.value.drawerswitch();
};
//删除
const proposeDelete = (id) => {
  deleteCategoryProduct(id).then((res) => {
    ElMessage.success("删除成功");
    getpropose();
  });
};
const proposeLoading = ref(false);
//获取关联
function getpropose() {
  proposeLoading.value = true;
  getCategoryProductList(proposeId.value)
    .then((res) => {
      proposeData.value = res;
    })
    .finally(() => {
      proposeLoading.value = false;
    });
}

const selectGoodsRef = ref(null);
const proposeSubmit = () => {
  selectGoodsRef.value.dialogSwitch();
};

const association = (ids) => {
  addCategoryProduct({ category_id: proposeId.value, goods_ids: ids }).then(
    (res) => {
      ElMessage.success("关联成功");
      getpropose();
    }
  );
};

defineExpose({
  proposeBtn,
});
</script>
