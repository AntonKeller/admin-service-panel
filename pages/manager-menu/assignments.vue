<template>
  <div>
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
              prepend-inner-icon="mdi-magnify"
              density="compact"
              label="Поиск по задачам"
              variant="outlined"
              hide-details
              single-line
              clearable
              v-model="searchText"
          />
        </div>
      </v-card-item>

      <v-card-item>
        <div class="d-flex ga-1">
          <v-chip
              v-for="e of statusVariant"
              :key="e.id"
              prepend-icon="mdi-filter-check-outline"
              density="comfortable"
              :variant="activeStatusId===e.id ? 'tonal' : 'text'"
              size="small"
              rounded="xl"
              :color="e.color"
              @click="setActiveChip(e.id)"
          >
            {{ e.title }}
          </v-chip>
        </div>
      </v-card-item>

      <v-overlay v-model="addMenuVisible" class="d-flex justify-center align-center">
        <c-assignment-card-add-menu :hideMenu="hideAddMenu"/>
      </v-overlay>

      <v-overlay v-model="changeMenuVisible" class="d-flex justify-center align-center">
        <c-assignment-card-change-menu :hideMenu="hideChangeMenu" :assignmentProp="activeAssignment"/>
      </v-overlay>
    </v-card>

    <v-list bg-color="transparent" max-height="85vh">
      <v-list-item v-for="assignment of assignmentsFiltered" :key="assignment.id">
        <c-assignment-card :assignment="assignment" @click="setActiveAssignment(assignment)"/>
      </v-list-item>
    </v-list>

  </div>
</template>

<script>
import {fetchAssignments} from "../../utils/methods/assignment-requests";
import {testDataAssignments} from "../../configs/testData";

export default {
  name: "assignments-page",

  data: () => ({
    activeStatusId: null,
    statusVariant: [
      {
        id: 1,
        title: 'Выполнены',
        color: 'teal',
      },
      {
        id: 2,
        title: 'Выполняются',
        color: 'lime-darken-3',
      },
      {
        id: 3,
        title: 'В ожидании',
        color: 'indigo',
      }
    ],
    addMenuVisible: false,
    changeMenuVisible: false,
    searchText: null,
    activeAssignment: null,
    assignmentList: null,
  }),

  computed: {
    assignmentsFiltered() {
      if (this.searchText?.length > 0 && this.assignmentList?.length > 0) {

        return this.assignmentList?.filter(assignment => [
          assignment.title,
          assignment?.contract?.contractDate,
          assignment?.contract?.customer?.fullName
        ].find(e => (new RegExp(this.searchText, 'i')).test(e)));

      } else return this.assignmentList;
    },
  },

  mounted() {
    this.updateAssignmentListData();
  },

  methods: {

    setActiveChip(id) {
      this.activeStatusId = this.activeStatusId === id ? null : id;
    },

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
            this.assignmentList = response?.data?.reverse();
          })
          .catch(err => {
            this.assignmentList = testDataAssignments?.reverse();
          });
    }

  }

}
</script>