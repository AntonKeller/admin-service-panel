<template>
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
                color="deep-purple-accent-3"
                prepend-icon="mdi-sort"
                variant="tonal"
                density="compact"
                rounded="xs"
                v-bind="props"
            >
              По умолчанию
            </v-btn>
          </template>

          <v-list bg-color="indigo-lighten-5" variant="text" density="compact">
            <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                :value="index"
                density="compact">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-chip density="comfortable" size="small" variant="flat" color="teal">
          На обьекте 5 чел
        </v-chip>
        <v-chip density="comfortable" size="small" variant="flat" color="blue">
          Ожидающие 3 чел
        </v-chip>
      </div>
    </v-card-subtitle>

    <v-card-text>
      <v-list max-height="85vh" rounded variant="text" bg-color="transparent">

        <v-list-item v-if="usersLoading">
          <v-skeleton-loader
              v-for="n of 3"
              width="full"
              color="transparent"
              elevation="0"
              type="list-item-three-line"
          />
        </v-list-item>

        <v-list-item
            v-for="user in users"
            :key="user.firstName + user.lastName"
        >
          <c-card-user
              icon="mdi-email-arrow-left-outline"
              :user="user"
              :card-click="showOverlay"
          />
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-overlay v-model="overlay" class="d-flex justify-center align-center">
      <c-user-tasks-overlay :user="selectedUser"/>
    </v-overlay>
  </v-card>
</template>

<script>

import axios from "axios";
import {serverURL} from "@/constants/constants";

export default {

  name: "inspectors-page",

  data() {
    return {

      // other
      usersLoading: true,
      sorted: false,

      // user overlay
      overlay: false,
      selectedUser: null,

      // data
      users: [],

      // constants
      menuItems: [
        {index: 1, title: 'По производительности'},
        {index: 2, title: 'По загруженности'},
        {index: 3, title: 'По загруженности'},
      ],

    }
  },

  mounted() {
    this.fetchUsers();
    setInterval(() => this.fetchUsers(), 30 * 1000);
  },

  // https://jsonplaceholder.typicode.com/users
  methods: {

    showOverlay(user) {
      this.selectedUser = user;
      this.overlay = true;
    },

    fetchUsers() {
      axios.get(serverURL + '/inspectors', {timeout: 1000})
          .then((response) => {
            console.log('Пользователи успешно получены', response?.data);
            this.users = response?.data.map(e => ({
              color: 'blue',
              icon: 'mdi-account-network',
              id: e.id,
              firstName: e.firstName,
              lastName: e.lastName,
              phoneNumber: e.phoneNumber,
              email: e.email,
              description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, consectetur."
            }));
          })
          .catch((err) => {
            console.log('Ошибка получения пользователей', err);
            this.users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(e => {
              return {
                id: e,
                color: 'blue',
                icon: 'mdi-account-network',
                firstName: 'Игорь',
                lastName: 'Иванов',
                phoneNumber: '+7-(951)-689-35-35',
                email: 'Ivanov@gmail.com',
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, consectetur."
              }
            })
          })
          .finally(() => {
            this.usersLoading = false;
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

/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #D1C4E9;
  /*box-shadow: inset 0 0 5px #B39DDB;*/
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #7E57C2;
  border-radius: 6px;
}

</style>