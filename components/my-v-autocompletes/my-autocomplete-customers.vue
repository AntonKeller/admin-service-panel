<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :loading="customersFetching"
        :items="customersList"
        :custom-filter="customerSearchFilter"
        prepend-inner-icon="mdi-account-tie"
        no-data-text="нет данных"
        color="yellow-darken-3"
        variant="outlined"
        density="compact"
        label="Заказчик"
        closable-chips
        chips
        v-bind="$attrs"
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
            prepend-icon="mdi-file-document-edit"
            :title="item.raw.shortName"
            :subtitle="item.raw.inn"
        >
          <template #append>
            <c-remove-btn @click:yes=""/>
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
      <v-overlay v-model="customerMenuAddVisible" class="d-flex justify-center align-center">
        <customer-add
            @add:success="onCustomerAddSuccess"
            @click:close="customerMenuAddVisible=false"
        />
      </v-overlay>
    </v-btn>
  </div>
</template>

<script>
import {fetchCustomers} from "@/utils/api/api_customers.js";

export default {
  name: "my-v-autocomplete-customers",
  data() {
    return {
      customerMenuAddVisible: false,
      customersFetching: false,
      customersList: null,
    }
  },
  methods: {
    customerSearchFilter(value, query, item) {
      console.log('value:', value, 'query:', query, 'item:', item);
      return true;
    },
    async onCustomerAddSuccess() {
      this.customerMenuAddVisible = false;
      await this.fetchCustomersList();
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