<template>
  <div>
    <v-card class="mx-auto" variant="text" color="blue-grey-darken-2">
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
              v-for="e of statuses"
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
    </v-card>

    <v-list bg-color="transparent" max-height="80vh">
      <v-list-item v-if="loadingData">
        <v-skeleton-loader
            v-for="n of 3"
            width="full"
            color="transparent"
            elevation="0"
            type="list-item-three-line"
        />
      </v-list-item>
      <v-list-item v-for="assignment of assignmentsFiltered" :key="assignment.id">
        <c-assignment-card
            @click="assignmentClick(assignment)"
            :removeClick="removeAssignmentCard"
            :changeClick="showMenuAssignmentCardChange"
            :assignment="assignment"
        />
      </v-list-item>
    </v-list>

    <v-overlay v-model="addMenuVisible" class="d-flex justify-center align-center">
      <c-assignment-card-add-menu :hideMenu="hideAddMenu"/>
    </v-overlay>

    <v-overlay v-model="changeMenuVisible" class="d-flex justify-center align-center">
      <c-assignment-card-change-menu :hideMenu="changeAssignment" :assignmentProp="activeAssignment"/>
    </v-overlay>

  </div>
</template>

<script>
import {fetchAssignments} from "../utils/methods/assignment-requests";
import {testDataAssignments} from "../configs/testData";
export default {
  name: "c-assignments-menu",
  props: {
    assignmentClick: Function
  },

  data: () => ({
    activeStatusId: null,
    statuses: [
      {
        id: 1,
        title: 'В работе',
        color: 'indigo',
      },
      {
        id: 2,
        title: 'Согласование',
        color: 'lime-darken-3',
      },
      {
        id: 3,
        title: 'Акт, оплата',
        color: 'teal',
      },
      {
        id: 4,
        title: 'Закрыт',
        color: 'blue-gray',
      },
      {
        id: 5,
        title: 'КП',
        color: 'blue-gray',
      },
      {
        id: 6,
        title: 'Договор',
        color: 'blue-gray',
      },
    ],
    addMenuVisible: false,
    changeMenuVisible: false,
    searchText: null,
    activeAssignment: null,
    assignmentList: null,
    loadingData: true,
  }),

  computed: {
    assignmentsFiltered() {

      const _so = (this.searchText?.length > 0 && this.assignmentList?.length > 0);

      return _so ? this.assignmentList?.filter(assignment => [
        assignment.title,
        assignment?.contract?.contractDate,
        assignment?.contract?.customer?.fullName
      ].find(e => (new RegExp(this.searchText, 'i')).test(e))) : this.assignmentList;
    },
  },

  mounted() {
    this.updateAssignmentListData();
  },

  methods: {

    removeAssignmentCard(id) {
      this.assignmentList = this.assignmentList.filter(assignment => assignment._id !== id)
    },

    setActiveChip(id) {
      this.activeStatusId = this.activeStatusId === id ? null : id;
    },

    hideAddMenu() {
      this.addOverlay = false;
    },

    changeAssignment(newAssignment) {
      for (let i = 0; i < this.assignmentList.length; i++) {
        if (this.assignmentList[i]?._id === newAssignment?._id) {
          this.assignmentList[i] = {...newAssignment}
          break;
        }
      }

      this.changeMenuVisible = false;
    },

    showMenuAssignmentCardChange(newActiveAssignment) {
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
          })
          .finally(() => {
            this.loadingData = false;
          })
    }

  }

}
</script>