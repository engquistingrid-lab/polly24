<template>
    <header>
        <h1>Secret Santa</h1>
        <div class="header-buttons">
          <button class="lang-button" v-on:click="switchLanguage">
              {{ uiLabels.ChangeLanguage || 'Ändra språk' }}
          </button>
        </div>
    </header>
   
    <div class="main-wrapper">
      <button class="menu-button start-new" @click="goToCreate"> 
            {{ uiLabels.StartNewGroup || 'Starta ny grupp' }}
      </button>
      
      <button class="menu-button join-group" @click="goToJoin">
          {{ uiLabels.JoinGroup || 'Gå med i grupp' }}
      </button>
    </div>
</template>

<script>
import socket from '@/socket';

export default {
  name: "HomePage",
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      serverIP: import.meta.env.VITE_SERVER_URL
    }
  },

  created: function () {
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.emit("getUILabels", this.lang);
  },

  methods: {
    switchLanguage: function() {
      if (this.lang === "en") this.lang = "sv";
      else this.lang = "en";
      localStorage.setItem("lang", this.lang);
      socket.emit("getUILabels", this.lang);
    },
    goToCreate() { this.$router.push('/StartNewGroup/'); },
    goToJoin() { this.$router.push('/joingroup/'); }
  }
}
</script>

<style>

</style>