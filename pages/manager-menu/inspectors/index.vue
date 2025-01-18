<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1280">
      <v-card variant="text" :loading="fetchingInspectors">

        <v-card-title>Инспекторы</v-card-title>

        <v-card-item>
          <div class="d-flex align-center">
            <v-btn
                prepend-icon="mdi-plus-box-multiple-outline"
                color="blue-grey"
                variant="tonal"
                @click="navigateToInspectorAdd"
            >
              Добавить
              <v-tooltip activator="parent">
                Добавить нового инспектора
              </v-tooltip>
            </v-btn>
            <v-sheet max-width="550" width="100%">
              <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
            </v-sheet>
          </div>
        </v-card-item>

        <v-card-item>
          <v-table style="max-height: 65vh" density="comfortable" fixed-header>
            <thead>
            <tr>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Отчество</th>
              <th>Номер телефона</th>
              <th>Email</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="inspector of inspectorsSlice"
                :key="inspector._id"
                class="text-caption"
            >
              <td>{{ inspector?.firstName || '-' }}</td>
              <td>{{ inspector?.surname || '-' }}</td>
              <td>{{ inspector?.lastName || '-' }}</td>
              <td>{{ inspector?.phoneNumber || '-' }}</td>
              <td>{{ inspector?.email || '-' }}</td>
              <td style="min-width: 95px; width: 95px; max-width: 95px">
                <div class="d-flex ga-2">
                  <my-change-button prompt="Редактировать ТЗ" @click.stop="navigateToInspectorChange(inspector)"/>
                  <my-button-table-remove :prompt="'Удалить'" @click:yes="removeInspector(inspector._id)"/>
                </div>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-card-item>

        <v-card-item v-if="inspectorsSlice?.length === 0">
          <v-label class="d-flex justify-center pb-4 border-b-sm">
            Нет данных
          </v-label>
        </v-card-item>

        <v-card-item v-if="inspectorsSlice && inspectorsSlice?.length !== 0">
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
import {mySearchFieldStyle} from "@/configs/styles";
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
      mySearchFieldStyle,
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