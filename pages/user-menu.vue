<template>
  <v-card style="width: 100vw; height: 100vh">

    <v-toolbar density="compact" color="primary">
      <v-toolbar-title>
        <v-icon>mdi-domain</v-icon>
        Lorem ipsum.
      </v-toolbar-title>
    </v-toolbar>

    <div class="d-flex flex-row">

      <v-tabs
          v-model="tab"
          color="primary"
          direction="vertical"
          center-active
          style="min-width: 180px"
      >
        <v-tab value="profile">
          <v-icon start>mdi-account-badge-outline</v-icon>
          Профиль
        </v-tab>

        <v-tab value="users">
          <v-icon start>mdi-account-group-outline</v-icon>
          Подряд
        </v-tab>

        <v-tab value="tasks">
          <v-icon start>mdi-calendar-check-outline</v-icon>
          Задачи
        </v-tab>

        <v-tab value="modules">
          <v-icon start>mdi-view-module</v-icon>
          Модули
        </v-tab>
      </v-tabs>

      <v-window v-model="tab" direction="horizontal" style="width: 100%">

        <v-window-item value="profile">
          <v-card flat variant="tonal">
            <v-card-text>
              <p>
                Sed aliquam ultrices mauris. Donec posuere vulputate arcu. Morbi ac felis. Etiam feugiat lorem non
                metus. Sed a libero.
              </p>

              <p>
                Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Aenean tellus metus, bibendum sed,
                posuere ac, mattis non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non nisl sit amet velit
                hendrerit rutrum.
              </p>

              <p class="mb-0">
                Phasellus dolor. Fusce neque. Fusce fermentum odio nec arcu. Pellentesque libero tortor, tincidunt et,
                tincidunt eget, semper nec, quam. Phasellus blandit leo ut odio.
              </p>
            </v-card-text>
          </v-card>
        </v-window-item>

        <v-window-item value="users">
          <c-user-list/>
        </v-window-item>

        <v-window-item value="tasks">
          <v-card flat variant="tonal">
            <v-card-text>
              <p>
                Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus,
                vitae
                iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non
                adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere
                imperdiet,
                leo. Nunc sed turpis.
              </p>

              <p>
                Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus,
                vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu
                tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit
                amet ligula pharetra condimentum.
              </p>

              <p>
                Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam
                commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu
                nunc.
              </p>

              <p>
                Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede.
                Duis leo. Fusce fermentum odio nec arcu.
              </p>

              <p class="mb-0">
                Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum
                et,
                tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a,
                condimentum nec, nisi.
              </p>
            </v-card-text>
          </v-card>
        </v-window-item>

        <v-window-item value="modules">
          <v-card flat variant="tonal">
            <v-card-text>
              <p>
                Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula
                sit
                amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna,
                posuere eget, vestibulum et, tempor auctor, justo.
              </p>

              <p class="mb-0">
                Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien ipsum, porta a, auctor
                quis, euismod ut, mi. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at
                tortor
                in tellus interdum sagittis.
              </p>
            </v-card-text>
          </v-card>
        </v-window-item>

      </v-window>
    </div>

<!--    <div class="index-background">-->
<!--      <v-card class="h-full" elevation="1">-->
<!--        <v-layout>-->
<!--          <v-navigation-drawer-->
<!--              v-model="drawer"-->
<!--              :rail="rail"-->
<!--              permanent-->
<!--              @click="rail = false"-->
<!--          >-->
<!--            <v-list-item-->
<!--                :prepend-avatar="`https://randomuser.me/api/portraits/men/${Math.floor(1+Math.random()*87)}.jpg`"-->
<!--                title="ООО Рога и копыта"-->
<!--                nav-->
<!--            >-->
<!--              <template v-slot:append>-->

<!--                &lt;!&ndash;              'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'&ndash;&gt;-->
<!--                <v-btn-->
<!--                    icon="mdi-chevron-left"-->
<!--                    variant="text"-->
<!--                    @click.stop="rail = !rail"-->
<!--                ></v-btn>-->
<!--              </template>-->
<!--            </v-list-item>-->

<!--            <v-divider></v-divider>-->

