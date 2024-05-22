<template>
  <v-sheet rounded="sm" min-height="80vh" height="80vh">
    <v-card height="100%" variant="tonal" color="blue-darken-4">
      <v-card-title class="d-flex ga-2">
        <div>
          <div v-if="!changeStatus">
            {{ assignment?.title + ' / ' + assignment?.customer?.shortName || '' + '/' || 'Безымянная задача' }}
          </div>
          <div v-if="changeStatus">
            <v-text-field density="comfortable" style="width: 250px" label="Label" v-model="assignment.title"></v-text-field>
          </div>
        </div>
        <div>
          <v-btn
              @click="changeStatus = !changeStatus"
              :variant="changeStatus ? 'outlined' : 'text'"
              rounded="sm"
              density="compact"
              icon="mdi-pencil-outline"
          />
        </div>
      </v-card-title>
      <v-card-subtitle>{{ assignment?.contract?.contractDate || 'Нет даты договора' }}</v-card-subtitle>
      <v-card-text>
        <div v-if="!changeStatus">
          {{ assignment?.description || fish_description }}
        </div>
        <div v-if="changeStatus">
          <v-textarea v-model="assignment.description" />
        </div>
      </v-card-text>
      <v-card-item>
        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              plegeAgreement
            </th>
            <th class="text-left">
              plegerName
            </th>
            <th class="text-left">
              ........
            </th>
            <th class="text-left">
              ........
            </th>
            <th class="text-left">
              ........
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in desserts"
              :key="item.name"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.name }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: "c-assignment-info-menu",
  props: {
    _assignment: Object,
  },
  data: () => ({
    changeStatus: false,
    assignment: null,
    //...........any
    fish_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur consectetur corporis deserunt, enim esse\n' +
        '          facilis harum in ipsam, laboriosam magni nihil temporibus totam. Aspernatur at commodi cupiditate deleniti\n' +
        '          distinctio dolorum est ex facilis illum ipsa ipsam maiores minima minus modi natus nemo nobis, odio praesentium\n' +
        '          ratione, repellat reprehenderit veniam voluptate.',
    desserts: [
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
      {name: 'Lorem ipsum dolor sit'},
    ]
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.assignment = this._assignment;
    }
  }
}
</script>

<style scoped>

</style>