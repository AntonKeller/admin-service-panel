<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="650">
      <v-card variant="text" :loading="fetching">

        <v-card-title>
          Шаблоны объектов осмотра
        </v-card-title>

        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-folder-cog-outline"/>
          Редактируйте, создавайте шаблоны под требования заказчика
        </v-card-subtitle>

        <v-card-item/>

        <v-card-item>
          <v-card-title class="d-flex align-center">
            <v-btn
                variant="outlined"
                class="bg-blue-darken-2"
                @click="navigateToTemplateAdd"
            >
              Добавить
              <v-tooltip activator="parent">
                Добавить нового инспектора
              </v-tooltip>
            </v-btn>
            <v-spacer/>
            <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
          </v-card-title>
        </v-card-item>

        <v-card-item>
          <v-sheet class="border-sm rounded-lg bg-white px-6 pt-4 pb-1">
            <v-data-table
                :items="templates"
                :headers="headers"
                :search="search"
                items-per-page-text="Кол-во на странице"
                density="comfortable"
                items-per-page="5"
                item-value="_id"
                show-select
            />
          </v-sheet>
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