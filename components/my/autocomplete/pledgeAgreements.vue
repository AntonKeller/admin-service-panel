<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        v-bind="$attrs"
        :loading="pledgeAgreementsFetching"
        :items="pledgeAgreementsList"
        :custom-filter="pledgeAgreementSearchFilter"
        @update:menu="onUpdateMenuPledgeAgreements"
        prepend-inner-icon="mdi-file-sign"
        no-data-text="нет данных"
        color="yellow-darken-3"
        density="compact"
        variant="outlined"
        label="Список договоров залога"
        closable-chips
        hide-selected
        multiple
        chips
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
                icon="mdi-progress-close"
                color="red-darken-4"
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
        icon="mdi-plus"
        variant="text"
        size="small"
        rounded="lg"
        @click="pledgeAgreementMenuAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить новый договор залога
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script>
import {unixDateToLongDateString} from "../../../utils/functions.js";
import {removePledgeAgreement, fetchPledgeAgreements} from "../../../utils/api/api_pledge-agreements.js";

export default {
  name: "pledgeAgreements",
  data() {
    return {
      pledgeAgreementsList: [], // TODO: Запросы и Vue вывод полей
      pledgeAgreementsFetching: false,
      pledgeAgreementMenuAddVisible: false,
      pledgeAgreementRules: [v => v || 'Договор должен быть выбран'],
    }
  },
  methods: {
    pledgeAgreementSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    onUpdateMenuPledgeAgreements(status) {
      if (status) this.fetchPledgeAgreementsList();
    },

    unixDateToLongDateString,

    removePledgeAgreement() {
      removePledgeAgreement()
          .then(() => {
            this.fetchPledgeAgreementsList()
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

    async fetchPledgeAgreementsList() {
      this.pledgeAgreementsFetching = true;
      const answer = await fetchPledgeAgreements();
      switch (answer.status) {
        case 200:
          this.pledgeAgreementsList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о договорах залога');
          break;
      }
      this.pledgeAgreementsFetching = false;
    },
  }
}
</script>