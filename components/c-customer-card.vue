<template>
  <v-card
      color="indigo"
      variant='tonal'
      density="compact"
      rounded
  >
    <v-card-title>
      {{(customerProp?.shortName || 'name error') + ' / ' + (customerProp?.inn || 'inn error')}}
    </v-card-title>
    <v-card-subtitle>
      {{customerProp.address}}
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
          {{customerProp.email}}
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
          {{customerProp.phoneNumber}}
        </v-chip>
      </div>
    </v-card-item>
  </v-card>
</template>

<script>

export default {
  name: "c-customer-card",
  props: {
    customerProp: Object,
  }
}
</script>