<!--            <v-list density="compact" nav>-->
<!--              <v-list-item prepend-icon="mdi-account-badge-outline" title="Профиль" value="profile"></v-list-item>-->
<!--              <v-list-item prepend-icon="mdi-account-group-outline" title="Осмотрщики" value="users"></v-list-item>-->
<!--              <v-list-item prepend-icon="mdi-calendar-check-outline" title="Задачи" value="tasks"></v-list-item>-->
<!--              <v-list-item prepend-icon="mdi-view-module" title="Модули" value="modules"></v-list-item>-->
<!--            </v-list>-->
<!--          </v-navigation-drawer>-->
<!--          <v-main style="min-height: 500px; padding-left: 150px">-->
<!--            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam at consequuntur culpa dolores eligendi-->
<!--            fuga-->
<!--            id illum incidunt inventore magnam, maxime molestiae nam natus odio odit placeat quam qui quibusdam, tenetur-->
<!--            vel. Asperiores consequatur dolores eius enim eos est exercitationem fuga impedit in iure iusto laborum,-->
<!--            libero maiores natus nulla perferendis, quos rem saepe, sed voluptatibus? Architecto consectetur deleniti-->
<!--            dolor ducimus earum explicabo, fugiat illum iste iusto, laborum laudantium minus necessitatibus non nulla-->
<!--            obcaecati odio odit omnis possimus quaerat quia tempora ullam velit veniam. Accusantium aliquam asperiores-->
<!--            atque consectetur deserunt dolorem, doloribus eaque eos exercitationem expedita explicabo iste labore magnam-->
<!--            modi mollitia nam nisi numquam officiis optio perferendis perspiciatis quam reprehenderit, sit? Assumenda at-->
<!--            commodi dolores enim fuga incidunt inventore, modi, nisi placeat quam reiciendis repellat totam vel! Aut-->
<!--            beatae deleniti explicabo id molestiae nemo neque nulla veniam voluptate. Accusantium ad adipisci-->
<!--            asperiores,-->
<!--            assumenda consectetur consequuntur debitis dolorum ea earum id illum ipsa ipsum laborum nam nostrum-->
<!--            obcaecati-->
<!--            officiis perferendis perspiciatis possimus praesentium quaerat quibusdam quis quo ratione repellat-->
<!--            repudiandae-->
<!--            voluptatibus? Ab autem beatae consectetur consequuntur deserunt dignissimos distinctio eius esse est facilis-->
<!--            fuga fugit harum hic ipsam iure, laudantium libero magnam mollitia neque nisi nostrum omnis optio possimus-->
<!--            quaerat quam quisquam, quod ratione rem sed tempora ullam unde veritatis, voluptates. Ad beatae dolor eum-->
<!--            libero maxime nesciunt optio quisquam totam voluptate voluptatum. Aperiam aspernatur atque aut autem-->
<!--            blanditiis cumque cupiditate dolore, dolorem dolores dolorum ducimus eius error eveniet excepturi id illo-->
<!--            itaque minus obcaecati omnis saepe ullam velit voluptas voluptatibus! Accusamus at atque, beatae eligendi,-->
<!--            et-->
<!--            explicabo fuga illo minus mollitia, nostrum officia porro quasi quos recusandae temporibus ut vel? Autem-->
<!--            commodi culpa cupiditate debitis dolorem eveniet, in labore magni molestias nisi nobis, officia, officiis-->
<!--            provident. Delectus dolores eaque eos illum incidunt itaque magnam natus, quisquam reiciendis, sequi tempore-->
<!--            totam unde voluptatibus! Culpa eos nisi officia, praesentium quam quibusdam veniam voluptas. Accusamus-->
<!--            architecto assumenda autem beatae consequuntur, delectus ducimus excepturi mollitia, necessitatibus neque-->
<!--            repudiandae veritatis. Culpa eius eveniet expedita nulla officiis unde? Ad, assumenda ducimus hic incidunt-->
<!--            nemo nihil odit praesentium rerum! Accusamus ad architecto commodi cum distinctio dolor dolorem eaque eius-->
<!--            eos-->
<!--            facilis fugit inventore laudantium neque, quam, quasi quia ratione repellat repellendus rerum tempora velit-->
<!--            vero voluptatem. Ab, adipisci aliquid cupiditate facilis mollitia optio ullam voluptates? Aliquid asperiores-->
<!--            at dolore dolorum earum et eveniet harum ipsa iure minus mollitia natus nostrum porro, quasi quisquam-->
<!--            recusandae repellendus, voluptatibus! Atque beatae cum dolore est, expedita fugit illum in incidunt-->
<!--            inventore,-->
<!--            ipsam maxime molestias, neque nisi obcaecati pariatur quas quia quo tenetur. Consequuntur distinctio-->
<!--            exercitationem id inventore laboriosam non officiis tempore tenetur. Architecto debitis ex, fuga fugit,-->
<!--            iusto-->
<!--            laborum libero, nulla odit porro quae qui tempora velit? Animi dolores, ea eum expedita fugit magnam magni-->
<!--            minus molestiae nulla perferendis quae qui quis quo quod recusandae repellat voluptate. Aliquid animi-->
<!--            aspernatur, autem beatae dicta dolore dolorem dolores eaque eius eos est et fugiat itaque numquam odit-->
<!--            officiis placeat quia, quis quo quod rerum sed sint voluptates. Ea impedit iusto odit suscipit!-->
<!--          </v-main>-->
<!--        </v-layout>-->
<!--      </v-card>-->
<!--    </div>-->
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
