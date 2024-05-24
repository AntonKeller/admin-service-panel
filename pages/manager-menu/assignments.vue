<template>
  <v-container>
    <c-assignments-menu :assignmentClick="showAssignmentBlocksMenu"/>

    <v-overlay
        v-model="infoMenuVisible"
        class="d-flex justify-center align-center"
        width="75%"
        max-width="80%"
        transition="scroll-y-transition"
    >
      <c-assignment-info-menu :_assignment="selectedAssignment"/>
    </v-overlay>
  </v-container>
</template>

<script>
export default {
  name: "assignments-page",
  data: () => ({
    infoMenuVisible: false,
    activeTab: null,
    selectedAssignment: null,
  }),
  methods: {
    showAssignmentBlocksMenu(selectAssignment) {
      this.selectedAssignment = ({...selectAssignment});
      console.log('this.selectedAssignment', this.selectedAssignment)
      this.infoMenuVisible = true;
    },
    showAssignmentMenu() {
      this.activeTab = 'assignments-menu-tab';
    },
  }
}
</script>