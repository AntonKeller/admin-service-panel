<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        v-bind="$attrs"
        :loading="customersFetching"
        :items="customersList"
        :custom-filter="customerSearchFilter"
        @update:menu="onUpdateMenuCustomer"
        auto-select-first
        prepend-inner-icon="mdi-account-tie"
        no-data-text="нет данных"
        color="yellow-darken-3"
        variant="outlined"
        density="compact"
        label="Заказчик"
        hide-selected
        closable-chips
        chips
    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            :text="`${item.raw?.shortName} / ${item.raw?.inn}`"
            prepend-icon="mdi-file-document-edit"
            color="blue-grey-darken-3"
            density="comfortable"
            label
        />
      </template>

      <template #item="{ props, item }">
        <v-list-item
            v-bind="props"
            :title="item.raw.shortName"
            :subtitle="item.raw.inn"
            prepend-icon="mdi-file-document-edit"
        >
          <template #append>
            <v-btn
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="removeCustomer(item.raw._id)"
            >
              <v-icon/>
              <v-tooltip activator="parent">
                Удалить запись
              </v-tooltip>
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
    <v-btn
        icon="mdi-plus"
        variant="text"
        rounded="lg"
        size="small"
        @click="customerMenuAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить нового заказчика
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script>
import {fetchCustomers, removeCustomer} from "../../../utils/api/api_customers.js";

export default {
  name: "my-autocomplete-customers",
  data() {
    return {
      customerMenuAddVisible: false,
      customersFetching: false,
      customersList: [],
    }
  },
  methods: {
    customerSearchFilter(value, query, item) {
      return [
        item.raw.inn || null,
        item.raw.fullName || null,
        item.raw.representativeFullName || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },
    onUpdateMenuCustomer(status) {
      if (status) this.fetchCustomersList();
    },
    async onCustomerAddSuccess() {
      this.customerMenuAddVisible = false;
      await this.fetchCustomersList();
    },
    removeCustomer() {
      removeCustomer()
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Заказчик успешно удален');
            this.fetchCustomersList();
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Не удалось удалить заказчика');
            console.log('Не удалось удалить', err);
          })
    },
    async fetchCustomersList() {
      this.customersFetching = true;
      const answer = await fetchCustomers();
      switch (answer.status) {
        case 200:
          this.customersList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о заказчиках');
          break;
      }
      this.customersFetching = false;
    },
  }
}
</script>