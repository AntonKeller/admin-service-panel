<template>
  <v-card :sending="sending" :disabled="sending" elevation="6" width="100vw" max-width="800">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Новый договор</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>

    <v-card-subtitle>
      Заполните поля
    </v-card-subtitle>

    <v-card-text>
      <v-form v-model="formIsValid" ref="form" class="mt-2">
        <v-row dense>
          <v-col :cols="12">
            <my-text-field
                v-model="contract.number"
                prepend-inner-icon="mdi-file-sign"
                label="Номер договора/ТЗ"
                placeholder="..../..."
            />
          </v-col>

          <v-col :cols="8">
            <my-date-picker
                v-model="contract.date"
                prepend-inner-icon="mdi-calendar-range"
                label="Дата заключения"
                placeholder="дд:мм:гггг"
            />
          </v-col>

          <v-col :cols="4">
            <v-switch
                v-model="hideParent"
                density="compact"
                label="Рамочный договор"
                color="primary"
                class="pl-4"
            />
          </v-col>

          <v-col :cols="12" v-if="!hideParent">
            <Transition>
              <myAutocompleteContracts v-model="contract.parent" label="Рамочный договор" hideButtonAdd/>
            </Transition>
          </v-col>

          <v-col :cols="12">
            <v-textarea
                v-model="contract.description"
                variant="outlined"
                density="compact"
                label="Описание"
                rows="5"
                no-resize
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <my-btn-submit text="Добавить" :sending="sending" @click="send"/>
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import {addContract} from "../../../utils/api/api_contracts";

export default {
  name: "contract-add",

  data() {
    return {
      contract: {
        _id: null,
        number: null,
        date: null,
        parent: null,
        description: null,
      },

      hideParent: false,
      formIsValid: null,
      sending: false,
    }
  },

  methods: {
    async send() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не все поля заполнены!');
        return;
      }

      this.sending = true;

      addContract(this.contract)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Договор успешно добавлен!');
            this.$emit('add:success');
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Ошибка добавления договора!');
            console.log('Ошибка добавления договора', err);
          })
          .finally(() => {
            this.sending = false;
          })
    },

    clear() {
      this.contract = {
        _id: null,
        number: null,
        date: null,
        parent: null,
        description: null,
      }
    }
  }
}
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>