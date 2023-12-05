import { createApp } from "vue";
import App from "./App.vue";
import "virtual:windi.css";
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 5. 创建并挂载根实例
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);

app.mount("#app");
