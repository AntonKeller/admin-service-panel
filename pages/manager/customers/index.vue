<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1280" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <v-card-title class="">Заказчики</v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-card-account-details-outline" size="small"/>
          Добавляйте заказчиков в таблицу и работайте в привычном формате
        </v-card-subtitle>
      </v-sheet>

      <v-sheet class="border-b bg-white py-4 pl-4 pr-1">
        <div class="d-flex align-center">
          <v-btn
              prepend-icon="mdi-playlist-plus"
              color="blue-accent-4"
              variant="text"
              size="small"
              rounded="md"
              border
              @click="onAddCustomer"
          >
            Добавить заказчика
            <v-tooltip activator="parent" text="Добавить новую запись"/>
          </v-btn>
          <div class="mx-2"></div>
          <v-btn
              append-icon="mdi-chevron-down"
              variant="text"
              size="small"
              rounded="md"
              border
              :disabled="!selectedItems.length"
          >
            Операции
            <v-tooltip activator="parent" text="Операции с выделенными"/>
            <v-menu activator="parent" transition="scale-transition">
              <v-sheet rounded="md" class="mt-1" elevation="0" border>
                <v-list-item
                    append-icon="mdi-format-list-checks"
                    density="compact"
                    @click="selectedItems=[]"
                >
                  <template #append>
                    <v-icon icon="mdi-format-list-checks" size="small"/>
                  </template>
                  <v-list-item-title>Снять выделение</v-list-item-title>
                </v-list-item>
                <v-divider/>
                <v-list-item
                    append-icon="mdi-delete-sweep-outline"
                    density="compact"
                    @click=""
                >
                  <template #append>
                    <v-icon icon="mdi-delete-sweep-outline" size="small"/>
                  </template>
                  <v-list-item-title>Удалить</v-list-item-title>
                  <v-menu activator="parent" location="top right" width="205">
                    <v-sheet class="elevation-0 rounded-lg border-sm px-4 py-3">
                      <div>Подтвердите удаление</div>
                      <v-divider class="my-3 "/>
                      <div class="d-flex align-center ga-1">
                        <v-btn
                            density="comfortable"
                            class="rounded-lg"
                            variant="flat"
                            size="small"
                            border="sm"
                            text="Ок"
                            @click="onRemoveSomeCustomers"
                        />
                        <v-btn
                            density="comfortable"
                            class="rounded-lg"
                            variant="flat"
                            size="small"
                            text="Отмена"
                        />
                      </div>
                    </v-sheet>
                  </v-menu>
                </v-list-item>
              </v-sheet>
            </v-menu>
          </v-btn>
          <div class="mx-1"></div>
          <v-btn
              :loading="fetching"
              prepend-icon="mdi-update"
              variant="text"
              size="small"
              rounded="md"
              border
              @click="updateTable"
          >
            Обновить
            <v-tooltip activator="parent" text="Обновить данные"/>
          </v-btn>
          <v-spacer/>
          <v-progress-circular
              v-if="searching"
              color="grey"
              size="25"
              indeterminate
          />
          <v-text-field
              v-model="_searchText"
              v-bind="mySearchFieldStyle"
              style="max-width: 350px"
              @update:modelValue="updateSearch"
          />
        </div>
      </v-sheet>

      <v-data-table
          v-model="selectedItems"
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :items-per-page="itemsPerPage"
          :items="itemsMap"
          :headers="headers"
          :search="searchText"
          style="max-height: 500px"
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
        <template #item.inn="{ item }">
          {{ item?.inn ?? '-' }}
        </template>
        <template #item.phoneNumber="{ item }">
          {{ item?.phoneNumber ?? '-' }}
        </template>
        <template v-slot:item.actions="{ item }">
          <my-change-button prompt="Редактировать ТЗ" @click.stop="onChangeCustomer(item._id)"/>
          <my-button-table-remove :prompt="'Удалить'" @click:yes="onRemoveCustomer(item._id)" class="ml-2"/>
        </template>
        <template #footer.prepend>
          <div class="mr-auto text-grey-darken-1 pl-4 mt-2" v-if="selectedItems.length">
            <v-icon icon="mdi-order-bool-ascending-variant" class="mr-1"/>
            Выбрано элементов: {{ selectedItems.length }}
          </div>
        </template>
      </v-data-table>
    </v-sheet>
  </v-container>
