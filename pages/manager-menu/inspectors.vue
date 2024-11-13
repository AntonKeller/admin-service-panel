<template>
  <v-container fluid>
    <v-card variant="text">
      <v-card-title>inspectors</v-card-title>
      <v-card-item>
        <my-search-bar
            v-model="searchText"
            color="blue-darken-2"
            :hint="`Найдено: ${inspectorsFoundCount}`"
            @btn:click="inspectorMenuAddVisibility = true"
        />
      </v-card-item>
    </v-card>

    <div style="min-height: 700px" class="mt-4">
      <v-divider/>
      <v-table
          style="height: 700px"
          density="comfortable"
          class="text-caption"
          fixed-header
      >
        <thead v-if="!fetching">
        <tr>
          <th>№</th>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Отчество</th>
          <th>Номер телефона</th>
          <th>Email</th>
          <th></th>
        </tr>
        </thead>
        <tbody v-if="!fetching">
        <tr
            v-for="(inspector, i) of inspectorsSlice"
            :key="inspector._id"
            @click="changeInspector(inspector)"
        >
          <td>{{ i + 1 }}</td>
          <td>{{ inspector?.firstName || '' }}</td>
          <td>{{ inspector?.surName || '' }}</td>
          <td>{{ inspector?.lastName || '' }}</td>
          <td>{{ inspector?.phoneNumber || '' }}</td>
          <td>{{ inspector?.email || '' }}</td>
          <td style="min-width: 65px; width: 65px; max-width: 65px">
            <c-remove-btn :prompt="'Удалить'" @click:yes="removeInspector(inspector._id)"/>
          </td>
        </tr>
        </tbody>
      </v-table>
      <v-divider/>
    </div>

    <div class="d-flex align-center mt-4">
      <v-pagination
          v-model="currentPage"
          density="comfortable"
          color="blue-grey-darken-2"
          show-first-last-page
          :length="totalPages"
          :total-visible="8"
      />
    </div>

    <v-overlay v-model="inspectorMenuAddVisibility" class="d-flex justify-center align-center">
      <inspector-add @add:success="updateInspectors"></inspector-add>
    </v-overlay>

    <v-overlay v-model="inspectorMenuChangeVisibility" class="d-flex justify-center align-center">
      <inspector-change @change:success="updateInspectors" :_inspector="inspectorSelected"></inspector-change>
    </v-overlay>

  </v-container>
</template>

<script>
import {fetchInspectors, removeInspector} from "../../utils/api/api_inspectors.js";
import {showAlert} from "../../utils/functions.js";

export default {
  name: "inspectors-page",
  components: {},

  data() {
    return {
      inspectors: [],
      inspectorSelected: null,
      fetching: false,
      searchText: '',
      currentPage: 1,
      itemsPerPage: 20,
      inspectorMenuAddVisibility: false,
      inspectorMenuChangeVisibility: false,
    }
  },

  mounted() {
    this.updateInspectors();
  },

  computed: {
    totalPages() {
      return Math.ceil(this.inspectorsFoundCount / this.itemsPerPage);
    },
    inspectorsFoundCount() {
      return this.inspectorsFound.length;
    },
    inspectorsSlice() {
      const from = (this.currentPage - 1) * this.itemsPerPage;
      const to = this.currentPage * this.itemsPerPage;
      return this.inspectorsFound.slice(from, to);
    },
    inspectorsFound() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.inspectors.filter(e => {
          return (new RegExp(this.searchText, 'ig')).test([
            e?.firstName || null,
            e?.surName || null,
            e?.lastName || null,
            e?.phoneNumber || null,
            e?.email || null
          ].filter(e => !!e).join(' '));
        })
      } else {
        return this.inspectors;
      }
    }
  },

  methods: {
    updateInspectors() {
      fetchInspectors()
          .then((response) => {
            this.inspectors = response.data;
          })
    },
    removeInspector(ID) {
      removeInspector(ID)
          .then(() => {
            this.snackBar = showAlert('Инспектор удален').success();
          })
          .catch(() => {
            this.snackBar = showAlert('Ошибка удаления').error();
          })
    },
    changeInspector(inspector) {
      this.inspectorSelected = inspector;
      this.inspectorMenuChangeVisibility = true;
    },
  }
}
</script>