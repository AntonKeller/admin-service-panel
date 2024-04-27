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
            @click="addOverlay = true; changeOverlay = false"
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

      <v-overlay v-model="addOverlay" class="d-flex justify-center align-center">
        <c-assignment-card-add :hideSelfFunc="overlayAddHide"/>
      </v-overlay>

      <v-overlay v-model="changeOverlay" class="d-flex justify-center align-center">
        <c-assignment-card-change :hideSelfFunc="overlayChangeHide" :assignmentProp="activeAssignment"/>
      </v-overlay>

    </v-card-text>
  </v-card>
</template>

<script>
import {fetchAssignmentsEx} from "../../utils/methods/assignment-requests";
import {testDataAssignments} from "../../configs/testData";

export default {
  name: "assignments-page",

  data: () => ({

    overlays: {
      add: false,
      change: false,
    },

    addOverlay: false,
    changeOverlay: false,
    activeAssignment: null,
    dataAssignments: null,
    assignmentList: null,
  }),

  mounted() {
    this.updateAssignmentListData();
  },

  methods: {
    overlayAddHide() {
      this.addOverlay = false;
    },
    overlayChangeHide() {
      this.changeOverlay = false;
    },
    setActiveAssignment(newActiveAssignment) {
      this.activeAssignment = ({...newActiveAssignment});
      this.changeOverlay = true;
    },
    updateAssignmentListData() {
      fetchAssignmentsEx(500)
          .then(response => {
            console.log('Запрос списка задач выполнен успешно', response?.data)
            this.assignmentList = response?.data;
          })
          .catch(err => {
            console.log('Запрос задач выполнен с ошибкой', err);
            this.assignmentList = testDataAssignments;
          })
          .finally(() => {
            console.log('Запрос списка задач обработан');
          });
    }
  }

}
</script>