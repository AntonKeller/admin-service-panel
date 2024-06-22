<template>
  <v-sheet class="rounded">
    <v-card
        variant="flat"
        min-width="800"
        max-width="800"
        density="comfortable"
        rounded
    >
      <v-card-title>Договоры</v-card-title>
      <v-card-subtitle>Выберите или создайте новый</v-card-subtitle>
      <v-card-item>
        <div class="d-flex ga-2">
          <v-btn
              rounded
              color="teal-darken-2"
              variant="elevated"
              density="default"
              size="small"
              icon="mdi-plus"
              @click="showContractAddMenu = true"
          />
          <v-text-field
              color="teal-darken-2"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              label="Поиск договора"
              variant="outlined"
              hide-details
              single-line
              clearable
              v-model="searchText"
          />
        </div>
      </v-card-item>
    </v-card>

    <v-list min-height="380" max-height="360">

      <v-list-item v-if="!loadingData && !contractsFiltered">Договора не найдены</v-list-item>

      <v-list-item>
        <v-table height="450px" fixed-header density="comfortable">
          <thead>
          <tr>
            <th class="text-left">Номер договора</th>
            <th class="text-left">Дата договора</th>
            <th class="text-left"></th>
          </tr>
          </thead>
          <tbody>
          <v-skeleton-loader
              v-if="loadingData"
              width="full"
              color="transparent"
              elevation="0"
              type="list-item-three-line"
          />
          <tr
              class="tr_hover"
              v-for="item in contractsFiltered"
              :key="item._id"
              @click="selectContract({...item})"
          >
            <td>{{ item.contractNumber }}</td>
            <td>{{ item.contractDate }}</td>
            <td>
              <v-btn
                  :loading="removeBtnLoadingId === item._id"
                  @click.stop="requestRemoveContract(item._id)"
                  color="teal-darken-4"
                  icon="mdi-close"
                  variant="text"
                  density="compact"
              />
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-list-item>
    </v-list>

    <v-overlay v-model="showContractAddMenu" class="d-flex justify-center align-center">
      <c-contract-card-add-menu :returnContract="addNewContract"/>
    </v-overlay>

  </v-sheet>
</template>

<script>
import {testDataContracts} from "../configs/data-test/data-test-contracts";
import {fetchContracts, removeContract} from "../utils/methods/contract-requests";

export default {
  name: "c-contract-list",

  props: {
    selectContract: Function,
  },

  data: () => ({
    removeBtnLoadingId: null,
    loadingData: true,
    searchText: null,
    contractList: null,
    showContractAddMenu: false,
    contractChangeMenuVisible: false,
  }),

  computed: {
    contractsFiltered() {
      if (this.searchText?.length > 0 && this.contractList?.length > 0) {

        let expression = new RegExp(this.searchText, 'i');

        let filtered = this.contractList?.filter(contract => [
          contract.contractNumber,
          contract.contractDate,
        ].find(e => expression.test(e)));

        console.log('filtered', filtered)

        return filtered?.length > 0 ? filtered : null;

      } else return this.contractList;
    }
  },

  mounted() {
    this.fetchData();
  },

  methods: {

    requestRemoveContract(id) {

      this.removeBtnLoadingId = id;

      removeContract(id)
          .then(response => {
            this.contractList = this.contractList.filter(contract => contract._id !== id);
            console.log('Договор успешно удален', response);
          })
          .catch(err => {
            console.log('Не удалось удалить договор', err);
          })
          .then(() => {
            this.removeBtnLoadingId = null;
          })
    },

    addNewContract(newContract) {
      if (Array.isArray(this.contractList)) {
        this.contractList.push(newContract)
      } else {
        this.contractList = [newContract];
      }
    },

    fetchData() {
      fetchContracts()
          .then(response => {
            return response?.data?.reverse();
          })
          .catch(err => {
            console.log('Запрос списка договоров выполнен с ошибкой', err);
            return testDataContracts?.reverse();
          })
          .then((_contracts) => {
            console.log('Запрос списка договоров завершен');
            this.contractList = _contracts;
            this.loadingData = false;
          });
    }
  }
}
</script>