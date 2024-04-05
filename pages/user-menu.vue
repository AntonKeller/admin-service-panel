<template>
  <v-card class="c-card">
    <v-layout class="c-layout" full-height>

      <v-navigation-drawer floating permanent width="280">

        <v-list density="compact" nav bg-color="indigo-lighten-5" rounded>

          <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg">
            Аккаунт
            <template v-slot:append>
              <v-btn
                  icon="mdi-location-exit"
                  size="small"
                  variant="text"
                  color="indigo-lighten-1"
              />
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item prepend-icon="mdi-account-group-outline" color="indigo-accent-4" value="users">
            Пользователи
            <template v-slot:append>
              <v-badge
                  color="info"
                  content="12"
                  inline
              ></v-badge>
            </template>
          </v-list-item>

          <v-list-item prepend-icon="mdi-format-list-text" color="indigo-accent-4" value="tasks">
            Список задач
          </v-list-item>

          <v-list-item prepend-icon="mdi-file-chart-outline" color="indigo-accent-4" value="reports">
            Отчеты
          </v-list-item>

          <v-list-item prepend-icon="mdi-view-module" color="indigo-accent-4" value="modules">
            Модули
            <template v-slot:append>
              <v-badge
                  color="secondary"
                  content="12"
                  inline
              ></v-badge>
            </template>
          </v-list-item>

          <v-list-item prepend-icon="mdi-card-account-details-star-outline" color="indigo-accent-4" value="subscribe">
            Управление подпиской
          </v-list-item>

        </v-list>
      </v-navigation-drawer>

      <v-main scrollable>
        <v-card class="mx-auto" variant="text">

          <v-card-title>
            <v-text-field
                color="indigo"
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
            <div class="d-flex ga-2">
              <v-menu transition="slide-x-transition">

                <template v-slot:activator="{ props }">
                  <v-btn
                      @click="sorted=!sorted"
                      color="primary"
                      variant="elevated"
                      density="compact"
                      rounded="0"
                      v-bind="props"
                  >сортировать</v-btn>
                </template>

                <v-list>
                  <v-list-item v-for="(item, index) in menuItems" :key="index" :value="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>

              </v-menu>

              <v-chip density="comfortable" size="small" variant="flat"
                      label
                      color="indigo">Chip 1
              </v-chip>

              <v-chip density="comfortable" size="small" variant="flat"
                      label
                      color="pink">Chip 2
              </v-chip>

              <v-chip density="comfortable" size="small" variant="flat" label
                      color="red">Chip 3
              </v-chip>

              <v-chip append-icon="mdi-checkbox-marked-circle" density="comfortable" size="small" variant="flat"
                      label
                      color="blue">Chip 4
              </v-chip>

            </div>
          </v-card-subtitle>

          <v-card-text>
            <v-list max-height="600px" lines="two">
              <v-list-item
                  v-for="user in users"
                  :key="user.title"
                  :subtitle="user.subtitle"
              >

                <template v-slot:title>
                  {{user.title}}
                  <v-badge :color="Math.random() > 0.5 ? 'error' : 'success'" dot style="width: 8px; height: 12px" />
                </template>

                <template v-slot:prepend>
                  <v-avatar :color="user.color">
                    <v-icon color="white">{{ user.icon }}</v-icon>
                  </v-avatar>
                </template>

                <template v-slot:default>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, in, libero! Impedit nesciunt nihil provident.
                </template>

                <template v-slot:append>
                  <v-btn
                      color="grey-lighten-1"
                      icon="mdi-open-in-new"
                      variant="text"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>
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
      sorted: false,

      users: [
        {
          color: 'blue',
          icon: 'mdi-account-network',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'amber',
          icon: 'mdi-account-network',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'blue',
          icon: 'mdi-account-network',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'red',
          icon: 'mdi-account-network',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'blue',
          icon: 'mdi-account-network',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'amber',
          icon: 'mdi-account-network',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'red',
          icon: 'mdi-account-network',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'amber',
          icon: 'mdi-account-network',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'amber',
          icon: 'mdi-account-network',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'blue',
          icon: 'mdi-account-network',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'red',
          icon: 'mdi-account-network',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'blue',
          icon: 'mdi-account-network',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'amber',
          icon: 'mdi-account-network',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
        {
          color: 'red',
          icon: 'mdi-account-network',
          subtitle: 'Jan 20, 2014',
          title: 'Vacation itinerary',
        },
        {
          color: 'red',
          icon: 'mdi-account-network',
          subtitle: 'Jan 10, 2014',
          title: 'Kitchen remodel',
        },
      ],

      menuItems: [
        {title: 'По убыванию'},
        {title: 'По возрастанию'},
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
