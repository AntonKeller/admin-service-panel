<template>
  <div>
    <v-navigation-drawer permanent rounded>

      <v-list density="compact" nav bg-color="deep-lighten-5" rounded>
<!--        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"-->
        <v-list-item>
          <span>Аккаунт</span>
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
        <v-list-item
            v-for="item of navItems"
            :key="item.title"
            :to="item.route"
            :prepend-icon="item.prependIcon"
            :active="item.active"
            :color="item.color"
            :value="item.value"
            @click="clickItem(item.title)"
        >
          <span>{{item.title}}</span>
          <template v-slot:append>
            <v-badge
                v-show="item.badge.show"
                :color="item.badge.color"
                :content="item.badge.content"
                inline
            ></v-badge>
          </template>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>
    <slot />
  </div>
</template>

<script>
import {navigateItems} from '@/configs/navigateItems.ts';

export default {

  name: "menu",

  data: () => ({
    navItems: navigateItems,
  }),

  methods: {
    clickItem(title) {
      this.navItems.forEach(e => {
        if (e.title === title) {
          e.active = true;
          console.log(e.title, "включен")
        } else if (e.title !== title && e.active) {
          e.active = false;
          console.log(e.title, "отключен")
        }
      });
    }
  }

}
</script>

<style scoped>

</style>