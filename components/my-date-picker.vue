<template>
  <div class="d-flex ga-1">
    <v-text-field
        v-model="textField"
        :style="fieldWidth ? `width: ${fieldWidth}px` : '' "
        :rules="[v => textDateValid(v)]"
        ref="dateInput"
        @input="onInput"
        prepend-inner-icon="mdi-calendar-range"
        color="yellow-darken-3"
        density="compact"
        variant="outlined"
        label="Дата регистрации"
        placeholder="дд:мм:гггг"
    />
    <v-btn icon="mdi-dots-horizontal" size="small" variant="text" rounded="lg">
      <v-icon/>
      <v-tooltip activator="parent" location="right">
        Календарь
      </v-tooltip>
      <v-menu v-model="isVisibleMenu" activator="parent" location="bottom" transition="slide-x-transition">
        <v-locale-provider locale="ru">
          <v-date-picker
              v-model="datepickerValue"
              @update:modelValue="datePickerUpdateValue"
              title="Дата регистрации"
              hide-header
              @click.stop
              border
          />
        </v-locale-provider>
      </v-menu>
    </v-btn>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  inheritAttrs: false,

  name: "my-date-picker",
  props: ['modelValue', 'fieldWidth'],
  emits: ['update:modelValue'],

  data() {
    return {
      unixDate: null,
      textFieldValue: null,
      datepickerValue: null,
      isVisibleMenu: false,
    }
  },

  computed: {
    textField: {
      get() {
        return this.textFieldValue;
      },
      set(v) {

        const expA = [
          /^(\d\d)(\d)$/i,
          /^(\d\d\.\d\d)(\d)$/i
        ].find(exp => exp.test(v));

        if (expA) {
          this.textFieldValue = v.replace(expA, '$1.$2');
          return;
        }

        const expB = [
          /^(\d{2})\.$/i,
          /^(\d\d\.\d\d)\.$/i,
          /^(\d\d\.\d\d\.\d\d\d\d).*/i
        ].find(exp => exp.test(v));

        if (expB) {
          this.textFieldValue = v.replace(expB, '$1');
          return;
        }

        this.textFieldValue = v;
      }
    }
  },

  watch: {
    unixDate(value) {
      this.$emit('update:modelValue', value);
      console.log('[update:modelValue]', value)
    },
  },

  methods: {

    datePickerUpdateValue(value) {
      this.textFieldValue = moment(value).format('DD.MM.YYYY');
      this.unixDate = moment(value).unix() * 1000;
      this.isVisibleMenu = false;
    },

    // Валидация текстовой даты (Text filed) -> возвращает true/false
    momentCheckDate(stringDate) {
      return moment(stringDate, 'DD.MM.YYYY', 'ru', true).isValid();
    },

    // Валидация текстовой даты (Text filed) -> возвращает сообщение об ошибке
    textDateValid(textDate) {
      return this.momentCheckDate(textDate) || 'Некорректная дата';
    },

    // Ограничивает ввод
    onInput() {

      const rules = [
        /^[0-3]/i,
        /^(0[1-9]|1\d|2\d|30|31)/i,
        /^(0[1-9]|1\d|2\d|30|31)\./i,
        /^(0[1-9]|1\d|2\d|30|31)\.[0-1]/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\./i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\.\d/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\.\d\d/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\.\d\d\d/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\.\d\d\d\d$/i,
      ];

      const textDate = this.textField;
      const foundIndexLastValid = rules.reverse().findIndex(exp => exp.test(textDate))

      if (foundIndexLastValid !== undefined) {
        const slice = textDate.match(rules[foundIndexLastValid])?.shift();
        this.$refs.dateInput.value = slice;
        this.textFieldValue = slice;
        if (this.momentCheckDate(textDate)) {
          this.unixDate = moment(textDate, 'DD.MM.YYYY', 'ru', true).unix() * 1000;
        }
      } else {
        this.$refs.dateInput.value = '';
        this.textFieldValue = '';
      }

      if (this.isVisibleMenu) this.isVisibleMenu = false;

      // console.log('\n\n--------------------------------------------------------------------------------------------');
      // console.log('foundIndexLastValid:', foundIndexLastValid);
      // console.log('this.textFieldValue:', this.textFieldValue);
      // console.log('this.$refs.dateInput.value:', this.$refs.dateInput.value);
      // if (this.momentCheckDate(textDate)) {
      //   console.log('is valid:', this.momentCheckDate(textDate));
      // }
      // console.log('--------------------------------------------------------------------------------------------\n\n');
    }
  }
}
</script>