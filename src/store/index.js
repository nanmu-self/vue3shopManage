import { defineStore } from "pinia";

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
