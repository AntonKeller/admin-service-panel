<template>
  <div>
    <v-card class="mx-auto" variant="text">
      <v-card-title class="d-flex ga-4">
        <v-btn
            min-width="50px"
            rounded="sm"
            variant="tonal"
            density="comfortable"
            color="indigo"
            icon="mdi-arrow-left-bold-outline"
            @click="btnBackClick"
        />
        <div>БЛОКИ ТЗ</div>
      </v-card-title>
      <v-card-item>
        <div class="d-flex ga-2">
          <v-btn
              rounded
              color="indigo-darken-1"
              variant="elevated"
              density="default"
              size="small"
              icon="mdi-plus"
              @click="addMenuVisible = true"
          />
          <v-text-field
              color="indigo-darken-1"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              label="Поиск по задачам"
              variant="outlined"
              hide-details
              single-line
              clearable
              v-model="searchText"
          />
        </div>
      </v-card-item>
    </v-card>

    <v-list
        bg-color="transparent"
        max-height="85vh"
        class="d-flex flex-wrap"
    >
      <v-list-item v-if="loadingData">
        <v-skeleton-loader
            v-for="n of 3"
            width="full"
            color="transparent"
            elevation="0"
            type="list-item-three-line"
        />
      </v-list-item>
      <v-list-item
          v-for="block of searchBlocks"
          :key="block._id"
          min-width="30%"
          max-width="50%"
      >
        <v-card
            @click="showObjects(block._id)"
            rounded
            density="compact"
            class="mx-auto"
            variant="tonal"
            color="indigo"
        >
          <v-card-title>{{ block.plegerName }}</v-card-title>
          <v-card-subtitle>{{ block.plegeAgreement }}</v-card-subtitle>
          <v-card-item>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, repudiandae!</v-card-item>
          <v-divider/>
          <v-card-text v-if="activeBlockID === block._id" class="d-flex ga-2 flex-wrap">
            <v-chip
                v-for="i of 15"
                rounded="sm"
                density="comfortable"
                size="small"
                variant="tonal"
                color="indigo"
                append-icon="mdi-phone"
                @click.stop="console.log('Customer call')"
            >lorem
            </v-chip>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>

  </div>
</template>

<script>
import {fetchAssignmentBlocks} from "@/utils/methods/assignment-block-requests";
import dataAssignmentBlocks from "@/configs/data-test/data-test-assignment-blocks";

export default {
  name: "c-assignment-blocks-menu",
  props: {
    assignment: Object,
    btnBackClick: Function
  },
  data: () => ({
    blocks: null,
    searchText: null,
    loadingData: true,
    activeBlockID: null,
  }),
  computed: {
    searchBlocks() {

      const _so = (this.searchText?.length > 0 && this.blocks?.length > 0);

      return _so ? this.blocks?.filter(block => (new RegExp(this.searchText, 'i')).test(block.plegerName)) : this.blocks;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {

    showObjects(id) {
      if (this.activeBlockID === null) {
        this.activeBlockID = id;
      } else if (this.activeBlockID === id) {
        this.activeBlockID = null;
      } else {
        this.activeBlockID = null;
        this.activeBlockID = id;
      }
    },

    fetchData() {
      fetchAssignmentBlocks(this.assignment._id)
          .then(response => {
            console.log('Блоки успешно получены');
            this.blocks = ({...response?.data});
          })
          .catch(err => {
            console.log('Ошибка получения блоков', err);
            this.blocks = ({...dataAssignmentBlocks});
          })
          .finally(() => {
            this.loadingData = false;
          })
    }

  }

}
</script>