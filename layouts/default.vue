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
}
</script>
