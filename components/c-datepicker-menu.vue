<template>
  <v-container>
    <v-row justify="space-around">
      <v-date-picker
          v-model="date"
          width="400"
          color="indigo-lighten-4"
          @select="console.log('date picker click')"
      />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "c-datepicker-menu",

  props: {
    returnDate: Function,
  },

  data: () => ({
    date: new Date(),
  }),

  methods: {
    // allowedDates(v) {
    //   console.log('date: ', v);
    //   return true
    // }
  },

}
</script>

<style scoped>

</style>