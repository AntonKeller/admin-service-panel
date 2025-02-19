<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :loading="fetching"
        :items="pledgeAgreementsList"
        :custom-filter="pledgeAgreementSearchFilter"
        @update:menu="onUpdateMenuPledgeAgreements"
        prepend-inner-icon="mdi-file-sign"
        label="Список договоров залога"
        no-data-text="нет данных"
        color="yellow-darken-3"
        density="compact"
        variant="outlined"
        closable-chips
        hide-selected
        multiple
        chips
        v-bind="$attrs"
    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            prepend-icon="mdi-file-document-edit"
            color="blue-grey-darken-3"
            density="comfortable"
            label
            :text="`${item.raw?.number} / ${unixDateToLongDateString(item.raw?.date)}`"
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
                icon="mdi-close"
                size="small"
                density="comfortable"
                variant="text"
                @click.stop="removePledgeAgreement(item.raw._id)"
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

    <v-btn
        class="border-sm border-dashed"
        variant="outlined"
        icon="mdi-plus"
        rounded="lg"
        size="small"
        @click="pledgeAgreementMenuAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить новый договор залога
      </v-tooltip>
    </v-btn>

    <v-overlay v-model="pledgeAgreementMenuAddVisible" class="d-flex justify-center align-center">
      <pledge-agreement-add
          @add:success="onPledgeAgreementAddSuccess"
          @click:close="pledgeAgreementMenuAddVisible=false"
      />
    </v-overlay>
  </div>
</template>

<script>
import {unixDateToLongDateString} from "../../../utils/functions";
import {removePledgeAgreement, fetchPledgeAgreements} from "../../../utils/api/api_pledge-agreements";

export default {
  name: "pledgeAgreements",

  data() {
    return {
      pledgeAgreementsList: [], // TODO: Запросы и Vue вывод полей
      fetching: false,
      pledgeAgreementMenuAddVisible: false,
      pledgeAgreementRules: [v => v || 'Договор должен быть выбран'],
    }
  },

  methods: {

    onPledgeAgreementAddSuccess() {
      this.fetchPledgeAgreementsList();
      this.pledgeAgreementMenuAddVisible = false;
    },

    pledgeAgreementSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    onUpdateMenuPledgeAgreements(status) {
      if (status) this.fetchPledgeAgreementsList();
    },

    unixDateToLongDateString,

    removePledgeAgreement(id) {
      removePledgeAgreement(id)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Договор залога успешно удален!');
            this.fetchPledgeAgreementsList();
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Ошибка удаления договора залога!');
            console.log('Не удалось удалить', err);
          })
    },

    async fetchPledgeAgreementsList() {

      this.fetching = true;

      fetchPledgeAgreements()
          .then(response => {
            this.pledgeAgreementsList = response.data;
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Ошибка получения списка кредитных договоров');
            console.log('Ошибка получения данных о договорах залога', err);
          })
          .finally(() => {
            this.fetching = false;
          })
    },
  }
}
</script>