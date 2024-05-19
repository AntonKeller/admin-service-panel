<template>
  <v-window v-model="activeTab">

    <v-window-item value="assignments-menu-tab">
      <c-assignments-menu :assignmentClick="showAssignmentBlocksMenu" />
    </v-window-item>

    <v-window-item value="assignment-blocks-menu-tab">
      <c-assignment-blocks-menu :btnBackClick="showAssignmentMenu" :assignment="selectedAssignment" />
    </v-window-item>

  </v-window>

</template>

<script>
export default {
  name: "assignments-page",
  data: () => ({
    activeTab: null,
    selectedAssignment: null,
  }),
  methods: {
    showAssignmentBlocksMenu(selectAssignment) {
      this.selectedAssignment = ({...selectAssignment});
      this.activeTab = 'assignment-blocks-menu-tab';
    },
    showAssignmentMenu() {
      this.activeTab = 'assignments-menu-tab';
    },
  }
}
</script>