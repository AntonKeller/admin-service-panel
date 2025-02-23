<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1120">
      <v-card variant="text">

        <v-card-title>Инспекторы</v-card-title>

        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-account-group-outline"/>
          Добавляйте, редактируйте данные ваших сюрвейеров
        </v-card-subtitle>

        <v-card-item/>

        <v-card-item>
          <v-card-title class="d-flex align-center">
            <v-btn v-bind="myBtnPlus" @click="onAddInspector">
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
          <v-sheet v-bind="myTableSheetStyle">
            <v-data-table
                :items="itemsSearchFilter"
                :headers="headers"
                :search="searchText"
                items-per-page-text="Кол-во на странице"
                no-data-text="Нет данных"
                density="comfortable"
                items-per-page="5"
                item-value="_id"
                fixed-header
                :show-select="false"
            >
              <template #item.name="{ item }">
                {{ getFullName(item) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <my-change-button prompt="Редактировать ТЗ" @click.stop="onChangeInspector(item._id)"/>
                <my-button-table-remove :prompt="'Удалить'" @click:yes="removeInspector(item._id)" class="ml-2"/>
              </template>
            </v-data-table>
          </v-sheet>
        </v-card-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {myBtnPlus, mySearchFieldStyle, myTableSheetStyle} from "@/configs/styles";
import {addInspector, fetchInspectors, removeInspector} from "@/utils/api/api_inspectors";

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
      items: [],
      fetching: false,
      searchText: '',

      // IMPORT STYLES
      mySearchFieldStyle,
      myTableSheetStyle,
      myBtnPlus,
    }
  },

  mounted() {
    this.fetchInspectors();
  },

  computed: {
    itemsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        const ex = new RegExp(this.searchText, 'ig');
        return this.items.filter(e => {
          return ex.test([
            e?.firstName || null,
            e?.surname || null,
            e?.lastName || null,
            e?.phoneNumber || null,
            e?.email || null
          ].filter(e => !!e).join(' '));
        })
      } else {
        return this.items;
      }
    },
  },

  methods: {

    getFullName(user) {
      return (user?.surname ? `${user?.surname}` : '') +
          (user?.firstName ? ` ${user?.firstName}` : '') +
          (user?.lastName ? ` ${user?.lastName}` : '');
    },

    onAddInspector() {
      const inspector = {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        login: null,
        password: null,
      }
      addInspector(inspector)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Добавлен новый инспектор');
            this.fetchInspectors();
          })
          .catch((err) => {
            console.log('Ошибка добавление инспектора', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавление инспектора');
          })
          .finally(() => {
            this.sending = false;
          })
    },

    fetchInspectors() {
      this.fetching = true;
      fetchInspectors()
          .then(response => {
            this.items = response.data;
          })
          .catch(err => {
            console.log('Ошибка получения списка инспекторов', err);
            this.$store.commit('alert/ERROR', 'Ошибка получения списка инспекторов');
          })
          .finally(() => {
            this.fetching = false;
          })
    },

    onChangeInspector(id) {
      navigateTo(`/manager/inspectors/${id}/change`);
    },

    removeInspector(id) {
      removeInspector(id)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Инспектор успешно удален');
            this.fetchInspectors();
          })
          .catch(() => {
            this.$store.commit('alert/ERROR', 'Ошибка удаления инспектора');
          })
    },
  }
}
</script>