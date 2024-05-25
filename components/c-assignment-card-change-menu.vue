<template>
  <v-sheet rounded="lg" min-height="80vh" height="80vh" elevation="24" color="white">
    <v-card height="100%" variant="tonal">
      <v-card-title class="d-flex ga-2">
        <div>
          <div v-if="!changeStatus">{{ title }}</div>
          <div v-if="changeStatus">
            <v-text-field
                density="comfortable"
                style="width: 460px"
                label="Наименование ТЗ"
                v-model="assignment.title"
            />
          </div>
        </div>
        <div>
          <v-btn
              @click="changeRequest()"
              :variant="changeStatus ? 'outlined' : 'text'"
              rounded="sm"
              density="compact"
              icon="mdi-pencil-outline"
          />
        </div>
        <v-btn density="default" variant="tonal">
          Договор: {{
            assignment?.contract?.contractNumber + ' / ' +
            assignment?.contract?.contractDate || 'Нет даты договора'
          }}
        </v-btn>
      </v-card-title>
      <v-card-subtitle>

      </v-card-subtitle>
      <v-card-text>
        <div v-if="!changeStatus">
          {{ assignment?.description }}
        </div>
        <div v-if="changeStatus">
          <v-textarea label="Описание" v-model="assignment.description"/>
        </div>
      </v-card-text>
      <v-card-item>
        <v-table>
          <thead>
          <tr>
            <th class="text-left">Залогодатель</th>
            <th class="text-left">Договор залога</th>
            <th class="text-left">Объектов, шт.</th>
            <th class="text-left">Статус</th>
            <th class="text-left">Объем фотографий</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in testDataAssignmentBlocks"
              :key="item._id"
          >
            <td>{{ item.plegerName }}</td>
            <td>{{ item.plegeAgreement }}</td>
            <td>{{ item.objectCount }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.photosCount }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>

    <v-overlay v-model="contractsMenuVisible" class="d-flex justify-center align-center">
      <c-contracts-menu :selectContract="selectContract"/>
    </v-overlay>

  </v-sheet>
</template>

<script>
import {testDataAssignmentBlocks} from "../configs/testData.ts";
import {requestChangeAssignment} from "../utils/methods/assignment-requests.ts";


export default {
  name: "c-assignment-card-change-menu",
  props: {
    _assignment: Object,
    _returnAssignment: Function,
  },
  data: () => ({

    contractsMenuVisible: false,

    changeStatus: false,

    assignment: {
      _id: '',
      title: '',
      description: '',
      contract: {
        _id: '',
        contractNumber: '',
        contractDate: '',
        customer: {
          _id: '',
          shortName: '',
          fullName: '',
          inn: '',
          phoneNumber: '',
          email: '',
          address: '',
        }
      },
    },

    assignmentBuffer: ({}),

    testDataAssignmentBlocks,

  }),

  computed: {

    title() {
      let a = this.assignment?.title || 'Пустой заголовок';
      let hasCustomer = this.assignment?.contract?.customer?.shortName &&
          this.assignment?.contract?.customer?.inn;
      return a + ' | ' + hasCustomer ? this.assignment?.contract?.customer?.shortName + ' | ' +
          this.assignment?.contract?.customer?.inn : 'Отсутствует заказчик';
    }

  },

  mounted() {
    this.setDefault();
  },

  methods: {

    setDefault() {
      this.assignment = this._assignment;
    },

    selectContract(newContract) {
      this.assignment.contract = ({...newContract});
      this.contractsMenuVisible = false;
    },

    changeRequest() {
      if (this.changeStatus) {
        requestChangeAssignment({
          _id: this.assignmentBuffer?._id,
          title: this.assignmentBuffer?.title,
          description: this.assignmentBuffer?.description
        }).then(r => {
          console.log('Успешно изменен');
          this.assignment.title = this.assignmentBuffer.title;
          this.assignment.description = this.assignmentBuffer.title;
          this._returnAssignment(({...this.assignmentBuffer}));
        }).catch(e => {
          console.log('Ошибка при изменении');
        }).finally(() => {
          this.changeStatus = false;
        })
      } else {
        console.log('this.assignment._id', this.assignment._id)
        this.assignmentBuffer._id = this.assignment._id;
        this.assignmentBuffer.title = this.assignment.title;
        this.assignmentBuffer.description = this.assignment.description;
        this.changeStatus = true;
      }

    },

  }
}
</script>