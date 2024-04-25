<template>
  <v-card
      color="indigo"
      variant='tonal'
      density="compact"
      rounded
  >
    <v-card-title>
      {{(customer?.shortName || 'name error') + ' / ' + (customer?.inn || 'inn error')}}
    </v-card-title>
    <v-card-subtitle>
      {{customer.address}}
    </v-card-subtitle>
    <v-card-item>
      <div class="d-flex ga-2">
        <v-chip
            prepend-icon="mdi-email"
            rounded="sm"
            size="small"
            variant="tonal"
            color="indigo"
            label
            @click.stop="console.log('click')"
        >
          {{customer.email}}
        </v-chip>
        <v-chip
            prepend-icon="mdi-email"
            rounded="sm"
            size="small"
            variant="tonal"
            color="indigo"
            label
            @click.stop="console.log('click')"
        >
          {{customer.phoneNumber}}
        </v-chip>
      </div>
    </v-card-item>
  </v-card>
</template>

<script>

export default {
  name: "c-customer-card",
  props: {
    customer: Object,
  }
}
</script>

<style scoped>

</style>