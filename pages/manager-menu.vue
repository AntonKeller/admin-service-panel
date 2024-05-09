<template>
  <nuxt-layout name="navigate">
    <nuxt-page/>
  </nuxt-layout>
</template>

<script>
import {accessTest} from "../utils/methods/requests";

export default {

  name: 'manager-menu',

  async asyncData() {
    const post = await accessTest("")
    return { post }
  },

  // async beforeMount() {
  //   await this.test();
  // },

  mounted(){
    console.log("this.$route.params", this.$route.params)
  },

  methods: {
    // async test() {
    //   localStorage
    // }
  }

}

</script>