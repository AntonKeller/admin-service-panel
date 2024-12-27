<template>
  <v-card height="100vh">
    <v-layout full-height>

      <v-app-bar elevation="0" :rounded="0" class="border-b-sm">
        <v-card
            class="bg-blue-darken-4"
            variant="flat"
            :rounded="0"
            style="min-width: 100%;"
        >
          <v-card-item>
            <div class="d-flex justify-start align-center">
              <v-img
                  src="/assets/images/logotype.png"
                  aspect-ratio="1/1"
                  max-width="50"
                  height="45"
              />
              <div class="ml-2">Mobile inspector</div>
              <v-btn
                  icon="mdi-account-cog-outline"
                  color="blue-lighten-5"
                  variant="text"
                  class="ml-auto"
                  rounded="lg"
                  @click="navigateToProfile"
              >
                <v-icon/>
                <v-tooltip activator="parent">
                  Настройки профиля
                </v-tooltip>
              </v-btn>
            </div>
          </v-card-item>
        </v-card>
      </v-app-bar>

      <v-navigation-drawer
          :rail="rail"
          permanent
          @click="rail = false"
          elevation="0"
      >
        <v-list variant="text" density="default" nav rounded="lg">
          <div class="d-flex align-center justify-space-between">
            <v-list-item
                prepend-icon="mdi-account"
                :title="profile.fullName"
                :subtitle="profile.email"
            />
            <v-btn
                icon="mdi-arrow-collapse-left"
                color="blue-grey-darken-3"
                size="small"
                variant="text"
                rounded
                :class="rail ? 'd-none' : ''"
                @click.stop="rail = !rail"
            >
              <v-icon/>
              <v-tooltip activator="parent">Свернуть меню</v-tooltip>
            </v-btn>
          </div>

          <v-divider/>

          <v-list-item
              v-for="item of navItems"
              :key="item._id"
              :to="item.route"
              :prepend-icon="item.prependIcon"
              :active="item._id === activeItem"
              :color="item.color"
              :value="item.value"
              :title="item.title"
              @click="activeItem = item._id"
          >
            <template v-slot:append>
              <v-tooltip activator="parent">...</v-tooltip>
              <v-badge
                  v-show="item.badge.show"
                  :color="item.badge.color"
                  :content="item.badge.content"
                  inline
              />
            </template>
          </v-list-item>

        </v-list>

        <template #append>
          <v-list variant="text" density="default" nav rounded="lg">
            <v-list-item
                class="bg-grey-lighten-4"
                prepend-icon="mdi-logout"
                variant="text"
                title="Выход"
                @click="logout"
            >
              <v-tooltip activator="parent">Выйти из системы</v-tooltip>
            </v-list-item>
          </v-list>
        </template>
      </v-navigation-drawer>

      <v-main>
        <slot/>
      </v-main>

    </v-layout>
  </v-card>
</template>

<script>
import {navItems} from '../configs/./navigate-items';
import {getProfile} from "../utils/api/api_profile";
import {navigateTo, reloadNuxtApp} from "nuxt/app";

export default {

  name: "navMenu",

  data() {
    return {
      drawer: true,
      rail: false,
      activeItem: null,
      profile: {},
      navItems,
    }
  },

  beforeMount() {
    this.getProfile();
  },

  mounted() {
    this.activeItem = this.whichRouteIsActive() || null;
  },

  methods: {
    whichRouteIsActive() {
      return this.navItems?.find(item => this.$route.fullPath.indexOf(item.route) !== -1)?._id;
    },

    navigateToProfile() {
      navigateTo('/manager-menu/profile');
    },

    async getProfile() {
      const response = await getProfile();
      this.profile = response.data;
    },

    logout() {
      localStorage.removeItem('accessToken');
      reloadNuxtApp();
    }
  }

}
</script>