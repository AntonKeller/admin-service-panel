<template>
  <div>
    <v-navigation-drawer permanent width="280" rounded>

      <v-list density="compact" nav bg-color="deep-lighten-5" rounded>

        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg">
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
            to="user-menu/tasks" link
            v-for="item of navItems"
            :key="item.title"
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
    <transition name="bounce">
      <slot/>
    </transition>
  </div>
</template>

<script>
export default {

  name: "user-menu-nav",

  data: () => ({

    navItems: [
      {
        title: 'Пользователи',
        prependIcon: 'mdi-account-group-outline',
        color: 'indigo-accent-4',
        value: 'users',
        active: false,
        badge: {
          show: true,
          color: "info",
          content: "12"
        },
      },
      {
        title: 'Список задач',
        prependIcon: 'mdi-format-list-text',
        color: 'indigo-accent-4',
        value: 'tasks',
        active: false,
        badge: {
          show: false,
          color: "info",
          content: "12"
        },
      },
      {
        title: 'Отчеты',
        prependIcon: 'mdi-file-chart-outline',
        color: 'indigo-accent-4',
        value: 'reports',
        active: false,
        badge: {
          show: true,
          color: "error",
          content: "3"
        },
      },
      {
        title: 'Модули',
        prependIcon: 'mdi-view-module',
        color: 'indigo-accent-4',
        value: 'modules',
        active: false,
        badge: {
          show: false,
          color: "error",
          content: "3"
        },
      },
      {
        title: 'Подписка',
        prependIcon: 'mdi-card-account-details-star-outline',
        color: 'indigo-accent-4',
        value: 'subscribe',
        active: false,
        badge: {
          show: false,
          color: "info",
          content: "12"
        },
      },
    ],

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