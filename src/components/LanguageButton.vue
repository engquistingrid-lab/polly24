<template>
  <button class="lang-button" @click="switchLanguage">
    <span v-if="lang === 'en'">🇸🇪 Byt till Svenska</span>
    <span v-else>🇬🇧 Switch to English</span>
  </button>
</template>

<script>

export default {
    name: 'LanguageButton',
    data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
    };
  },
  created: function () {

  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv";
      } else {
        this.lang = "en";
      }
      localStorage.setItem("lang", this.lang);

      this.$emit('language-changed', this.lang);
    }
  }
}

</script>

<style scoped>
.lang-button {
  background-color: transparent;
  border: 2px solid var(--color-text, #333); /* Använd din textfärg */
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.lang-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Anpassning för mobil */
@media screen and (max-width: 600px) {
  .lang-button {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}
</style>