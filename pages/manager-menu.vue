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

  beforeCreate() {

    if (sessionStorage.selectedAssignment) { // Инициализация текущего активного assignment
      try {
        const selectedAssignmentParse = JSON.parse(sessionStorage.selectedAssignment);
        this.$store.commit('assignments/SELECT', selectedAssignmentParse);
        console.log('[manager-menu] selectedAssignment инициализирован из session storage');
      } catch (err) {
        console.log('Не удалось распарсить selectedAssignment из session storage', err);
      }
    }

    if (sessionStorage.selectedAssignmentBlock) { // Инициализация текущего активного assignment block
      try {
        const selectedAssignmentBlockParse = JSON.parse(sessionStorage.selectedAssignmentBlock);
        this.$store.commit('assignmentBlocks/SELECT', selectedAssignmentBlockParse);
      } catch (err) {
        console.log('Не удалось распарсить selectedAssignmentBlock из session storage', err);
      }
    }

    if (sessionStorage.selectedInspectionObject) { // Инициализация текущего активного inspection object
      try {
        const selectedInspectionObjectParse = JSON.parse(sessionStorage.selectedInspectionObject);
        this.$store.commit('inspectionObjects/SELECT', selectedInspectionObjectParse);
      } catch (err) {
        console.log('Не удалось распарсить selectedInspectionObject из session storage', err);
      }
    }

  },
}
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>