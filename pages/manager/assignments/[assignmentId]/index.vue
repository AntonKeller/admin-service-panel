<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1024" class="bg-transparent">

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

        <v-card-title>
          <v-sheet class="bg-transparent px-2 py-4 rounded-lg">
            <v-icon icon="mdi-checkbox-marked-circle-auto-outline"/>
            <span class="ml-3">{{ assignment?.title }}</span>
          </v-sheet>
        </v-card-title>

        <v-card-item>
          <v-row>
            <v-col cols="4">
              <v-sheet class="border-thin px-6 py-4 rounded-lg h-100">
                <div class="d-flex align-center justify-space-between">
                  <v-icon size="small" color="blue-accent-4" icon="mdi-account-tie"/>
                  <v-spacer/>
                  <div>Заказчик</div>
                </div>
                <div class="mt-7 align-self-end">{{ assignmentCustomer }}</div>
              </v-sheet>
            </v-col>
            <v-col cols="4">
              <v-sheet class="border-thin px-6 py-4 rounded-lg h-100">
                <div class="d-flex align-center justify-space-between">
                  <v-icon size="small" color="blue-accent-4" icon="mdi-file-sign"/>
                  <v-spacer/>
                  <div>Договор</div>
                </div>
                <div class="mt-7 align-self-end">{{ assignmentContract }}</div>
              </v-sheet>
            </v-col>
            <v-col cols="4">
              <v-sheet class="border-thin px-6 py-4 rounded-lg h-100">
                <div class="d-flex align-center justify-space-between">
                  <v-icon size="small" color="blue-accent-4" icon="mdi-text-box-outline"/>
                  <v-spacer/>
                  <div>Доп. соглашение</div>
                </div>
                <div class="mt-7 align-self-end text-no-wrap">{{ assignmentSubContract }}</div>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-item>

        <v-card-item>
          <v-sheet v-bind="myTableSheetStyle">
            <div class="d-flex ga-4 align-center mb-6">
              <span class="font-weight-bold opacity-80">Адреса осмотров</span>
              <v-spacer/>
              <v-btn v-bind="myBtnPlus" @click="onAddBlock">
                Добавить адрес
                <v-tooltip activator="parent">
                  Добавить новый адрес на осмотр
                </v-tooltip>
              </v-btn>
              <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
            </div>
            <v-divider/>
            <v-data-table
                v-model="selectedItems"
                v-model:items-per-page="itemsPerPage"
                :items-per-page-options="itemsPerPageOptions"
                :items-per-page="itemsPerPage"
                :search="searchText"
                :loading="fetching"
                :headers="headers"
                :items="itemsMap"
                style="max-height: 400px"
                items-per-page-text="Кол-во на странице"
                loading-text="Загрузка данных..."
                no-data-text="Нет данных"
                class="bg-transparent"
                density="comfortable"
                items-per-page="5"
                item-value="_id"
                fixed-header
                :show-select="false"
                @update:current-items="selectedItems = []"
            >
              <template #item.actions="{ item }">
                <v-btn
                    icon="mdi-open-in-new"
                    density="comfortable"
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
import {mySearchFieldStyle, navigateBackBtnStyle, myBtnPlus, myTableSheetStyle} from "../../../../configs/styles";
import {fetchAssignmentBlocks, sendAssignmentBlock} from "../../../../utils/api/api_assignment_blocks";
import {unixDateToMiddleDateString, unixDateToShortDateString} from "../../../../utils/functions";
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
      myTableSheetStyle,
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
          console.log('Ошибка, такого задания не существует');
          this.$store.commit('alert/ERROR', 'Такого задания не существует');
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
      if (!this.assignment?.customer) return '[Пусто]';
      const returnName = this.assignment?.customer?.shortName || '[имя не указано]';
      const returnInn = this.assignment?.customer?.inn || '[ИНН не указан]';
      return `${returnName} | ${returnInn}`;
    },

    assignmentContract() {
      if (!this.assignment?.contract?.number || !this.assignment?.contract?.date) return '[Пусто]';
      const {number, date} = this.assignment?.contract;
      if (number && date) return `№ ${number} от ${this.unixDateToShortDateString(date)}`;
      if (!number && date) return `[№  отсутствует] от ${this.unixDateToShortDateString(date)}`;
      if (number && !date) return `№ ${number} от [дата отсутствует]`;
    },

    assignmentSubContract() {
      if (!this.assignment?.subContract?.number || !this.assignment?.subContract?.date) return `[Пусто]`;
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
      // if (window.history.length <= 2) {
      navigateTo(`/manager/assignments`);
      // } else {
      //   this.$router.back();
      // }
    },
  }
}
</script>