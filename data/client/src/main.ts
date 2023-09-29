import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { createPinia } from "pinia";
import axios from "axios";

import "./styles/index.scss";

const pinia = createPinia();

//axios.defaults.withCredentials = true;

createApp(App).use(pinia).use(router).mount("#app");
