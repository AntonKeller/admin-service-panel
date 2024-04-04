<template>
  <v-card class="c-card">
    <v-layout class="c-layout" full-height>

      <v-navigation-drawer

          floating
          permanent
      >
        <v-list
            density="compact"
            nav
        >
          <v-list-item
              prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          >
            Иванов И.И
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-account-group-outline" value="users" color="primary">
            Пользователи
          </v-list-item>
          <v-list-item prepend-icon="mdi-file-chart-outline" value="tasks" color="primary">
            Отчеты
          </v-list-item>
          <v-list-item prepend-icon="mdi-view-module" value="reports" color="primary">
            Модули
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main scrollable>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus eos laudantium neque officia officiis soluta
        temporibus. Accusantium blanditiis cupiditate facilis impedit, incidunt labore laboriosam perspiciatis
        recusandae? Impedit officia repellat sint. Ea eaque fugiat hic id illum, ipsum iusto laudantium libero molestias
        natus numquam quae quaerat quis repudiandae suscipit, unde voluptatum. Ad harum necessitatibus non obcaecati sed
        sunt tempora. Ad asperiores assumenda commodi consequatur cupiditate delectus, dicta dolor dolore doloremque
        ducimus enim, explicabo hic laborum magni odio, officiis pariatur quisquam reiciendis repudiandae sint sunt
        tenetur ullam voluptate. Aspernatur atque distinctio dolor doloremque est et fuga, harum in, iste laboriosam
        maiores modi molestias nobis obcaecati quibusdam recusandae soluta ullam vero! Accusamus adipisci, aperiam
        deserunt fugiat illum molestias quibusdam voluptatem voluptatibus! Ad adipisci alias aperiam architecto
        aspernatur assumenda consequuntur distinctio ea eius error facere fugit harum hic ipsa ipsum labore modi nulla,
        odit placeat porro provident quas qui repellendus rerum sed tenetur totam ut.
      </v-main>

    </v-layout>
  </v-card>
</template>

<script>

// const

// await navigateTo('/')

export default {

  name: 'IndexPage',

  data() {
    return {
      tab: 'option-1',
      drawer: true,
      rail: true,
    }
  },

  beforeMount() {
    console.log('beforeMount')
  },

  // https://jsonplaceholder.typicode.com/users
  methods: {
    fetchData() {
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": 'your-api-key',
          "X-RapidAPI-Host": 'facts-by-api-ninjas.p.rapidapi.com',
        },
      })
          .then((response) => {
            response.json().then((data) => {
              this.fact = data[0].fact;
            });
          })
          .catch((err) => {
            console.error(err);
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
