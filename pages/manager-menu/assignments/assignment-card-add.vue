<template>
  <my-overlay :model-value="true" @afterLeave="navigateTo('/manager-menu/assignments')">
    <c-assignment-card-add @add:success="$emit('add:success')"/>
  </my-overlay>
</template>

<script>

export default {
  name: "assignment-card-add-page",
}
</script>