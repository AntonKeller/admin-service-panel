<template>
  <v-container fluid>
    <v-sheet>
      <v-card class="mx-auto" variant="text">

        <v-card-title>Список заданий</v-card-title>

        <v-card-item>
          <div class="d-flex ga-4 align-center">
            <my-search-bar
                v-model="searchText"
                label="Поиск по задачам"
                style="min-width: 400px"
                @btn:click="addMenuVisible = true"
            />
          </div>
        </v-card-item>
        <v-card-text>
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
        </v-card-text>
      </v-card>
    </v-sheet>

    <my-overlay v-model="addMenuVisible">
      <c-assignment-card-add-menu :hideMenu="hideAddMenu"/>
    </my-overlay>

    <my-overlay v-model="changeMenuVisible">
      <c-assignment-card-change-menu :_returnAssignment="changeAssignment" :_assignment="selectedAssignment"/>
    </my-overlay>
  </v-container>
</template>

<script>
import {fetchAssignments} from "@/utils/methods/assignment-requests.ts";
import dataAssignments from "@/configs/data-test/data-test-assignments";

export default {
  name: "assignments-page",

  data: () => ({
    addMenuVisible: false,
    changeMenuVisible: false,
    selectedAssignment: null,
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