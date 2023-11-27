import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const pageStatus = defineStore("status", () => {
  const currentKey = ref({ key: [] });
  const count = ref(1);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { currentKey, doubleCount, increment };
});
