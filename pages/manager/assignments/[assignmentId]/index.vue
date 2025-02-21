<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1280">

      <v-card variant="text">
        <v-card-item>
          <v-btn v-bind="navigateBackBtnStyle" @click="navigateBack">
            Назад
            <v-tooltip activator="parent" location="left">
              Вернуться назад
            </v-tooltip>
          </v-btn>
        </v-card-item>
      </v-card>

      <v-card variant="text">
        <v-card-title>{{ assignment?.title }}</v-card-title>
        <v-card-subtitle>
          <div class="d-flex ga-4 flex-wrap">
            <v-label class="text-body-2">
              <v-icon icon="mdi-account-tie"/>
              <div class="ml-2 align-self-end">{{ assignmentCustomer }}</div>
            </v-label>
            <v-label class="text-body-2">
              <v-icon icon="mdi-file-sign"/>
              <div class="ml-2 align-self-end">{{ assignmentContract }}</div>
            </v-label>
            <v-label class="text-body-2">
              <v-icon icon="mdi-text-box-outline"/>
              <div class="ml-2 align-self-end">{{ assignmentSubContract }}</div>
            </v-label>
          </div>
        </v-card-subtitle>

        <v-card-item>
          <v-sheet class="text-caption rounded-lg pr-1" style="height: 80px; overflow-y: scroll">
            {{ assignment?.description }}
          </v-sheet>
        </v-card-item>

        <v-card-item>
          <div class="d-flex ga-4 align-center">
            <v-btn v-bind="myBtnPlus" @click="onAddBlock">
              Добавить адрес
              <v-tooltip activator="parent">
                Добавить новый адрес на осмотр
              </v-tooltip>
            </v-btn>
            <v-spacer/>
            <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
          </div>
        </v-card-item>

        <v-card-item>
          <v-sheet class="border-sm rounded-lg bg-white px-7 pt-5 pb-2">
            <v-data-table
                v-model="selectedItems"
                v-model:items-per-page="itemsPerPage"
                :items-per-page-options="itemsPerPageOptions"
                :items-per-page="itemsPerPage"
                :search="searchText"
                :loading="fetching"
                :headers="headers"
                :items="itemsMap"
                style="max-height: 600px"
                items-per-page-text="Кол-во на странице"
                loading-text="Загрузка данных..."
                no-data-text="Нет данных"
                class="bg-transparent"
                density="comfortable"
                items-per-page="5"
                item-value="_id"
                fixed-header
                show-select
                @update:current-items="selectedItems = []"
            >
              <template #item.actions="{ item }">
                <v-btn
                    icon="mdi-open-in-new"
                    density="comfortable"
                    color="deep-orange"
                    variant="text"
                    size="small"
                    @click.stop="onOpenBlockCard(item._id)"
                >
                  <v-icon/>
                  <v-tooltip activator="parent" location="left">
                    Открыть карточку
                  </v-tooltip>
                </v-btn>
                <my-change-button
                    class="ml-2"
                    prompt="Редактировать ТЗ"
                    @click.stop="onBlockChange(item._id)"
                />
                <my-button-table-remove
                    :prompt="'Удалить'"
                    class="ml-2"
                    @click:yes="onRemoveBlock(item._id)"
                />
              </template>
            </v-data-table>
          </v-sheet>
        </v-card-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {fetchAssignmentBlocks, sendAssignmentBlock} from "../../../../utils/api/api_assignment_blocks";
import {unixDateToMiddleDateString, unixDateToShortDateString} from "../../../../utils/functions";
import {mySearchFieldStyle, navigateBackBtnStyle, myBtnPlus} from "../../../../configs/styles";
import {removeAssignmentBlock} from "@/utils/api/api_assignment_blocks";
import {fetchAssignmentOneById} from "@/utils/api/api_assignments";
import {navigateTo} from "nuxt/app";

