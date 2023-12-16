import { getGoodsInfo } from "@/api/goods";

export const goodsId = ref(0);
export const goodsSkusCard = ref([]);
// 规格设置
export const goodsSkus = ref([]);

// 获取商品详情
export const getGoodsDetail = () => {
  getGoodsInfo(goodsId.value).then((res) => {
    console.log(res);
    goodsSkus.value = res.goodsSkus;
    goodsSkusCard.value = res.goodsSkusCard;
  });
};
