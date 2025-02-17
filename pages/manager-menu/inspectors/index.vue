<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1120">
      <v-card variant="text" :loading="fetchingInspectors">
        <v-card-title>
          Инспекторы
        </v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-account-group-outline" />
          Добавляйте, редактируйте данные ваших сюрвейеров
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
              :items="inspectorsSlice"
              :headers="headers"
              :search="searchText"
              items-per-page-text="Кол-во на странице"
              no-data-text="Нет данных"
              density="comfortable"
              items-per-page="5"
              item-value="_id"
              fixed-header
              show-select
          >
            <template #item.name="{ item }">
              {{
                (item.surname ? `${item.surname}` : '') + (item.firstName ? ` ${item.firstName}` : '') + (item.lastName ? ` ${item.lastName}` : '')
              }}
            </template>
            <template v-slot:item.actions="{ item }">
              <my-change-button prompt="Редактировать ТЗ" @click.stop="navigateToInspectorChange(item)"/>
              <my-button-table-remove :prompt="'Удалить'" @click:yes="removeInspector(item._id)" class="ml-2"/>
            </template>
            <template #loading>
              <v-skeleton-loader type="table-row@10" />
            </template>
          </v-data-table>
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
      headers: [
        {
          align: 'start',
          key: 'name',
          value: 'surname',
          sortable: true,
          title: 'ФИО Инспектора',

        },
        {
          align: 'start',
          key: 'phoneNumber',
          sortable: true,
          title: 'Номер телефона',
        },
        {
          align: 'start',
          key: 'email',
          sortable: true,
          title: 'Email',
        },
        {
          align: 'end',
          key: 'actions',
          sortable: false,
          width: 100,
        },
      ],

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

    getFullName(inspector) {
      if (!inspector.firstName && !inspector.surname && !inspector.lastName) return '-';
      return (inspector.firstName ? `${inspector.firstName}` : '') +
          (inspector.surname ? ` ${inspector.surname}` : '') +
          (inspector.lastName ? ` ${inspector.lastName}` : '');
    },

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