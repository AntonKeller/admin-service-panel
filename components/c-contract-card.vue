<template>
  <v-card
      color="blue-grey-darken-2"
      variant='text'
      density="compact"
      rounded
  >
    <v-card-text>
      {{ contract.contractNumber }}
    </v-card-text>
    <v-card-title class="d-flex align-center justify-space-between">
      {{ contract.contractNumber }}
      <div class="d-flex ga-2">
        <v-btn
            icon="mdi-pencil"
            density="comfortable"
            variant="tonal"
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
    <v-card-subtitle />
    <v-card-item>
      {{ contract.contractDate }}
    </v-card-item>
  </v-card>
</template>

<script>
import {removeContract} from "../utils/api/api_contracts";

export default {
  name: "c-contract-card",

  props: {
    contract: Object,
    removeClick: Function,
    changeClick: Function,
  },

  methods: {
    remove(id) {
      removeContract(id)
          .then(response => {
            this.removeClick(id);
          })
          .catch(err => {
            console.log('Не удалось удалить договор', err);
          })
    }
  }


}
</script>