import { getGoodsInfo } from "@/api/goods";

export const goodsId = ref(0);
export const goodsSkusCard = ref([]);
// 规格设置
export const goodsSkus = ref([]);

// 获取商品详情
export const getGoodsDetail = () => {
  getGoodsInfo(goodsId.value).then((res) => {
    goodsSkus.value = res.goodsSkus;
    goodsSkusCard.value = res.goodsSkusCard;

    if (res.goodsSkus.length == 0) {
      let arr = [];
      res.goodsSkusCard.forEach((item) => {
        if (item.goodsSkusCardValue.length > 0) {
          arr.push(item.goodsSkusCardValue);
        }
      });
      cartesianProductOf(arr);
    }
  });
};

// 笛卡尔积算法
export function cartesianProductOf() {
  let arr = Array.prototype.reduce.call(
    ...arguments,
    function (a, b) {
      var ret = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    },
    [[]]
  );

  let resArr = [];
  arr.forEach((item) => {
    if (item.length != 0) {
      resArr.push({
        code: "",
        cprice: "0.00",
        goods_id: goodsId.value,
        oprice: "0.00",
        pprice: "0.00",
        skus: item,
        stock: 0,
        volume: 0,
        weight: 0,
      });
    }
  });

  goodsSkus.value = resArr;
}
