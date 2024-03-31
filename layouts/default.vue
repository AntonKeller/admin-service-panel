<template>
  <div>
    <transition name="bounce">
      <slot/>
    </transition>
  </div>
</template>

<script>

export default {
  name: "default",
  components: {
  },
}
</script>

<style scoped>

</style>