</template>

<script>
import {addCustomer, fetchCustomers, removeCustomer, removeSomeCustomers} from "@/utils/api/api_customers";
import {myBtnPlus, mySearchFieldStyle, myTableSheetStyle} from "@/configs/styles";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "customers-page",

  data() {
    return {
      headers: [
        {
          align: 'start',
          key: 'shortName',
          value: 'shortName',
          sortable: true,
          title: 'Организация',
        },
        {
          align: 'start',
          key: 'inn',
          value: 'inn',
          sortable: true,
          title: 'ИНН',
          nowrap: true,
        },
        {
          align: 'start',
          key: 'representativeFullName',
          value: 'representativeFullName',
          sortable: true,
          title: 'Представитель',
        },
        {
          align: 'start',
          key: 'phoneNumber',
          sortable: true,
          title: 'Номер представителя',
          nowrap: true,
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
      selectedItems: [],
      _searchText: '',
      searchText: '',
      fetching: false,
      searching: false,
      currentPage: 1,
      itemsPerPage: 10,
      itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],

      // IMPORT STYLES
      mySearchFieldStyle,
      myTableSheetStyle,
      myBtnPlus,
    }
  },

  beforeMount() {
    this.fetchCustomers();
  },

  watch: {
    _searchText() {
      this.searching = true;
    }
  },

  computed: {
    itemsMap() {
      return this.itemsSearchFilter;
    },
    itemsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.items.filter(e => {
          return (new RegExp(this.searchText, 'ig')).test([
            e?.fullName || null,
            e?.shortName || null,
            e?.inn || null,
            e?.address || null
          ].filter(e => !!e).join(' '));
        })
      } else {
        return this.items;
      }
    }
  },

  methods: {

    updateTable() {
      this.fetching = true;
      const timeoutId = setTimeout(() => {
        this.fetchCustomers();
        this.fetching = false;
        clearTimeout(timeoutId);
      }, 500)
    },

    updateSearch: _.debounce(function (search) {
      this.searchText = search;
      this.searching = false;
    }, 900),

    fetchCustomers() {
      this.fetching = true;
      fetchCustomers()
          .then(response => {
            this.items = response.data;
          })
          .catch(err => {
            console.log('Ошибка загрузки списка заказчиков', err);
            this.$store.commit('alert/ERROR', 'Ошибка загрузки списка заказчиков');
          })
          .finally(() => {
            this.fetching = false;
          });
    },

    onAddCustomer() {
      // TODO: Логика добавления
      const customer = {
        _id: null,
        shortName: null,
        fullName: null,
        inn: null,
        address: null,
        actualAddress: null,
        email: null,
        phoneNumber: null,
        representativeFullName: null,
        representativePosition: null,
        template: null,
      }

      addCustomer(customer)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Добавлен новый заказчик');
            this.fetchCustomers();
          })
          .catch(err => {
            console.log('Ошибка добавления заказчика', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавления');
          })
          .finally(() => {
            this.loading = false;
          })
    },

    onChangeCustomer(id) {
      navigateTo(`/manager/customers/${id}/change`);
    },

    onRemoveSomeCustomers() {
      if (!this.selectedItems || this.selectedItems.length === 0) return;
      removeSomeCustomers(this.selectedItems)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Записи удалены');
            this.fetchCustomers();
          })
          .catch(err => {
            console.log('Ошибка удаления записей', err);
            this.$store.commit('alert/SUCCESS', 'Ошибка удаления записей');
          })
    },

    onRemoveCustomer(id) {
      removeCustomer(id)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Заказчик успешно удален');
            this.fetchCustomers();
          })
          .catch((err) => {
            this.$store.commit('alert/ERROR', 'Ошибка удаления заказчика');
            console.log('Ошибка удаления заказчика', err);
          })
    }
  }
}
</script>