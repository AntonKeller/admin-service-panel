<template>
    <v-card class="c-card" color="deep-purple-lighten-5">
      <v-layout class="c-layout" full-height>
        <v-main scrollable>
          <div>
            <v-card class="mx-auto" variant="text">
              <v-card-title>
                TASKS MENU
              </v-card-title>
              <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem praesentium, voluptatum. Aspernatur
                consequatur
                dolore, doloribus esse eveniet facere ipsa itaque maxime nam natus porro provident quia ratione sequi
                temporibus
                tenetur voluptas? Cupiditate dolorem mollitia rerum? Excepturi illum labore molestias nobis numquam odit
                pariatur
                quia quo, sit, soluta tenetur unde voluptatum.
              </v-card-text>
            </v-card>
          </div>
        </v-main>
      </v-layout>
    </v-card>
</template>

<script>

export default {
  name: "tasks"
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
  /*max-width: 768px;*/
  max-width: 1024px;
}
</style>