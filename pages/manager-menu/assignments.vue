<template>
  <div>
    <v-card class="mx-auto" variant="text" color="blue-grey-darken-2">
      <v-card-title>Список заданий</v-card-title>
      <v-card-item>
        <div class="d-flex ga-2">
          <v-btn
              rounded
              color="teal-darken-2"
              variant="elevated"
              density="default"
              size="small"
              icon="mdi-plus"
              @click="addMenuVisible = true"
          />
          <v-text-field
              color="teal-darken-1"
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
              :variant="activeStatus===e.id ? 'tonal' : 'text'"
              size="small"
              rounded="xl"
              :color="e.color"
              @click="setActiveChip(e.id)"
          >
            {{ e.title }}
          </v-chip>
        </div>
      </v-card-item>

      <v-card-item>
        <v-divider/>
      </v-card-item>
    </v-card>

    <v-list max-height="70vh">
      <v-table density="default" fixed-header>
        <thead>
        <tr>
          <th class="text-left">ТЗ</th>
          <th class="text-left">Описание</th>
          <th class="text-left">Договор</th>
          <th class="text-left">Дата договора</th>
          <th class="text-left">Заказчик</th>
          <th class="text-left">Тел.</th>
          <th class="text-left">Почта</th>
          <th class="text-left"></th>
        </tr>
        </thead>
        <tbody>
        <v-skeleton-loader
            v-if="fetchingAssignments"
            width="full"
            color="transparent"
            elevation="0"
            type="list-item-three-line"
        />
        <tr
            v-for="assignment of assignmentsFiltered"
            :key="assignment.id"
            class="tr_hover"
            @click="assignmentCardChangeOpen(assignment)"
        >
          <td>{{ assignment?.title }}</td>
          <td>{{ assignment?.description?.slice(0, 50) }}...</td>
          <td>{{ assignment?.contract?.contractNumber }}</td>
          <td>{{ assignment?.contract?.contractDate }}</td>
          <td>{{ assignment?.contract?.customer?.fullName || '-' }}</td>
          <td>{{ assignment?.contract?.customer?.phoneNumber || '-' }}</td>
          <td>{{ assignment?.contract?.customer?.email || '-' }}</td>
          <td>
            <v-btn
                @click.stop="removeAssignmentCard(assignment.id)"
                rounded="0"
                density="compact"
                variant="text"
                color="red-darken-4"
                icon="mdi-progress-close"
            />
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-list>

    <v-overlay
        v-model="addMenuVisible"
        class="d-flex justify-center align-center"
        transition="scroll-y-transition"
    >
      <c-assignment-card-add-menu :hideMenu="hideAddMenu"/>
    </v-overlay>

    <v-overlay
        v-model="changeMenuVisible"
        class="d-flex justify-center align-center"
        transition="scroll-y-transition"
    >
      <c-assignment-card-change-menu
          :_returnAssignment="changeAssignment"
          :_assignment="selectedAssignment"
      />
    </v-overlay>

  </div>
</template>

<script>
import {fetchAssignments} from "../../utils/methods/assignment-requests";
import dataAssignments from "../../configs/data-test/data-test-assignments";
import statuses from "../../configs/assignmentStatuses";

export default {
  name: "assignments-page",

  data: () => ({
    //
    statuses,
    activeStatus: null,
    //
    addMenuVisible: false,
    changeMenuVisible: false,
    selectedAssignment: null,
    //
    fetchingAssignments: true,
    searchText: null,
    assignmentList: null,
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
      this.activeStatus = this.activeStatus === id ? null : id;
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
    },

    assignmentCardChangeOpen(newSelectedAssignment) {
      this.selectedAssignment = ({...newSelectedAssignment});
      this.changeMenuVisible = true;
    },

    updateAssignmentListData() {

      fetchAssignments()
          .then(r => r?.data?.reverse())
          .catch(() => dataAssignments?.reverse())
          .then((r) => {
            this.fetchingAssignments = false;
            this.assignmentList = r;
          })
    }

  }

}
</script>