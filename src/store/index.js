import { defineStore } from "pinia";

import { logout } from "@/api/admin.js";
import { useRouter } from "vue-router";

export const useUserStore = defineStore(
  "user",
  () => {
    const users = ref(null);
    // 侧边栏是否展开
    const expand = ref(true);

    const setUserInfo = (user) => {
      users.value = user;
    };

    const sidebarWidth = () => {
      expand.value = !expand.value;
    };

    return { users, setUserInfo, expand, sidebarWidth };
  },
  {
    persist: {
      storage: localStorage,
      paths: ["users"],
    },
  }
);
