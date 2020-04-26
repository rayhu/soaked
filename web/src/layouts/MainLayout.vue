<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Soaked
        </q-toolbar-title>

        <div>version 0.0.1</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          CLients Connections
        </q-item-label>
        <EssentialLink
          v-for="ip in client_ips"
          :key="ip"
          v-bind="ip"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'
import axios from "axios"

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      timer: '',
      clients: [],
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Docs',
          caption: 'quasar.dev',
          icon: 'school',
          link: 'https://quasar.dev'
        },
        {
          title: 'Github',
          caption: 'github.com/quasarframework',
          icon: 'code',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Discord Chat Channel',
          caption: 'chat.quasar.dev',
          icon: 'chat',
          link: 'https://chat.quasar.dev'
        },
        {
          title: 'Forum',
          caption: 'forum.quasar.dev',
          icon: 'record_voice_over',
          link: 'https://forum.quasar.dev'
        },
        {
          title: 'Twitter',
          caption: '@quasarframework',
          icon: 'rss_feed',
          link: 'https://twitter.quasar.dev'
        },
        {
          title: 'Facebook',
          caption: '@QuasarFramework',
          icon: 'public',
          link: 'https://facebook.quasar.dev'
        },
        {
          title: 'Quasar Awesome',
          caption: 'Community Quasar projects',
          icon: 'favorite',
          link: 'https://awesome.quasar.dev'
        }
      ]
    }
  },
  computed: {
    // a computed getter
    client_ips: function () {
      return this.clients.map((x) => {return {"link": `#/conn/${x.client_ip}`,"title": x.client_ip, "caption": "click to talk", "icon":"chat"}})

    }
  },
  methods: {
    update (){
      var vm = this;
      axios.get('http://localhost:9996/pipes')
        .then(function (response) {
          const clientsObj=response.data
          vm.clients = clientsObj.clients
          console.log(vm.clients)
        })
    }
  },
  mounted: function() {
    this.update()
    this.timer = setInterval(this.update, 3000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
