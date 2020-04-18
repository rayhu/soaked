import Vue from "vue"
import ApiClient from "../services/ApiClient"

// "async" is optional
export default async ({ /* app, router, Vue, ... */ }) => {
  let configs = Vue.prototype.$configuration

  let defaultApiHeaders = { "API-KEY": configs.API_KEY }
  Vue.prototype.$api = new ApiClient(configs.API_URL_BASE, defaultApiHeaders)
}

