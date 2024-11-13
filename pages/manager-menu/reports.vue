<template>
  <v-container fluid>
    <v-sheet>
      <v-card variant="text" color="blue-darken-4">
        <v-card-title>Отчеты</v-card-title>
        <v-card-item>
          <div class="d-flex ga-4 align-center">
            <my-search-bar
                v-model="search"
                :hint="`Найдено: ${totalItems ?? 0}`"
                style="min-width: 500px"
                @btn:click=""
            />
          </div>
        </v-card-item>
      </v-card>
      <div style="min-height: 700px" class="mt-4">
        <v-divider/>
        <v-table
            style="height: 700px"
            density="comfortable"
            class="text-caption"
            fixed-header
        >
          <thead>
          <tr>
            <th>Отчет №</th>
            <th>К техническому заданию</th>
            <th>Блок</th>
            <th>Клиент</th>
            <th>Объектов осмотра</th>
            <th>Исполнитель</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(report, i) of reports">
            <td>{{ i + 1 }}</td>
            <td>lorem</td>
            <td>lorem</td>
            <td>lorem</td>
            <td>lorem</td>
            <td>lorem</td>
          </tr>
          </tbody>
        </v-table>
        <v-divider/>
      </div>
      <div class="d-flex align-center mt-4">
        <v-pagination
            :model-value="page"
            :length="totalPages"
            :total-visible="8"
            density="comfortable"
            color="blue-grey-darken-2"
            show-first-last-page
            @update:modelValue="changePage"
        />
      </div>
      <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
        <v-icon>mdi-alert-circle-outline</v-icon>
        {{ snackBar.msg }}
      </v-snackbar>
    </v-sheet>
  </v-container>
</template>

<script>
import {fetchReports} from "../../utils/api/api_reports";
import {showAlert} from "../../utils/functions.js";

export default {
  name: "reports-page",

  data() {
    return {
      snackBar: {},
      search: null,
      page: 1,
      totalPages: 1,
      totalItems: null,
      reports: []
    }
  },

  beforeMount() {

  },

  computed: {},

  methods: {
    changePage() {

      fetchReports()
          .then(response => {
            const {currentPage, totalPages, totalItems, data} = response.data;
            this.page = currentPage;
            this.totalPages = totalPages;
            this.totalItems = totalItems;
            this.reports = data;
          })
          .catch(err => {
            this.snackBar = showAlert('Не удалось изменить!').error();
            console.log('Ошибка запроса', err)
          })
    }
  }
}
</script>