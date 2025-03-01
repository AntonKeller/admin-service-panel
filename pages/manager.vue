<template>
  <div>
    <nuxt-layout name="navigate">
      <nuxt-page/>
      <my-alert></my-alert>
    </nuxt-layout>
  </div>
</template>

<script>
export default {
  name: "manager",
}
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s, transform 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>