export default {
  name: "assignment-card-page",

  data() {
    return {
      headers: [
        {
          title: 'Адрес',
          align: 'start',
          key: 'address',
          value: 'address',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Начало',
          align: 'start',
          key: 'start',
          value: 'start',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Инспектор',
          align: 'start',
          key: 'inspector',
          value: 'inspector',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Контакты инспектора',
          align: 'start',
          key: 'inspectorContacts',
          value: 'inspectorContacts',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          align: 'end',
          key: 'actions',
          sortable: false,
          minWidth: 150,
          maxWidth: 150,
          width: 150,
          nowrap: true,
        },
      ],
      items: [],
      selectedItems: [],
      fetching: false,
      assignment: null,
      searchText: '',
      itemsPerPage: 10,
      itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],

      // IMPORT STYLES
      navigateBackBtnStyle,
      mySearchFieldStyle,
      myBtnPlus,
    }
  },

  async beforeMount() {
    fetchAssignmentOneById(useRoute().params.assignmentId)
        .then(resp => {
          this.assignment = resp.data;
          this.fetchBlocks();
        })
        .catch(err => {
          console.log('Ошибка получения задания', err);
          this.$store.commit('alert/ERROR', 'Записи не существует');
          this.navigateBack();
        })
  },

  computed: {

    itemsMap() {
      return this.itemsSearchFilter.map(e => ({
        _id: e._id,
        address: e?.address ?? '-',
        start: this.unixDateToMiddleDateString(e?.startDate),
        inspector: this.getInspector(e?.inspector),
        inspectorContacts: this.getInspectorContacts(e?.inspector),
      }))
    },

    itemsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.items.filter(block => {
          return [
            block.title,
            block.description,
          ].filter(e => !!e).find(value => (new RegExp(this.searchText, 'ig')).test(value));
        });
      }
      return this.items;
    },

    assignmentCustomer() {
      if (!this.assignment?.customer) return 'Заказчик: не задан';
      const returnName = this.assignment?.customer?.shortName || 'имя не задано';
      const returnInn = this.assignment?.customer?.inn || 'не задан';
      return `Заказчик: ${returnName} | ${returnInn}`;
    },

    assignmentContract() {
      if (!this.assignment?.contract?.number || !this.assignment?.contract?.date) return `Договор не задан`;
      const {number, date} = this.assignment?.contract;
      if (number && date) return `Договор с заказчиком № ${number} от ${this.unixDateToShortDateString(date)}`;
      if (!number && date) return `Договор с заказчиком № [№ договора отсутствует] от ${this.unixDateToShortDateString(date)}`;
      if (number && !date) return `Договор с заказчиком № ${number} от [дата договора отсутствует]`;
    },

    assignmentSubContract() {
      if (!this.assignment?.subContract?.number || !this.assignment?.subContract?.date) return `ТЗ не задано`;
      const {number, date} = this.assignment?.subContract;
      if (number && date) return `ТЗ № ${number} от ${this.unixDateToShortDateString(date)}`;
      if (!number && date) return `ТЗ № [№ отсутствует] от ${this.unixDateToShortDateString(date)}`;
      if (number && !date) return `ТЗ № ${number} от [дата ТЗ отсутствует]`;
    },
  },

  methods: {

    unixDateToMiddleDateString,
    unixDateToShortDateString,

    fetchBlocks() {
      this.fetching = true;
      fetchAssignmentBlocks(this.assignment._id)
          .then(response => {
            this.items = response.data ?? [];
          })
          .catch(err => {
            console.log('Ошибка получения списка объектов', err);
            this.$store.commit('alert/ERROR', 'Ошибка получения списка объектов');
          })
          .finally(() => {
            this.fetching = false;
            this.selectedItems = [];
          })
    },

    // table fields
    getInspector(inspector) {
      if (!inspector?.surname && !inspector?.firstName && !inspector?.lastName) return '-';
      return `${inspector?.surname || ''} ${inspector?.firstName || ''} ${inspector?.lastName || ''}`;
    },

    getInspectorContacts(inspector) {
      if (!inspector?.phoneNumber && !inspector?.email) return '-';
      return `${inspector?.phoneNumber} | ${inspector?.email}`;
    },

    onAddBlock() {
      if (!this.assignment._id) {
        this.$store.commit('alert/ERROR', 'Ошибка при добавлении адреса, отсутствует id задания');
        return;
      }
      sendAssignmentBlock(this.assignment._id, {
        _id: null,
        title: '[пустой]', // Заголовок
        address: null, // Адрес
        startDate: null, // Дата начала
        pledger: null, // Залогодатель
        contact: null, // Контакт
        inspector: null, // Инспектор
      }).then(() => {
        this.fetchBlocks();
        this.$store.commit('alert/SUCCESS', 'Добавлен новый адрес осмотра');
        this.selectedItems = [];
      }).catch((err) => {
        this.$store.commit('alert/ERROR', 'Ошибка добавления нового адреса');
        console.log('Ошибка добавления', err);
      })
    },

    onOpenBlockCard(id) {
      navigateTo(`${id}/`);
    },

    onBlockChange(id) {
      navigateTo(`${id}/change`);
    },

    onRemoveBlock(blockID) {
      removeAssignmentBlock(blockID)
          .then(() => {
            this.fetchBlocks();
            this.$store.commit('alert/SUCCESS', 'Адрес успешно удален');
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Не удалось удалить адрес');
            console.log('Ошибка удаления адреса', err);
          })
    },

    navigateBack() {
      if (window.history.length <= 1) {
        navigateTo(`/manager/assignments/${useRoute().params.assignmentId}/`);
      } else {
        this.$router.back();
      }
    },
  }
}
</script>