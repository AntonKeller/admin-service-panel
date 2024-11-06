<template>
  <v-overlay
      v-model="visibility"
      class="d-flex justify-center align-center"
      @click:outside="navigateBack"
  >
    <v-sheet
        rounded
        elevation="6"
        color="grey-lighten-4"
    >
      <v-card
          rounded
          variant="text"
          width="800"
          color="blue-grey-darken-3"
      >

        <v-card-title>Новая задача</v-card-title>
        <v-card-subtitle>Заполните поля</v-card-subtitle>

        <v-card-item>
          <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">
            <my-text-field
                v-model="assignment.title"
                label="Заголовок задания"
                prepend-inner-icon="mdi-label-variant-outline"
            />

            <div class="d-flex ga-2">
              <v-autocomplete
                  v-model="assignment.contract"
                  :items="getContracts"
                  prepend-inner-icon="mdi-file-sign"
                  color="blue-grey-darken-3"
                  density="comfortable"
                  variant="outlined"
                  label="Договор"
                  rounded="sm"
                  closable-chips
                  chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                      v-bind="props"
                      prepend-icon="mdi-file-document-edit"
                      color="blue-grey-darken-3"
                      density="comfortable"
                      :text="`${item.raw?.contractNumber} / ${item.raw?.contractDate} / ${item.raw?.customer?.shortName}`"
                  />
                </template>

                <template v-slot:item="{ props, item }">
                  <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-file-document-edit"
                      :title="item.raw?.contractNumber"
                      :subtitle="item.raw?.contractDate  + ' / ' + item.raw?.customer?.shortName"
                  />
                </template>
              </v-autocomplete>

              <v-btn
                  variant="tonal"
                  icon="mdi-plus"
                  rounded="sm"
                  @click="contractAddMenuShow = true"
              />
            </div>

            <v-textarea
                v-model="assignment.description"
                :rules="assignmentDescriptionRules"
                color="blue-grey-darken-3"
                max-rows="1"
                variant="outlined"
                auto-grow
            />
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              text="Добавить"
              prepend-icon="mdi-checkbox-multiple-marked-outline"
              @click="sendAssignment"
          />
          <my-btn-clear
              text="Очистить"
              @click="assignment = {}"
          />
        </v-card-actions>

      </v-card>

      <v-snackbar :color="getAlert.type" v-model="getAlert.isShow">
        <v-icon>mdi-alert-circle-outline</v-icon>
        {{ getAlert.msg }}
      </v-snackbar>


      <v-overlay
          v-model="contractAddMenuShow"
          class="d-flex justify-center align-center"
      >
        <c-contract-card-add-menu />
      </v-overlay>

    </v-sheet>
  </v-overlay>
</template>

<script>
export default {
  name: "assignment-add-page",
  data: () => ({

    visibility: false,
    formIsValid: false,
    contractAddMenuShow: false,
    assignment: {},

    assignmentTitleRules: [
      value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0',
      value => value?.length <= 100 ? true : 'Кол-во символов должно быть <= 100'
    ],
    contractRules: [
      value => value?.length > 0 ? true : 'Выберите договор'
    ],
    assignmentDescriptionRules: [
      value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0',
      value => value?.length <= 1500 ? true : 'Кол-во символов должно быть <= 1500',
    ],
  }),

  beforeMount() {
    this.$store.dispatch('contracts/UPDATE_ITEMS');
  },

  mounted() {
    const timeoutID = setTimeout(() => {
      this.visibility = true;
      clearTimeout(timeoutID);
    }, 1);
  },

  watch: {
    assignment() {
      console.log('assignment', assignment);
    }
  },

  computed: {
    getContracts() {
      return this.$store.getters['contracts/GET_ITEMS'];
    },
    getAlert() {
      return this.$store.getters['assignments/GET_ALERT'];
    }
  },

  methods: {

    navigateBack() {
      const router = useRouter();
      router.back();
    },

    async sendAssignment() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        this.$store.dispatch('assignments/ADD_NEW_ITEM', this.assignment);
      }
    }

  }
}
</script>