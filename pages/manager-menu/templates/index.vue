<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1080">
      <v-card variant="text" :loading="fetching">

        <v-card-title>
          Шаблоны объектов осмотра
        </v-card-title>

        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-folder-cog-outline"/>
          Редактируйте, создавайте шаблоны под требования заказчика
        </v-card-subtitle>

        <v-card-item>
          <v-card-title class="d-flex align-center">
            <v-btn
                prepend-icon="mdi-plus-box-multiple-outline"
                color="blue-grey-darken-1"
                variant="tonal"
                @click="navigateToInspectorAdd"
            >
              Добавить
              <v-tooltip activator="parent">
                Добавить нового инспектора
              </v-tooltip>
            </v-btn>
            <v-spacer />
            <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
          </v-card-title>
        </v-card-item>

        <v-card-item>
          <v-data-table
              :items="templates"
              :headers="headers"
              :search="search"
              items-per-page-text="Кол-во на странице"
              items-per-page="5"
              density="comfortable"
              show-select
          />
        </v-card-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {mySearchFieldStyle} from "@/configs/styles";
export default {
  name: "index",
  data() {
    return {
      mySearchFieldStyle,
      headers: [
        {
          align: 'start',
          key: 'name',
          sortable: true,
          title: 'Наименование',
        },
      ],
      templates: [
        {
          _id: 1,
          name: 'Какое-то имя 1'
        },
        {
          _id: 2,
          name: 'Какое-то имя 2'
        },
        {
          _id: 3,
          name: 'Какое-то имя 3'
        },
        {
          _id: 4,
          name: 'Какое-то имя 4'
        }
      ],
      search: '',
      fetching: false,
    }
  }
}
</script>