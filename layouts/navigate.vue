<template>
  <v-card height="100vh">
    <v-layout class="c-layout" full-height>

      <v-navigation-drawer
          permanent
          expand-on-hover
          rail
          rounded
          elevation="0"
      >

        <v-list variant="text" density="default" nav rounded>

          <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/men/1.jpg"
              subtitle="ivan_ivanov@gmail.com"
              title="Project Manager"
          />

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

      <v-main scrollable>
        <slot/>
      </v-main>

    </v-layout>
  </v-card>
</template>

<script>
import {navItems} from '../configs/./navigate-items';

export default {

  name: "navMenu",

  data: () => ({
    activeItem: null,
    navItems,
  }),

  mounted() {
    this.activeItem = this.whichRouteIsActive() || null;
  },

  methods: {
    whichRouteIsActive() {
      return this.navItems?.find(item => this.$route.fullPath.indexOf(item.route) !== -1)?._id;
    }
  }

}
</script>