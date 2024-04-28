<template>
  <v-card class="mx-auto" variant="text" color="blue-grey-darken-2" max-height="100%">
    <v-card-title>Список заданий</v-card-title>
    <v-card-item>
      <div class="d-flex ga-2">
        <v-btn
            rounded
            color="indigo-darken-1"
            variant="elevated"
            density="default"
            size="small"
            icon="mdi-plus"
            @click="addMenuVisible = true"
        />
        <v-text-field
            color="indigo-darken-1"
            :loading="true"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Поиск по задачам"
            variant="outlined"
            hide-details
            single-line
        />
      </div>
    </v-card-item>

    <v-card-text>

      <v-list bg-color="transparent" max-height="85vh">
        <v-list-item v-for="assignment of assignmentList" :key="assignment.id">
          <c-assignment-card :assignment="assignment" @click="setActiveAssignment(assignment)"/>
        </v-list-item>
      </v-list>

      <v-overlay v-model="addMenuVisible" class="d-flex justify-center align-center">
        <c-assignment-card-add-menu :hideMenu="hideAddMenu"/>
      </v-overlay>

      <v-overlay v-model="changeMenuVisible" class="d-flex justify-center align-center">
        <c-assignment-card-change-menu :hideMenu="hideChangeMenu" :assignmentProp="activeAssignment"/>
      </v-overlay>

    </v-card-text>
  </v-card>
</template>

<script>
import {fetchAssignments} from "../../utils/methods/assignment-requests";
import {testDataAssignments} from "../../configs/testData";

export default {
  name: "assignments-page",

  data: () => ({
    addMenuVisible: false,
    changeMenuVisible: false,

    activeAssignment: null,
    dataAssignments: null,
    assignmentList: null,
  }),

  mounted() {
    this.updateAssignmentListData();
  },

  methods: {

    hideAddMenu() {
      this.addOverlay = false;
    },

    hideChangeMenu() {
      this.changeOverlay = false;
    },

    setActiveAssignment(newActiveAssignment) {
      this.activeAssignment = ({...newActiveAssignment});
      this.changeMenuVisible = true;
    },

    updateAssignmentListData() {
      fetchAssignments(500)
          .then(response => {
            this.assignmentList = response?.data;
          })
          .catch(err => {
            this.assignmentList = testDataAssignments;
          })
          .finally(() => {
            console.log('Запрос списка задач обработан', this.assignmentList);
          });
    }

  }

}
</script>