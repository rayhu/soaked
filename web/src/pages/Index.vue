<template>
  <q-page class="flex flex-center">
    There are {{ connected_pipes }} pipes connected now.  
    <q-btn label="refresh" @click="update"></q-btn>
  </q-page>
</template>

<script>
import { getPipes } from "../services/pipes"
import axios from "axios"

export default {
  name: 'PageIndex',
  data() {
    return {
      connected_pipes:"0"
    }
  },
  methods: {
    async update (){
      var vm = this;
      axios.get('http://localhost:9996/pipes')
        .then(function (response) {
          const clientsObj=response.data
          vm.connected_pipes = clientsObj.clients.length
        })       
    }
  },
  mounted() {
    var vm = this;
    axios.get('http://localhost:9996/pipes')
      .then(function (response) {
        const clientsObj=response.data
        vm.connected_pipes = clientsObj.clients.length
      })
  }
}
</script>
