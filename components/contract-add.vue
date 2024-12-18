<template>
  <v-sheet color="grey-lighten-4">
    <v-card
        variant="text"
        width="700"
        color="blue-grey-darken-3"
    >
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
        <v-form v-model="isValid" class="d-flex flex-column ga-2">

          <my-text-field
              v-model="contract.number"
              prepend-inner-icon="mdi-file-sign"
              label="Номер договора/ТЗ"
              placeholder="..../..."
          />

          <my-date-picker
              v-model="contract.date"
              prepend-inner-icon="mdi-calendar-range"
              label="Дата заключения"
              placeholder="дд:мм:гггг"
          />

          <div class="d-flex ga-1">
            <v-autocomplete
                v-model="contract.parent"
                :loading="contractsListFetching"
                :items="contracts"
                :custom-filter="contractSearchFilter"
                prepend-inner-icon="mdi-file-document-edit"
                no-data-text="нет данных"
                color="yellow-darken-3"
                variant="outlined"
                density="compact"
                label="Рамочный договор"
                closable-chips
                hide-selected
                chips
            >
              <template #chip="{ props, item }">
                <v-chip
                    v-bind="props"
                    :text="`${item.raw?.number} / ${unixDateToLongDateString(item.raw?.date)}`"
                    prepend-icon="mdi-file-document-edit"
                    color="blue-grey-darken-3"
                    density="comfortable"
                    label
                />
              </template>

              <template #item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :title="item.raw?.number"
                    :subtitle="unixDateToLongDateString(item.raw?.date)"
                >
                  <template #append>
                    <v-btn
                        icon="mdi-progress-close"
                        color="red-darken-4"
                        density="comfortable"
                        variant="text"
                        @click.stop="removeContract"
                    >
                      <v-icon/>
                      <v-tooltip activator="parent">
                        Удалить запись
                      </v-tooltip>
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </div>

          <v-textarea
              v-model="contract.description"
              variant="outlined"
              density="compact"
              label="Описание"
              rows="5"
              no-resize
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <my-btn-submit
            text="Добавить"
            :loading="loading"
            @click="submit"
        />
        <my-button-clear
            text="Очистить"
            @click="clear"
        />
      </v-card-actions>

    </v-card>

    <v-overlay v-model="contractMenuAddVisible" class="d-flex justify-center align-center">
      <contract-add
          @add:success="onContractAddSuccess"
          @click:close="contractMenuAddVisible = false"
      />
    </v-overlay>

  </v-sheet>
</template>

<script>
import {fetchContracts, removeContract} from "@/utils/api/api_contracts";
import {addContract} from "../utils/api/api_contracts";
import {unixDateToLongDateString} from "../utils/functions";

export default {
  name: "contract-add",

  data() {
    return {
      contract: {
        number: null,
        date: null,
        parent: null,
        description: null,
      },

      isValid: null,
      loading: false,

      contractsList: [],
      contractsListFetching: false,
      contractMenuAddVisible: false,
      contractRules: [v => v || 'Договор должен быть выбран'],

      contractNumberRules: [
        v => v?.length > 0 || 'Договора должна быть больше 0',
        v => v?.length <= 18 || 'Договора должна быть меньше 18',
      ],
      contractDateRules: [
        v => /^\d{2}\.\d{2}\.\d{4}$/i.test(v) ? true : 'Неподходящий формат даты'
      ],
    }
  },

  async mounted() {
    await this.fetchContractsList();
  },

  computed: {
    contracts() {
      return this.contractsList?.filter(contract => !contract.parent) || [];
    },
  },

  methods: {

    unixDateToLongDateString,

    contractSearchFilter(value, query, item) {
      return [
        item.raw.inn || null,
        item.raw.fullName || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    async onContractAddSuccess() {
      this.contractMenuAddVisible = false;
      await this.fetchContractsList();
    },

    async fetchContractsList() {
      this.contractsFetching = true;
      const answer = await fetchContracts();
      switch (answer.status) {
        case 200:
          this.contractsList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о договорах');
          break;
      }
      this.contractsFetching = false;
    },

    submit() {
      if (this.isValid) {
        this.loading = true;
        addContract(this.contract)
            .then(() => {
              this.$store.commit('alert/SUCCESS', 'Добавлен новый договор!');
              this.$emit('add:success');
            })
            .catch(err => {
              this.$store.commit('alert/ERROR', 'Не удалось добавить договор!');
              console.log('Ошибка добавления договора', err);
            })
            .finally(() => {
              this.loading = false;
            })
      } else {
        this.$store.commit('alert/ERROR', 'Поля не заполнены!');
      }
    },

    removeContract() {
      removeContract()
          .then(() => {
            //   TODO: написать логику удаления
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

    clear() {
      this.contract = {
        number: null,
        date: null,
        parent: null,
        description: null,
      }
    }

  }
}
</script>