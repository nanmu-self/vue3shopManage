<script setup>
import gsap from "gsap";

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
});

const obj = reactive({
  num: 0,
});

gsap.to(obj, {
  duration: 0.5,
  num: props.value,
});
</script>

<template>
  {{ obj.num.toFixed() }}
</template>

<style scoped></style>
