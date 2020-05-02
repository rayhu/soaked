import Vue from "vue"
import _ from "lodash"

export default async ({ /* app, router, Vue, ... */ }) => {
  let isConfigSet = false

  function setGlobalConfiguration (configObj) {
    Vue.prototype.$configuration = Object.freeze(_.assign({}, configObj))
    window.$ui_configuration = Vue.prototype.$configuration
    isConfigSet = true
  }

  if (process.env.MODE === "electron") {
    let electron = require("electron")
    if (electron && electron.remote) {
      Vue.prototype.$electron = electron
      if (!window.process) window.process = {}
      let configs = electron.remote.getGlobal("Configuration")
      if (configs) setGlobalConfiguration(configs)
    }
  }

  if (window.ENVUI) {
    setGlobalConfiguration(window.ENVUI)
  }
  if (!isConfigSet) setGlobalConfiguration(process.env)
}
