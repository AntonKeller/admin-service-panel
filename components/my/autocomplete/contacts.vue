<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        v-bind="$attrs"
        :items="contacts"
        :loading="contactsFetching"
        :custom-filter="contactSearchFilter"
        @update:menu="onUpdateMenuContacts"
        prepend-inner-icon="mdi-file-document-edit"
        no-data-text="нет данных"
        color="yellow-darken-3"
        variant="outlined"
        density="compact"
        label="Контактное лицо"
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
            :subtitle="`${item.raw?.phoneNumber} / ${item.raw?.email}`"
        >
          <template #append>
            <v-btn
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="removeContact(item.raw._id)"
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
        @click="contactFormAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить новое контактное лицо
      </v-tooltip>
    </v-btn>

    <v-overlay v-model="contactFormAddVisible" class="d-flex align-center justify-center">
      <my-form-contact-add @add:success="onContactAddSuccess" @click:close="contactFormAddVisible=false"/>
    </v-overlay>

  </div>
</template>

<script>
import {fetchContacts, removeContact} from "../../../utils/api/api_contacts";

export default {
  name: "contacts",

  data() {
    return {
      contactsList: [],
      contactsFetching: false,
      contactFormAddVisible: false,
      contactRules: [v => v || 'Выберите контактное лицо'],
    }
  },
  computed: {
    contacts() {
      return this.contactsList?.filter(contact => !contact.parent) || [];
    },
  },
  methods: {

    onContactAddSuccess() {
      this.fetchContactsList();
      this.contactFormAddVisible = false;
    },

    onUpdateMenuContacts(status) {
      if (status) this.fetchContactsList();
    },

    contactSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    removeContact(id) {
      removeContact(id)
          .then(() => {
            this.fetchContactsList();
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

    async fetchContactsList() {
      this.contactsFetching = true;
      const answer = await fetchContacts();
      switch (answer.status) {
        case 200:
          this.contactsList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о контактах');
          break;
      }
      this.contactsFetching = false;
    },
  }
}
</script>