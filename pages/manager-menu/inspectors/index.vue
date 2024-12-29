<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1280">
      <v-card variant="text" :loading="fetchingInspectors">

        <v-card-title>Инспекторы</v-card-title>

        <v-card-item>
          <div class="d-flex align-center">
            <v-btn
                variant="tonal"
                color="blue-darken-4"
                prepend-icon="mdi-plus-box-multiple-outline"
                @click="navigateToInspectorAdd"
            >
              Добавить
              <v-tooltip activator="parent">
                Добавить нового инспектора
              </v-tooltip>
            </v-btn>
            <v-sheet width="550">
              <v-text-field
                  v-model="searchText"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo-filled"
                  label="Поиск инспектора"
                  density="compact"
                  class="ml-2"
                  flat
                  hide-details
                  single-line
              />
            </v-sheet>
          </div>
        </v-card-item>

        <v-card-item>
<!--          <v-divider/>-->
          <v-table style="max-height: 77vh" density="comfortable" fixed-header>
            <thead>
            <tr>
              <th class="rounded-ts-lg rounded-bs-sm bg-blue-darken-3">Имя</th>
              <th class="bg-blue-darken-3">Фамилия</th>
              <th class="bg-blue-darken-3">Отчество</th>
              <th class="bg-blue-darken-3">Номер телефона</th>
              <th class="bg-blue-darken-3">Email</th>
              <th class="rounded-te-lg rounded-be-sm bg-blue-darken-3"></th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="inspector of inspectorsSlice"
                :key="inspector._id"
                class="text-caption my-table-row"
            >
              <td>{{ inspector?.firstName || '' }}</td>
              <td>{{ inspector?.surname || '' }}</td>
              <td>{{ inspector?.lastName || '' }}</td>
              <td>{{ inspector?.phoneNumber || '' }}</td>
              <td>{{ inspector?.email || '' }}</td>
              <td style="min-width: 90px; width: 90px; max-width: 90px">
                <div class="d-flex ga-2">
                  <my-change-button prompt="Редактировать ТЗ" @click.stop="navigateToInspectorChange(inspector)"/>
                  <my-button-table-remove :prompt="'Удалить'" @click:yes="removeInspector(inspector._id)"/>
                </div>
              </td>
            </tr>
            </tbody>
          </v-table>
          <v-divider/>
        </v-card-item>

        <v-card-item>
          <div class="d-flex align-center">
            <v-pagination
                v-model="currentPage"
                density="comfortable"
                color="blue-grey-darken-2"
                show-first-last-page
                :length="totalPages"
                :total-visible="8"
            />
          </div>
        </v-card-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {removeInspector} from "@/utils/api/api_inspectors";
import _ from "lodash";

export default {
  name: "inspectors-page",

  data() {
    return {
      searchText: '',
      currentPage: 1,
      itemsPerPage: 20,
      inspectorMenuAddVisibility: false,
      inspectorMenuChangeVisibility: false,
    }
  },

  mounted() {
    this.$store.dispatch('inspectors/FETCH');
  },

  computed: {
    inspectors() {
      return this.$store.getters['inspectors/GET_INSPECTORS'];
    },
    fetchingInspectors() {
      return this.$store.getters['inspectors/GET_FETCHING'];
    },
    inspectorsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.inspectors.filter(e => {
          return (new RegExp(this.searchText, 'ig')).test([
            e?.firstName || null,
            e?.surname || null,
            e?.lastName || null,
            e?.phoneNumber || null,
            e?.email || null
          ].filter(e => !!e).join(' '));
        })
      } else {
        return this.inspectors;
      }
    },
    totalPages() {
      return Math.ceil(this.inspectorsFoundCount / this.itemsPerPage);
    },
    inspectorsFoundCount() {
      return this.inspectorsSearchFilter.length;
    },
    inspectorsSlice() {
      const from = (this.currentPage - 1) * this.itemsPerPage;
      const to = this.currentPage * this.itemsPerPage;
      return this.inspectorsSearchFilter.slice(from, to);
    },

  },

  methods: {

    selectInspector(inspector) {
      this.$store.commit('inspectors/SELECT', _.cloneDeep(inspector));
    },

    navigateToInspectorAdd() {
      navigateTo('/manager-menu/inspectors/inspector-add');
    },

    navigateToInspectorChange(inspector) {
      this.selectInspector(inspector);
      navigateTo('/manager-menu/inspectors/inspector-change');
    },

    removeInspector(ID) {
      removeInspector(ID)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Инспектор успешно удален');
            this.$store.dispatch('inspectors/FETCH');
          })
          .catch(() => {
            this.$store.commit('alert/ERROR', 'Ошибка удаления инспектора');
          })
    },
  }
}
</script>