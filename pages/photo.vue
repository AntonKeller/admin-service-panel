<template>
  <div>
    <div class="d-flex">
      <v-img
          v-for="(img, i) of images"
          :src="img"
          :key="img"
          ref="img"
          class="photo"
          width="250"
          height="250"
          @click="showImg(i)"
      />
    </div>
    <VueEasyLightbox
        :visible="visible"
        :index="index"
        :imgs="images"
        @hide="hideImg"
    />
    <!--    :src="@/assets/images/image.jpg"-->
  </div>

</template>

<script>
export default {
  name: "photo",
  data() {
    return {
      visible: false,
      index: null,
      images: [
        {
          src: 'https://cdn.culture.ru/images/33571d5b-f386-556a-9a96-c7e39d71a269',
          title: 'Фотография 1'
        },
        {
          src: 'https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_65b8eb8bd9ea187695acfba1_65b8eb9e7a6e172ce3ce9e1f/scale_1200',
          title: 'Фотография 2'
        },
        {
          src: 'https://storage.yandexcloud.net/incrussia-prod/wp-content/uploads/2017/05/9d9bd938e75b6843af6c682add53c922.jpg',
          title: 'Фотография 3'
        },
      ]
    }
  },
  methods: {
    showImg(index) {
      this.index = index;
      this.visible = true;
    },
    hideImg() {
      this.visible = false;
    }
  }
}
</script>