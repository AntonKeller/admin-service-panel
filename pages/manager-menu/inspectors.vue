<template>
  <v-container fluid>
    <v-card variant="text">
      <v-card-title>inspectors</v-card-title>
      <v-card-item>
        <my-search-bar
            v-model="searchText"
            color="blue-darken-2"
            @btn:click=""
        ></my-search-bar>
      </v-card-item>
      <v-card-text>
        <v-data-table-virtual
            fixed-header
            :headers="headers"
            :items="search"
            height="750"
            item-value="name"
        >
          <template v-slot:item="{ item }">
            <tr @click="itemSelected=item">
              <td>
                <v-btn
                    density="compact"
                    icon="mdi-pencil"
                    variant="text"
                    rounded
                    color="orange-darken-4"
                    @click="change(item)"
                >
                </v-btn>
              </td>
              <td>
                <p>{{ item._id }}</p>
                <p>{{ item.name }}</p>
              </td>
              <td class="text-center">{{ item.speed }}</td>
              <td class="text-center">{{ item.length }}</td>
              <td class="text-center">{{ item.price }}</td>
              <td class="text-center">{{ item.year }}</td>
            </tr>
          </template>


          <!--          <template v-slot:item.service="{ item }">-->
          <!--            <v-btn-->
          <!--                density="compact"-->
          <!--                icon="mdi-pencil"-->
          <!--                variant="text"-->
          <!--                rounded-->
          <!--                color="orange-darken-4"-->
          <!--                @click="change(item)"-->
          <!--            >-->
          <!--            </v-btn>-->
          <!--          </template>-->
          <!--          <template v-slot:item.name="{ item }">-->
          <!--            <p>{{ item._id }}</p>-->
          <!--            <p>{{ item.name }}</p>-->
          <!--          </template>-->
          <!--          <template v-slot:item.speed="{ item }">-->
          <!--            <p>{{ item.speed }}</p>-->
          <!--          </template>-->
          <!--          <template v-slot:item.length="{ item }">-->
          <!--            <p>{{ item.length }}</p>-->
          <!--          </template>-->
          <!--          <template v-slot:item.price="{ item }">-->
          <!--            <p>{{ item.price }}</p>-->
          <!--          </template>-->
          <!--          <template v-slot:item.year="{ item }">-->
          <!--            <p>{{ item.year }}</p>-->
          <!--          </template>-->
        </v-data-table-virtual>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "inspectors",
  data() {
    return {
      headers: [
        {title: '', align: 'start', key: 'service'},
        {title: 'Boat Type', align: 'start', key: 'name'},
        {title: 'Speed (knots)', align: 'center', key: 'speed'},
        {title: 'Length (m)', align: 'center', key: 'length'},
        {title: 'Price ($)', align: 'center', key: 'price'},
        {title: 'Year', align: 'center', key: 'year'},
      ],
      boats: [
        {
          _id: 1,
          name: 'Speedster',
          speed: 35,
          length: 22,
          price: 300000,
          year: 2021,
        },
        {
          _id: 2,
          name: 'OceanMaster',
          speed: 25,
          length: 35,
          price: 500000,
          year: 2020,
        },
        {
          _id: 3,
          name: 'Voyager',
          speed: 20,
          length: 45,
          price: 700000,
          year: 2019,
        },
        {
          _id: 4,
          name: 'WaveRunner',
          speed: 40,
          length: 19,
          price: 250000,
          year: 2022,
        },
        {
          _id: 5,
          name: 'SeaBreeze',
          speed: 28,
          length: 31,
          price: 450000,
          year: 2018,
        },
        {
          _id: 6,
          name: 'HarborGuard',
          speed: 18,
          length: 50,
          price: 800000,
          year: 2017,
        },
        {
          _id: 7,
          name: 'SlickFin',
          speed: 33,
          length: 24,
          price: 350000,
          year: 2021,
        },
        {
          _id: 8,
          name: 'StormBreaker',
          speed: 22,
          length: 38,
          price: 600000,
          year: 2020,
        },
        {
          _id: 9,
          name: 'WindSail',
          speed: 15,
          length: 55,
          price: 900000,
          year: 2019,
        },
        {
          _id: 10,
          name: 'FastTide',
          speed: 37,
          length: 20,
          price: 280000,
          year: 2022,
        },
      ],
      searchText: '',
      itemSelected: null,
    };
  },
  watch: {
    itemSelected() {
      console.log('itemSelected:', this.itemSelected);
    }
  },
  computed: {
    search() {
      return this.virtualBoats.filter(item => {
        return Object.values(item).find(value => {
          return typeof value === 'string' && (new RegExp(this.searchText, 'ig')).test(value)
        })
      })
    },
    virtualBoats() {
      return [...Array(2000).keys()].map(i => {
        const boat = {...this.boats[i % this.boats.length]}
        boat.name = `${boat.name} #${i}`
        return boat
      })
    },
  },
  methods: {
    change(item) {
      console.log('item:', item);
    }
  }
}
</script>