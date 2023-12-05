import { defineStore } from "pinia";

import { logout } from "@/api/admin.js";
import { useRouter } from "vue-router";

export const useUserStore = defineStore(
  "user",
  () => {
    const users = ref(null);

    const setUserInfo = (user) => {
      users.value = user;
    };

    return { users, setUserInfo };
  },
  {
    persist: {
      storage: localStorage,
      paths: ["users"],
    },
  }
);
