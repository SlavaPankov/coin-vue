<template>
  <div v-if="pageIsLoaded" class="container banks__container">
    <h1 class="heading-reset banks__heading">Карта банкоматов</h1>
    <yandex-map
      :coords="[55.75399399999374, 37.62209300000001]"
      zoom="11"
      style="width: 100%; height: 728px"
      :behaviors="['default']"
      :controls="['smallMapDefaultSet']"
    >
      <ymap-marker
        v-for="(coords, index) in banksCoords"
        :key="index"
        marker-id="1"
        marker-type="placemark"
        :coords="[coords.lat, coords.lon]"
        :icon="{ color: '#116ACC' }"
        cluster-name="1"
      ></ymap-marker>
    </yandex-map>
  </div>
  <base-spinner v-if="pageLoading" />
  <load-error v-if="loadingFailed" :callback="loadBanksCoords" />
</template>

<script>
import BaseSpinner from "@/components/BaseSpinner";
import LoadError from "@/components/LoadError";
import { yandexMap, ymapMarker } from "vue-yandex-maps";
import axios from "axios";
import { BASE_URL } from "@/api/api.config";

export default {
  name: "BanksPage",
  components: { yandexMap, ymapMarker, BaseSpinner, LoadError },
  data() {
    return {
      banksCoords: [],
      pageLoading: true,
      pageIsLoaded: false,
      loadingFailed: false,
      settings: {
        // you may define your apiKey, lang and version or skip this.
        apiKey: "",
        lang: "ru_RU",
        version: "2.1",
      },
    };
  },

  methods: {
    loadBanksCoords() {
      this.pageLoading = true;

      axios
        .get(`${BASE_URL}/banks`)
        .then((res) => {
          if (!res.data.payload) {
            this.pageLoading = false;
            this.loadingFailed = true;
          }
          this.banksCoords = res.data.payload;
          this.pageIsLoaded = true;
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
          this.loadingFailed = true;
        });
    },
  },

  created() {
    this.loadBanksCoords();
  },
};
</script>

<style lang="scss" scoped>
.banks {
  &__container {
    padding-top: 50px;
    padding-bottom: 50px;
  }

  &__heading {
    margin-bottom: 56px;
    font-weight: 700;
    font-size: 34px;
    line-height: 40px;
    letter-spacing: -0.02em;
    color: var(--black);
  }
}
</style>
