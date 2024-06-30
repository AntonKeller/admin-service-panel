<template>
  <v-sheet
      rounded="lg"
      height="65vh"
      width="60vw"
      elevation="24"
      color="white"
  >
    <v-card height="100%">
      <v-card-title>
        Объекты на осмотр
      </v-card-title>
      <v-card-subtitle>
        Блок: Осмотр завода
      </v-card-subtitle>
      <v-card-item>

      </v-card-item>
      <v-card-text>
        <v-table height="430px" fixed-header density="comfortable">
          <thead>
          <tr>
            <th class="text-left">Наименование</th>
            <th class="text-left">Инвентарный номер</th>
            <th class="text-left">Адрес</th>
            <th class="text-left">Описание</th>
          </tr>
          </thead>
          <tbody>
          <v-skeleton-loader
              v-if="loading"
              width="full"
              color="transparent"
              elevation="0"
              type="list-item-three-line"
          />
          <tr
              v-for="item in inspectionObjects"
              :key="item._id"
          >
            <td>{{ textSlicer(item.name, 25) }}</td>
            <td>{{ textSlicer(item.inventoryNumber, 25) }}</td>
            <td>{{ textSlicer(item.address, 50) }}</td>
            <td>{{ textSlicer(item.description, 80) }}</td>
          </tr>
          <tr
              v-for="item in inspectionObjects"
              :key="item._id"
          >
            <td>{{ textSlicer(item.name, 25) }}</td>
            <td>{{ textSlicer(item.inventoryNumber, 25) }}</td>
            <td>{{ textSlicer(item.address, 50) }}</td>
            <td>{{ textSlicer(item.description, 80) }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-item>
        <v-pagination :length="9"></v-pagination>
      </v-card-item>
    </v-card>
  </v-sheet>
</template>

<script>
import {getInspectionObjects} from "@/utils/methods/inspection-objects-requests";
import {dataInspectionObjects} from "@/configs/data-test/data-test-inspection-object";

export default {
  name: "c-inspection-objects-menu",

  props: {
    assignmentBlock: Object,
  },

  data: () => ({
    inspectionObjects: [],
    loading: false,
  }),

  mounted() {
    this.objectsRequest(this.assignmentBlock);
  },

  methods: {

    textSlicer(txt, size) {
      return txt?.length > size ? txt.slice(0, size - 3) + '...' : txt;
    },

    objectsRequest(_block) {
      this.loading = true;
      getInspectionObjects()
          .then(resp => {
            console.log('Объекты получены');
            this.inspectionObjects = resp?.data;
          })
          .catch(err => {
            console.log('Ошибка получения объектов', err);
            this.inspectionObjects = dataInspectionObjects;
          })
          .finally(() => {
            this.loading = false;
          })
    }
  }
}
</script>

<style scoped>

</style>