import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueAutosuggest from "vue-autosuggest";
Vue.use(VueAutosuggest);

Vue.config.productionTip = false;
Vue.component("search", require("./components/search.vue").default);
Vue.component("foot", require("./components/footer.vue").default);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
