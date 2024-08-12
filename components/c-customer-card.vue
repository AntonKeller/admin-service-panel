<template>
  <v-card
      variant='text'
      density="compact"
      rounded
      color="teal-darken-4"
  >
    <v-card-title class="d-flex justify-space-between">

      {{ (customerProp?.shortName || 'name error') + ' / ' + (customerProp?.inn || 'inn error') }}
      <div class="d-flex ga-2">
        <v-btn
            icon="mdi-pencil"
            density="comfortable"
            variant="text"
            rounded
            @click.stop="changeClick(customerProp)"
        />
        <v-btn
            icon="mdi-close"
            density="comfortable"
            variant="text"
            rounded
            @click.stop="removeSelf(customerProp._id)"
        />
      </div>
    </v-card-title>
    <v-card-subtitle>
      {{ customerProp.address }}
    </v-card-subtitle>
    <v-card-item>
      <div class="d-flex ga-2">
        <v-chip
            prepend-icon="mdi-email"
            rounded="xl"
            size="small"
            variant="tonal"
            color="teal-darken-3"
            label
            @click.stop="console.log('click')"
        >
          {{ customerProp.email }}
        </v-chip>
        <v-chip
            prepend-icon="mdi-email"
            rounded="xl"
            size="small"
            variant="tonal"
            color="teal-darken-3"
            label
            @click.stop="console.log('click')"
        >
          {{ customerProp.phoneNumber }}
        </v-chip>
      </div>
    </v-card-item>
  </v-card>
</template>

<script>
import {removeCustomer} from "../utils/service/server.ts";

export default {
  name: "c-customer-card",

  props: {
    customerProp: Object,
    removeClick: Function,
    changeClick: Function,
  },

  methods: {
    removeSelf(_id) {
      removeCustomer(_id)
          .then(() => {
            this.removeClick(this.customerProp._id);
          })
          .catch(err => {
            console.log('Удаление заказчика не удалось', err);
          })
    }
  }
}
</script>