<script setup></script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
<style>
body {
  @apply bg-gray-100;
}
::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}

/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
/*定义滑块
     内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(202, 202, 204, 0.3);
  background-color: #b3b3b3;
}
</style>
