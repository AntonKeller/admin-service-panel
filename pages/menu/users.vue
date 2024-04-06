<template>
  <!--  <v-card class="c-card" color="deep-purple-lighten-5">-->
  <!--    <v-layout class="c-layout" full-height>-->
  <!--      <v-main scrollable>-->
  <!--        <v-card class="mx-auto" variant="text">-->

  <!--          <v-card-title>-->
  <!--            <v-text-field-->
  <!--                color="indigo"-->
  <!--                :loading="searchIsLoading || true"-->
  <!--                append-inner-icon="mdi-magnify"-->
  <!--                density="compact"-->
  <!--                label="Поиск юзеров"-->
  <!--                variant="outlined"-->
  <!--                hide-details-->
  <!--                single-line-->
  <!--                @click:append-inner="onClick"-->
  <!--            ></v-text-field>-->
  <!--          </v-card-title>-->

  <!--          <v-card-subtitle>-->
  <!--            <div class="d-flex ga-2">-->
  <!--              <v-menu transition="slide-x-transition">-->

  <!--                <template v-slot:activator="{ props }">-->
  <!--                  <v-btn-->
  <!--                      @click="sorted=!sorted"-->
  <!--                      color="deep-purple-accent-3"-->
  <!--                      prepend-icon="mdi-sort"-->
  <!--                      variant="tonal"-->
  <!--                      density="compact"-->
  <!--                      rounded="xs"-->
  <!--                      v-bind="props"-->
  <!--                  >-->
  <!--                    По умолчанию-->
  <!--                  </v-btn>-->
  <!--                </template>-->

  <!--                <v-list bg-color="indigo-lighten-5" variant="text" density="compact">-->
  <!--                  <v-list-item v-for="(item, index) in menuItems" :key="index" :value="index">-->
  <!--                    <v-list-item-title>{{ item.title }}</v-list-item-title>-->
  <!--                  </v-list-item>-->
  <!--                </v-list>-->

  <!--              </v-menu>-->

  <!--              <v-chip density="comfortable" size="small" variant="flat" label color="indigo">-->
  <!--                <NuxtLink link to="/user-menu/menu">sdfsdf</NuxtLink>-->
  <!--              </v-chip>-->

  <!--              <v-chip density="comfortable" size="small" variant="flat" label color="pink">-->
  <!--                Chip 2-->
  <!--              </v-chip>-->

  <!--              <v-chip density="comfortable" size="small" variant="flat" label color="red">-->
  <!--                Chip 3-->
  <!--              </v-chip>-->
  <!--              <v-chip density="comfortable" size="small" variant="flat" label color="blue">-->
  <!--                Chip 4-->
  <!--                <template v-slot:append>-->
  <!--                  <v-icon style="margin-left:4px">mdi-checkbox-marked-circle</v-icon>-->
  <!--                </template>-->
  <!--              </v-chip>-->

  <!--            </div>-->
  <!--          </v-card-subtitle>-->

  <!--          <v-card-text>-->
  <!--            <v-list max-height="85vh" lines="two" rounded>-->
  <!--              <v-list-item v-for="user in users" :key="user.firstName + user.lastName">-->

  <!--                <template v-slot:title>-->
  <!--                  {{ user.firstName + ' ' + user.lastName }}-->
  <!--                  <v-badge :color="Math.random() > 0.5 ? 'error' : 'success'" dot style="width: 8px; height: 12px"/>-->
  <!--                </template>-->

  <!--                <template v-slot:subtitle>-->
  <!--                  <div class="d-flex flex-row ga-2">-->
  <!--                    <div class="d-inline-block">-->
  <!--                      {{ user.email }}-->
  <!--                    </div>-->
  <!--                    <v-chip prepend-icon="mdi-phone-outgoing-outline" rounded="md" size="x-small" variant="flat" label-->
  <!--                            color="blue">-->
  <!--                      {{ user.phoneNumber }}-->
  <!--                    </v-chip>-->
  <!--                    <v-chip prepend-icon="mdi-email-arrow-left-outline" rounded="md" size="x-small" variant="flat"-->
  <!--                            label color="teal">-->
  <!--                      {{ user.email }}-->
  <!--                    </v-chip>-->
  <!--                  </div>-->
  <!--                </template>-->

  <!--                <template v-slot:prepend>-->
  <!--                  <v-avatar :color="user.color">-->
  <!--                    <v-icon color="white">{{ user.icon }}</v-icon>-->
  <!--                  </v-avatar>-->
  <!--                </template>-->

  <!--                <template v-slot:default>-->
  <!--                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur deserunt esse minus nesciunt-->
  <!--                  nulla vel!-->
  <!--                  <v-divider color="indigo" style="margin-top: 4px"></v-divider>-->
  <!--                </template>-->

  <!--                <template v-slot:append>-->
  <!--                  <v-btn-->
  <!--                      color="grey"-->
  <!--                      icon="mdi-open-in-new"-->
  <!--                      variant="text"-->
  <!--                  />-->
  <!--                </template>-->
  <!--              </v-list-item>-->
  <!--            </v-list>-->
  <!--          </v-card-text>-->

  <!--        </v-card>-->

  <!--      </v-main>-->
  <!--    </v-layout>-->
  <!--  </v-card>-->
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab amet asperiores aspernatur assumenda consectetur delectus
  dignissimos doloribus earum facere fuga id in, ipsam iste itaque iusto maiores, molestiae mollitia nobis optio quaerat
  quas rem repellendus sint sunt tenetur. Ad aliquam architecto assumenda atque cupiditate, esse eveniet in ipsum maxime
  nemo odit perferendis quidem quisquam, quo similique tempore totam ut voluptatum. Accusantium, ad architecto
  blanditiis commodi dolorum, explicabo, incidunt ipsam iure molestias nam quasi ratione sapiente voluptatibus. Corporis
  doloribus, eaque incidunt non odit porro! Aliquam debitis deleniti dolore eaque facilis quam qui repellendus tempore
  vitae! Adipisci aliquam cupiditate fuga odit, quod reprehenderit suscipit voluptas. Assumenda autem corporis dicta
  dolorum earum inventore ipsum mollitia nostrum ratione voluptate? A accusamus dolor expedita fuga molestiae placeat
  saepe. Ab accusamus blanditiis commodi corporis cumque delectus dolore doloribus earum excepturi exercitationem
  explicabo, facere, harum illo impedit labore libero nobis quae quam quas quia quo quod quos ratione, recusandae soluta
  veniam voluptas voluptate? Ab architecto cupiditate delectus deserunt dolore ducimus eaque eos eveniet ex
  exercitationem incidunt laudantium libero magni maiores minima nam natus nemo, nihil obcaecati pariatur perspiciatis
  quos repudiandae saepe sapiente similique soluta sunt veritatis. Ab alias amet architecto assumenda, atque commodi
  cupiditate dignissimos distinctio dolor doloremque doloribus ducimus eaque, error est id ipsum laudantium molestias
  nam nisi non nostrum odio optio placeat possimus provident quia quisquam quos ratione repellendus repudiandae sapiente
  sint tempora velit? Ad architecto beatae cupiditate dolor ducimus eaque et excepturi ipsam labore libero minus nemo,
  odit suscipit. Asperiores debitis doloribus facilis ipsum iure nesciunt nulla numquam odio officia, perspiciatis!
  Dolor dolorum eum laboriosam minima nemo quia quis, sapiente sequi! Ad cum molestias officia officiis quidem quis sunt
  vitae voluptas. Ab aliquam delectus dolor et minima, quasi qui quos sapiente ut voluptatum? Accusamus, adipisci aut
  autem consequuntur culpa cupiditate delectus deserunt dignissimos, dolore dolores earum eos error excepturi fuga
  fugiat harum magni nemo officia omnis porro quae quidem repellendus reprehenderit repudiandae tenetur vel velit vero.
  Iure omnis quidem tempore. Dicta illum, laudantium maxime minima necessitatibus neque numquam officia quibusdam quis
  rem repudiandae totam velit vitae. Ad animi consectetur consequatur esse expedita id in magnam maiores, maxime, natus
  neque nihil odit optio quisquam reiciendis saepe sapiente tempore ullam velit voluptatibus. A accusantium animi
  architecto aut commodi deserunt doloremque eaque exercitationem id impedit ipsum magnam magni maiores modi nam
  necessitatibus nihil numquam obcaecati omnis, optio perferendis praesentium quo saepe suscipit tempora tempore,
  veniam? Accusamus ad, aliquam aut consequatur cum cupiditate dignissimos ea earum esse expedita harum id illum in iure
  labore laboriosam laborum magnam molestiae molestias necessitatibus nostrum numquam pariatur quas quidem quo ratione
  saepe veniam. Architecto culpa, deserunt eius exercitationem explicabo hic incidunt iste nemo odit repellat tempore
  unde. Accusantium asperiores esse fugiat hic magnam optio quo quos similique veniam veritatis. Ab at delectus deleniti
  dicta eligendi est id, ipsam nam non odit quam quibusdam temporibus ut? Aut cupiditate earum fuga ipsum laboriosam
  laudantium minima omnis optio provident sapiente, suscipit totam ut? Accusantium beatae ea eius eos facilis iusto
  optio, possimus quo quos saepe.
