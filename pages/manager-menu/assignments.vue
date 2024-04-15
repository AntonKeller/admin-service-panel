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
            @click="overlay = true"
        />
        <v-text-field
            color="indigo-darken-1"
            :loading="true"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Поиск юзеров"
            variant="outlined"
            hide-details
            single-line
            v-model="searchText"
            @input="search"
        ></v-text-field>
      </div>
    </v-card-item>
    <v-card-text>
      <v-list bg-color="transparent" max-height="85vh">
        <v-list-item v-for="assignment of _assignments" :key="assignment.id">
          <c-card-assignment :assignment="assignment"/>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>

import {testDataAssignments} from '@/configs/testDataAssignments'

export default {
  name: "assignments-page",
  data: () => ({
    _assignments: testDataAssignments,
  })
}
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #D1C4E9;
  /*box-shadow: inset 0 0 5px #B39DDB;*/
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #7E57C2;
  border-radius: 6px;
}
</style>