<template>
  <v-card
      rounded
      density="compact"
      class="mx-auto"
      variant="text"
      color="indigo"
      max-height="100%"
  >
    <v-card-title class="d-flex justify-space-between">
      {{ assignment.title }}
      <div class="d-flex ga-2">
        <v-btn
            icon="mdi-pencil"
            density="comfortable"
            variant="text"
            rounded
            @click.stop="changeClick(assignment)"
        />
        <v-btn
            icon="mdi-close"
            density="comfortable"
            variant="text"
            rounded
            @click.stop="remove(assignment._id)"
        />
      </div>
    </v-card-title>
    <v-card-subtitle>{{ assignment.contract.contractDate }}</v-card-subtitle>
    <v-card-item>
      <div class="d-flex ga-2">
        <v-chip
            rounded="sm"
            density="comfortable"
            size="small"
            variant="text"
            color="indigo"
            append-icon="mdi-open-in-new"
            @click.stop="console.log('Customer show menu')"
        >
          {{ assignment.contract.customer.shortName }}
        </v-chip>
        <v-chip
            rounded="sm"
            density="comfortable"
            size="small"
            variant="text"
            color="indigo"
            append-icon="mdi-phone"
            @click.stop="console.log('Customer call')"
        >
          {{ assignment.contract.customer.phoneNumber }}
        </v-chip>
        <v-chip
            rounded="sm"
            density="comfortable"
            size="small"
            variant="text"
            color="indigo"
            append-icon="mdi-open-in-new"
            @click.stop="console.log('Contract show menu')"
        >
          {{ assignment.contract.customer.email }}
        </v-chip>
      </div>
    </v-card-item>
    <v-card-text>
      {{ descriptionSliced }}
    </v-card-text>
  </v-card>
</template>

<script>
import {removeAssignment} from "../utils/methods/assignment-requests";

export default {
  name: "c-assignment-card",
  props: {
    assignment: Object,
    removeClick: Function,
    changeClick: Function,
  },
  computed: {
    descriptionSliced() {
      let desc = this.assignment?.description;
      return desc?.length > 200 ? desc?.slice(0, 200) + ' ....' : desc;
    }
  },
  methods: {
    remove(id) {
      removeAssignment(id, 500)
          .then(response => {
            console.log('Задание успешно удалено', response);
            this.removeClick(id)
          })
          .catch(err => {
            console.log('Не удалось удалить задание', err);
          });
    }
  },
}
</script>