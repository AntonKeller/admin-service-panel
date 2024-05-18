<template>
  <div>
    <v-card class="c-card" color="deep-purple-lighten-5">
      <v-layout class="c-layout" full-height>
        <v-navigation-drawer permanent rounded>
          <v-list density="default" nav rounded>

            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg">
              <span>Аккаунт</span>
              <template v-slot:append>
                <v-btn
                    icon="mdi-location-exit"
                    size="small"
                    variant="tonal"
                    color="indigo-lighten-2"
                />
              </template>
            </v-list-item>

            <v-divider/>

            <v-list-item
                v-for="item of navItems"
                :key="item._id"
                :to="item.route"
                :prepend-icon="item.prependIcon"
                :active="item._id === activeItem"
                :color="item.color"
                :value="item.value"
                @click="activeItem = item._id"
            >
              <span>{{ item.title }}</span>
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
  </div>
</template>

<script>
import {navigateItems} from '../configs/navigateItems.ts';

export default {

  name: "navMenu",

  data: () => ({
    activeItem: null,
    navItems: navigateItems,
  }),

  mounted() {
    this.activeItem = this.whichRouteIsActive() || null;
    console.log('activeItem:', this.activeItem)
  },

  methods: {
    whichRouteIsActive() {
      return this.navItems?.find(item => this.$route.fullPath.indexOf(item.route) !== -1)?._id;
    }
  }

}
</script>

<style scoped>

.c-card {
  height: 100vh;
  padding-top: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.c-layout {
  max-width: 1024px;
}

</style>