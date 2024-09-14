<template>
  <v-card
      color="blue-grey-darken-4"
      variant='text'
      density="compact"
  >
    <v-card-title>Отчеты</v-card-title>
    <v-card-subtitle>Отчеты отобразятся в списке по готовности</v-card-subtitle>
    <v-card-text>
      <v-sheet class="d-flex flex-wrap ga-4">
        <v-card border="sm" variant="tonal" color="blue-darken-3" v-for="n of 7" class="w-25">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>ТЗ: Осмотр объектов недвижимости</span>
            <v-btn density="compact" variant="text" rounded="lg" icon="mdi-open-in-new" />
          </v-card-title>
          <v-card-subtitle>Осмотр бань, адрес: ул. 3 Ямского поля 2 к 7</v-card-subtitle>
          <v-card-text>
            <v-label class="text-caption" text="Исполнители:" />
            <div class="d-flex ga-2 flex-wrap">
              <v-divider class="my-1"/>
                <v-chip border="sm" variant="tonal" density="compact" size="small">Иванов И. И.</v-chip>
                <v-chip border="sm" variant="tonal" density="compact" size="small">Петров А. А.</v-chip>
                <v-chip border="sm" variant="tonal" density="compact" size="small">Сидоров И. А.</v-chip>
                <v-chip border="sm" variant="tonal" density="compact" size="small">Иващенко А. А.</v-chip>
                <v-chip border="sm" variant="tonal" density="compact" size="small">Кузнецов А. А.</v-chip>
                <v-chip border="sm" variant="tonal" density="compact" size="small">Григоренко А. А.</v-chip>
              <v-divider class="my-1"/>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn density="comfortable" variant="elevated" color="blue-darken-4">Скачать</v-btn>
            <v-btn density="comfortable" variant="tonal">Перейти</v-btn>
            <v-btn density="comfortable" variant="text">Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-card-text>
  </v-card>

</template>

<script>
export default {
  name: "reports"
}
</script>