<template>
  <v-sheet
      rounded="lg"
      height="65vh"
      width="60vw"
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
              @click="changeRequest()"
              :variant="changeMode ? 'outlined' : 'text'"
              rounded="lg"
              density="comfortable"
              icon="mdi-pencil-outline"
          />
          <div v-if="!changeMode">
            {{ assignment?.title }}
          </div>
          <v-text-field
              rounded="lg"
              v-if="changeMode"
              label="Наименование ТЗ"
              density="default"
              v-model="assignment.title"
          />
        </v-sheet>
      </v-card-title>

      <v-card-text class="d-flex flex-column ga-2">

        <div v-if="!changeMode">
          {{ assignment?.description }}
        </div>

        <div v-if="changeMode">
          <v-textarea rounded="lg" label="Описание" v-model="assignment.description"/>
        </div>

        <v-divider color="teal-darken-4"/>

        <div class="d-flex ga-2">
          <v-chip
              @click="showContractMenu"
              prepend-icon="mdi-open-in-new"
              density="comfortable"
              size="small"
              variant="flat"
              color="teal-lighten-5"
          >
            {{ getContractTitle }}
          </v-chip>
          <v-chip
              @click="showCustomerMenu"
              prepend-icon="mdi-open-in-new"
              density="comfortable"
              size="small"
              variant="flat"
              color="teal-lighten-5"
          >
            {{ getCustomerTitle }}
          </v-chip>
        </div>

        <v-divider color="teal-darken-4"/>

      </v-card-text>

      <v-card-item>
        <v-table height="450px" fixed-header density="default">
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
          >
            <td>{{ textSlicer(item.assignmentBlock.loanAgreement, 20) }}</td>
            <td>{{ textSlicer(item.assignmentBlock.loanAgreementDate, 20) }}</td>
            <td>{{ textSlicer(item.assignmentBlock.plegeAgreement, 20) }}</td>
            <td>{{ textSlicer(item.assignmentBlock.plegeAgreementDate, 20) }}</td>
            <td>{{ textSlicer(item.assignmentBlock.startDate, 20) }}</td>
            <td>{{ textSlicer(item.assignmentBlock.endDate, 20) }}</td>
            <td>{{ textSlicer(item.assignmentBlock.status, 20) }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>

    <v-overlay v-model="contractsMenuVisible" class="d-flex justify-center align-center">
      <c-contracts-menu :selectContract="setContract"/>
    </v-overlay>

    <v-overlay v-model="customersMenuVisible" class="d-flex justify-center align-center">
      <c-customers-menu :selectCustomer="setCustomer"/>
    </v-overlay>

  </v-sheet>
</template>

<script>
import testDataAssignmentBlocks from "../configs/data-test/data-test-assignment-blocks";
import {requestChangeAssignment} from "../utils/methods/assignment-requests";
import {fetchAssignmentBlocks} from "@/utils/methods/assignment-block-requests";


export default {
  name: "c-assignment-card-change-menu",

  props: {
    _assignment: Object,
    _returnAssignment: Function,
  },

  data: () => ({

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

    getContractTitle() {
      return this.assignment?.contract ? 'Договор: ' + this.assignment?.contract?.contractNumber : 'Добавить договор';
    },

    getCustomerTitle() {
      return this.assignment?.customer ? 'Заказчик: ' + this.assignment?.customer?.shortName : 'Добавить заказчика';
    }

  },

  methods: {

    textSlicer(txt, size) {
      return txt?.length > size ? txt.slice(0, 10) + '...' : txt;
    },

    setDefault() {
      this.assignment = ({...this._assignment});
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

    changeRequest() {
      if (this.changeMode) {

        this.changeLoading = true;

        requestChangeAssignment(this.assignment)
            .then(() => {
              this._returnAssignment({...this.assignment});
            })
            .catch(err => {
              console.log('Ошибка при изменении', err);
              this.setDefault();
              this.changeMode = false;
              this.changeLoading = false;
              this._returnAssignment({...this._assignment});
            })

      } else {
        this.changeMode = true;
      }

    },

    fetchAssignmentBlocksData() {
      this.fetchBlocksLoading = true;
      fetchAssignmentBlocks(this.assignment._id)
          .then(r => {
            console.log('Блоки ТЗ получены');
            return r?.data;
          })
          .catch(err => {
            console.log('Ошибка получения блоков ТЗ', err);
            return testDataAssignmentBlocks;
          })
          .then(blockList => {
            this.fetchBlocksLoading = false;
            this.assignmentBlockList = blockList;
          })
    }

  }
}
</script>