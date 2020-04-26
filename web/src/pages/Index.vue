<template>
  <q-page class="flex flex-center">

    <div class="column">
      <div class="row">
        <div class="col">
          There are {{ connected_pipes }} pipes connected now.
        </div>
        <div class="col">
          <q-btn label="refresh" @click="update"></q-btn>
        </div>
      </div>
      <div class="col">      
        <div class="q-ma-md">
          <q-scroll-area style="height: 600px; max-width: 300px;">
            <div class="q-py-xs">
            Jello
             {{ client_ips }}
            </div>
          </q-scroll-area>
        </div>
      </div>

      <div class="col">
        fills remaining available space
      </div>
      <div class="col">
        <q-input filled bottom-slots v-model="text" label="Label" counter maxlength="12" >
          <template v-slot:before>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg">
            </q-avatar>
          </template>

          <template v-slot:append>
            <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
            <q-icon name="schedule" />
          </template>

          <template v-slot:hint>
            Field hint
          </template>

          <template v-slot:after>
            <q-btn round dense flat icon="send" />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script>
import { getPipes } from "../services/pipes"
import axios from "axios"

export default {
  name: 'PageIndex',
  data() {
    return {
      text: "",
      connected_pipes:"0",
      clients: []
    }
  },
  computed: {
    // a computed getter
    client_ips: function () {
      const ipaddr = this.clients.map((x) => {return {"link": x.client_ip,"title": x.client_ip, "caption": x.client_ip}})
      return ipaddr
    }
  },
  methods: {
    async update (){
      var vm = this;
      axios.get('http://localhost:9996/pipes')
        .then(function (response) {
          vm.clients=response.data.clients
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
