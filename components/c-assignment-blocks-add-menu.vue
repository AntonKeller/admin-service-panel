@Component({
template: '#hello-template',
props: ['name', 'initialEnthusiasm']
})

<!--<template>-->
<!--  <div>-->
<!--    <v-card class="mx-auto" variant="text">-->

<!--      <v-card-title class="d-flex ga-4">-->

<!--      </v-card-title>-->

<!--      <v-card-text>-->
<!--        <form>-->
<!--          <v-text-field></v-text-field>-->
<!--        </form>-->
<!--      </v-card-text>-->

<!--      <v-card-actions>-->

<!--      </v-card-actions>-->
<!--    </v-card>-->

<!--    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">-->
<!--      <v-icon>mdi-alert-circle-outline</v-icon>-->
<!--      {{ snackBar.msg }}-->
<!--    </v-snackbar>-->
<!--  </div>-->
<!--</template>-->

<script>
import {addNewAssignmentBlock} from "../utils/methods/assignment-block-requests";

export default {
  name: "c-assignment-blocks-menu",

  data: () => ({
    block:String,
    snackBar: {}
  }),

  methods: {

    sendBlock() {
      addNewAssignmentBlock(block)
          .then(() => {

          })
          .catch((err) => {
            console.log('Ошибка добавления', err);
          })
          .finally(() => {
            console.log('Ошибка добавления');
          })
    }

  }

}
</script>