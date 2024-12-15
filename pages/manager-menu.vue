<template>
  <div>
    <nuxt-layout name="navigate">
      <div>
        <nuxt-page/>
      </div>
    </nuxt-layout>
  </div>
</template>

<script>
export default {
  name: 'manager-menu',
}
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.30s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateX(-100px);
  filter: blur(0.3rem);
}
</style>