<template>
  <v-card height="100vh">
    <v-layout full-height>

      <v-navigation-drawer
          :rail="rail"
          permanent
          @click="rail = false"
          elevation="0"
      >

        <v-list variant="text" density="default" nav rounded="lg">

          <div class="d-flex align-center justify-space-between">
            <v-list-item
                prepend-avatar="https://randomuser.me/api/portraits/men/1.jpg"
                :title="profile.fullName"
                :subtitle="profile.email"
                to="/manager-menu/profile"
                @click="activeItem = 'profile'"
                :active="activeItem === 'profile'"
            />
            <v-btn
                icon="mdi-arrow-collapse-left"
                color="blue-grey-darken-3"
                density="default"
                variant="text"
                rounded
                :class="rail ? 'd-none' : ''"
                @click.stop="rail = !rail"
            >
              <v-icon/>
              <v-tooltip activator="parent">
                Свернуть меню
              </v-tooltip>
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
              <v-badge
                  v-show="item.badge.show"
                  :color="item.badge.color"
                  :content="item.badge.content"
                  inline
              />
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar></v-app-bar>

      <v-main scrollable>
        <slot/>
      </v-main>

    </v-layout>
  </v-card>
</template>

<script>
import {navItems} from '../configs/./navigate-items';
import {getProfile} from "../utils/api/api_profile";

export default {

  name: "navMenu",

  data() {
    return {
      drawer: true,
      rail: true,
      activeItem: null,
      profile: {},
      navItems,
    }
  },

  watch: {
    drawer() {
      console.log('this.drawer:', this.drawer);
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
    async getProfile() {
      const response = await getProfile();
      this.profile = response.data;
    }
  }

}
</script>