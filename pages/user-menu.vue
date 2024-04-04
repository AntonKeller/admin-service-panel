<template>
  <v-card class="c-card">
    <v-layout class="c-layout" full-height>

      <v-navigation-drawer floating permanent>
        <v-list density="compact" nav bg-color="indigo" rounded>
          <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg">
            Аккаунт
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-account-group-outline" value="users">
            Пользователи
          </v-list-item>
          <v-list-item prepend-icon="mdi-file-chart-outline" value="tasks">
            Отчеты
          </v-list-item>
          <v-list-item prepend-icon="mdi-view-module" value="reports">
            Модули
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main scrollable>
        <v-card class="mx-auto" variant="text">

          <v-card-title>
            <v-text-field
                :loading="searchIsLoading || true"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="Поиск юзеров"
                variant="outlined"
                hide-details
                single-line
                @click:append-inner="onClick"
            ></v-text-field>
          </v-card-title>

          <v-card-subtitle>
            <v-chip prepend-icon="mdi-checkbox-marked-circle" density="comfortable" size="small" variant="outlined"
                    color="indigo">Chip 1
            </v-chip>
            <v-chip prepend-icon="mdi-checkbox-marked-circle" density="comfortable" size="small" variant="outlined"
                    color="pink">Chip 2
            </v-chip>
            <v-chip prepend-icon="mdi-checkbox-marked-circle" density="comfortable" size="small" variant="outlined"
                    color="red">Chip 3
            </v-chip>
            <v-chip prepend-icon="mdi-checkbox-marked-circle" density="comfortable" size="small" variant="outlined"
                    color="blue">Chip 4
            </v-chip>
          </v-card-subtitle>

          <v-card-text>
            <v-list lines="two" max-height="400px">
              <v-list-item
                  v-for="file in users"
                  :key="file.title"
                  :subtitle="file.subtitle"
                  :title="file.title"
              >
                <template v-slot:prepend>
                  <v-avatar :color="file.color">
                    <v-icon color="white">{{ file.icon }}</v-icon>
                  </v-avatar>
                </template>

                <template v-slot:append>
                  <v-btn
                      color="grey-lighten-1"
                      icon="mdi-information"
                      variant="text"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn variant="outlined" color="indigo" prepend-icon="mdi-plus-box-outline">
              Новая
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-main>

    </v-layout>
  </v-card>
</template>

<script>

import axios from "axios";
import {serverURL} from "../constants/constants";

export default {

  name: 'IndexPage',

  data() {
    return {
      tab: 'option-1',
      drawer: true,
      rail: true,

      users: [
        {
          // id: 1,
          // login:
          color: 'blue',
          icon: 'mdi-clipboard-text',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'amber',
          icon: 'mdi-gesture-tap-button',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'blue',
          icon: 'mdi-clipboard-text',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'amber',
          icon: 'mdi-gesture-tap-button',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'blue',
          icon: 'mdi-clipboard-text',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'amber',
          icon: 'mdi-gesture-tap-button',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'blue',
          icon: 'mdi-clipboard-text',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'amber',
          icon: 'mdi-gesture-tap-button',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
      ],

      folders: [
        {
          subtitle: 'Jan 9, 2014',
          title: 'Photos',
        },
        {
          subtitle: 'Jan 17, 2014',
          title: 'Recipes',
        },
        {
          subtitle: 'Jan 28, 2014',
          title: 'Work',
        },
      ],

    }
  },

  mounted() {
    this.fetchUsers();
    setInterval(() => this.fetchUsers(), 5 * 60 * 1000);
  },

  // https://jsonplaceholder.typicode.com/users
  methods: {

    fetchUsers() {
      axios.get(serverURL + '/users')
          .then((response) => {
            console.log('Пользователи успешно получены', response);
            this.users = response?.data.map(e => e);
          })
          .catch((err) => {
            console.log('Ошибка получения пользователей', err);
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
  },

  // beforeCreate: () => {
  //   const router = useRouter()
  //   router.back()
  // },
}

</script>

<style scoped>
.scroll-hidden::-webkit-scrollbar {
  width: 0;
}

.c-card {
  height: 100vh;
  padding-top: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.c-layout {
  /*max-width: 768px;*/
  max-width: 1024px;
}


.h-full {
  /*height: 100vh;*/
}

.index-background {
  /*padding: 0 30% 0 30%;*/
}

.index-page-container {
  display: flex;
  flex-direction: column;
  flex: 10px;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/*.left-panel-wrap {*/
/*  background-color: rgb(22, 60, 157, 0.5);*/
/*  max-width: 400px;*/
/*}*/

.au-panel-wrap {
  min-width: 400px;
  max-width: 400px;
  align-self: center;
  justify-self: self-end;
}

</style>
