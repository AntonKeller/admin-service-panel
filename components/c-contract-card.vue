<template>
  <v-card
      color="indigo"
      variant='text'
      density="compact"
      rounded
  >
    <v-card-title class="d-flex align-center justify-space-between">
      {{ contract.contractNumber }}
      <div class="d-flex ga-2">
        <v-btn
            icon="mdi-pencil"
            density="comfortable"
            variant="text"
            rounded
            @click.stop="changeClick(contract)"
        />
        <v-btn
            icon="mdi-close"
            density="comfortable"
            variant="text"
            rounded
            @click.stop="remove(contract._id)"
        />
      </div>
    </v-card-title>
    <v-card-subtitle>
      {{ contract.customer.shortName }} /
      {{ contract.customer.inn }} /
      {{ contract.customer.phoneNumber }}
    </v-card-subtitle>
    <v-card-item>
      {{ contract.contractDate }}
    </v-card-item>
  </v-card>
</template>

<script>
import {removeContract} from "../utils/methods/contract-requests";

export default {
  name: "c-contract-card",

  props: {
    contract: Object,
    removeClick: Function,
    changeClick: Function,
  },

  methods: {
    remove(id) {
      removeContract(id, 250)
          .then(response => {
            console.log('Договор успешно удален', response);
            this.removeClick(id);
          })
          .catch(err => {
            console.log('Не удалось удалить договор', err);
          })
    }
  }


}
</script>