<template>
  <div>
    <v-window v-model="activeTab">

      <v-window-item value="assignments-menu-tab">
        <c-assignments-menu :assignmentClick="showAssignmentBlocksMenu"/>
      </v-window-item>

<!--      <v-window-item value="assignment-blocks-menu-tab">-->
<!--        <c-assignment-blocks-menu :btnBackClick="showAssignmentMenu" :assignment="selectedAssignment"/>-->
<!--      </v-window-item>-->
      <v-overlay v-model="infoMenuVisible" class="d-flex justify-center align-center" width="75%" max-width="80%">
        <c-assignment-info-menu :_assignment="selectedAssignment" />
      </v-overlay>
    </v-window>


  </div>
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
      // this.activeTab = 'assignment-blocks-menu-tab';
    },
    showAssignmentMenu() {
      this.activeTab = 'assignments-menu-tab';
    },
  }
}
</script>