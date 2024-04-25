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
<!--        v-model="searchText"-->
<!--        @input="search"-->
      </div>
    </v-card-item>

    <v-card-text>

      <v-list bg-color="transparent" max-height="85vh">
        <v-list-item v-for="assignment of testDataAssignments" :key="assignment.id">
          <c-assignment-card @click="setActive(assignment)" :assignment="assignment"/>
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

import {testDataAssignments} from '@/configs/testData';

export default {
  name: "assignments-page",
  data: () => ({
    addOverlay: false,
    changeOverlay: false,
    activeAssignment: null,
    testDataAssignments,
  }),
  methods: {
    overlayAddHide() {
      this.addOverlay = false;
    },
    overlayChangeHide() {
      this.changeOverlay = false;
    },
    setActive(newActiveAssignment) {
      this.activeAssignment = ({...newActiveAssignment});
      this.changeOverlay = true;
    }
  }
}
</script>

<style scoped>

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #D1C4E9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #7E57C2;
  border-radius: 6px;
}

</style>