</template>

<script>

// import axios from "axios";
// import {serverURL} from "@/constants/constants";

export default {

  name: "users",

  data() {
    // return {
    //   tab: 'option-1',
    //   drawer: true,
    //   rail: true,
    //   sorted: false,
    //
    //   users: [
    //     {
    //       color: 'blue',
    //       id: '',
    //       icon: 'mdi-account-network',
    //       firstName: 'Vacation itinerary',
    //       lastName: '',
    //       phoneNumber: '',
    //       email: '',
    //     },
    //   ],
    //
    //   menuItems: [
    //     {title: 'По убыванию'},
    //     {title: 'По возрастанию'},
    //   ],
    //
    //   folders: [
    //     {
    //       subtitle: 'Jan 9, 2014',
    //       title: 'Photos',
    //     },
    //     {
    //       subtitle: 'Jan 17, 2014',
    //       title: 'Recipes',
    //     },
    //     {
    //       subtitle: 'Jan 28, 2014',
    //       title: 'Work',
    //     },
    //   ],
    //
    // }
  },

  mounted() {
    // this.fetchUsers();
    // setInterval(() => this.fetchUsers(), 5 * 60 * 1000);
  },

  // https://jsonplaceholder.typicode.com/users
  methods: {
    // fetchUsers() {
    //   axios.get(serverURL + '/users')
    //       .then((response) => {
    //         console.log('Пользователи успешно получены', response);
    //         console.log(response?.data)
    //         this.users = response?.data.map(e => ({
    //           color: 'blue',
    //           icon: 'mdi-account-network',
    //           id: e.id,
    //           firstName: e.firstName,
    //           lastName: e.lastName,
    //           phoneNumber: e.phoneNumber,
    //           email: e.email
    //         }));
    //       })
    //       .catch((err) => {
    //         console.log('Ошибка получения пользователей', err);
    //       })
    //       .finally(() => {
    //         this.isLoading = false;
    //       });
    // },
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

  .au-panel-wrap {
    min-width: 400px;
    max-width: 400px;
    align-self: center;
    justify-self: self-end;
  }
</style>