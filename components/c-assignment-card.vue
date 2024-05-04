<template>
  <v-card
      rounded
      density="compact"
      class="mx-auto"
      variant="tonal"
      color="indigo"
      max-height="100%"
  >
    <v-card-title>{{ assignment.title }}</v-card-title>
    <v-card-subtitle>{{ assignment.contract.contractDate }}</v-card-subtitle>
    <v-card-item>
      <div class="d-flex ga-2">
        <v-chip
            rounded="sm"
            density="comfortable"
            size="small"
            variant="tonal"
            color="blue"
            append-icon="mdi-open-in-new"
            @click.stop="console.log('Customer show menu')"
        >
          {{ assignment.contract.customer.shortName }}
        </v-chip>
        <v-chip
            rounded="sm"
            density="comfortable"
            size="small"
            variant="tonal"
            color="blue"
            append-icon="mdi-phone"
            @click.stop="console.log('Customer call')"
        >
          {{ assignment.contract.customer.phoneNumber }}
        </v-chip>
        <v-chip
            rounded="sm"
            density="comfortable"
            size="small"
            variant="tonal"
            color="blue"
            append-icon="mdi-open-in-new"
            @click.stop="console.log('Contract show menu')"
        >
          {{ assignment.contract.customer.email }}
        </v-chip>
      </div>
    </v-card-item>
    <v-card-text>
      {{ assignment.description?.length > 200 ? assignment.description?.slice(0, 200) + ' ....' : assignment.description }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "c-assignment-card",
  props: ['assignment'],
}
</script>