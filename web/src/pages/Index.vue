<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    >
  </q-page>
</template>

<script>
import ApiClient from "../services/ApiClient"

export default {
  name: 'PageIndex',
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  mounted() {
    const apiClient = new ApiClient(settings.API_URL_BASE)

  },
}
</script>
