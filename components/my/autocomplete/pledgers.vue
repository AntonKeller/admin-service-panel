<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        v-bind="$attrs"
        :items="pledgerList"
        :loading="pledgersFetching"
        :custom-filter="pledgersSearchFilter"
        @update:menu="onUpdateMenuPledgers"
        prepend-inner-icon="mdi-file-document-edit"
        no-data-text="нет данных"
        color="yellow-darken-3"
        variant="outlined"
        density="compact"
        label="Залогодатель"
        closable-chips
        hide-selected
        chips
    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            :text="`${item.raw?.firstName || ''} ${item.raw?.surName || ''} ${item.raw?.lastName || ''}`"
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
            :title="`${item.raw?.firstName || ''} ${item.raw?.surName || ''} ${item.raw?.lastName || ''}`"
            :subtitle="`${item.raw?.inn || 'ИНН отсутствует'}`"
        >
          <template #append>
            <v-btn
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="removePledger(item.raw._id)"
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
        rounded="lg"
        size="small"
        @click="pledgerMenuAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить нового залогодателя
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script>
import {fetchPledgers, removePledger} from "../../../utils/api/api_pledgers";

export default {
  name: "pledgers",

  data() {
    return {
      pledgerList: [],
      pledgersFetching: false,
      pledgerMenuAddVisible: false,
      pledgerRules: [v => v || 'Выберите залогодателя'],
    }
  },

  methods: {
    onUpdateMenuPledgers(status) {
      if (status) this.fetchPledgerList();
    },

    removePledger(pledgerID) {
      removePledger(pledgerID)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Залогодатель успешно удален');
            this.fetchPledgerList();
          })
          .catch(err => {
            if (err.response && err.response.status === 400) {
              this.$store.commit('alert/ERROR', 'Недостаточно прав для удаления залогодателя');
            } else {
              this.$store.commit('alert/ERROR', 'Не удалось удалить залогодателя');
            }
            console.log('Ошибка удаления залогодателя', err);
          })
    },

    pledgersSearchFilter(value, query, item) {
      return [
        item.raw.inn || null,
        item.raw.firstName || null,
        item.raw.surName || null,
        item.raw.lastName || null,
        item.raw.position || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    async fetchPledgerList() {
      this.pledgersFetching = true;
      fetchPledgers()
          .then(response => {
            this.pledgerList = response.data;
          })
          .catch(err => {
            console.log('Ошибка получения списка залогодателей', err);
          })
          .finally(() => {
            this.pledgersFetching = false;
          })
    },

  }
}
</script>