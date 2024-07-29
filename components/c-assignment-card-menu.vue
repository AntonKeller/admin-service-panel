<template>
  <v-sheet
      rounded="lg"
      height="70vh"
      width="65vw"
      elevation="24"
      color="white"
  >
    <v-card
        height="100%"
        :disabled="changeLoading"
    >
      <v-card-title>
        <v-sheet class="d-flex ga-2">
          <v-btn
              :loading="changeLoading"
              :variant="changeMode ? 'outlined' : 'text'"
              icon="mdi-pencil-outline"
              density="comfortable"
              rounded="lg"
              @click="cardChangeMenu = true"
          />
          {{ assignment?.title }}
        </v-sheet>
      </v-card-title>

      <v-card-item>
        <div style="height: 120px; overflow-y: scroll">
          {{ assignment?.description }}
        </div>
      </v-card-item>

      <v-card-subtitle />

      <v-card-text class="d-flex flex-column">

        <div class="d-flex ga-1">
          <v-chip
              density="compact"
              color="blue-grey-darken-3"
              rounded="sm"
          >
            {{
              assignment?.contract?.contractNumber && assignment?.contract?.contractDate ?
              `Договор: ${assignment?.contract?.contractNumber} / ${assignment?.contract?.contractDate}` :
                  'Отсутствует договор'
            }}
          </v-chip>


          <v-chip
              density="compact"
              color="blue-grey-darken-3"
              rounded="sm"
          >
            {{
              assignment?.customer?.shortName && assignment?.customer?.inn ?
              `Заказчик: ${assignment?.customer?.shortName} / ${assignment?.customer?.inn}` :
                  'Отсутствует заказчик'
            }}
          </v-chip>

        </div>
      </v-card-text>

      <v-card-item>
        <div class="d-flex ga-1 align-center">
          <my-search-bar
              style="min-width: 300px"
              label="Поиск"
              @btn:click="console.log('Добавлена позиция')"
          />
          <v-chip
              v-for="e of statuses"
              :key="e.id"
              prepend-icon="mdi-filter-check-outline"
              density="comfortable"
              :variant="activeStatus===e.id ? 'tonal' : 'text'"
              size="small"
              rounded="xl"
              :color="e.color"
              @click="activeStatus = activeStatus === e.id ? null : e.id"
          >
            {{ e.title }}
          </v-chip>
        </div>
        <v-divider class="my-2" color="teal-darken-4"/>
      </v-card-item>

      <v-card-item>
        <v-table height="320px" fixed-header density="comfortable">
          <thead>
          <tr>
            <th class="text-left">Кредитный договор</th>
            <th class="text-left">Дата кд</th>
            <th class="text-left">Договор залога</th>
            <th class="text-left">Дата дз</th>
            <th class="text-left">Начало</th>
            <th class="text-left">Окончание</th>
            <th class="text-left">Статус</th>
          </tr>
          </thead>
          <tbody>
          <v-skeleton-loader
              v-if="fetchBlocksLoading"
              width="full"
              color="transparent"
              elevation="0"
              type="list-item-three-line"
          />
          <tr
              v-for="item in assignmentBlockList"
              :key="item._id"
              @click="aBlockClick(item)"
          >
            <td>{{ item.assignmentBlock.loanAgreement }}</td>
            <td>{{ timeStringToDate(item.assignmentBlock.loanAgreementDate, 20).toLocaleDateString() }}</td>
            <td>{{ item.assignmentBlock.plegeAgreement }}</td>
            <td>{{ timeStringToDate(item.assignmentBlock.plegeAgreementDate, 20).toLocaleDateString() }}</td>
            <td>{{ timeStringToDate(item.assignmentBlock.startDate, 20).toLocaleDateString() }}</td>
            <td>{{ timeStringToDate(item.assignmentBlock.endDate, 20).toLocaleDateString() }}</td>
            <td>{{ item.assignmentBlock.status }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-card-item>
      <v-card variant="text">
        <v-card-item>
          <div class="d-flex align-center">
            <v-text-field
                v-model="currentPage"
                variant="outlined"
                density="compact"
                hide-details
                label="Страница"
                type="number"
                style="min-width: 80px; width: 80px; max-width: 80px"
                :clearable="false"
                @update:modelValue="fetchAssignmentBlocksDataDebounce"
            />
            <v-pagination
                style="max-width: 800px"
                show-first-last-page
                density="default"
                v-model="currentPage"
                :length="totalPages"
                rounded="circle"
                @update:modelValue="fetchAssignmentBlocksData"
            />
          </div>
        </v-card-item>
      </v-card>
    </v-card>

    <my-overlay v-model="cardChangeMenu">
      <c-assignment-card-change-menu :_assignment="assignment" />
    </my-overlay>

    <v-overlay v-model="contractsMenuVisible" class="d-flex justify-center align-center">
      <c-contracts-menu :selectContract="setContract"/>
    </v-overlay>

    <v-overlay v-model="customersMenuVisible" class="d-flex justify-center align-center">
      <c-customers-menu :selectCustomer="setCustomer"/>
    </v-overlay>

    <v-overlay
        v-model="selectedBlock"
        class="d-flex justify-center align-center"
        transition="scroll-y-transition"
    >
      <c-inspection-objects-menu/>
    </v-overlay>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

  </v-sheet>
</template>

<script>
import _ from "lodash";
import statuses from "@/configs/assignment-statuses";
import testDataCustomers from "@/configs/data-test/data-test-customers";
import testDataAssignmentBlocks from "../configs/data-test/data-test-assignment-blocks";
import {testDataContracts} from "@/configs/data-test/data-test-contracts";
import {fetchAssignmentBlocks} from "@/utils/methods/assignment-block-requests";
import {requestChangeAssignment} from "../utils/methods/assignment-requests";
import {timeStringToDate} from "../utils/service/serverAPI";
import {fetchCustomers} from "@/utils/methods/customer-requests";
import {fetchContracts} from "@/utils/methods/contract-requests";

export default {
  name: "c-assignment-card-menu",
  components: {},


  props: {
    _assignment: Object,
    _returnAssignment: Function,
  },

  data: () => ({

    statuses,
    activeStatus: null,

    currentPage: 1,
    totalPages: null,
    totalItems: 0,

    cardChangeMenu: false,

    snackBar: {},

    contracts: [],
    customers: [],
    loadingContracts: false,
    loadingCustomers: false,

    selectedBlock: null,
    contractsMenuVisible: false,
    customersMenuVisible: false,

    changeMode: false,
    changeLoading: false,
    fetchBlocksLoading: true,

    assignment: {
      _id: '',
      title: '',
      description: '',
      contract: null,
      customer: null
    },

    assignmentBlockList: [],
  }),

  mounted() {
    this.setDefault();
    this.fetchAssignmentBlocksData();
  },

  computed: {

    cAssignmentContract: {
      get() {
        return this.assignment?.contract;
      },
      set(_value) {
        console.log('_value', _value);
        this.assignment.contract = _value;
      }
    },

    getContractTitle() {
      return this.assignment?.contract ?
          'Договор: ' + this.assignment?.contract?.contractNumber : 'Добавить договор';
    },

    getCustomerTitle() {
      return this.assignment?.customer ?
          'Заказчик: ' + this.assignment?.customer?.shortName : 'Добавить заказчика';
    }

  },

  methods: {

    timeStringToDate,

    fetchAssignmentBlocksDataDebounce: _.debounce(function () {
      this.fetchAssignmentBlocksData();
    }, 1000),

    aBlockClick(_block) {
      this.selectedBlock = ({..._block});
      console.log('this.selectedBlock', this.selectedBlock);
    },

    textSlicer(txt, size) {
      return txt?.length > size ? txt.slice(0, 10) + '...' : txt;
    },

    setDefault() {
      this.assignment = {...this._assignment};
    },

    setContract(newContract) {
      this.assignment.contract = ({...newContract});
      this.contractsMenuVisible = false;
    },

    setCustomer(newCustomer) {
      this.assignment.customer = ({...newCustomer});
      this.customersMenuVisible = false;
    },

    showContractMenu() {
      this.contractsMenuVisible = true;
    },

    showCustomerMenu() {
      this.customersMenuVisible = true;
    },

    fetchAssignmentBlocksData() {
      this.fetchBlocksLoading = true;
      fetchAssignmentBlocks(this.assignment._id)
          .then(resp => {
            this.assignmentBlockList = resp?.data;
          })
          .catch(err => {
            console.log('Ошибка получения блоков ТЗ', err);
            this.snackBar.msg = 'Используются тестовые данные!'
            this.snackBar.type = 'yellow';
            this.snackBar.isShow = true;
            this.assignmentBlockList = testDataAssignmentBlocks;
          })
          .finally(() => {
            this.fetchBlocksLoading = false;
          })
    }

  }
}
</script>

<style>

tr:hover > td {
  text-decoration: underline;
  cursor: pointer;
}

</style>